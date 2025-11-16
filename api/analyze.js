import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are a code quality analyzer that evaluates code based on these principles:

1. **Descriptive Naming**: Variables, functions, and classes should have clear, meaningful names that describe their purpose.

2. **Function Size**:
   - Warn if functions exceed 200 lines
   - Avoid functions with fewer than 5 lines if they're only used once (unless they improve clarity)

3. **Explicit Dependencies**: Functions should clearly declare their dependencies through parameters rather than relying on global state or hidden dependencies.

4. **Error Handling**: Code should handle errors appropriately and fail gracefully.

5. **Nesting Depth**: Keep nesting to 2-3 levels maximum. Deep nesting indicates complexity that should be refactored.

6. **Side Effects**: Functions should minimize side effects. Pure functions are preferred where appropriate.

7. **Magic Numbers**: Avoid hardcoded numbers without explanation. Use named constants instead.

**Important**: For ${language}, do not flag accepted language idioms or patterns even if they technically violate these rules. Consider the language's conventions and best practices.

Analyze the provided code and return a JSON response with this exact structure:
{
  "score": <number 0-100>,
  "language_detected": "<detected language>",
  "summary": "<brief overall assessment>",
  "issues": [
    {
      "severity": "<high|medium|low>",
      "principle": "<which principle was violated>",
      "line_content": "<the problematic code snippet>",
      "explanation": "<what's wrong>",
      "impact": "<why it matters>",
      "hint": "<how to fix it>"
    }
  ],
  "strengths": ["<positive aspects of the code>"]
}

Respond ONLY with valid JSON. Do not include any markdown formatting or additional text.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
      ],
      system: systemPrompt
    });

    const content = response.content[0].text;

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      // If Claude's response isn't valid JSON, try to extract it
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse analysis response');
      }
    }

    return res.status(200).json(analysisResult);

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze code',
      message: error.message
    });
  }
}
