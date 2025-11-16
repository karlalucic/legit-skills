# Legit Skills

Tutoring platform for programmers that teaches through conversation instead of static tutorials. Uses Claude AI to provide personalized feedback on code, explain algorithms interactively, and break down technical concepts.

## What it does

The platform has four modes, each designed to fill gaps in how programmers usually learn:

**Code Analysis**
Upload any code file and get feedback based on production-ready principles. The AI scores your code (0-100) and identifies issues like poor naming, excessive nesting, missing error handling, or magic numbers. Also points out what you did well. Think of it as a code review from a senior engineer who actually explains the reasoning.

**Algorithm Learning**
Interactive tutoring on algorithms and data structures using the Socratic method (the AI asks you questions instead of dumping answers). Get explanations with real-world analogies, visual diagrams (Mermaid/ASCII), and code skeleton templates. You write code in the built-in editor, and the AI reviews it. Works side-by-side: chat on the left, code editor on the right.

**Math & Probability**
Tutoring for probability, statistics, and game theory problems that show up in interviews (Monty Hall, Birthday Paradox, Bayes' Theorem, expected value). Each explanation includes the intuition, the math, Python simulations to verify the results, and tips for answering these in interviews.

**Technical Concepts**
Deep dives into system design, databases, networking, OS internals, cloud computing, and security. Topics like CAP theorem, load balancing, microservices, caching strategies, ACID properties. Each concept gets broken down into: what it is, how it works, real-world use cases, trade-offs, and architecture diagrams.

## Tech stack

Frontend is React 18.3.1 with Vite 6.0.5 for the build tooling. Tailwind CSS 3.4.17 for styling. Monaco Editor for the code editor (same one VS Code uses). Mermaid 11.12.0 renders diagrams from text descriptions.

Backend is minimal, just Vercel serverless functions that proxy requests to the Anthropic API. This keeps API keys secure in production while letting you call Claude directly from the browser during development.

## Setup

Need Node.js (v16+) and an Anthropic API key.

Clone and install:
```bash
git clone https://github.com/karlalucic/legit-skills.git
cd legit-skills
npm install
```

Copy the environment file and add your API key:
```bash
cp .env.example .env
```

Edit `.env` and add your key:
```
# For production (Vercel serverless functions)
ANTHROPIC_API_KEY=your_key_here

# For development (Vite dev server, must start with VITE_)
VITE_ANTHROPIC_API_KEY=your_key_here
```

Note: You need to set the key in both places because Vite only exposes variables prefixed with `VITE_` to the browser during development.

## Running locally

Start the dev server:
```bash
npm run dev
```

Opens at `http://localhost:5173`. Changes hot-reload automatically.

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment

Configured for Vercel but should work on any platform that supports serverless functions.

For Vercel:
1. Push to GitHub
2. Import the repo in Vercel
3. Add `ANTHROPIC_API_KEY` as an environment variable in settings
4. Deploy

The `/api` folder contains the serverless functions. Vercel automatically detects and deploys them.

## Project structure

```
legit-skills/
├── api/                    # Serverless functions (production API)
│   ├── analyze.js         # Code analysis endpoint
│   ├── teach.js           # Teaching/tutoring endpoint
│   └── schema.js          # Returns analysis schema
├── src/
│   ├── components/        # React components
│   ├── utils/            # Helpers (API client, language detection, markdown parser)
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── .env.example          # Template for environment variables
├── vercel.json           # Vercel deployment config
└── vite.config.js        # Vite build config
```

## How it works

Development mode calls the Anthropic API directly from your browser (faster iteration, easier debugging). Production mode routes requests through serverless functions to keep the API key secure.

The chat interface maintains conversation history so the AI has context. Visual diagrams auto-generate when the AI includes Mermaid syntax in responses. The code editor detects language automatically (Python, JavaScript, Java, C++) and provides syntax highlighting.

## Limitations

Requires an internet connection and API credits from Anthropic. The AI can occasionally hallucinate details in technical explanations (verify critical information). Code analysis is opinionated and based on specific principles (descriptive naming, small functions, etc), which might not match your team's standards.

## License

MIT

## Contributing

Pull requests welcome. For major changes, open an issue first to discuss what you want to change.
