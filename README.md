# Dependency Analyzer

A TypeScript project analyzer that scans TypeScript and JavaScript files, builds a module dependency graph, detects circular dependencies, and provides intelligent analysis using an LLM (Google Gemini).

---

## Features

- Parses `.ts`, `.tsx`, `.js`, `.jsx` files
- Detects circular dependencies
- Summarizes module dependencies
- Estimates project complexity (Low/Medium/High)
- Identifies tightly coupled modules
- Suggests refactoring recommendations
- Provides a REST API for programmatic access
- Security: only sends summaries to LLM, not full file contents

---

## Prerequisites

- Node.js v18 or higher
- npm
- Google Gemini API key (set in `.env` as `GEMINI_API_KEY`)

---

## Installation

```bash
git clone
cd dependency-analyzer
npm install

Create a .env file in the root directory:
GEMINI_API_KEY=your_gemini_api_key_here


To Run API Server

npm start

Run analysis from console

npm run analyze
```
