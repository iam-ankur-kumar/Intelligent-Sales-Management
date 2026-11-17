# Specification: Intelligent Sales Management Platform

> **Guidelines**: Read [guidelines.md](./guidelines.md) before executing ANY tasks below.

Check off items as completed.

---

## Solution Overview

**Solution:** Intelligent Sales Management Platform  
**Data Source:** SAP S/4HANA Cloud Public Edition (OData APIs + sample data layer)  
**Assets:** 2 (AI Agent + CAP Application)

| Asset | Type | Description |
|-------|------|-------------|
| `intelligent-sales-management-agent` | AI Agent (Python, A2A) | Conversational sales assistant with MCP tools for S/4HANA OData APIs |
| `intelligent-sales-management-app` | CAP Application + React UI | Unified sales dashboard, customer & order management, agent activity UI |

---

## Solution Setup

- [ ] Create asset directories:
  ```bash
  mkdir -p assets/intelligent-sales-management-agent
  mkdir -p assets/intelligent-sales-management-app
  ```
- [ ] Invoke `setup-solution` skill to create `solution.yaml` and `asset.yaml` files for both assets
- [ ] Validate `solution.yaml`, `assets/intelligent-sales-management-agent/asset.yaml`, and `assets/intelligent-sales-management-app/asset.yaml` all exist and are well-formed

---

## Asset Implementation

### Step 1 — AI Agent (build first, UI depends on it)

- [ ] Execute `specification/intelligent-sales-management-agent/specification.md` (all items)

  This builds:
  - Python A2A agent with LangChain/LangGraph
  - MCP tools for 4 SAP S/4HANA Cloud APIs (Sales Orders, Business Partner, Billing, Credit Block)
  - Runtime skills: customer-analysis, sales-order-investigation, performance-recommendations
  - Sample data layer (clearly labelled, `USE_SAMPLE_DATA=true` by default)
  - Agent activity tracking (in-memory, last 50 interactions)
  - Business instrumentation (4 milestones, OpenTelemetry spans)
  - Full test suite (≥70% coverage, `test_report.json`)

### Step 2 — CAP Application + UI (depends on Agent endpoint)

- [ ] Execute `specification/intelligent-sales-management-app/specification.md` (all items)

  This builds:
  - CAP Node.js backend: `SalesService` with 7 proxy actions to AI agent
  - Persistent entities: `AgentConversation`, `AgentActivity`, `SalesRecommendation`
  - React + SAP UI5 Web Components frontend with 5 screens:
    1. **Sales Dashboard** — KPI cards, 6-month trend chart, top customers
    2. **Customer Management** — searchable list + detail with order history & AI insights
    3. **Sales Order Management** — filtered list + detail with exception detection
    4. **AI Sales Assistant** — streaming chat with quick actions
    5. **Agent Activity** — execution timeline, tool call traceability, recommendations panel
  - Sample data provider (10 customers, 25 orders, 6-month trends)
  - XSUAA authentication + 4 role collections
  - Integration test suite

### Step 3 — Cross-Asset Compatibility Check

- [ ] Verify the CAP application's `AGENT_URL` matches the agent's A2A server port (`8000` default)
- [ ] Verify the CAP service response types match the agent's JSON output shapes (DashboardKPIResponse, CustomerListResponse, OrderListResponse)
- [ ] Verify the `isSampleData` flag is correctly propagated from agent → CAP service → UI banner
- [ ] Verify `AgentConversation.toolsUsed` JSON format matches the agent's `[TOOL_CALL]` log output format
- [ ] Verify role-based access: `SalesManager` and above can trigger `generateRecommendations`; `SalesRepresentative` cannot
- [ ] Verify the sample data banner appears on all 5 screens when `USE_SAMPLE_DATA=true`
- [ ] Run both asset test suites in parallel and confirm both pass:
  ```bash
  cd assets/intelligent-sales-management-agent && pytest   # ≥70% coverage
  cd assets/intelligent-sales-management-app && npm test   # all 5 pass
  ```

---

## API Discovery Results

Downloaded API specifications are in `specification/intelligent-sales-management-agent/api-specs/`:

| API | ORD ID | Spec File | Used For |
|-----|--------|-----------|---------|
| Sales Order (A2X) | `sap.s4:apiResource:CE_SALESORDER_0001:v1` | `CE_SALESORDER_0001.edmx` | Order listing, details, line items, status |
| Business Partner (A2X) | `sap.s4:apiResource:API_BUSINESS_PARTNER:v1` | `API_BUSINESS_PARTNER.edmx` | Customer master, search, credit data |
| Billing Document | `sap.s4:apiResource:API_BILLING_DOCUMENT_SRV:v1` | `API_BILLING_DOCUMENT_SRV.edmx` | Revenue history, billing status |
| Credit Block (A2X) | `sap.s4:apiResource:API_SLS_DOC_WITH_CREDIT_BLOCK:v1` | `API_SLS_DOC_WITH_CREDIT_BLOCK.edmx` | Credit-blocked order detection |

---

## Live S/4HANA Connection (Post-Sample-Data)

When ready to connect to a real S/4HANA Cloud Public Edition tenant:

- [ ] Set `USE_SAMPLE_DATA=false` in agent environment
- [ ] Configure MCP tool credentials (S/4HANA hostname, OAuth client ID/secret) via BTP Destination Service
- [ ] Validate all 4 MCP tool sets connect successfully (smoke test each API with `$top=1`)
- [ ] Remove sample data banner from UI
- [ ] Run full regression test suite against live data
