"""Unit tests for runtime skill files."""
import os
import pytest


SKILLS_DIR = os.path.join(os.path.dirname(__file__), "..", "app", "skills")


def get_skill_path(skill_name):
    return os.path.join(SKILLS_DIR, skill_name, "SKILL.md")


def test_customer_analysis_skill_exists():
    """customer-analysis SKILL.md should exist."""
    assert os.path.exists(get_skill_path("customer-analysis"))


def test_sales_order_investigation_skill_exists():
    """sales-order-investigation SKILL.md should exist."""
    assert os.path.exists(get_skill_path("sales-order-investigation"))


def test_performance_recommendations_skill_exists():
    """performance-recommendations SKILL.md should exist."""
    assert os.path.exists(get_skill_path("performance-recommendations"))


def _read_skill(skill_name):
    with open(get_skill_path(skill_name)) as f:
        return f.read()


def test_customer_analysis_has_frontmatter():
    """Customer analysis skill should have valid frontmatter."""
    content = _read_skill("customer-analysis")
    assert content.startswith("---")
    assert "name:" in content
    assert "description:" in content


def test_sales_order_investigation_has_frontmatter():
    """Sales order investigation skill should have valid frontmatter."""
    content = _read_skill("sales-order-investigation")
    assert content.startswith("---")
    assert "name:" in content
    assert "description:" in content


def test_performance_recommendations_has_frontmatter():
    """Performance recommendations skill should have valid frontmatter."""
    content = _read_skill("performance-recommendations")
    assert content.startswith("---")
    assert "name:" in content
    assert "description:" in content


def test_customer_analysis_has_risk_scoring():
    """Customer analysis skill should include risk scoring guidance."""
    content = _read_skill("customer-analysis")
    assert "risk" in content.lower()


def test_sales_order_investigation_has_exception_classification():
    """Sales order investigation should include exception classification."""
    content = _read_skill("sales-order-investigation")
    assert "exception" in content.lower() or "overdue" in content.lower()


def test_performance_recommendations_has_at_risk_section():
    """Performance recommendations skill should cover at-risk customers."""
    content = _read_skill("performance-recommendations")
    assert "at-risk" in content.lower() or "risk" in content.lower()
