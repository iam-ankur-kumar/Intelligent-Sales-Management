# Product Requirements Document (PRD)

**Title:** Intelligent Sales Management Application  
**Date:** 2026-11-09  
**Owner:** Sales Technology / Joule Studio  
**Solution Category:** AI Agent, CAP Application

---

## Product Purpose & Value Proposition

**Elevator Pitch:**  
Sales teams running SAP S/4HANA Cloud Public Edition spend hours manually pulling customer data, investigating orders, and trying to identify at-risk accounts — with no unified view and no AI assistance. The Intelligent Sales Management Application replaces that manual effort with a single interface that combines live S/4HANA data, a multi-module sales dashboard, and a conversational AI agent that answers questions, surfaces risks, and delivers recommendations in real time.

**Business Need:**  
No standard SAP tool currently provides a unified, role-aware sales management interface with an embedded AI assistant. Sales managers must navigate multiple transactions, export data to spreadsheets, and rely on weekly reporting cycles to understand performance. This solution closes that gap by providing instant, natural-language access to S/4HANA data alongside structured dashboards for customers, orders, and performance.

**Expected Value:**

| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| Customer analysis time | 2 hours | 5 minutes | Weeks 4–6 |
| At-risk customer identification | 1–2 days | 30 minutes | Weeks 4–6 |
| Manual sales analysis effort | — | –40% reduction | Weeks 4–6 |
| Sales order investigation time | 30 minutes | 5 minutes | Weeks 4–6 |

**Product Objectives (Prioritized):**
1. Provide a unified, role-aware sales management dashboard with real-time KPIs from S/4HANA Cloud
2. Deliver a conversational AI assistant that answers natural-language sales queries and surfaces recommendations
3. Enable at-risk customer and order exception identification in under 30 minutes
4. Establish a clean, swappable architecture — sample data first, live S/4HANA OData integration second

---

## Business Metrics

| Metric | Baseline | Target | Timeline | Process / Capability | Source |
|--------|----------|--------|----------|----------------------|--------|
| Customer analysis time | 2 hours | 5 minutes | Weeks 4–6 | Customer Order Monitoring | user |
| At-risk customer identification | 1–2 days | 30 minutes | Weeks 4–6 | Sales Performance Management | user |
| Manual sales analysis effort | — | –40% reduction | Weeks 4–6 | Sales Analytics | user |
| Sales order investigation time | 30 minutes | 5 minutes | Weeks 4–6 | Sales Order Management | user |

---

## User Profiles & Personas

### Primary Persona: Sarah Chen — Sales Manager

Sarah is a 42-year-old Sales Manager at a mid-sized manufacturing company. She oversees a team of eight sales representatives and is accountable for quarterly revenue targets. Every morning she logs into SAP, runs several transactions to check open orders, follows up on blocked shipments, and tries to identify which customers haven't placed orders recently. This takes 1.5–2 hours before she can brief her team. She is comfortable with enterprise software but frustrated by the fragmentation — she wants one screen that shows her everything, and ideally tells her where to focus without asking.

**Goals:** Reduce morning analysis time to under 15 minutes. Get alerted to at-risk customers and blocked orders before her team does. Have evidence-backed talking points for her weekly leadership review.

### Secondary Persona: Marcus Webb — Sales Representative

Marcus is a 31-year-old account executive managing 60+ customer accounts. He needs to quickly look up a customer's purchasing history before a call, check if an order has shipped, and understand why a delivery date changed. He uses mobile and desktop interchangeably and values speed above depth of detail.

**Goals:** Look up any customer or order in under 60 seconds. Know the status of his accounts without calling the warehouse or finance team.

### Tertiary Persona: Priya Nair — Sales Operations Analyst

Priya is a 36-year-old analyst who produces weekly and monthly sales reports. She spends 60–70% of her time extracting and formatting data. She wants to ask analytical questions — "Which product lines are declining?" or "Which customers reduced spend by more than 20%?" — and get answers immediately instead of running queries.

**Goals:** Replace manual report preparation with AI-driven analysis. Identify trends and anomalies in seconds.

### Other User Types

- **Head of Sales (David Park):** Reviews executive KPI summaries and AI-generated performance insights. Primarily a consumer of the dashboard and recommendations; does not investigate individual orders.

---

## User Goals & Tasks

### For Sarah Chen (Sales Manager):

**Goals:**
- Monitor daily sales performance across all accounts without opening multiple SAP transactions
- Identify at-risk customers and exception orders before they escalate
- Receive AI recommendations on where to focus sales effort

**Key Tasks:**
- Open the Sales Dashboard and review KPI cards (orders, values, open orders, trends)
- Ask the AI Assistant: "Which customers haven't ordered in 30 days?"
- Navigate to Customer Management to review a flagged customer's purchase history
- Review credit-blocked orders in Sales Order Management and act on exceptions

### For Marcus Webb (Sales Representative):

**Goals:**
- Quickly access full customer and order detail from a single interface
- Track order status without contacting back-office teams

**Key Tasks:**
- Search for a customer by name or ID and open their profile
- View a customer's last 10 orders and delivery performance
- Look up a specific sales order and check line-item delivery dates

### For Priya Nair (Sales Operations Analyst):

**Goals:**
- Answer ad-hoc analytical questions without building reports manually
- Identify patterns across customer segments and product lines

**Key Tasks:**
- Ask the AI Assistant: "Show me the top 10 customers by order value this quarter"
- Review the Agent Activity log to verify how the AI arrived at a recommendation
- Export or copy AI-generated analysis for inclusion in leadership reports

---

## Product Principles

1. **Data before speculation:** Every AI recommendation must be traceable to source data. The agent must cite which records informed its output.
2. **Read-only by default:** No autonomous write operations to S/4HANA. All interactions are read and analyse only.
3. **Sample first, real second:** Build and validate all functionality with clearly labelled sample data before connecting live APIs. The architecture must make this swap seamless.
4. **Role-aware by design:** Each user role sees only the data and actions relevant to their job. Access control is enforced at the service layer, not just the UI.
5. **Modular and extensible:** Each AI tool, sub-agent, and UI module is independently deployable and replaceable. Adding a new data source or agent should not require rebuilding existing components.

---

## Business Context

**Current State:**  
Sales teams use standard SAP S/4HANA transactions (VA05, VA03, XD03) to manually review customers and orders. Performance analysis requires exports to Excel. At-risk customer identification is ad-hoc and depends on individual knowledge. No conversational interface exists. Reporting cycles are weekly, not real-time.

**Strategic Alignment:**  
This solution supports the company's digitalization strategy — moving from reactive, manual sales operations to proactive, AI-assisted decision-making. It aligns to the Lead to Cash E2E process and specifically strengthens the Order to Fulfill phase through real-time visibility and AI-powered exception detection.

---

## Goals and Non-Goals

### Goals (In Scope)

- Five-module React/SAP UI5 application: Sales Dashboard, Customer Management, Sales Order Management, AI Sales Assistant, Agent Activity
- Python AI agent (A2A protocol) with read-only MCP tools over S/4HANA OData APIs
- Sample data layer that mirrors the S/4HANA data model with clearly labelled mock records
- Live integration path via SAP S/4HANA Cloud Public Edition OData APIs (CE_SALESORDER_0001, API_BUSINESS_PARTNER, API_BILLING_DOCUMENT_SRV, API_SALES_QUOTATION_SRV, API_SLS_DOC_WITH_CREDIT_BLOCK)
- Enterprise security: SAP BTP XSUAA authentication, role-based access for 4 user roles
- Agent activity logging with full tool call trace and execution history

### Non-Goals (Out of Scope)

- Creating, updating, or deleting sales orders or customers in S/4HANA
- SAP Analytics Cloud, SAP Datasphere, or BW/4HANA integration
- Mobile-native application (responsive web only)
- SAP Sales Cloud or CRM integration
- Outbound notifications or alerting pipelines (email, Slack)
- Pricing simulation or quotation creation

---

## Requirements

### Must-Have Requirements

**REQ-01: Sales Dashboard**

- **Problem to Solve:** Sales managers have no single screen showing current sales KPIs and trends; they must navigate multiple transactions.
- **User Story:** As a Sales Manager, I need a dashboard showing total sales orders, total order value, customer count, and open orders so that I can assess daily performance in under 2 minutes.
- **Acceptance Criteria:**
  - Given the dashboard is loaded, it displays: total order count, total net value (currency), active customer count, open order count, and a sales trend chart (last 12 months)
  - Given data is from sample layer, all KPI cards are labelled "[SAMPLE DATA]"
  - Given a user with Head of Sales role, the dashboard shows the same KPIs at organisation level
- **Maps to Objective:** Objective 1 — unified, role-aware dashboard
- **Priority Rank:** 1

**REQ-02: Customer Management**

- **Problem to Solve:** Sales representatives must look up customers across multiple transactions and have no unified customer profile with purchasing history.
- **User Story:** As a Sales Representative, I need a searchable customer list with drilldown to master details and purchasing history so that I can prepare for customer interactions in under 60 seconds.
- **Acceptance Criteria:**
  - Given the Customer Management screen, I can search by customer name or customer number
  - Given a selected customer, I see: name, address, credit limit, credit exposure, account group, and assigned sales area
  - Given a selected customer, I see their last 20 sales orders with order date, value, status, and delivery date
  - Given the AI insights panel, the customer profile shows AI-generated risk status and purchase trend
- **Maps to Objective:** Objectives 1 and 3
- **Priority Rank:** 2

**REQ-03: Sales Order Management**

- **Problem to Solve:** Investigating a single order requires navigating multiple SAP transactions; there is no consolidated order view with exception highlights.
- **User Story:** As a Sales Manager, I need a sales order list with filters, order detail drilldown, and exception highlighting so that I can investigate and resolve order issues in under 5 minutes.
- **Acceptance Criteria:**
  - Given the Sales Order Management screen, I can filter by status, customer, date range, and order value
  - Given a selected order, I see all header details: order number, customer, total value, delivery date, status, and sales organisation
  - Given a selected order, I see all line items: material, quantity, unit price, net value, confirmed delivery date, and item status
  - Orders with credit blocks, delivery blocks, or past due delivery dates are visually highlighted as exceptions
- **Maps to Objective:** Objectives 1 and 3
- **Priority Rank:** 3

**REQ-04: AI Sales Assistant**

- **Problem to Solve:** Sales teams cannot query S/4HANA data in natural language; all analysis requires manual transaction navigation.
- **User Story:** As a Sales Operations Analyst, I need a conversational AI interface that answers questions about customers, orders, and sales performance in natural language so that I can replace hours of manual analysis with instant answers.
- **Acceptance Criteria:**
  - Given the AI Assistant screen, I can type any natural language question about sales data
  - Given a query, the assistant returns a response within 10 seconds with data sourced from the active data layer (sample or live)
  - Given a response, I can see which data sources and tool calls were used to generate it
  - The assistant can answer questions such as: top customers by order value, orders at risk of late delivery, customers with declining spend, open orders by sales representative
  - The assistant can invoke sub-agents for deep-dive customer analysis, order investigation, and performance recommendations
- **Maps to Objective:** Objective 2
- **Priority Rank:** 4

**REQ-05: Agent Activity Log**

- **Problem to Solve:** When the AI agent produces a recommendation, users have no way to verify how it was reached or diagnose errors.
- **User Story:** As a Sales Operations Analyst, I need a full trace of agent executions — tool calls, inputs, outputs, and results — so that I can verify AI recommendations and diagnose unexpected behaviour.
- **Acceptance Criteria:**
  - Given the Agent Activity screen, I see a list of all agent executions, most recent first
  - Given a selected execution, I see: query text, start time, duration, status (success/error), all tool calls made (tool name, input parameters, response), and final recommendation text
  - Failed executions show the error message and the last successful tool call before failure
  - All executions are retained for at least 7 days
- **Maps to Objective:** Objective 2
- **Priority Rank:** 5

**REQ-06: Sample Data Layer**

- **Problem to Solve:** Live S/4HANA connectivity cannot be established on day one; development and testing need realistic, clearly labelled data.
- **User Story:** As a developer and tester, I need a sample data layer that mirrors S/4HANA data structures with clearly labelled mock records so that all application features can be built and validated before live integration.
- **Acceptance Criteria:**
  - Sample data covers: 50+ customers, 500+ sales orders, 1,000+ order line items, 100+ billing documents
  - All sample data records are labelled with a "[SAMPLE]" flag visible in the UI
  - The data layer can be switched to live S/4HANA OData by changing a configuration flag — no code changes required
  - Sample data represents realistic business scenarios including: open orders, blocked orders, overdue deliveries, high-value customers, and declining accounts
- **Maps to Objective:** Objective 4
- **Priority Rank:** 6

**REQ-07: Enterprise Security**

- **Problem to Solve:** Without role-based access control, all users see all data and all functions, violating least-privilege and enterprise compliance requirements.
- **User Story:** As an IT administrator, I need the application to enforce role-based access control using SAP BTP XSUAA so that each user role accesses only the data and functions relevant to their job.
- **Acceptance Criteria:**
  - The application is protected by SAP BTP XSUAA authentication; unauthenticated users cannot access any screen or API
  - Four roles are enforced: SalesManager, SalesRepresentative, SalesOperationsAnalyst, HeadOfSales
  - Role assignments control visibility of dashboard KPIs, customer records, and AI assistant access
  - All API endpoints validate the JWT token and reject requests with insufficient scope
- **Maps to Objective:** Objective 1
- **Priority Rank:** 7

### High-Want Requirements

**REQ-08: Export and Share**
- **Problem to Solve:** Users need to share AI-generated insights and dashboard data with stakeholders who do not have access to the application.
- **User Story:** As a Sales Manager, I need to export dashboard KPIs and AI recommendations as a PDF or CSV so that I can share insights in leadership reviews.
- **Priority Rank:** 1

**REQ-09: Saved Queries**
- **Problem to Solve:** Analysts repeat the same AI assistant queries daily; there is no way to save and reuse them.
- **User Story:** As a Sales Operations Analyst, I need to save and re-run AI assistant queries so that recurring analysis can be repeated in one click.
- **Priority Rank:** 2

### Nice-to-Have Requirements

**REQ-10: Trend Alerts**
- **Problem to Solve:** Sales managers are only aware of declining customers when they manually check; proactive alerts would save investigation time.
- **Priority Rank:** 1

**REQ-11: Multi-Language Support**
- **Problem to Solve:** Sales teams in non-English markets need the interface in their language.
- **Priority Rank:** 2

---

## Non-Functional Requirements

### Performance

- **Latency:** Dashboard KPI load under 3 seconds; AI assistant response under 10 seconds (95th percentile)
- **Throughput:** Support up to 50 concurrent users during business hours

### Reliability

- **Availability:** 99.5% uptime during business hours (07:00–20:00 local time)
- **Fallback:** If live S/4HANA connectivity is unavailable, fall back to cached data with a visible staleness indicator

### Security

- **Authentication:** SAP BTP XSUAA JWT; all tokens validated server-side
- **Data Access:** No S/4HANA credentials stored client-side; all API calls proxied through CAP service layer
- **Audit Logging:** All agent tool calls and data accesses logged with user identity, timestamp, and resource

### Explainability

- **Traceability:** Every AI recommendation includes a "How was this generated?" panel showing tool calls and source data
- **Decision Logging:** All agent executions stored in the Agent Activity log with full input/output trail
- **Uncertainty Communication:** Agent responses include a confidence indicator; low-confidence responses are flagged

---

## Solution Architecture

**Architecture Overview:**  
A two-tier solution deployed on SAP BTP. The frontend is a React application with SAP UI5 Web Components, served by a CAP (Node.js) backend. The CAP backend exposes a unified API layer that routes requests either to the sample data layer or to live S/4HANA Cloud OData APIs, controlled by a feature flag. A separate Python AI agent (A2A protocol) is deployed as a BTP application; it is called by the frontend via an agent gateway and uses custom MCP tools to access the CAP data layer.

**Key Components:**

- **CAP Backend (Node.js):** Unified service layer; handles authentication, data routing, sample/live switching, and exposes OData/REST endpoints to the frontend
- **React + SAP UI5 Web Components Frontend:** Five-module SPA (Sales Dashboard, Customer Management, Sales Order Management, AI Sales Assistant, Agent Activity)
- **Python AI Agent (A2A):** Conversational agent with sub-agent orchestration; deployed as a standalone BTP Cloud Foundry application
- **MCP Tool Layer:** Five custom MCP tools (list_sales_orders, get_sales_order_details, list_customers, get_customer_details, get_billing_documents) that call the CAP service layer
- **Sample Data Layer:** In-memory or SQLite fixture data matching the S/4HANA data model; activated by configuration flag
- **S/4HANA OData Integration:** Outbound connections to CE_SALESORDER_0001, API_BUSINESS_PARTNER, API_BILLING_DOCUMENT_SRV, API_SALES_QUOTATION_SRV, API_SLS_DOC_WITH_CREDIT_BLOCK via SAP BTP Connectivity Service
- **SAP BTP XSUAA:** Authentication and authorisation for all services

**Integration Points:**

- S/4HANA Cloud → CAP backend: OData V2/V4 pull (read-only), on-demand (per user request)
- CAP backend → AI Agent: REST/A2A protocol, synchronous per query
- AI Agent → MCP Tools → CAP backend: internal tool calls, synchronous

**Deployment Environments:**

- **Development:** Sample data active; no live S/4HANA connectivity required
- **Integration/QA:** Live S/4HANA sandbox tenant; feature flag set to `live`
- **Production:** Live S/4HANA production tenant; XSUAA production credentials

### Agent Extensibility & Instrumentation

**Agent Extensibility:**
The AI agent is designed with a modular tool registry. New MCP tools can be added by registering them in the tool configuration without modifying core agent logic. Sub-agents (customer analysis, order investigation, performance recommendations) are independently deployable Python modules invoked by the orchestrator agent. New sub-agents can be added by registering them in the agent's skill manifest.

**Business Step Instrumentation:**
All milestone business steps emit structured OpenTelemetry log statements. Each agent execution creates a parent span; tool calls and sub-agent invocations create child spans. Log statements follow the pattern:
- Achievement: `[MILESTONE_ID].achieved: [description]`
- Miss/failure: `[MILESTONE_ID].missed: [description] | reason=[error]`

### Automation & Agent Behaviour

**Automation Level:** Autonomous agent (read-only) with human-in-the-loop for recommendations

**Actions the system performs without human approval:**
- Query S/4HANA or sample data via MCP tools
- Synthesize and return analysis and recommendations
- Log all tool calls and results to the Agent Activity store

**Actions that require human review or approval:**
- All recommendations are advisory only; no automated changes to S/4HANA records

**Model or engine used:** LLM via SAP Generative AI Hub (model: GPT-4o or equivalent); Python agent runtime on SAP BTP Cloud Foundry

**Knowledge & data sources accessed:**
- Sales orders and line items: CE_SALESORDER_0001 / API_SALES_ORDER_SRV (S/4HANA Cloud Public Edition)
- Business partners / customers: API_BUSINESS_PARTNER (S/4HANA Cloud Public Edition)
- Billing documents: API_BILLING_DOCUMENT_SRV (S/4HANA Cloud Public Edition)
- Sales quotations: API_SALES_QUOTATION_SRV (S/4HANA Cloud Public Edition)
- Credit-blocked orders: API_SLS_DOC_WITH_CREDIT_BLOCK (S/4HANA Cloud Public Edition)

**Tools or connectors invoked:**
- `list_sales_orders` MCP tool: retrieves paginated sales order list with filters — read-only
- `get_sales_order_details` MCP tool: retrieves full order header + line items by order number — read-only
- `list_customers` MCP tool: retrieves paginated business partner list with search — read-only
- `get_customer_details` MCP tool: retrieves full customer profile and purchasing history — read-only
- `get_billing_documents` MCP tool: retrieves billing documents for a customer or order — read-only

**Guardrails & fail-safes:**
- No write operations to S/4HANA permitted from any agent tool
- If S/4HANA API returns error, agent reports data unavailability and does not hallucinate
- Low-confidence analysis outputs are flagged with a confidence indicator
- All tool call inputs are validated before dispatch; malformed queries are rejected with a clear error
- Agent responses are length-limited to prevent token overflow; large result sets are summarised

### Configuration & Data

**Configuration Scope:**
- Feature flag: `DATA_LAYER=sample|live` controls data source routing
- S/4HANA Cloud connection: service binding via SAP BTP Connectivity Destination
- XSUAA service binding for authentication
- AI Hub service binding for LLM access

**Organisational & Master Data:**
- Sample data: 50+ business partners, 500+ sales orders, 1,000+ line items, 100+ billing documents
- Sample records tagged with `[SAMPLE]` in all display fields
- Live integration: reads organisational structure from S/4HANA (sales organisations, distribution channels, divisions) on first call

---

## Governance, Risk & Compliance

**Data Handling:**
- No S/4HANA business data is persisted in the application database beyond agent execution logs (7-day retention)
- No PII beyond SAP business partner name and number is stored; all display is read-through from S/4HANA
- Agent execution logs may contain query text; these are accessible only to users with the SalesOperationsAnalyst or SalesManager role

**Approval Flows:**
- AI recommendations are advisory; no approval workflow is triggered automatically
- Future: high-risk recommendations (e.g., flagging a customer for credit review) may be routed to a manager approval step

---

## Milestones

### M1: Application and AI Agent Running with Sample Data

- **Description:** CAP backend, React/UI5 frontend, and initial AI agent are deployed and functional with clearly labelled sample data. All five application modules are accessible.
- **Achieved when:** All five UI modules load without errors, the AI Assistant responds to at least one natural-language query using sample data, and all KPI cards display sample values.
- **Log on achievement:** `M1.achieved: application and AI agent operational with sample data | modules=5 | data_layer=sample`
- **Log on miss:** `M1.missed: application or AI agent failed to start | reason={error}`

### M2: Specialized Agents and Orchestration Complete

- **Description:** Customer analysis sub-agent, sales order investigation sub-agent, and performance recommendation sub-agent are operational and invocable from the AI Sales Assistant.
- **Achieved when:** The AI Assistant can successfully invoke all three sub-agents and return results for customer, order, and performance queries.
- **Log on achievement:** `M2.achieved: all sub-agents operational | sub_agents=[customer_analysis, order_investigation, performance_recommendations]`
- **Log on miss:** `M2.missed: one or more sub-agents failed to register or respond | reason={error}`

### M3: Live S/4HANA OData Integration Active

- **Description:** The DATA_LAYER flag is set to `live`; all five MCP tools retrieve real data from SAP S/4HANA Cloud Public Edition OData APIs.
- **Achieved when:** All five MCP tools return live S/4HANA data without errors; sample data labels are removed from the UI; the AI Assistant answers queries using real records.
- **Log on achievement:** `M3.achieved: live S4HANA integration active | apis_connected=5 | data_layer=live`
- **Log on miss:** `M3.missed: S4HANA OData connectivity failed | api={api_name} | reason={error}`

### M4: Testing, Validation, and Pilot Rollout

- **Description:** End-to-end testing complete; the application is deployed to the pilot environment with real users and role assignments.
- **Achieved when:** User acceptance testing passes for all must-have requirements; at least 5 pilot users from different roles have successfully completed key tasks.
- **Log on achievement:** `M4.achieved: pilot rollout complete | pilot_users={count} | roles_validated=[SalesManager, SalesRepresentative, SalesOperationsAnalyst, HeadOfSales]`
- **Log on miss:** `M4.missed: pilot rollout blocked | reason={error}`

---

## Risks, Assumptions, and Dependencies

### Risks

- **OData API field mapping complexity:** S/4HANA OData responses require field mapping and transformation; unmapped fields may cause tool errors. Mitigation: build and test MCP tools against sample data before live integration.
- **LLM response quality for sales recommendations:** Recommendation accuracy depends on prompt engineering and data completeness. Mitigation: structured system prompts with domain context; confidence indicators on all outputs.
- **S/4HANA Cloud API availability:** If the customer's S/4HANA tenant has restricted API access or requires additional authorization objects, live integration may be delayed. Mitigation: document required authorization objects and test with a sandbox tenant first.

### Assumptions (Validate These)

- The customer has access to a SAP S/4HANA Cloud Public Edition tenant with released OData APIs enabled
- SAP BTP subaccount with Cloud Foundry environment, XSUAA, and Connectivity Service is available
- SAP Generative AI Hub access (or equivalent LLM endpoint) is provisioned in the BTP subaccount
- Sample data volume (50 customers, 500 orders) is sufficient to demonstrate all application features meaningfully

### Dependencies

- SAP BTP Connectivity Service for live S/4HANA OData integration
- SAP Generative AI Hub (GPT-4o or equivalent) for AI agent LLM
- SAP BTP XSUAA for authentication and role management
- S/4HANA Cloud Public Edition sandbox tenant for integration testing (M3)

---

## Open Questions

- Which S/4HANA sales organization and distribution channel should sample data reflect?
- Should the Agent Activity log be accessible to all roles, or restricted to SalesOperationsAnalyst and SalesManager only?
- Are there specific currency or UoM display requirements (multi-currency support)?
- Should the AI Assistant support follow-up questions within a conversation session, or are all queries stateless?

---

## Appendix

### Glossary

- **A2A (Agent-to-Agent):** Protocol for AI agent communication used in SAP BTP Joule Studio
- **CAP:** SAP Cloud Application Programming Model — framework for building Node.js/Java services on SAP BTP
- **MCP Tool:** Model Context Protocol tool — a typed, callable function exposed to an AI agent
- **OData:** Open Data Protocol — REST-based protocol used by SAP S/4HANA APIs
- **XSUAA:** Extended Services for User Account and Authentication — SAP BTP identity and access management service
- **A2A Agent:** Autonomous AI agent built using the Agent-to-Agent protocol, deployed on SAP BTP

### References

- SAP S/4HANA Cloud Public Edition — Sales Order API: `sap.s4:apiResource:CE_SALESORDER_0001:v1`
- SAP S/4HANA Cloud Public Edition — Business Partner API: `sap.s4:apiResource:API_BUSINESS_PARTNER:v1`
- SAP S/4HANA Cloud Public Edition — Billing Document API: `sap.s4:apiResource:API_BILLING_DOCUMENT_SRV:v1`
- SAP S/4HANA Cloud Public Edition — Sales Quotation API: `sap.s4:apiResource:API_SALES_QUOTATION_SRV:v1`
- SAP S/4HANA Cloud Public Edition — Credit Block API: `sap.s4:apiResource:API_SLS_DOC_WITH_CREDIT_BLOCK:v1`
- SAP BTP Cloud Foundry Documentation: https://help.sap.com/docs/btp
- SAP Cloud Application Programming Model: https://cap.cloud.sap
