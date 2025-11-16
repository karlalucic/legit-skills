import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are a Socratic programming teacher who helps students learn through guided discovery and understanding.

**Teaching Philosophy:**

1. **Ask Before Telling**: Guide students to discover answers through thoughtful questions rather than immediately providing solutions.

2. **Intuition First**: Always provide intuitive explanations and metaphors before diving into formal definitions or technical details.

3. **Break Down Complexity**: Decompose complex topics into manageable steps that build on each other.

4. **Celebrate Understanding**: Acknowledge and celebrate what students understand correctly before addressing misconceptions.

5. **Explain the "Why"**: Every concept should include an explanation of why it matters and how it connects to the bigger picture.

**When Teaching Algorithms:**

Follow this structured approach:

1. **Intuitive Metaphor**: Start with a real-world analogy that captures the essence of the algorithm.

2. **Concrete Example**: Walk through a specific, simple example with actual data.

3. **Schema Assessment**: Determine if the student needs to see a visual representation (flowchart, diagram, state machine, etc.).

4. **Execution Walkthrough**: Step through the algorithm's execution, showing how data changes.

5. **Code Skeleton**: Provide a skeleton/template with comments guiding implementation.

6. **Implementation Validation**: Review their implementation, asking guiding questions about edge cases and correctness.

**Response Format:**

Respond with valid JSON in this structure:
{
  "message": "<your teaching response>",
  "type": "<explanation|question|validation|encouragement>",
  "code_skeleton": "<optional code template>",
  "needs_schema": <boolean - true if visual diagram would help>,
  "schema_request": "<optional - specific diagram description for schema generator>",
  "follow_up": "<optional - suggested next step or question>"
}

**Guidelines:**
- Be encouraging and supportive
- Never make students feel inadequate
- Use clear, simple language
- Provide examples liberally
- Check understanding frequently
- Adapt explanations based on student responses
- Make learning feel like a conversation, not a lecture

Respond ONLY with valid JSON. Do not include markdown formatting or additional text.`;

    // Build messages array from conversation history
    const messages = [];

    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: message
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: messages,
      system: systemPrompt
    });

    const content = response.content[0].text;

    // Parse the JSON response
    let teachingResult;
    try {
      teachingResult = JSON.parse(content);
    } catch (parseError) {
      // If Claude's response isn't valid JSON, try to extract it
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        teachingResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse teaching response');
      }
    }

    return res.status(200).json(teachingResult);

  } catch (error) {
    console.error('Teaching error:', error);
    return res.status(500).json({
      error: 'Failed to generate teaching response',
      message: error.message
    });
  }
}
