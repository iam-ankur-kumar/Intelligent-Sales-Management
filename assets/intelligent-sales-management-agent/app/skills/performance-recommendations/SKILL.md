---
name: performance-recommendations
description: AI-powered sales performance analysis and actionable recommendations for sales managers — identifies risks, opportunities, and priority actions
---

# Sales Performance Recommendations Workflow

## When to Use This Skill

Load this skill when the user requests:
- Sales performance recommendations
- At-risk customers list
- Team action priorities
- Sales opportunities overview
- Weekly / monthly performance briefing

## Instructions

### Step 1: Gather KPI Snapshot

1. Get dashboard KPIs (total orders, open orders, overdue count, credit block count, top customers)
2. Get 6-month trend data (monthly order counts and values)
3. Calculate performance indicators:
   - Month-over-month order value change (%)
   - Overdue rate: `(overdue orders / total open orders) * 100`
   - Credit block rate: `(credit blocked orders / total open orders) * 100`

### Step 2: Identify At-Risk Customers

For each customer with open orders:
1. Check if they have overdue orders
2. Check if they have credit-blocked orders
3. Check if their recent order volume is declining
4. Classify as At-Risk if any of these apply

Top 3 At-Risk Customers (by impact = open order value at risk):
- Priority 1: Highest open order value with active exception
- Priority 2: Second highest
- Priority 3: Third highest

### Step 3: Identify Upsell Opportunities

Look for customers who:
- Have no open orders but have placed orders in the past 90 days (re-engagement opportunity)
- Have consistently increasing order volumes (expansion candidate)
- Have low credit utilization (< 50%) and high order frequency (credit limit increase or larger orders possible)

Top 3 opportunities by estimated revenue potential.

### Step 4: Identify Immediate Actions Required

Flag for immediate attention:
- Orders overdue by > 7 days (escalation needed)
- Orders in credit block for > 3 days (finance team action)
- Customers approaching credit limit (> 90%) with pending orders

### Step 5: Generate Recommendations Report

```
## Sales Performance Recommendations [SAMPLE DATA if applicable]
Generated: [timestamp]

### Performance Snapshot
| KPI | Value | Trend |
|-----|-------|-------|
| Open Orders | [count] | [↑/→/↓] |
| Open Order Value | [amount] | [↑/→/↓] |
| Overdue Rate | [%] | [🔴/🟠/🟢] |
| Credit Block Rate | [%] | [🔴/🟠/🟢] |

### 🔴 Priority Actions (Immediate)
[List of urgent items requiring same-day action]

### ⚠️ At-Risk Customers (Top 3)
1. **[Customer Name]** — [Risk reason], Open value: [amount]
   → Recommended action: [specific action]

2. **[Customer Name]** — [Risk reason], Open value: [amount]
   → Recommended action: [specific action]

3. **[Customer Name]** — [Risk reason], Open value: [amount]
   → Recommended action: [specific action]

### 🎯 Revenue Opportunities (Top 3)
1. **[Customer Name]** — [Opportunity type], Estimated potential: [amount]
   → Recommended action: [specific action]

2. [...]

3. [...]

### 📊 Trend Insight
[2–3 sentences analyzing the 6-month trend: is performance improving, stable, or declining?]

### This Week's Focus
1. [Single most important action for the sales manager]
2. [Second priority]
3. [Third priority]
```

## Error Handling

- Insufficient data: "Insufficient order history to generate recommendations. Minimum 30 days of data required."
- Tool errors: Relay exact error and skip that data point; generate partial recommendations with a note.
