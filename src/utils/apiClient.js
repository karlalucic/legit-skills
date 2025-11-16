export async function analyzeCode(code, language) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, language })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Analysis failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to analyze code: ${error.message}`);
  }
}

export async function sendTeachMessage(message, conversationHistory = [], context = null) {
  try {
    const response = await fetch('/api/teach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, conversationHistory, context })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Teaching request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to get teaching response: ${error.message}`);
  }
}

export async function generateSchema(request, context = null) {
  try {
    const response = await fetch('/api/schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ request, context })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Schema generation failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to generate schema: ${error.message}`);
  }
}
