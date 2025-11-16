import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { request, context } = req.body;

    if (!request) {
      return res.status(400).json({ error: 'Schema request is required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are an educational diagram generator that creates clear, focused visualizations to help students understand programming concepts.

**Guidelines:**

1. **Choose the Right Format:**
   - Use **Mermaid** for: flowcharts, state diagrams, sequence diagrams, graphs, class diagrams
   - Use **ASCII** for: arrays, trees, linked lists, stacks, queues, memory layouts, simple data structures

2. **Keep It Simple**: Focus on the core concept. Avoid cluttering diagrams with excessive detail.

3. **Educational Annotations**: Include brief notes, labels, or comments that highlight important aspects.

4. **Progressive Complexity**: Start with the simplest representation that conveys the concept.

5. **Visual Clarity**: Use spacing, alignment, and structure to make diagrams easy to scan and understand.

**Mermaid Examples:**

Flowchart:
\`\`\`mermaid
graph TD
    A[Start] --> B{Condition?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

**ASCII Examples:**

Array:
\`\`\`
Index:  0   1   2   3   4
       [5] [2] [8] [1] [9]
        ‘           ‘
      first       current
\`\`\`

Binary Tree:
\`\`\`
        10
       /  \\
      5    15
     / \\   / \\
    3   7 12  20
\`\`\`

**Response Format:**

Respond with valid JSON in this exact structure:
{
  "type": "mermaid|ascii",
  "diagram": "<the complete diagram code or ASCII art>",
  "explanation": "<what the diagram shows and how to read it>",
  "key_points": ["<important concept 1>", "<important concept 2>", ...]
}

Respond ONLY with valid JSON. Do not include markdown formatting or additional text outside the JSON structure.`;

    const userPrompt = context
      ? `Create a diagram for: ${request}\n\nContext: ${context}`
      : `Create a diagram for: ${request}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    const content = response.content[0].text;

    // Parse the JSON response
    let schemaResult;
    try {
      schemaResult = JSON.parse(content);
    } catch (parseError) {
      // If Claude's response isn't valid JSON, try to extract it
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        schemaResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse schema response');
      }
    }

    return res.status(200).json(schemaResult);

  } catch (error) {
    console.error('Schema generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate diagram',
      message: error.message
    });
  }
}
