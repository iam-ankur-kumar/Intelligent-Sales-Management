# Specification: intelligent-sales-management-agent

> **Guidelines**: Read all applicable guidelines before executing ANY tasks below:
> - [guidelines.md](../guidelines.md) — Universal execution rules
> - [guidelines-agent.md](../guidelines-agent.md) — Universal agent patterns
> - [guidelines-agent-python.md](../guidelines-agent-python.md) — Python implementation details
> - [guidelines-agent-skills.md](../guidelines-agent-skills.md) — Runtime skills patterns
> - [guidelines-agent-mcp.md](../guidelines-agent-mcp.md) — MCP integration patterns

---

## Basic Setup

- [ ] Read `intent.md` for full business context, goals, and fit-gap analysis
- [ ] Bootstrap agent code in `assets/intelligent-sales-management-agent/` using instructions from the `sap-agent-bootstrap` reference in the agent skill (invoke from inside `assets/intelligent-sales-management-agent/`, use copy commands — do NOT create files manually)
- [ ] Install dependencies, validate the agent starts and responds at `/.well-known/agent.json`

---

## Runtime Skills

> **Before proceeding**, read [guidelines-agent-skills.md](../guidelines-agent-skills.md)

The following runtime skills are required due to complex multi-step workflows:

- [ ] Create `assets/intelligent-sales-management-agent/app/skills/customer-analysis/SKILL.md` with:
  - `name: customer-analysis`
  - `description: Deep customer analysis workflow — purchasing history, risk scoring, and revenue opportunity identification`
  - Step-by-step instructions: retrieve customer master data, retrieve order history, calculate revenue trends (last 3/6/12 months), identify risk indicators (payment delays, declining order volume, credit blocks), generate recommendations
  - Reference file: `references/risk-scoring-rules.md` with thresholds for at-risk classification

- [ ] Create `assets/intelligent-sales-management-agent/app/skills/sales-order-investigation/SKILL.md` with:
  - `name: sales-order-investigation`
  - `description: Structured investigation of sales orders — status analysis, exception detection, and resolution guidance`
  - Step-by-step instructions: retrieve order header and items, check delivery dates vs. requested dates, identify overdue deliveries, detect credit blocks, check billing status
  - Decision table: exception types → recommended actions

- [ ] Create `assets/intelligent-sales-management-agent/app/skills/performance-recommendations/SKILL.md` with:
  - `name: performance-recommendations`
  - `description: AI-powered sales performance analysis and actionable recommendations for sales managers`
  - Instructions: aggregate KPIs (total value, open orders, overdue rate, top customers), identify performance gaps, generate prioritized action list

---

## Project-Specific Tasks

### Sample Data Layer

- [ ] Create `assets/intelligent-sales-management-agent/app/sample_data.py` with clearly labelled sample data for:
  - 10 sample customers (business partners with names, segments, credit limits)
  - 25 sample sales orders across different statuses (Open, In Delivery, Completed, Credit Blocked)
  - Sample billing documents linked to completed orders
  - All data must include a `[SAMPLE DATA]` label in comments/docstrings
- [ ] Implement a `USE_SAMPLE_DATA` environment variable flag (`true` by default for development) — when set, the agent returns sample data instead of calling live MCP tools
- [ ] Ensure sample data covers all required query patterns: by customer, by date range, by status, by sales organization

### Agent System Prompt

- [ ] Open `assets/intelligent-sales-management-agent/app/agent.py` and write a comprehensive system prompt covering:
  - Role: "You are an Intelligent Sales Assistant for enterprise sales teams. You help sales managers monitor customers, analyze sales orders, understand sales performance, and receive actionable AI recommendations."
  - Capabilities: natural language queries on customer and sales order data; customer risk analysis; sales performance recommendations; order exception detection
  - Page size limit: always set `top` / `$top` to maximum 100 on paginated tool calls
  - Anti-hallucination: "NEVER fabricate or invent customer names, order numbers, or financial figures. Always retrieve data using tools."
  - Error handling: relay tool errors verbatim
  - Skill loading: "When performing deep customer analysis, load the `customer-analysis` skill. When investigating a specific sales order, load the `sales-order-investigation` skill. When generating performance recommendations, load the `performance-recommendations` skill."
  - Data mode: "When `USE_SAMPLE_DATA=true`, use the built-in sample data. Clearly label all sample data responses with '[SAMPLE DATA]'."

### Sales Order Capabilities

- [ ] Implement the following query patterns using MCP tools from `CE_SALESORDER_0001` API:
  - List sales orders with filters: by customer (`SoldToParty`), by status (`OverallSDProcessStatus`), by date range (`SalesOrderDate`), by sales organization (`SalesOrganization`)
  - Retrieve sales order header details: order number, customer, total value (`TotalNetAmount` + currency), requested delivery date, order type
  - Retrieve sales order line items: material, quantity, unit price, confirmed delivery date, item status
  - Detect overdue orders: compare `RequestedDeliveryDate` against today's date where status is not `C` (completed)
  - Count open sales orders (status `A` = open, `B` = in process)
- [ ] Add a tool call for calculating total sales order value (sum of `TotalNetAmount` across a filtered set)

### Customer Management Capabilities

- [ ] Implement the following query patterns using MCP tools from `API_BUSINESS_PARTNER` API:
  - List business partners filtered by `BusinessPartnerCategory = '2'` (organizations/customers)
  - Retrieve customer master: name, address, industry, credit limit (`CreditLimit`), credit exposure
  - Search customers by name (`BusinessPartnerFullName` contains filter)
  - Retrieve customer-level sales order history (combine BP lookup + Sales Order filter by `SoldToParty`)
  - Get customer count (total active customers)

### Billing & Revenue Capabilities

- [ ] Implement the following query patterns using MCP tools from `API_BILLING_DOCUMENT_SRV` API:
  - List billing documents by customer (`SoldToParty`) and date range
  - Retrieve billed revenue per customer (aggregate `TotalNetAmount` from billing documents)
  - Identify customers with recent billing activity (last 30/60/90 days)

### Credit Block Detection

- [ ] Implement credit block detection using MCP tools from `API_SLS_DOC_WITH_CREDIT_BLOCK` API:
  - List all sales orders currently in credit block
  - Retrieve credit block details: customer, blocked amount, credit analyst
  - Include credit block count in the sales dashboard KPIs

### Sales Dashboard KPIs

- [ ] Implement a `get_sales_dashboard_kpis` capability (callable via natural language) that returns:
  - Total sales orders count (all active orders)
  - Total open sales order value (sum of open order values)
  - Customer count (total active customers)
  - Open orders count (status A + B)
  - Overdue orders count (past requested delivery date)
  - Credit blocked orders count
  - Top 5 customers by order value
  - Sales trend indicator (current month vs. prior month order value)

### Sales Trends & Analysis

- [ ] Implement `get_sales_trends` capability:
  - Monthly order value aggregation for the last 6 months
  - Order volume trend (count of orders per month)
  - Average order value trend
  - Return data structured for chart rendering (array of `{month, orderCount, totalValue, avgValue}`)

### AI Recommendations Engine

- [ ] Implement `generate_sales_recommendations` capability:
  - Identifies top 3 at-risk customers (declining order volume or credit blocks)
  - Identifies top 3 upsell opportunities (customers with below-average order frequency)
  - Identifies overdue orders requiring immediate action
  - Returns structured recommendations with priority (High/Medium/Low), customer/order reference, and suggested action

### Agent Activity Tracking

- [ ] Add structured logging for all agent tool invocations with format:
  `[TOOL_CALL]: {tool_name} called with params: {params_summary} → {status}`
- [ ] Store agent execution history in-memory (last 50 interactions) accessible via `get_agent_activity` query:
  - Timestamp, user query, tools called, execution status (success/error), result summary
- [ ] Track recommendation history: when recommendations are generated, store them with timestamp for retrieval

---

## Business Instrumentation

- [ ] Instrument the following milestones from `intent.md`:
  - `[M1]` Application + AI agent running: log when agent starts and first tool is successfully called
  - `[M2]` Specialized agents operational: log when each skill (customer-analysis, sales-order-investigation, performance-recommendations) is successfully loaded and executed
  - `[M3]` Live S/4HANA integration ready: log when `USE_SAMPLE_DATA=false` and first real MCP tool call succeeds
  - `[M4]` Pilot rollout: log when dashboard KPIs are successfully returned
- [ ] Add OpenTelemetry custom spans for each business step: `sales_order_query`, `customer_lookup`, `billing_aggregation`, `credit_block_check`, `recommendation_generation`
- [ ] Verify `bootstrap(app)` is called after `app = server.build()` in `main.py`

---

## MCP Tool Integration

> Read [guidelines-agent-mcp.md](../guidelines-agent-mcp.md) for complete MCP integration patterns.

**API Specs downloaded to `specification/intelligent-sales-management-agent/api-specs/`:**

| API Name | ORD ID | Spec File |
|----------|--------|-----------|
| Sales Order (A2X) | `sap.s4:apiResource:CE_SALESORDER_0001:v1` | `CE_SALESORDER_0001.edmx` |
| Business Partner (A2X) | `sap.s4:apiResource:API_BUSINESS_PARTNER:v1` | `API_BUSINESS_PARTNER.edmx` |
| Billing Document | `sap.s4:apiResource:API_BILLING_DOCUMENT_SRV:v1` | `API_BILLING_DOCUMENT_SRV.edmx` |
| Credit Block (A2X) | `sap.s4:apiResource:API_SLS_DOC_WITH_CREDIT_BLOCK:v1` | `API_SLS_DOC_WITH_CREDIT_BLOCK.edmx` |

**MCP API Scope Declarations:**

```
MCP API: sap.s4:apiResource:CE_SALESORDER_0001:v1
MCP tool scope: read-only
Resources in scope: A_SalesOrder, A_SalesOrderItem, A_SalesOrderScheduleLine

MCP API: sap.s4:apiResource:API_BUSINESS_PARTNER:v1
MCP tool scope: read-only
Resources in scope: A_BusinessPartner, A_BusinessPartnerAddress, A_Customer, A_CustSalesArea

MCP API: sap.s4:apiResource:API_BILLING_DOCUMENT_SRV:v1
MCP tool scope: read-only
Resources in scope: A_BillingDocument, A_BillingDocumentItem

MCP API: sap.s4:apiResource:API_SLS_DOC_WITH_CREDIT_BLOCK:v1
MCP tool scope: read-only
Resources in scope: A_SalesDocumentWithCreditBlock
```

- [ ] Invoke `mcp-translation-file` skill for each spec file in `specification/intelligent-sales-management-agent/api-specs/`
- [ ] Invoke `setup-solution` skill to create and register MCP server assets for all generated translation files
- [ ] Wire MCP tool loading in `agent.py` using `get_mcp_tools()` from the `mcp_tools` module — never import directly from `sap_cloud_sdk.agentgateway`
- [ ] Add all MCP server dependencies to `asset.yaml` under `requires` — one entry per MCP server (Path A)
- [ ] Generate `mcp-mock.json` using the `mcp-mock-config` skill after all MCP assets are created

---

## Testing

> See [guidelines-agent-python.md](../guidelines-agent-python.md) for Python testing setup and patterns.

- [ ] `conftest.py` only sets `IBD_TESTING=true`
- [ ] Write unit tests in `assets/intelligent-sales-management-agent/tests/`:
  - `test_sales_order_tools.py` — test sales order listing, filtering by customer/status/date, line item retrieval
  - `test_customer_tools.py` — test business partner listing, customer master retrieval, customer search
  - `test_billing_tools.py` — test billing document listing and revenue aggregation
  - `test_credit_block_tools.py` — test credit block detection and listing
  - `test_dashboard_kpis.py` — test KPI calculation logic with mocked tool responses
  - `test_recommendations.py` — test recommendation generation with sample scenarios
  - `test_agent_activity.py` — test activity history logging and retrieval
- [ ] Write one integration test `tests/test_integration.py` executing end-to-end agent flow: user asks "Show me the sales dashboard KPIs" → agent calls tools → returns structured KPI response
- [ ] Run `pytest` from `assets/intelligent-sales-management-agent/` — if coverage < 70%, add targeted tests
- [ ] Run `pytest` again to generate final `test_report.json`
- [ ] Verify `test_report.json` exists in `assets/intelligent-sales-management-agent/`
