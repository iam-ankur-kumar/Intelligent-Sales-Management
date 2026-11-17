---
name: sales-order-investigation
description: Structured investigation of a sales order — status analysis, exception detection, delivery tracking, and resolution guidance
---

# Sales Order Investigation Workflow

## When to Use This Skill

Load this skill when the user requests:
- Investigation of a specific sales order
- Why an order is delayed or overdue
- Credit block explanation for an order
- Order status and next steps
- Order exception analysis

## Prerequisites

- A sales order number must be provided
- If the user provides a customer name instead, search for their orders first

## Instructions

### Step 1: Retrieve Order Header

1. Retrieve the sales order by `SalesOrder` ID
2. Record: customer (`SoldToParty` + name), order date, total value, currency, status, sales organization
3. Note the `OverallSDProcessStatus`:
   - `A` = Open (not yet started)
   - `B` = In Process (delivery in progress)
   - `C` = Completed (fully billed)
   - `D` = Rejected

### Step 2: Retrieve Line Items

1. Query `A_SalesOrderItem` for this order
2. For each item record: material, description, quantity, unit price, net price, confirmed delivery date, item status
3. Identify any items with:
   - `ItemSDProcessStatus = "A"` (blocked)
   - Missing confirmed delivery date
   - Quantity mismatch (requested vs. confirmed)

### Step 3: Delivery Date Analysis

1. Compare `RequestedDeliveryDate` (from header) with today's date
2. If `RequestedDeliveryDate < today` AND status ≠ `C`: **Order is OVERDUE**
3. Calculate days overdue: `today - RequestedDeliveryDate`
4. For in-process orders, check the most recent confirmed delivery date on line items

### Step 4: Credit Block Check

1. Query credit block API filtered by this sales order number
2. If a credit block record exists:
   - Record: blocked amount, credit analyst, blocking reason code
   - This is typically the cause if the order is "stuck" in status A

### Step 5: Billing Status

1. Check if any billing documents reference this sales order
2. If billing documents exist: order is partially or fully billed
3. If no billing and status is C: flag as anomaly

### Step 6: Exception Classification

| Condition | Exception Type | Severity |
|-----------|----------------|----------|
| Past delivery date, status B | Overdue Delivery | 🔴 High |
| Credit block active | Credit Hold | 🔴 High |
| No confirmed delivery date | Scheduling Gap | 🟠 Medium |
| Status A for > 14 days | Stalled Order | 🟠 Medium |
| Line item blocked | Item Exception | 🟡 Low |

### Step 7: Generate Investigation Report

```
## Order Investigation: [Order ID] [SAMPLE DATA if applicable]

### Order Summary
- Customer: [Name] ([ID])
- Order Date: [date]
- Total Value: [amount] [currency]
- Status: [status description]
- Sales Organization: [org]

### Line Items ([count])
| Item | Material | Description | Qty | Unit Price | Total |
|------|----------|-------------|-----|-----------|-------|
[table rows]

### Delivery Status
- Requested Delivery: [date]
- Status: [On Track / OVERDUE by X days / Pending]

### Exceptions Found
[List all exceptions with severity]

### Root Cause Analysis
[1–2 sentences explaining the primary issue]

### Recommended Actions
1. [Immediate action if any exception]
2. [Follow-up action]
3. [Preventive action]
```

## Error Handling

- Order not found: "Sales order [ID] was not found in the system."
- No line items: Report header information and note missing items.
- Tool error: Relay exact error message.
