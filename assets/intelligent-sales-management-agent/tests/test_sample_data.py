"""Unit tests for the sample data module."""
import pytest
from app.sample_data import (
    SAMPLE_CUSTOMERS,
    SAMPLE_SALES_ORDERS,
    SAMPLE_BILLING_DOCUMENTS,
    SAMPLE_CREDIT_BLOCKED_ORDERS,
    get_sample_dashboard_kpis,
)


def test_sample_customers_count():
    """Should have exactly 10 sample customers."""
    assert len(SAMPLE_CUSTOMERS) == 10


def test_sample_customers_have_required_fields():
    """Each customer should have required fields."""
    required = {"BusinessPartner", "BusinessPartnerFullName", "Industry", "CreditLimit", "Currency"}
    for customer in SAMPLE_CUSTOMERS:
        for field in required:
            assert field in customer, f"Customer missing field: {field}"


def test_sample_customers_are_labeled():
    """All sample customers should be labeled as sample data."""
    for customer in SAMPLE_CUSTOMERS:
        assert customer.get("isSampleData") is True


def test_sample_sales_orders_count():
    """Should have exactly 25 sample sales orders."""
    assert len(SAMPLE_SALES_ORDERS) == 25


def test_sample_sales_orders_have_required_fields():
    """Each order should have required fields."""
    required = {"SalesOrder", "SoldToParty", "OverallSDProcessStatus", "TotalNetAmount", "TransactionCurrency"}
    for order in SAMPLE_SALES_ORDERS:
        for field in required:
            assert field in order, f"Order {order.get('SalesOrder')} missing field: {field}"


def test_sample_orders_have_mixed_statuses():
    """Orders should cover multiple status types."""
    statuses = {o["OverallSDProcessStatus"] for o in SAMPLE_SALES_ORDERS}
    assert "A" in statuses, "No open orders (status A)"
    assert "B" in statuses, "No in-process orders (status B)"
    assert "C" in statuses, "No completed orders (status C)"


def test_sample_orders_have_overdue():
    """Some orders should be flagged as overdue."""
    overdue = [o for o in SAMPLE_SALES_ORDERS if o.get("IsOverdue")]
    assert len(overdue) >= 2, "Expected at least 2 overdue orders"


def test_sample_orders_have_credit_blocked():
    """Some orders should be credit blocked."""
    blocked = [o for o in SAMPLE_SALES_ORDERS if o.get("CreditBlock")]
    assert len(blocked) >= 2, "Expected at least 2 credit blocked orders"


def test_sample_billing_documents_count():
    """Should have billing documents."""
    assert len(SAMPLE_BILLING_DOCUMENTS) >= 8


def test_credit_blocked_orders_subset():
    """Credit blocked orders should be a subset of all orders."""
    all_order_ids = {o["SalesOrder"] for o in SAMPLE_SALES_ORDERS}
    for blocked_order in SAMPLE_CREDIT_BLOCKED_ORDERS:
        assert blocked_order["SalesOrder"] in all_order_ids


def test_get_sample_dashboard_kpis_structure():
    """Dashboard KPIs should return required structure."""
    kpis = get_sample_dashboard_kpis()
    required_keys = {
        "totalOrders", "openOrders", "totalOpenValue", "currency",
        "customerCount", "overdueOrders", "creditBlockedOrders",
        "topCustomers", "trendData", "isSampleData"
    }
    for key in required_keys:
        assert key in kpis, f"KPIs missing key: {key}"


def test_get_sample_dashboard_kpis_values():
    """Dashboard KPIs should have valid values."""
    kpis = get_sample_dashboard_kpis()
    assert kpis["totalOrders"] == 25
    assert kpis["customerCount"] == 10
    assert kpis["openOrders"] > 0
    assert kpis["overdueOrders"] >= 2
    assert kpis["creditBlockedOrders"] >= 2
    assert kpis["isSampleData"] is True
    assert kpis["currency"] == "USD"


def test_get_sample_dashboard_top_customers():
    """Top customers should have required fields."""
    kpis = get_sample_dashboard_kpis()
    assert len(kpis["topCustomers"]) <= 5
    for customer in kpis["topCustomers"]:
        assert "id" in customer
        assert "name" in customer
        assert "orderValue" in customer


def test_get_sample_dashboard_trend_data():
    """Trend data should have 6 months of data."""
    kpis = get_sample_dashboard_kpis()
    assert len(kpis["trendData"]) == 6
    for month_data in kpis["trendData"]:
        assert "month" in month_data
        assert "orderCount" in month_data
        assert "totalValue" in month_data
        assert "avgValue" in month_data
