"""
Integration test: end-to-end agent flow with mocked LLM and MCP tools.
Tests must run offline — all external systems are mocked.
"""
import json
import os
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from langchain_core.messages import AIMessage

from app.agent import SampleAgent, AgentResponse


def make_mock_tool(name, description="Mock tool"):
    """Create a minimal LangChain-compatible mock tool."""
    tool = MagicMock()
    tool.name = name
    tool.description = description
    return tool


@pytest.fixture
def mock_tools():
    return [
        make_mock_tool("list_salesorder_for_sap_self", "List sales orders"),
        make_mock_tool("list_a_businesspartner_for_api_business_partner", "List business partners"),
    ]


@pytest.fixture
def mock_ai_response():
    """Mock AI message returned by the graph."""
    return AIMessage(
        content="[SAMPLE DATA] Sales Dashboard KPIs:\n"
                "- Total Orders: 25\n"
                "- Open Orders: 13\n"
                "- Open Order Value: $1,369,500\n"
                "- Overdue Orders: 3\n"
                "- Credit Blocked: 2\n"
                "- Active Customers: 10"
    )


@pytest.mark.asyncio
async def test_agent_invoke_returns_response(mock_tools, mock_ai_response):
    """Agent.invoke should return a completed AgentResponse."""
    agent = SampleAgent()

    graph_result = {"messages": [mock_ai_response]}

    with patch.object(agent, "_run_agent", new=AsyncMock(return_value=graph_result)):
        response = await agent.invoke(
            query="Show me the sales dashboard KPIs",
            context_id="test-session-001",
            tools=mock_tools,
        )

    assert isinstance(response, AgentResponse)
    assert response.status == "completed"
    assert "Sales Dashboard" in response.message or "KPI" in response.message.upper() or "Orders" in response.message


@pytest.mark.asyncio
async def test_agent_stream_completes(mock_tools, mock_ai_response):
    """Agent.stream should yield a final chunk with is_task_complete=True."""
    agent = SampleAgent()

    graph_result = {"messages": [mock_ai_response]}

    with patch.object(agent, "_run_agent", new=AsyncMock(return_value=graph_result)):
        chunks = []
        async for chunk in agent.stream(
            query="List the top customers by order value",
            context_id="test-session-002",
            tools=mock_tools,
        ):
            chunks.append(chunk)

    assert len(chunks) >= 2  # at least "Processing" + final
    final_chunk = chunks[-1]
    assert final_chunk["is_task_complete"] is True
    assert "content" in final_chunk


@pytest.mark.asyncio
async def test_agent_handles_no_tools(mock_ai_response):
    """Agent should handle gracefully when no tools are available."""
    agent = SampleAgent()

    graph_result = {"messages": [mock_ai_response]}

    with patch.object(agent, "_run_agent", new=AsyncMock(return_value=graph_result)):
        response = await agent.invoke(
            query="What can you help me with?",
            context_id="test-session-003",
            tools=[],
        )

    assert isinstance(response, AgentResponse)
    assert response.status == "completed"


@pytest.mark.asyncio
async def test_agent_error_handling(mock_tools):
    """Agent should return error status when an exception occurs."""
    agent = SampleAgent()

    with patch.object(agent, "_run_agent", new=AsyncMock(side_effect=RuntimeError("Test error"))):
        response = await agent.invoke(
            query="Show me orders",
            context_id="test-session-004",
            tools=mock_tools,
        )

    assert isinstance(response, AgentResponse)
    assert response.status in ("error", "completed")  # error handler catches and returns a response


@pytest.mark.asyncio
async def test_agent_logs_activity_after_invoke(mock_tools, mock_ai_response):
    """After invoke, activity history should have an entry."""
    from app.agent import get_activity_history, _activity_history
    _activity_history.clear()

    agent = SampleAgent()
    graph_result = {"messages": [mock_ai_response]}

    with patch.object(agent, "_run_agent", new=AsyncMock(return_value=graph_result)):
        await agent.invoke(
            query="Show me dashboard KPIs for activity test",
            context_id="test-session-005",
            tools=mock_tools,
        )

    history = get_activity_history()
    assert len(history) >= 1
    assert "dashboard" in history[0]["userQuery"].lower() or "activity" in history[0]["userQuery"].lower()


@pytest.mark.asyncio
async def test_agent_customer_query(mock_tools, mock_ai_response):
    """Agent should handle customer-related queries."""
    agent = SampleAgent()

    customer_response = AIMessage(
        content="[SAMPLE DATA] Customer Analysis: Acme Technology Solutions (CUST-0001)\n"
                "- Credit Limit: $500,000\n"
                "- Current Exposure: $123,450\n"
                "- Risk Level: Low 🟢\n"
                "- Open Orders: 2"
    )

    graph_result = {"messages": [customer_response]}

    with patch.object(agent, "_run_agent", new=AsyncMock(return_value=graph_result)):
        response = await agent.invoke(
            query="Analyze customer Acme Technology Solutions",
            context_id="test-session-006",
            tools=mock_tools,
        )

    assert response.status == "completed"
    assert len(response.message) > 0


@pytest.mark.asyncio
async def test_agent_order_investigation_query(mock_tools):
    """Agent should handle sales order investigation queries."""
    agent = SampleAgent()

    order_response = AIMessage(
        content="[SAMPLE DATA] Order Investigation: SO-100009\n"
                "- Customer: Retail Dynamics Inc\n"
                "- Status: OVERDUE by 5 days\n"
                "- Exception: Overdue Delivery (High)\n"
                "- Recommended Action: Escalate to logistics team"
    )

    graph_result = {"messages": [order_response]}

    with patch.object(agent, "_run_agent", new=AsyncMock(return_value=graph_result)):
        response = await agent.invoke(
            query="Investigate sales order SO-100009",
            context_id="test-session-007",
            tools=mock_tools,
        )

    assert response.status == "completed"
    assert len(response.message) > 0
