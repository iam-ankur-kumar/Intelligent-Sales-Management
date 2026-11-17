'use strict';

/**
 * Agent Client — Reusable A2A client for the AI Sales Agent.
 * Handles communication with the agent via the A2A protocol.
 */

const AGENT_URL = process.env.AGENT_URL || 'http://localhost:5000';
const AGENT_TIMEOUT_MS = parseInt(process.env.AGENT_TIMEOUT_MS || '60000', 10);
const MAX_RETRIES = 3;

/**
 * Send a message to the agent and wait for the final response.
 * @param {string} message - User message
 * @param {string} sessionId - Session identifier
 * @returns {Promise<{response: string, toolsUsed: string[], isSampleData: boolean}>}
 */
async function sendMessage(message, sessionId) {
  const taskId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const payload = {
    jsonrpc: '2.0',
    id: taskId,
    method: 'tasks/send',
    params: {
      id: taskId,
      message: {
        role: 'user',
        parts: [{ type: 'text', text: message }],
      },
      sessionId: sessionId || `session-${Date.now()}`,
    },
  };

  let lastError;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(`${AGENT_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new AgentError(`Agent returned HTTP ${response.status}`, response.status);
      }

      const data = await response.json();

      if (data.error) {
        throw new AgentError(data.error.message || 'Agent error', 500);
      }

      const result = data.result;
      const parts = result?.artifacts?.[0]?.parts || result?.message?.parts || [];
      const textPart = parts.find((p) => p.type === 'text') || parts[0];
      const responseText = textPart?.text || JSON.stringify(result) || 'No response';

      return {
        response: responseText,
        toolsUsed: extractToolsUsed(result),
        isSampleData: responseText.includes('[SAMPLE DATA]'),
        status: result?.status?.state || 'completed',
      };
    } catch (err) {
      lastError = err;
      if (err instanceof AgentError && err.statusCode < 500) {
        throw err; // Don't retry 4xx errors
      }
      if (attempt < MAX_RETRIES - 1) {
        await sleep(Math.pow(2, attempt) * 500); // exponential backoff
      }
    }
  }
  throw new AgentUnavailableError(`Agent unreachable after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

/**
 * Extract tool names from agent result artifacts.
 */
function extractToolsUsed(result) {
  try {
    const metadata = result?.metadata || {};
    if (Array.isArray(metadata.toolsUsed)) return metadata.toolsUsed;
    return [];
  } catch {
    return [];
  }
}

/**
 * Fetch with a configurable timeout.
 */
async function fetchWithTimeout(url, options) {
  const { default: fetch } = await import('node-fetch');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class AgentError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AgentError';
    this.statusCode = statusCode;
  }
}

class AgentUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AgentUnavailableError';
    this.statusCode = 503;
  }
}

module.exports = { sendMessage, AgentError, AgentUnavailableError };
