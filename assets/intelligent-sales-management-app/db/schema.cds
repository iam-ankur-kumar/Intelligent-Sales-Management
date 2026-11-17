namespace com.intelligent.sales;

/**
 * AgentConversation — stores AI Sales Assistant conversation history.
 * Each record represents one user ↔ agent exchange.
 */
entity AgentConversation {
  key ID            : UUID;
  sessionId         : String(64);
  timestamp         : DateTime;
  userMessage       : String(2000);
  agentResponse     : LargeString;
  toolsUsed         : LargeString;   // JSON array of tool names called
  executionStatus   : String(20);    // success | error | partial
  durationMs        : Integer;
}

/**
 * AgentActivity — fine-grained agent tool execution log.
 * One record per MCP tool call within a conversation.
 */
entity AgentActivity {
  key ID            : UUID;
  conversationId    : UUID;
  timestamp         : DateTime;
  toolName          : String(200);
  toolParameters    : LargeString;   // JSON
  toolResult        : LargeString;   // JSON, truncated at 5000 chars
  status            : String(20);    // called | success | error
  errorMessage      : String(500);
}

/**
 * SalesRecommendation — AI-generated recommendations for the sales team.
 */
entity SalesRecommendation {
  key ID            : UUID;
  timestamp         : DateTime;
  priority          : String(10);    // High | Medium | Low
  category          : String(50);    // AtRiskCustomer | UpsellOpportunity | OverdueOrder
  referenceId       : String(50);    // customer ID or order number
  referenceType     : String(20);    // Customer | SalesOrder
  recommendation    : LargeString;
  status            : String(20);    // New | Acknowledged | Actioned
}

/**
 * SampleDataFlag — runtime toggle for sample vs. live data mode.
 * Always a single record (ID=1).
 */
entity SampleDataFlag {
  key ID            : Integer;
  useSampleData     : Boolean default true;
  lastUpdated       : DateTime;
}
