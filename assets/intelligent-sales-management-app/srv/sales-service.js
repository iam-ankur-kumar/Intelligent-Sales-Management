'use strict';

/**
 * SalesService Implementation
 * Proxy actions delegate to the AI Sales Agent (A2A protocol).
 * Falls back to sample data when USE_SAMPLE_DATA=true or agent is unavailable.
 */

const cds = require('@sap/cds');
const { sendMessage, AgentUnavailableError } = require('./agent-client');
const sampleData = require('./sample-data-provider');

const USE_SAMPLE_DATA = process.env.USE_SAMPLE_DATA !== 'false';

module.exports = cds.service.impl(async function (srv) {

  // ── sendMessage ──────────────────────────────────────────────────────────
  srv.on('sendMessage', async (req) => {
    const { message, sessionId } = req.data;
    const sid = sessionId || `session-${Date.now()}`;
    const start = Date.now();

    if (USE_SAMPLE_DATA) {
      const reply = sampleData.chatReply(message);
      await _storeConversation(req, sid, message, reply.response, reply.toolsUsed, 'success', Date.now() - start);
      return { sessionId: sid, response: reply.response, toolsUsed: reply.toolsUsed, isSampleData: true, status: 'completed' };
    }

    try {
      const result = await sendMessage(message, sid);
      await _storeConversation(req, sid, message, result.response, result.toolsUsed, result.status, Date.now() - start);
      return { sessionId: sid, ...result };
    } catch (err) {
      const errMsg = `Agent unavailable: ${err.message}`;
      await _storeConversation(req, sid, message, errMsg, [], 'error', Date.now() - start);
      req.error(503, errMsg);
    }
  });

  // ── getDashboardKPIs ─────────────────────────────────────────────────────
  srv.on('getDashboardKPIs', async (req) => {
    if (USE_SAMPLE_DATA) return sampleData.getDashboardKPIs();

    try {
      const result = await sendMessage(
        'Generate a comprehensive sales dashboard summary with KPIs: total orders, open orders, total open value, customer count, overdue orders, credit blocked orders, top 5 customers by value, and 6-month trend data. Return as structured JSON.',
        `kpi-${Date.now()}`
      );
      return _parseStructuredResponse(result.response, sampleData.getDashboardKPIs());
    } catch (err) {
      cds.log('sales-service').warn('getDashboardKPIs fell back to sample data:', err.message);
      return { ...sampleData.getDashboardKPIs(), isSampleData: true };
    }
  });

  // ── getCustomers ─────────────────────────────────────────────────────────
  srv.on('getCustomers', async (req) => {
    const { search, top = 50 } = req.data;
    if (USE_SAMPLE_DATA) return sampleData.getCustomers(search, top);

    try {
      const query = search
        ? `List up to ${top} customers matching "${search}". Include id, name, industry, segment, creditLimit, creditExposure, currency, orderCount, totalOrderValue.`
        : `List up to ${top} customers. Include id, name, industry, segment, creditLimit, creditExposure, currency, orderCount, totalOrderValue.`;
      const result = await sendMessage(query, `customers-${Date.now()}`);
      return _parseStructuredResponse(result.response, sampleData.getCustomers(search, top));
    } catch (err) {
      cds.log('sales-service').warn('getCustomers fell back to sample data:', err.message);
      return sampleData.getCustomers(search, top);
    }
  });

  // ── getCustomerDetail ────────────────────────────────────────────────────
  srv.on('getCustomerDetail', async (req) => {
    const { customerId } = req.data;
    if (!customerId) return req.error(400, 'customerId is required');
    if (USE_SAMPLE_DATA) return sampleData.getCustomerDetail(customerId);

    try {
      const result = await sendMessage(
        `Get complete details for customer ${customerId}: master data, recent orders, risk assessment, and AI insights.`,
        `cust-detail-${Date.now()}`
      );
      return _parseStructuredResponse(result.response, sampleData.getCustomerDetail(customerId));
    } catch (err) {
      cds.log('sales-service').warn('getCustomerDetail fell back to sample data:', err.message);
      return sampleData.getCustomerDetail(customerId);
    }
  });

  // ── getSalesOrders ───────────────────────────────────────────────────────
  srv.on('getSalesOrders', async (req) => {
    const { customerId, status, top = 50 } = req.data;
    if (USE_SAMPLE_DATA) return sampleData.getSalesOrders(customerId, status, top);

    try {
      let query = `List up to ${top} sales orders`;
      if (customerId) query += ` for customer ${customerId}`;
      if (status) query += ` with status ${status}`;
      query += '. Include id, customer, customerName, status, statusDescription, totalValue, currency, salesOrderDate, requestedDeliveryDate, overdue, daysOverdue, creditBlocked.';

      const result = await sendMessage(query, `orders-${Date.now()}`);
      return _parseStructuredResponse(result.response, sampleData.getSalesOrders(customerId, status, top));
    } catch (err) {
      cds.log('sales-service').warn('getSalesOrders fell back to sample data:', err.message);
      return sampleData.getSalesOrders(customerId, status, top);
    }
  });

  // ── getSalesOrderDetail ──────────────────────────────────────────────────
  srv.on('getSalesOrderDetail', async (req) => {
    const { orderId } = req.data;
    if (!orderId) return req.error(400, 'orderId is required');
    if (USE_SAMPLE_DATA) return sampleData.getSalesOrderDetail(orderId);

    try {
      const result = await sendMessage(
        `Get complete details for sales order ${orderId}: header data, all line items with quantities and prices, delivery dates, billing status, and any credit blocks.`,
        `order-detail-${Date.now()}`
      );
      return _parseStructuredResponse(result.response, sampleData.getSalesOrderDetail(orderId));
    } catch (err) {
      cds.log('sales-service').warn('getSalesOrderDetail fell back to sample data:', err.message);
      return sampleData.getSalesOrderDetail(orderId);
    }
  });

  // ── generateRecommendations ──────────────────────────────────────────────
  srv.on('generateRecommendations', async (req) => {
    if (USE_SAMPLE_DATA) {
      const recs = sampleData.getRecommendations();
      await _persistRecommendations(recs.recommendations);
      return recs;
    }

    try {
      const result = await sendMessage(
        'Analyze current sales data and generate prioritized recommendations. Identify at-risk customers, upsell opportunities, and overdue orders requiring immediate action. Return top 10 recommendations with priority (High/Medium/Low), category, referenceId, referenceType, and recommendation text.',
        `recs-${Date.now()}`
      );
      const parsed = _parseStructuredResponse(result.response, sampleData.getRecommendations());
      await _persistRecommendations(parsed.recommendations || []);
      return parsed;
    } catch (err) {
      cds.log('sales-service').warn('generateRecommendations fell back to sample data:', err.message);
      const recs = sampleData.getRecommendations();
      await _persistRecommendations(recs.recommendations);
      return recs;
    }
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  async function _storeConversation(req, sessionId, userMessage, agentResponse, toolsUsed, status, durationMs) {
    try {
      const { AgentConversations } = srv.entities;
      const db = await cds.connect.to('db');
      await db.run(INSERT.into(AgentConversations).entries({
        ID: cds.utils.uuid(),
        sessionId,
        timestamp: new Date().toISOString(),
        userMessage: userMessage?.slice(0, 2000) || '',
        agentResponse: agentResponse || '',
        toolsUsed: JSON.stringify(toolsUsed || []),
        executionStatus: status || 'success',
        durationMs: durationMs || 0
      }));
    } catch (dbErr) {
      cds.log('sales-service').warn('Failed to store conversation:', dbErr.message);
    }
  }

  async function _persistRecommendations(recommendations) {
    try {
      const { SalesRecommendations } = srv.entities;
      const db = await cds.connect.to('db');
      for (const rec of recommendations || []) {
        await db.run(INSERT.into(SalesRecommendations).entries({
          ID: rec.id || cds.utils.uuid(),
          timestamp: new Date().toISOString(),
          priority: rec.priority || 'Medium',
          category: rec.category || 'General',
          referenceId: rec.referenceId || '',
          referenceType: rec.referenceType || 'Customer',
          recommendation: rec.recommendation || '',
          status: rec.status || 'New'
        }));
      }
    } catch (dbErr) {
      cds.log('sales-service').warn('Failed to persist recommendations:', dbErr.message);
    }
  }

  function _parseStructuredResponse(responseText, fallback) {
    try {
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                        responseText.match(/(\{[\s\S]*\})/);
      if (jsonMatch) return JSON.parse(jsonMatch[1]);
      return JSON.parse(responseText);
    } catch {
      return fallback;
    }
  }
});
