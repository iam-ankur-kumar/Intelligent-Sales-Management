# Specification: intelligent-sales-management-app

> **Guidelines**: Read all applicable guidelines before executing ANY tasks below:
> - [guidelines.md](../guidelines.md) — Universal execution rules

---

## Basic Setup

- [ ] Read `intent.md` for full business context, goals, user roles, and fit-gap analysis
- [ ] Create CAP project structure in `assets/intelligent-sales-management-app/`:
  ```
  assets/intelligent-sales-management-app/
  ├── asset.yaml
  ├── package.json
  ├── .cdsrc.json
  ├── db/
  │   └── schema.cds        # Data model (agent activity + sample data cache)
  ├── srv/
  │   ├── sales-service.cds # OData service definition
  │   └── sales-service.js  # Service implementation (handlers + agent proxy)
  ├── app/
  │   └── sales-ui/         # React + SAP UI5 Web Components frontend
  │       ├── public/
  │       │   └── index.html
  │       ├── src/
  │       │   ├── App.jsx
  │       │   ├── components/
  │       │   │   ├── Dashboard/
  │       │   │   ├── CustomerManagement/
  │       │   │   ├── SalesOrderManagement/
  │       │   │   ├── AISalesAssistant/
  │       │   │   └── AgentActivity/
  │       │   └── index.jsx
  │       └── package.json
  └── test/
      └── sales-service.test.js
  ```
- [ ] Initialize `package.json` with dependencies: `@sap/cds`, `@sap/cds-dk`, `express`, `@sap-cloud-sdk/http-client`, `node-fetch`
- [ ] Create `.cdsrc.json` with `requires` for in-memory SQLite (development) and HANA (production)

---

## Project-Specific Tasks

### Data Model (`db/schema.cds`)

- [ ] Define the following entities:

  **AgentConversation** — stores AI assistant conversation history
  - `ID: UUID` (key)
  - `sessionId: String(64)`
  - `timestamp: DateTime`
  - `userMessage: String(2000)`
  - `agentResponse: LargeString`
  - `toolsUsed: LargeString` (JSON array of tool names)
  - `executionStatus: String(20)` (success / error / partial)
  - `durationMs: Integer`

  **AgentActivity** — stores agent tool execution events
  - `ID: UUID` (key)
  - `conversationId: UUID`
  - `timestamp: DateTime`
  - `toolName: String(200)`
  - `toolParameters: LargeString` (JSON)
  - `toolResult: LargeString` (JSON, truncated to 5000 chars)
  - `status: String(20)` (called / success / error)
  - `errorMessage: String(500)`

  **SalesRecommendation** — stores AI-generated recommendations
  - `ID: UUID` (key)
  - `timestamp: DateTime`
  - `priority: String(10)` (High / Medium / Low)
  - `category: String(50)` (AtRiskCustomer / UpsellOpportunity / OverdueOrder)
  - `referenceId: String(50)` (customer ID or order number)
  - `referenceType: String(20)` (Customer / SalesOrder)
  - `recommendation: LargeString`
  - `status: String(20)` (New / Acknowledged / Actioned)

  **SampleDataFlag** — runtime toggle
  - `ID: Integer` (key, always 1)
  - `useSampleData: Boolean` (default: true)
  - `lastUpdated: DateTime`

### Service Layer (`srv/sales-service.cds`)

- [ ] Define `SalesService` exposing:
  - `AgentConversations` (read/write)
  - `AgentActivities` (read-only)
  - `SalesRecommendations` (read/write — status updates)
  - `SampleDataFlag` (read/write)
  - **Actions**:
    - `action sendMessage(message: String, sessionId: String) returns MessageResponse` — proxies to AI agent
    - `action getDashboardKPIs() returns DashboardKPIResponse` — proxies to AI agent
    - `action getCustomers(search: String, top: Integer) returns CustomerListResponse` — proxies to AI agent
    - `action getCustomerDetail(customerId: String) returns CustomerDetailResponse` — proxies to AI agent
    - `action getSalesOrders(customerId: String, status: String, top: Integer) returns OrderListResponse` — proxies to AI agent
    - `action getSalesOrderDetail(orderId: String) returns OrderDetailResponse` — proxies to AI agent
    - `action generateRecommendations() returns RecommendationsResponse` — proxies to AI agent

### Service Implementation (`srv/sales-service.js`)

- [ ] Implement `sendMessage` action handler:
  - Calls the AI agent's A2A endpoint (`AGENT_URL` env var or `http://localhost:8000` default)
  - Stores conversation in `AgentConversation` entity
  - Logs tool activity to `AgentActivity` entity
  - Returns agent streaming response (SSE-compatible)

- [ ] Implement `getDashboardKPIs` action handler:
  - Sends "Generate sales dashboard KPIs" to agent
  - Parses structured JSON response
  - Returns typed `DashboardKPIResponse`:
    ```
    {
      totalOrders: Integer,
      openOrders: Integer,
      totalOpenValue: Decimal,
      currency: String,
      customerCount: Integer,
      overdueOrders: Integer,
      creditBlockedOrders: Integer,
      topCustomers: array of {id, name, orderValue},
      trendData: array of {month, orderCount, totalValue},
      isSampleData: Boolean
    }
    ```

- [ ] Implement `getCustomers` action handler:
  - Sends "List customers" query with optional search term to agent
  - Returns `CustomerListResponse`:
    ```
    {
      customers: array of {id, name, industry, segment, creditLimit, currency, orderCount, totalOrderValue},
      totalCount: Integer,
      isSampleData: Boolean
    }
    ```

- [ ] Implement `getCustomerDetail` action handler:
  - Sends "Get customer detail for {customerId}" to agent
  - Returns `CustomerDetailResponse` with master data + order history + insights

- [ ] Implement `getSalesOrders` action handler:
  - Sends filtered sales order query to agent
  - Returns `OrderListResponse`:
    ```
    {
      orders: array of {id, customer, customerName, status, totalValue, currency, requestedDeliveryDate, overdue: Boolean},
      totalCount: Integer,
      isSampleData: Boolean
    }
    ```

- [ ] Implement `getSalesOrderDetail` action handler:
  - Returns full order with line items, delivery dates, billing status

- [ ] Implement `generateRecommendations` action handler:
  - Calls agent recommendation engine
  - Persists results to `SalesRecommendation` entity
  - Returns top recommendations

- [ ] Add error handling middleware: catches agent connectivity errors, returns `503 Agent Unavailable` with message

- [ ] Add `USE_SAMPLE_DATA` environment variable support: when set, pass flag to agent queries

### Frontend Application (`app/sales-ui/`)

- [ ] Initialize React app with `package.json`:
  - Dependencies: `react`, `react-dom`, `@ui5/webcomponents-react`, `@ui5/webcomponents`, `@ui5/webcomponents-fiori`
  - Dev dependencies: `vite`, `@vitejs/plugin-react`

- [ ] Create `src/App.jsx` — main shell with SAP Fiori Shell Bar:
  - Shell bar title: "Intelligent Sales Management"
  - SAP BTP themed navigation using `ui5-side-navigation`
  - Navigation items: Dashboard, Customers, Sales Orders, AI Assistant, Agent Activity
  - Sample data banner: when `isSampleData=true`, show a prominent `ui5-notification-list-item` banner: "⚠️ Displaying sample data — connect to SAP S/4HANA for live data"
  - Responsive layout using `ui5-flexible-column-layout`

#### Dashboard Screen (`src/components/Dashboard/`)

- [ ] Create `DashboardScreen.jsx`:
  - Heading: "Sales Dashboard" with last-refresh timestamp
  - Row 1 KPI Cards using `ui5-card` (4 cards):
    - Total Sales Orders (with trend arrow)
    - Open Order Value (currency formatted)
    - Active Customers
    - Overdue Orders (red indicator if > 0)
  - Row 2 KPI Cards:
    - Credit Blocked Orders (orange indicator)
    - Average Order Value
    - Orders This Month
    - Month-on-Month Change (% with up/down indicator)
  - Sales Trend Chart: use a `ui5-bar-chart` or `ui5-line-chart` displaying 6-month trend data (`{month, totalValue}`)
  - Top 5 Customers table using `ui5-table` with columns: Customer Name, Orders, Total Value, Trend
  - Refresh button calling `getDashboardKPIs`
  - Loading skeleton state while fetching

#### Customer Management Screen (`src/components/CustomerManagement/`)

- [ ] Create `CustomerListScreen.jsx`:
  - Search bar using `ui5-search-field` with debounced input (300ms)
  - `ui5-table` with columns: Customer ID, Name, Industry, Credit Limit, Open Orders, Total Value, Status
  - Pagination: 20 customers per page
  - Clickable rows → navigate to Customer Detail
  - "Export to CSV" button

- [ ] Create `CustomerDetailScreen.jsx`:
  - Customer header card: name, ID, industry, segment, credit limit, credit status
  - Tab container (`ui5-tabcontainer`) with tabs:
    - **Orders**: table of customer's sales orders (last 50)
    - **Billing**: billing documents and revenue by month (bar chart)
    - **Insights**: AI-generated customer analysis (call `sendMessage` with customer analysis prompt)
    - **Recommendations**: AI recommendations for this customer
  - "Analyze Customer" button → triggers customer analysis skill in agent

#### Sales Order Management Screen (`src/components/SalesOrderManagement/`)

- [ ] Create `SalesOrderListScreen.jsx`:
  - Filter bar using `ui5-filter-bar`:
    - Customer (search input)
    - Status (select: All / Open / In Process / Completed / Credit Blocked / Overdue)
    - Date range (from/to date pickers)
    - Sales Organization (input)
  - `ui5-table` with columns: Order ID, Customer, Status (with `ui5-status-indicator`), Total Value, Requested Delivery, Days Overdue, Actions
  - Status color coding: Open=Blue, In Process=Orange, Completed=Green, Credit Blocked=Red, Overdue=Red
  - Clickable rows → Sales Order Detail
  - Exception banner: "X orders are overdue" (red) and "Y orders in credit block" (orange)

- [ ] Create `SalesOrderDetailScreen.jsx`:
  - Order header: ID, customer, creation date, type, sales org, total value
  - Status timeline using `ui5-progress-indicator` or step indicators: Created → Confirmed → In Delivery → Billed
  - Line items table: Material, Description, Quantity, Unit, Net Price, Total, Delivery Date, Item Status
  - Credit block alert panel (if applicable)
  - "Investigate Order" button → calls sales-order-investigation skill via agent

#### AI Sales Assistant Screen (`src/components/AISalesAssistant/`)

- [ ] Create `AISalesAssistantScreen.jsx`:
  - Chat layout: message history + input area (full height)
  - Message bubbles: user messages (right-aligned, SAP blue), agent responses (left-aligned, white card)
  - Typing indicator animation while agent responds
  - Quick action buttons above input:
    - "📊 Dashboard KPIs"
    - "⚠️ Show Overdue Orders"
    - "🎯 Generate Recommendations"
    - "🔍 Find At-Risk Customers"
  - Input: `ui5-textarea` + Send button (`ui5-button`)
  - Agent responses support markdown-like formatting (bold, lists, tables rendered in HTML)
  - Session persistence: conversation history preserved within browser session
  - Streaming support: display agent response token-by-token as it streams
  - Error state: show `ui5-message-strip` with type "Negative" when agent is unavailable

#### Agent Activity Screen (`src/components/AgentActivity/`)

- [ ] Create `AgentActivityScreen.jsx`:
  - Timeline view (`ui5-timeline`) of recent agent executions (last 50)
  - Each timeline item shows:
    - Timestamp
    - User query (truncated to 100 chars)
    - Status icon: ✅ success / ❌ error / ⏳ in progress
    - Duration (ms)
    - Expandable section: tools called (ordered list with params + result preview)
  - Filter by status (All / Success / Error)
  - "Clear History" button
  - Auto-refresh every 30 seconds (toggle)
  - Error detail panel: full error message + stack trace for failed executions

- [ ] Create `RecommendationsPanel.jsx` (embedded in Agent Activity and Dashboard):
  - List of current recommendations sorted by priority
  - Priority badges: 🔴 High / 🟠 Medium / 🟢 Low
  - Recommendation card: category icon, reference (customer/order link), description, suggested action
  - Action buttons: "Acknowledge" / "Mark as Actioned" (updates `SalesRecommendation.status`)
  - "Refresh Recommendations" button → triggers AI recommendation generation

### API Integration Configuration

- [ ] Create `srv/agent-client.js` — reusable client for AI agent A2A calls:
  - Base URL: `process.env.AGENT_URL || 'http://localhost:8000'`
  - Methods: `sendMessage(message, sessionId)`, `streamMessage(message, sessionId)`
  - Retry logic: 3 retries with exponential backoff on connectivity failures
  - Timeout: 60 seconds per request
  - Error classification: AgentUnavailable / AgentError / NetworkError

- [ ] Create `srv/sample-data-provider.js` — sample data for development:
  - Mirrors the exact response shapes of `getDashboardKPIs`, `getCustomers`, `getSalesOrders`
  - 10 customers across 3 industries (Technology, Manufacturing, Retail)
  - 25 orders in mixed statuses with realistic values ($5K–$500K range)
  - 6 months of trend data
  - 3 pre-generated recommendations (1 High, 1 Medium, 1 Low priority)
  - All items clearly marked `isSampleData: true`

### Authentication & Authorization

- [ ] Configure XSUAA in `package.json` and `.cdsrc.json` for BTP authentication (development: mock auth)
- [ ] Define role collections in `xs-security.json`:
  - `SalesManager` — full read access to all entities + can trigger recommendations
  - `SalesRepresentative` — read access, own customer/order scope only
  - `SalesOperationsAnalyst` — read-only access to all entities
  - `HeadOfSales` — full access including recommendation management
- [ ] Apply `@requires` annotations to sensitive service actions

### Build & Runtime Configuration

- [ ] Create `Procfile` or start script: `cds serve --production`
- [ ] Add `vite.config.js` for the React frontend with proxy config: `/api` → `http://localhost:4004`
- [ ] Create `mta.yaml` for BTP deployment descriptor (multi-target application):
  - Module: `intelligent-sales-management-srv` (CAP Node.js)
  - Module: `intelligent-sales-management-ui` (approuter / static HTML5 app)
  - Resource: XSUAA service instance
  - Resource: SAP HANA Cloud service instance (for production)

### Testing

- [ ] Write integration tests in `test/sales-service.test.js`:
  - Test `getDashboardKPIs` with mocked agent response → verify KPI structure
  - Test `getCustomers` with search term → verify customer list structure
  - Test `getSalesOrders` with status filter → verify order list structure
  - Test `sendMessage` → verify conversation is stored in `AgentConversation`
  - Test error handling: agent unavailable → verify 503 response
- [ ] Run `npm test` from `assets/intelligent-sales-management-app/`
- [ ] Verify all 5 test cases pass
