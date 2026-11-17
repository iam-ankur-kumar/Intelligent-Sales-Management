"""Unit tests for agent system prompt and configuration."""
import pytest
from app.agent import get_system_prompt, get_model_name, get_temperature


def test_system_prompt_exists():
    """System prompt should not be empty."""
    prompt = get_system_prompt()
    assert prompt
    assert len(prompt) > 100


def test_system_prompt_contains_sales_context():
    """System prompt should reference sales capabilities."""
    prompt = get_system_prompt()
    assert "sales" in prompt.lower()
    assert "customer" in prompt.lower()


def test_system_prompt_anti_hallucination():
    """System prompt should include anti-hallucination rules."""
    prompt = get_system_prompt()
    assert "NEVER fabricate" in prompt or "never fabricate" in prompt.lower()


def test_system_prompt_skill_references():
    """System prompt should reference runtime skills."""
    prompt = get_system_prompt()
    assert "customer-analysis" in prompt.lower() or "customer analysis" in prompt.lower()
    assert "sales-order-investigation" in prompt.lower() or "sales order" in prompt.lower()
    assert "performance-recommendations" in prompt.lower() or "performance" in prompt.lower()


def test_system_prompt_pagination_limit():
    """System prompt should instruct to limit pagination."""
    prompt = get_system_prompt()
    assert "top" in prompt.lower() or "pagination" in prompt.lower() or "limit" in prompt.lower()


def test_system_prompt_sample_data():
    """System prompt should reference sample data labeling."""
    prompt = get_system_prompt()
    assert "SAMPLE DATA" in prompt or "sample data" in prompt.lower()


def test_system_prompt_security():
    """System prompt should include security guidelines."""
    prompt = get_system_prompt()
    assert "security" in prompt.lower() or "instructions" in prompt.lower() or "tool results" in prompt.lower()


def test_model_name():
    """Model name should be set."""
    model = get_model_name()
    assert model
    assert "claude" in model.lower() or "gpt" in model.lower() or "sap" in model.lower()


def test_temperature():
    """Temperature should be between 0 and 1."""
    temp = get_temperature()
    assert 0.0 <= temp <= 1.0
