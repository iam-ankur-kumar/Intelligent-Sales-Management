"""Unit tests for agent activity tracking."""
import pytest
from app.agent import log_activity, get_activity_history, _activity_history


def setup_function():
    """Clear activity history before each test."""
    _activity_history.clear()


def test_log_activity_stores_entry():
    """log_activity should store an entry in history."""
    log_activity(
        query="Show me dashboard KPIs",
        tools_used=["list_salesorder_for_sap_self"],
        status="success",
        result_summary="Returned 25 orders",
        duration_ms=1250,
    )
    history = get_activity_history()
    assert len(history) == 1


def test_log_activity_fields():
    """Stored activity entry should have all required fields."""
    log_activity(
        query="List customers",
        tools_used=["list_a_businesspartner_for_api_business_partner"],
        status="success",
        result_summary="Returned 10 customers",
        duration_ms=800,
    )
    history = get_activity_history()
    entry = history[0]
    assert "timestamp" in entry
    assert "userQuery" in entry
    assert "toolsUsed" in entry
    assert "status" in entry
    assert "resultSummary" in entry
    assert "durationMs" in entry


def test_log_activity_truncates_query():
    """Long queries should be truncated to 200 chars."""
    long_query = "A" * 300
    log_activity(
        query=long_query,
        tools_used=[],
        status="success",
        result_summary="",
        duration_ms=0,
    )
    history = get_activity_history()
    assert len(history[0]["userQuery"]) <= 200


def test_log_activity_truncates_result():
    """Long result summaries should be truncated to 500 chars."""
    long_result = "B" * 600
    log_activity(
        query="Test",
        tools_used=[],
        status="success",
        result_summary=long_result,
        duration_ms=0,
    )
    history = get_activity_history()
    assert len(history[0]["resultSummary"]) <= 500


def test_get_activity_history_most_recent_first():
    """History should return most recent entries first."""
    log_activity("First query", [], "success", "result1", 100)
    log_activity("Second query", [], "success", "result2", 200)
    history = get_activity_history()
    assert history[0]["userQuery"] == "Second query"
    assert history[1]["userQuery"] == "First query"


def test_activity_history_max_50():
    """Activity history should cap at 50 entries."""
    for i in range(60):
        log_activity(f"Query {i}", [], "success", f"result {i}", i * 10)
    history = get_activity_history()
    assert len(history) <= 50


def test_get_activity_history_empty():
    """Empty history should return empty list."""
    history = get_activity_history()
    assert history == []


def test_log_activity_error_status():
    """Error status should be stored correctly."""
    log_activity(
        query="Failed query",
        tools_used=["list_salesorder_for_sap_self"],
        status="error",
        result_summary="Connection timeout",
        duration_ms=5000,
    )
    history = get_activity_history()
    assert history[0]["status"] == "error"
