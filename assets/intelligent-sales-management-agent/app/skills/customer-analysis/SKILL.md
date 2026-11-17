---
name: customer-analysis
description: Deep customer analysis workflow — purchasing history, risk scoring, and revenue opportunity identification for a specific customer
---

# Customer Analysis Workflow

## When to Use This Skill

Load this skill when the user requests:
- Deep analysis of a specific customer
- Customer risk assessment or at-risk classification
- Revenue trend analysis for a customer
- Upsell / cross-sell opportunity identification
- A comprehensive customer report

## Prerequisites

Before starting:
- Confirm the customer ID or name was provided
- If only a name was given, search for the customer first to get the BusinessPartner ID

## Instructions

### Step 1: Retrieve Customer Master Data

1. Retrieve the business partner record using the customer ID (`BusinessPartner` field)
2. Record: `BusinessPartnerFullName`, `Industry`, `Segment`, `CreditLimit`, `CreditExposure`, `Currency`
3. Calculate credit utilization: `(CreditExposure / CreditLimit) * 100`

### Step 2: Retrieve Sales Order History

1. Query sales orders filtered by `SoldToParty = <customer_id>`
2. Set `$top = 100` to retrieve recent history
3. Separate orders by status: Open (A), In Process (B), Completed (C)
4. Calculate:
   - Total order count (all time)
   - Total order value (all statuses)
   - Open order value (status A + B)
   - Last 3 months order value
   - Last 6 months order value
   - Last 12 months order value

### Step 3: Retrieve Billing History

1. Query billing documents filtered by `SoldToParty = <customer_id>`
2. Set `$top = 50`
3. Calculate total billed revenue per month for the last 6 months

### Step 4: Risk Scoring

Evaluate risk indicators and assign a score (0–100, higher = more risk):

| Indicator | Weight | Condition |
|-----------|--------|-----------|
| Credit utilization | +40 | > 90% of credit limit |
| Credit utilization | +20 | > 75% of credit limit |
| Overdue orders present | +30 | Any order past requested delivery date |
| Declining order volume | +20 | Last 3 months < 50% of prior 3 months |
| No recent orders | +15 | No orders in last 60 days |
| Credit block active | +25 | Any order in credit block |

**Risk Classification:**
- Score 0–20: Low Risk (🟢)
- Score 21–50: Medium Risk (🟠)
- Score 51+: High Risk (🔴)

### Step 5: Identify Opportunities

Look for:
- **Upsell opportunity**: Customer's average order value is below segment average AND no credit block
- **Re-engagement needed**: No orders in last 45 days for a previously active customer
- **Credit limit increase**: Customer regularly at 70–85% utilization with no overdue orders
- **Relationship at risk**: Order frequency declining more than 30% quarter-over-quarter

### Step 6: Generate Analysis Report

Structure your response as:
```
## Customer Analysis: [Customer Name] ([Customer ID]) [SAMPLE DATA if applicable]

### Summary
[2–3 sentence executive summary]

### Credit Position
- Credit Limit: [amount]
- Current Exposure: [amount]
- Utilization: [%] [🟢/🟠/🔴]

### Order Activity
- Total Orders: [count]
- Open Order Value: [amount]
- Last 3 Months Revenue: [amount]
- Last 6 Months Revenue: [amount]
- Trend: [Increasing/Stable/Declining] [↑/→/↓]

### Risk Assessment
- Risk Score: [0–100]
- Risk Level: [Low/Medium/High] [🟢/🟠/🔴]
- Key Risk Factors: [list]

### Opportunities
[List identified opportunities with priority]

### Recommended Actions
1. [Highest priority action]
2. [Second priority action]
3. [Third priority action]
```

## Error Handling

- If customer not found: Report "Customer [ID] not found in the system."
- If no order history: Report "No sales order history found for this customer."
- If tools return errors: Relay the exact error message.
