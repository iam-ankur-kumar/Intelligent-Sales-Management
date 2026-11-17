"""Unit tests for mcp-mock.json structure and content."""
import json
import os
import pytest


@pytest.fixture
def mcp_mock():
    """Load mcp-mock.json from agent root."""
    mock_path = os.path.join(os.path.dirname(__file__), "..", "mcp-mock.json")
    with open(mock_path) as f:
        return json.load(f)


def test_mcp_mock_has_servers(mcp_mock):
    """mcp-mock.json should have servers."""
    assert "servers" in mcp_mock
    assert len(mcp_mock["servers"]) > 0


def test_mcp_mock_has_metadata(mcp_mock):
    """mcp-mock.json should have metadata."""
    assert "metadata" in mcp_mock
    meta = mcp_mock["metadata"]
    assert "version" in meta
    assert "total_servers" in meta
    assert "total_tools" in meta


def test_mcp_mock_has_sales_order_server(mcp_mock):
    """mcp-mock.json should include sales order tools."""
    all_tool_names = []
    for server in mcp_mock["servers"].values():
        all_tool_names.extend(server.get("tools", {}).keys())
    sales_order_tools = [t for t in all_tool_names if "salesorder" in t.lower()]
    assert len(sales_order_tools) > 0, "No sales order tools found in mcp-mock.json"


def test_mcp_mock_has_business_partner_server(mcp_mock):
    """mcp-mock.json should include business partner tools."""
    all_tool_names = []
    for server in mcp_mock["servers"].values():
        all_tool_names.extend(server.get("tools", {}).keys())
    bp_tools = [t for t in all_tool_names if "businesspartner" in t.lower() or "customer" in t.lower()]
    assert len(bp_tools) > 0, "No business partner tools found in mcp-mock.json"


def test_mcp_mock_tools_have_required_fields(mcp_mock):
    """Each tool should have description, input_schema, and mock_response."""
    for server_name, server in mcp_mock["servers"].items():
        for tool_name, tool in server.get("tools", {}).items():
            assert "description" in tool, f"{server_name}.{tool_name} missing description"
            assert "input_schema" in tool, f"{server_name}.{tool_name} missing input_schema"
            assert "mock_response" in tool, f"{server_name}.{tool_name} missing mock_response"


def test_mcp_mock_list_tools_return_results(mcp_mock):
    """List tools should return mock responses with results."""
    for server in mcp_mock["servers"].values():
        for tool_name, tool in server.get("tools", {}).items():
            if tool_name.startswith("list_"):
                response = tool["mock_response"]
                # Either has 'results' key or is a direct array
                assert "results" in response or isinstance(response, list), \
                    f"list tool {tool_name} should return results"


def test_mcp_mock_total_tools_matches_metadata(mcp_mock):
    """Total tools in metadata should match actual tool count."""
    actual_total = sum(
        len(server.get("tools", {}))
        for server in mcp_mock["servers"].values()
    )
    assert mcp_mock["metadata"]["total_tools"] == actual_total
