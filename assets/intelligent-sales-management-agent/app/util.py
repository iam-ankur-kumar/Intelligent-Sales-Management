"""
Utility functions for MCP tool processing.

Provides helper functions for enhancing MCP tool descriptions and metadata.
"""
import asyncio
import hashlib
import json
import logging
import os
import re
from typing import Any

from langchain_core.tools import ToolException

# ── Sample-data interceptor ──────────────────────────────────────────────────

def _get_sample_response(tool_name: str, force: bool = False, **kwargs: Any) -> str | None:
    """Return a JSON-encoded sample response for *tool_name*, or None if the
    tool is not covered by sample data (caller should hit the real gateway).
    Set force=True to bypass the USE_SAMPLE_DATA env check (used for 401 fallback)."""
    use_sample = force or os.environ.get("USE_SAMPLE_DATA", "false").lower() == "true"
    if not use_sample:
        return None

    # Import lazily so the module is only loaded when needed.
    from app.sample_data import (  # noqa: PLC0415
        SAMPLE_BILLING_DOCUMENTS,
        SAMPLE_CREDIT_BLOCKED_ORDERS,
        SAMPLE_CUSTOMERS,
        SAMPLE_ORDER_ITEMS,
        SAMPLE_SALES_ORDERS,
        get_sample_dashboard_kpis,
    )

    # Normalise the tool name — the platform may prefix it with a server slug.
    name = tool_name.lower()

    # ── Sales Orders ──────────────────────────────────────────────────────────
    if "list_salesorder" in name:
        top = int(kwargs.get("top", kwargs.get("$top", 100)))
        data = SAMPLE_SALES_ORDERS[:top]
        return json.dumps({"value": data, "isSampleData": True}, separators=(",", ":"))

    if "get_salesorder" in name and "item" not in name:
        order_id = kwargs.get("SalesOrder") or kwargs.get("salesOrder") or ""
        for o in SAMPLE_SALES_ORDERS:
            if o["SalesOrder"] == order_id:
                return json.dumps(o, separators=(",", ":"))
        return json.dumps({"error": f"Order {order_id} not found in sample data"}, separators=(",", ":"))

    if "list_salesorderitem" in name or "get_salesorderitem" in name:
        order_id = kwargs.get("SalesOrder") or kwargs.get("salesOrder") or ""
        items = SAMPLE_ORDER_ITEMS.get(order_id, [])
        return json.dumps({"value": items, "isSampleData": True}, separators=(",", ":"))

    # ── Business Partners / Customers ─────────────────────────────────────────
    if "list_a_customer" in name or "list_a_businesspartner" in name:
        top = int(kwargs.get("top", kwargs.get("$top", 100)))
        data = SAMPLE_CUSTOMERS[:top]
        return json.dumps({"value": data, "isSampleData": True}, separators=(",", ":"))

    if "get_a_customer" in name or "get_a_businesspartner" in name:
        bp_id = kwargs.get("BusinessPartner") or kwargs.get("businessPartner") or ""
        for c in SAMPLE_CUSTOMERS:
            if c["BusinessPartner"] == bp_id:
                return json.dumps(c, separators=(",", ":"))
        return json.dumps({"error": f"Business partner {bp_id} not found in sample data"}, separators=(",", ":"))

    # ── Billing Documents ─────────────────────────────────────────────────────
    if "list_a_billingdocument" in name:
        top = int(kwargs.get("top", kwargs.get("$top", 100)))
        data = SAMPLE_BILLING_DOCUMENTS[:top]
        return json.dumps({"value": data, "isSampleData": True}, separators=(",", ":"))

    if "get_a_billingdocument" in name:
        doc_id = kwargs.get("BillingDocument") or kwargs.get("billingDocument") or ""
        for d in SAMPLE_BILLING_DOCUMENTS:
            if d["BillingDocument"] == doc_id:
                return json.dumps(d, separators=(",", ":"))
        return json.dumps({"error": f"Billing document {doc_id} not found in sample data"}, separators=(",", ":"))

    # ── Credit Blocked Orders ─────────────────────────────────────────────────
    if "list_a_creditblockedsalesdocument" in name:
        top = int(kwargs.get("top", kwargs.get("$top", 100)))
        data = SAMPLE_CREDIT_BLOCKED_ORDERS[:top]
        return json.dumps({"value": data, "isSampleData": True}, separators=(",", ":"))

    if "get_a_creditblockedsalesdocument" in name:
        order_id = kwargs.get("SalesDocument") or kwargs.get("salesDocument") or ""
        for o in SAMPLE_CREDIT_BLOCKED_ORDERS:
            if o["SalesOrder"] == order_id:
                return json.dumps(o, separators=(",", ":"))
        return json.dumps({"error": f"Credit-blocked order {order_id} not found in sample data"}, separators=(",", ":"))

    # Not covered by sample data
    return None


def _unwrap_exception_group(exc: BaseException) -> BaseException:
    """Unwrap nested ExceptionGroups to present meaningful error messages."""
    while isinstance(exc, BaseExceptionGroup) and exc.exceptions:
        exc = exc.exceptions[0]
    return exc

logger = logging.getLogger(__name__)

MCP_CALL_TIMEOUT_SECONDS = float(os.environ.get("MCP_CALL_TIMEOUT_SECONDS", 60.0))
# Maximum response size to prevent OOM and bound per-turn context cost — responses
# larger than this are truncated. Kept modest by default because tool results are
# re-sent on every subsequent turn; raise MCP_MAX_RESPONSE_CHARS for agents that
# genuinely need large payloads.
MCP_MAX_RESPONSE_CHARS = int(os.environ.get("MCP_MAX_RESPONSE_CHARS", 30_000))


def minify_json(text: str) -> str:
    """Return a whitespace-stripped form of ``text`` if it is valid JSON.

    Pretty-printed JSON carries indentation and spacing that cost tokens on every
    turn the result stays in context. Re-serializing with compact separators is
    lossless and typically saves ~30%. Non-JSON input is returned
    unchanged.
    """
    try:
        parsed = json.loads(text)
    except (ValueError, TypeError):
        return text
    return json.dumps(parsed, separators=(",", ":"), ensure_ascii=False)


def truncate_response(text: str, max_chars: int = MCP_MAX_RESPONSE_CHARS) -> str:
    """Truncate ``text`` to ``max_chars``, cutting at a structural boundary.

    A raw character cut can leave the model with a half-written JSON object or a
    token split mid-word. When possible we back up to the last newline, comma, or
    whitespace before the limit so the truncated output ends cleanly. A marker is
    always appended so the model knows content was dropped.
    """
    if len(text) <= max_chars:
        return text
    window = text[:max_chars]
    # Back up to the last clean boundary within the final 10% of the window so we
    # never cut mid-token; fall back to the hard cut if none is found.
    floor = int(max_chars * 0.9)
    boundary = max(window.rfind("\n"), window.rfind(","), window.rfind(" "))
    if boundary >= floor:
        window = window[:boundary]
    return window + "\n...[truncated]"


def enhance_tool_description(mcp_tool: Any) -> str:
    """
    Enhance MCP tool description with server name prefix.

    Prefixes the description with server name to help LLM identify tool origin.
    Extracts server label from fragment_name or uses server_name as fallback.

    Args:
        mcp_tool: The MCP tool object from SDK

    Returns:
        Enhanced description string with server label prefix

    Example:
        Input: tool with server_name="sap_system", description="Get user data"
        Output: "[sap_system] Get user data"
    """
    if mcp_tool is None:
        logger.warning("enhance_tool_description called with None tool")
        return ""

    # Extract server label from fragment_name or use server_name as fallback
    server_label = getattr(mcp_tool, "fragment_name", mcp_tool.server_name)
    enhanced_description = f"[{server_label}] {mcp_tool.description or ''}".strip()

    return enhanced_description

def enhance_tool_name(mcp_tool: Any) -> str:
    """Get enhanced and namespaced tool name, sanitized to match ^[a-zA-Z0-9-_]+$ and at most 64 chars.

    The server_name is parsed to extract meaningful segments:
    - If server_name has format like "org:type:resource:version" (e.g., "sap.mcpbuilder:apiResource:cost-center:v1"),
      the first two segments (org + type) are dropped, keeping only "resource:version" portions.
    - The remaining segments are joined with underscores and combined with tool_name as: {remaining}__{tool_name}
    - If server_name has 2 or fewer segments, the entire name is used.

    The result is sanitized to match ^[a-zA-Z0-9-_]+$ and truncated if needed.
    If the sanitized name exceeds 64 chars, it is truncated to 55 chars and an
    8-char sha256 suffix is appended (total 64), guaranteeing uniqueness.

    Args:
        mcp_tool: The MCP tool object from SDK (must have server_name and name attributes)

    Returns:
        Sanitized and namespaced tool name (max 64 chars)

    Examples:
        >>> tool = MockTool(server_name="sap.mcpbuilder:apiResource:cost-center:v1", name="list_a_costcenter")
        >>> enhance_tool_name(tool)
        'cost-center_v1__list_a_costcenter'
        >>> tool = MockTool(server_name="simple-server", name="my_tool")
        >>> enhance_tool_name(tool)
        'simple-server__my_tool'
    """
    if mcp_tool is None:
        logger.warning("enhance_tool_name called with None tool")
        return ""

    server_name = mcp_tool.server_name
    tool_name = mcp_tool.name

    # Step 1: Split server_name by ':'
    segments = server_name.split(":")

    # Step 2: If more than 2 segments, drop the first two (org + type), keep the rest
    if len(segments) > 2:
        remaining = segments[2:]
    else:
        remaining = segments

    # Step 3: Build {remaining}__{tool_name}, joining remaining segments with underscores
    server_part = "_".join(remaining)
    raw = f"{server_part}__{tool_name}"

    # Step 4: Sanitize (replace invalid chars with _)
    sanitized = re.sub(r"[^a-zA-Z0-9\-_]", "_", raw)

    # Step 5: If > 64 chars, truncate to 55 + _ + 8-char hash
    if len(sanitized) <= 64:
        return sanitized
    suffix = hashlib.sha256(sanitized.encode()).hexdigest()[:8]
    return f"{sanitized[:55]}_{suffix}"


async def call_mcp_tool(agw_client: Any, mcp_tool: Any, user_token: str | None = None, **kwargs: Any) -> str:
    """
    Call an MCP tool with error handling.

    Args:
        agw_client: Agent Gateway client instance
        mcp_tool: The tool to call (MCPTool object from SDK)
        user_token: User authentication token to pass to MCP server for tool execution
        **kwargs: Tool arguments

    Returns:
        Tool result as string (truncated if exceeds MCP_MAX_RESPONSE_CHARS)

    Raises:
        ValueError: If tool is None
        ToolException: If the tool call fails
    """
    if mcp_tool is None:
        raise ValueError("Tool parameter cannot be None")

    arg_keys = list(kwargs.keys()) if kwargs else []
    logger.info(
        f"Calling MCP tool '{mcp_tool.name}' via Agent Gateway with {len(arg_keys)} argument(s)"
    )

    # ── Sample-data short-circuit ─────────────────────────────────────────────
    # Check env var at call time (not module load time) to handle late injection.
    use_sample = os.environ.get("USE_SAMPLE_DATA", "false").lower() == "true"
    if use_sample:
        sample_response = _get_sample_response(mcp_tool.name, **kwargs)
        if sample_response is not None:
            logger.info(f"[SAMPLE DATA] Returning sample response for '{mcp_tool.name}'")
            return sample_response
    # ─────────────────────────────────────────────────────────────────────────

    call_params = {"tool": mcp_tool, **kwargs}
    if user_token is not None:
        call_params["user_token"] = user_token

    _call_result = None
    try:
        _call_result = await asyncio.wait_for(
            agw_client.call_mcp_tool(**call_params),
            timeout=MCP_CALL_TIMEOUT_SECONDS,
        )
    except (asyncio.TimeoutError, TimeoutError):
        logger.warning(
            f"call_mcp_tool: Tool {mcp_tool.name} timed out after {MCP_CALL_TIMEOUT_SECONDS}s"
        )
        raise ToolException(f"Tool '{mcp_tool.name}' timed out after {MCP_CALL_TIMEOUT_SECONDS}s")
    except (ExceptionGroup, BaseExceptionGroup) as eg:
        inner = _unwrap_exception_group(eg)
        if _call_result is None:
            # If it's a 401 auth error, fall back to sample data automatically
            if "401" in str(inner):
                sample_response = _get_sample_response(mcp_tool.name, force=True, **kwargs)
                if sample_response is not None:
                    logger.info(f"[SAMPLE DATA] 401 from gateway — returning sample response for '{mcp_tool.name}'")
                    return sample_response
            logger.warning(
                f"call_mcp_tool: ExceptionGroup raised and no result captured for {mcp_tool.name}: {inner}"
            )
            raise ToolException(
                f"Tool '{mcp_tool.name}' failed: {inner}"
            ) from eg
        logger.debug(
            f"call_mcp_tool: Ignoring ExceptionGroup on teardown for {mcp_tool.name} "
            f"(result already captured): {_unwrap_exception_group(eg)}"
        )
    except Exception as e:
        inner = _unwrap_exception_group(e)
        # If it's a 401 auth error, fall back to sample data automatically
        if "401" in str(inner):
            sample_response = _get_sample_response(mcp_tool.name, force=True, **kwargs)
            if sample_response is not None:
                logger.info(f"[SAMPLE DATA] 401 from gateway — returning sample response for '{mcp_tool.name}'")
                return sample_response
        logger.exception(f"call_mcp_tool: Error calling {mcp_tool.name}")
        raise ToolException(f"Tool '{mcp_tool.name}' failed: {inner}") from e

    if _call_result is None:
        raise ToolException(
            f"Tool '{mcp_tool.name}' returned no result — the server may be unavailable"
        )

    result = minify_json(str(_call_result))

    if not result:
        logger.warning(f"call_mcp_tool: Tool {mcp_tool.name} returned empty result")

    if len(result) > MCP_MAX_RESPONSE_CHARS:
        logger.warning(
            f"call_mcp_tool: Response from {mcp_tool.name} truncated from "
            f"{len(result)} to ~{MCP_MAX_RESPONSE_CHARS} chars to prevent OOM"
        )
        result = truncate_response(result, MCP_MAX_RESPONSE_CHARS)

    logger.info(
        f"MCP tool '{mcp_tool.name}' returned successfully (response length: {len(result)} chars)"
    )
    return result
