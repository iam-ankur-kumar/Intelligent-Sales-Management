using com.intelligent.sales as db from '../db/schema';

/**
 * SalesService — Unified API for the Intelligent Sales Management Application.
 * All business data queries are proxied through the AI Sales Agent (A2A protocol).
 */
service SalesService @(path: '/api/sales') {

  // ──────────────────────────────────────────────────────────────────────────
  // Entities (persistent storage)
  // ──────────────────────────────────────────────────────────────────────────

  entity AgentConversations      as projection on db.AgentConversation;
  entity AgentActivities         as projection on db.AgentActivity;
  entity SalesRecommendations    as projection on db.SalesRecommendation;
  entity SampleDataFlags         as projection on db.SampleDataFlag;

  // ──────────────────────────────────────────────────────────────────────────
  // Actions — proxy to AI Sales Agent
  // ──────────────────────────────────────────────────────────────────────────

  /** Send a natural language message to the AI Sales Assistant. */
  action sendMessage(message: String, sessionId: String)
    returns MessageResponse;

  /** Get aggregated Sales Dashboard KPIs. */
  action getDashboardKPIs()
    returns DashboardKPIResponse;

  /** Get a list of customers, optionally filtered by search term. */
  action getCustomers(search: String, top: Integer)
    returns CustomerListResponse;

  /** Get detailed information for a specific customer. */
  action getCustomerDetail(customerId: String)
    returns CustomerDetailResponse;

  /** Get a list of sales orders with optional filters. */
  action getSalesOrders(customerId: String, status: String, top: Integer)
    returns OrderListResponse;

  /** Get detailed information for a specific sales order. */
  action getSalesOrderDetail(orderId: String)
    returns OrderDetailResponse;

  /** Generate AI-powered sales recommendations. */
  action generateRecommendations()
    returns RecommendationsResponse;

  // ──────────────────────────────────────────────────────────────────────────
  // Return types
  // ──────────────────────────────────────────────────────────────────────────

  type MessageResponse {
    sessionId        : String;
    response         : String;
    toolsUsed        : array of String;
    isSampleData     : Boolean;
    status           : String;
  }

  type KPITopCustomer {
    id               : String;
    name             : String;
    orderValue       : Decimal;
  }

  type TrendDataPoint {
    month            : String;
    orderCount       : Integer;
    totalValue       : Decimal;
    avgValue         : Decimal;
  }

  type DashboardKPIResponse {
    totalOrders              : Integer;
    openOrders               : Integer;
    totalOpenValue           : Decimal;
    currency                 : String;
    customerCount            : Integer;
    overdueOrders            : Integer;
    creditBlockedOrders      : Integer;
    topCustomers             : array of KPITopCustomer;
    trendData                : array of TrendDataPoint;
    isSampleData             : Boolean;
  }

  type CustomerListItem {
    id               : String;
    name             : String;
    industry         : String;
    segment          : String;
    creditLimit      : Decimal;
    creditExposure   : Decimal;
    currency         : String;
    orderCount       : Integer;
    totalOrderValue  : Decimal;
  }

  type CustomerListResponse {
    customers        : array of CustomerListItem;
    totalCount       : Integer;
    isSampleData     : Boolean;
  }

  type CustomerDetailResponse {
    customer         : CustomerListItem;
    recentOrders     : array of OrderListItem;
    riskScore        : Integer;
    riskLevel        : String;
    insights         : String;
    isSampleData     : Boolean;
  }

  type OrderListItem {
    id                      : String;
    customer                : String;
    customerName            : String;
    status                  : String;
    statusDescription       : String;
    totalValue              : Decimal;
    currency                : String;
    salesOrderDate          : String;
    requestedDeliveryDate   : String;
    overdue                 : Boolean;
    daysOverdue             : Integer;
    creditBlocked           : Boolean;
  }

  type OrderLineItem {
    itemNumber       : String;
    material         : String;
    description      : String;
    quantity         : Decimal;
    unit             : String;
    unitPrice        : Decimal;
    totalPrice       : Decimal;
    currency         : String;
  }

  type OrderListResponse {
    orders           : array of OrderListItem;
    totalCount       : Integer;
    overdueCount     : Integer;
    creditBlockedCount: Integer;
    isSampleData     : Boolean;
  }

  type OrderDetailResponse {
    order            : OrderListItem;
    lineItems        : array of OrderLineItem;
    isSampleData     : Boolean;
  }

  type RecommendationItem {
    id               : UUID;
    priority         : String;
    category         : String;
    referenceId      : String;
    referenceType    : String;
    recommendation   : String;
    status           : String;
  }

  type RecommendationsResponse {
    recommendations  : array of RecommendationItem;
    totalCount       : Integer;
    isSampleData     : Boolean;
  }
}
