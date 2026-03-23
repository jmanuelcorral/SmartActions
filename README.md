# 🧠 SMART Actions Demo

**SMART Actions** = AI agents embedded in your CI/CD pipeline using **GitHub Copilot CLI** inside **GitHub Actions**.

They perform _qualitative_ checks that linters and unit tests can't — security audits, documentation enforcement, changelog generation — by giving an LLM a structured prompt and parsing its output for pass/fail signals.

## How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│  GitHub      │────▸│  Copilot CLI      │────▸│  Agent Prompt  │
│  Actions     │     │  (the brain)      │     │  (.agent.md)   │
│  Workflow    │◂────│                    │◂────│                │
│              │     │  Structured Output │     │  Instructions  │
└──────┬───────┘     └──────────────────┘     └───────────────┘
       │
       ▼
 ┌─────────────┐
 │  Kill Switch │  grep for a specific phrase → pass or fail
 └─────────────┘
```

1. **The Brain** — `npm i -g @github/copilot` (GitHub Copilot CLI)
2. **The Persona** — A markdown file in `.github/agents/` that acts as the system prompt
3. **The Trigger** — A `grep` command that checks the AI's output for a "kill switch" phrase

## Workflows

| Workflow | Trigger | Agent | Kill Switch |
|----------|---------|-------|-------------|
| 🔒 **Security Agent** | PR + push to `main` | `security-reporter.agent.md` | `THIS ASSESSMENT CONTAINS A CRITICAL VULNERABILITY` |
| 📚 **Docs Enforcer** | PR only | `docs-enforcer.agent.md` | `MISSING_DOCUMENTATION_DETECTED` |
| 📝 **Changelog Generator** | Push to `main` | `changelog-generator.agent.md` | _None (always succeeds)_ |

## Setup

### 1. Create a Fine-Grained PAT

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Create a token with the **`Copilot Requests: Read`** permission
3. Copy the token

### 2. Add the Secret

1. Go to your repository → **Settings → Secrets and variables → Actions**
2. Add a new secret: **`COPILOT_GITHUB_TOKEN`** with the PAT value

### 3. Push Code

That's it. The workflows trigger automatically on PRs and pushes to `main`.

## Repository Structure

```
src/
  app.ts              # Express app with intentional vulnerabilities (for demo)
  utils.ts            # Secure helper utilities
package.json          # Project dependencies
tsconfig.json         # TypeScript configuration
.github/
  agents/
    security-reporter.agent.md    # Security scanning persona
    docs-enforcer.agent.md        # Documentation enforcement persona
    changelog-generator.agent.md  # Changelog generation persona
  workflows/
    smart-security.yml            # Security agent workflow
    smart-docs.yml                # Docs enforcer workflow
    smart-changelog.yml           # Changelog generator workflow
```

## The Demo App

`src/app.ts` contains **intentional vulnerabilities** for demonstration:

| Vulnerability | Type | Endpoint |
|--------------|------|----------|
| SQL Injection | Raw query concatenation | `GET /api/users/:id` |
| XSS | Unescaped user input in HTML | `GET /search` |
| Hardcoded Secret | API key in source code | `GET /api/external-data` |

Each vulnerability is marked with `// ⚠️ INTENTIONAL VULNERABILITY FOR DEMO`.

The app also includes **secure endpoints** for contrast (`/api/products/:id`, `/secure-search`, `/health`).

## Key Concepts

### Kill Switch Pattern

The "kill switch" is a specific phrase the agent outputs based on its findings. The workflow uses `grep` to check for it:

```bash
if grep -q "KILL_SWITCH_STRING" "$REPORT_PATH"; then
  exit 1  # Fail the build
fi
```

This turns qualitative AI analysis into a binary CI gate.

### Agent Prompt Design

Each `.agent.md` file contains:
- **YAML frontmatter** — metadata (name, description, model, triggers)
- **Instructions** — what to scan, how to evaluate
- **Report format** — structured output template
- **Kill switch definition** — exact phrase to output on pass/fail

## License

MIT
