"""
[SAMPLE DATA] — Clearly labelled sample data for development and testing.
All data in this module is synthetic and does not represent real business entities.
Toggle live vs. sample data with the USE_SAMPLE_DATA environment variable.
"""

import os
from datetime import datetime, timedelta

USE_SAMPLE_DATA = os.environ.get("USE_SAMPLE_DATA", "true").lower() == "true"

# ──────────────────────────────────────────────────────────────────────────────
# [SAMPLE DATA] Customers (Business Partners)
# ──────────────────────────────────────────────────────────────────────────────
SAMPLE_CUSTOMERS = [
    {
        "BusinessPartner": "CUST-0001",
        "BusinessPartnerFullName": "Acme Technology Solutions",
        "Industry": "Technology",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 500000.00,
        "Currency": "USD",
        "CreditExposure": 123450.00,
        "Segment": "Enterprise",
        "City": "San Francisco",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0002",
        "BusinessPartnerFullName": "Global Manufacturing Corp",
        "Industry": "Manufacturing",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 750000.00,
        "Currency": "USD",
        "CreditExposure": 342100.00,
        "Segment": "Enterprise",
        "City": "Detroit",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0003",
        "BusinessPartnerFullName": "Retail Dynamics Inc",
        "Industry": "Retail",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 250000.00,
        "Currency": "USD",
        "CreditExposure": 245000.00,
        "Segment": "Mid-Market",
        "City": "New York",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0004",
        "BusinessPartnerFullName": "Precision Engineering Ltd",
        "Industry": "Manufacturing",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 400000.00,
        "Currency": "USD",
        "CreditExposure": 67800.00,
        "Segment": "Mid-Market",
        "City": "Chicago",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0005",
        "BusinessPartnerFullName": "CloudFirst Software AG",
        "Industry": "Technology",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 300000.00,
        "Currency": "USD",
        "CreditExposure": 0.00,
        "Segment": "Mid-Market",
        "City": "Austin",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0006",
        "BusinessPartnerFullName": "MegaStore Retail Group",
        "Industry": "Retail",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 600000.00,
        "Currency": "USD",
        "CreditExposure": 598000.00,
        "Segment": "Enterprise",
        "City": "Los Angeles",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0007",
        "BusinessPartnerFullName": "Northern Logistics Services",
        "Industry": "Logistics",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 200000.00,
        "Currency": "USD",
        "CreditExposure": 34500.00,
        "Segment": "SMB",
        "City": "Minneapolis",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0008",
        "BusinessPartnerFullName": "Healthcare Partners Network",
        "Industry": "Healthcare",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 450000.00,
        "Currency": "USD",
        "CreditExposure": 112300.00,
        "Segment": "Enterprise",
        "City": "Boston",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0009",
        "BusinessPartnerFullName": "EcoGreen Industries",
        "Industry": "Manufacturing",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 180000.00,
        "Currency": "USD",
        "CreditExposure": 22100.00,
        "Segment": "SMB",
        "City": "Portland",
        "Country": "US",
        "isSampleData": True,
    },
    {
        "BusinessPartner": "CUST-0010",
        "BusinessPartnerFullName": "Digital Media Studios",
        "Industry": "Technology",
        "BusinessPartnerCategory": "2",
        "CreditLimit": 150000.00,
        "Currency": "USD",
        "CreditExposure": 0.00,
        "Segment": "SMB",
        "City": "Nashville",
        "Country": "US",
        "isSampleData": True,
    },
]

# ──────────────────────────────────────────────────────────────────────────────
# [SAMPLE DATA] Sales Orders
# ──────────────────────────────────────────────────────────────────────────────
_today = datetime.now()

SAMPLE_SALES_ORDERS = [
    # Open orders
    {"SalesOrder": "SO-100001", "SoldToParty": "CUST-0001", "SoldToPartyName": "Acme Technology Solutions", "OverallSDProcessStatus": "A", "TotalNetAmount": 45000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=5)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=10)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100002", "SoldToParty": "CUST-0002", "SoldToPartyName": "Global Manufacturing Corp", "OverallSDProcessStatus": "A", "TotalNetAmount": 128000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=3)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=7)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100003", "SoldToParty": "CUST-0003", "SoldToPartyName": "Retail Dynamics Inc", "OverallSDProcessStatus": "A", "TotalNetAmount": 67500.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=8)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=5)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100004", "SoldToParty": "CUST-0004", "SoldToPartyName": "Precision Engineering Ltd", "OverallSDProcessStatus": "A", "TotalNetAmount": 23400.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=2)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=14)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100005", "SoldToParty": "CUST-0005", "SoldToPartyName": "CloudFirst Software AG", "OverallSDProcessStatus": "A", "TotalNetAmount": 89200.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=1)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=20)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True},
    # In Process orders
    {"SalesOrder": "SO-100006", "SoldToParty": "CUST-0001", "SoldToPartyName": "Acme Technology Solutions", "OverallSDProcessStatus": "B", "TotalNetAmount": 312000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=12)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=3)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100007", "SoldToParty": "CUST-0002", "SoldToPartyName": "Global Manufacturing Corp", "OverallSDProcessStatus": "B", "TotalNetAmount": 445000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=15)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=2)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100008", "SoldToParty": "CUST-0006", "SoldToPartyName": "MegaStore Retail Group", "OverallSDProcessStatus": "B", "TotalNetAmount": 156000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=10)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=1)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True},
    # Overdue orders (past delivery date, not completed)
    {"SalesOrder": "SO-100009", "SoldToParty": "CUST-0003", "SoldToPartyName": "Retail Dynamics Inc", "OverallSDProcessStatus": "B", "TotalNetAmount": 34500.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=30)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=5)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True, "IsOverdue": True},
    {"SalesOrder": "SO-100010", "SoldToParty": "CUST-0007", "SoldToPartyName": "Northern Logistics Services", "OverallSDProcessStatus": "A", "TotalNetAmount": 18900.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=25)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=10)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True, "IsOverdue": True},
    {"SalesOrder": "SO-100011", "SoldToParty": "CUST-0008", "SoldToPartyName": "Healthcare Partners Network", "OverallSDProcessStatus": "B", "TotalNetAmount": 72000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=20)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=3)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True, "IsOverdue": True},
    # Credit blocked orders
    {"SalesOrder": "SO-100012", "SoldToParty": "CUST-0003", "SoldToPartyName": "Retail Dynamics Inc", "OverallSDProcessStatus": "A", "TotalNetAmount": 95000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=7)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=8)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True, "CreditBlock": True},
    {"SalesOrder": "SO-100013", "SoldToParty": "CUST-0006", "SoldToPartyName": "MegaStore Retail Group", "OverallSDProcessStatus": "A", "TotalNetAmount": 210000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=4)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today + timedelta(days=12)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True, "CreditBlock": True},
    # Completed orders
    {"SalesOrder": "SO-100014", "SoldToParty": "CUST-0001", "SoldToPartyName": "Acme Technology Solutions", "OverallSDProcessStatus": "C", "TotalNetAmount": 78000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=45)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=20)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100015", "SoldToParty": "CUST-0002", "SoldToPartyName": "Global Manufacturing Corp", "OverallSDProcessStatus": "C", "TotalNetAmount": 234500.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=60)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=30)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100016", "SoldToParty": "CUST-0004", "SoldToPartyName": "Precision Engineering Ltd", "OverallSDProcessStatus": "C", "TotalNetAmount": 56700.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=40)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=15)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100017", "SoldToParty": "CUST-0009", "SoldToPartyName": "EcoGreen Industries", "OverallSDProcessStatus": "C", "TotalNetAmount": 22100.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=35)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=10)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True},
    {"SalesOrder": "SO-100018", "SoldToParty": "CUST-0005", "SoldToPartyName": "CloudFirst Software AG", "OverallSDProcessStatus": "C", "TotalNetAmount": 145600.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=55)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=25)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True},
    {"SalesOrder": "SO-100019", "SoldToParty": "CUST-0008", "SoldToPartyName": "Healthcare Partners Network", "OverallSDProcessStatus": "C", "TotalNetAmount": 112300.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=50)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=20)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True},
    {"SalesOrder": "SO-100020", "SoldToParty": "CUST-0010", "SoldToPartyName": "Digital Media Studios", "OverallSDProcessStatus": "C", "TotalNetAmount": 31200.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=42)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=12)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    # Additional orders for trend data
    {"SalesOrder": "SO-100021", "SoldToParty": "CUST-0001", "SoldToPartyName": "Acme Technology Solutions", "OverallSDProcessStatus": "C", "TotalNetAmount": 198000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=90)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=60)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100022", "SoldToParty": "CUST-0002", "SoldToPartyName": "Global Manufacturing Corp", "OverallSDProcessStatus": "C", "TotalNetAmount": 367000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=120)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=90)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100023", "SoldToParty": "CUST-0006", "SoldToPartyName": "MegaStore Retail Group", "OverallSDProcessStatus": "C", "TotalNetAmount": 234000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=150)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=120)).strftime("%Y-%m-%d"), "SalesOrganization": "1020", "isSampleData": True},
    {"SalesOrder": "SO-100024", "SoldToParty": "CUST-0003", "SoldToPartyName": "Retail Dynamics Inc", "OverallSDProcessStatus": "C", "TotalNetAmount": 88900.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=75)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=45)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
    {"SalesOrder": "SO-100025", "SoldToParty": "CUST-0004", "SoldToPartyName": "Precision Engineering Ltd", "OverallSDProcessStatus": "C", "TotalNetAmount": 145000.00, "TransactionCurrency": "USD", "SalesOrderDate": (_today - timedelta(days=180)).strftime("%Y-%m-%d"), "RequestedDeliveryDate": (_today - timedelta(days=150)).strftime("%Y-%m-%d"), "SalesOrganization": "1010", "isSampleData": True},
]

# ──────────────────────────────────────────────────────────────────────────────
# [SAMPLE DATA] Sales Order Line Items
# ──────────────────────────────────────────────────────────────────────────────
SAMPLE_ORDER_ITEMS = {
    "SO-100001": [
        {"SalesOrderItem": "10", "Material": "MAT-PRD-001", "SalesOrderItemText": "Enterprise Software License", "RequestedQuantity": 5, "RequestedQuantityUnit": "EA", "NetPriceAmount": 9000.00, "TransactionCurrency": "USD"},
        {"SalesOrderItem": "20", "Material": "MAT-SVC-002", "SalesOrderItemText": "Implementation Services", "RequestedQuantity": 1, "RequestedQuantityUnit": "EA", "NetPriceAmount": 45000.00, "TransactionCurrency": "USD"},
    ],
    "SO-100002": [
        {"SalesOrderItem": "10", "Material": "MAT-HW-001", "SalesOrderItemText": "Industrial Control Unit", "RequestedQuantity": 20, "RequestedQuantityUnit": "EA", "NetPriceAmount": 6400.00, "TransactionCurrency": "USD"},
    ],
    "SO-100006": [
        {"SalesOrderItem": "10", "Material": "MAT-PRD-003", "SalesOrderItemText": "Cloud Platform License - Annual", "RequestedQuantity": 12, "RequestedQuantityUnit": "EA", "NetPriceAmount": 26000.00, "TransactionCurrency": "USD"},
    ],
}

# ──────────────────────────────────────────────────────────────────────────────
# [SAMPLE DATA] Billing Documents
# ──────────────────────────────────────────────────────────────────────────────
SAMPLE_BILLING_DOCUMENTS = [
    {"BillingDocument": "BL-9001", "SoldToParty": "CUST-0001", "BillingDocumentDate": (_today - timedelta(days=20)).strftime("%Y-%m-%d"), "TotalNetAmount": 78000.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9002", "SoldToParty": "CUST-0002", "BillingDocumentDate": (_today - timedelta(days=30)).strftime("%Y-%m-%d"), "TotalNetAmount": 234500.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9003", "SoldToParty": "CUST-0004", "BillingDocumentDate": (_today - timedelta(days=15)).strftime("%Y-%m-%d"), "TotalNetAmount": 56700.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9004", "SoldToParty": "CUST-0001", "BillingDocumentDate": (_today - timedelta(days=90)).strftime("%Y-%m-%d"), "TotalNetAmount": 198000.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9005", "SoldToParty": "CUST-0002", "BillingDocumentDate": (_today - timedelta(days=120)).strftime("%Y-%m-%d"), "TotalNetAmount": 367000.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9006", "SoldToParty": "CUST-0005", "BillingDocumentDate": (_today - timedelta(days=25)).strftime("%Y-%m-%d"), "TotalNetAmount": 145600.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9007", "SoldToParty": "CUST-0008", "BillingDocumentDate": (_today - timedelta(days=20)).strftime("%Y-%m-%d"), "TotalNetAmount": 112300.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9008", "SoldToParty": "CUST-0010", "BillingDocumentDate": (_today - timedelta(days=12)).strftime("%Y-%m-%d"), "TotalNetAmount": 31200.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9009", "SoldToParty": "CUST-0006", "BillingDocumentDate": (_today - timedelta(days=120)).strftime("%Y-%m-%d"), "TotalNetAmount": 234000.00, "TransactionCurrency": "USD", "isSampleData": True},
    {"BillingDocument": "BL-9010", "SoldToParty": "CUST-0003", "BillingDocumentDate": (_today - timedelta(days=45)).strftime("%Y-%m-%d"), "TotalNetAmount": 88900.00, "TransactionCurrency": "USD", "isSampleData": True},
]

# ──────────────────────────────────────────────────────────────────────────────
# [SAMPLE DATA] Credit Blocked Orders
# ──────────────────────────────────────────────────────────────────────────────
SAMPLE_CREDIT_BLOCKED_ORDERS = [
    o for o in SAMPLE_SALES_ORDERS if o.get("CreditBlock")
]

# ──────────────────────────────────────────────────────────────────────────────
# Helper: compute dashboard KPIs from sample data
# ──────────────────────────────────────────────────────────────────────────────
def get_sample_dashboard_kpis() -> dict:
    """[SAMPLE DATA] Compute sales dashboard KPIs from sample data."""
    active_orders = [o for o in SAMPLE_SALES_ORDERS if o["OverallSDProcessStatus"] != "C"]
    open_orders = [o for o in SAMPLE_SALES_ORDERS if o["OverallSDProcessStatus"] in ("A", "B")]
    overdue_orders = [o for o in SAMPLE_SALES_ORDERS if o.get("IsOverdue")]
    credit_blocked = [o for o in SAMPLE_SALES_ORDERS if o.get("CreditBlock")]

    total_open_value = sum(o["TotalNetAmount"] for o in open_orders)

    # Top 5 customers by open order value
    customer_values: dict = {}
    for o in open_orders:
        cid = o["SoldToParty"]
        customer_values[cid] = customer_values.get(cid, {"id": cid, "name": o["SoldToPartyName"], "orderValue": 0.0})
        customer_values[cid]["orderValue"] += o["TotalNetAmount"]

    top_customers = sorted(customer_values.values(), key=lambda x: x["orderValue"], reverse=True)[:5]

    # 6-month trend (monthly buckets)
    trend_data = []
    for i in range(5, -1, -1):
        month_start = _today.replace(day=1) - timedelta(days=30 * i)
        month_end = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
        month_orders = [
            o for o in SAMPLE_SALES_ORDERS
            if month_start.strftime("%Y-%m") <= o["SalesOrderDate"][:7] < month_end.strftime("%Y-%m")
        ]
        trend_data.append({
            "month": month_start.strftime("%Y-%m"),
            "orderCount": len(month_orders),
            "totalValue": round(sum(o["TotalNetAmount"] for o in month_orders), 2),
            "avgValue": round(sum(o["TotalNetAmount"] for o in month_orders) / len(month_orders), 2) if month_orders else 0.0,
        })

    return {
        "totalOrders": len(SAMPLE_SALES_ORDERS),
        "openOrders": len(open_orders),
        "totalOpenValue": round(total_open_value, 2),
        "currency": "USD",
        "customerCount": len(SAMPLE_CUSTOMERS),
        "overdueOrders": len(overdue_orders),
        "creditBlockedOrders": len(credit_blocked),
        "topCustomers": top_customers,
        "trendData": trend_data,
        "isSampleData": True,
    }
