# DECA Draftroom (Interactive Agent Web App)

DECA Draftroom is a Next.js web app for practicing DECA prepared-event writing. Students can select an event, paste draft content, and receive rubric-structured feedback with revision guidance.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Deployment Environment

The analysis route reads `GEMINI_API_KEY` only on the server. Add it to the Vercel project under **Settings > Environment Variables** for the `Production` and `Preview` environments, then redeploy. Do not add `.env.local` to git.

## Project Structure

- Main route: [`src/app/page.tsx`](/Users/anish/Documents/DECAWrittenAnalyzer.worktrees/deca-interactive-agent-webapp/src/app/page.tsx)
- Route styling: [`src/app/page.module.css`](/Users/anish/Documents/DECAWrittenAnalyzer.worktrees/deca-interactive-agent-webapp/src/app/page.module.css)
- Global styling: [`src/app/globals.css`](/Users/anish/Documents/DECAWrittenAnalyzer.worktrees/deca-interactive-agent-webapp/src/app/globals.css)
- App shell/layout: [`src/app/layout.tsx`](/Users/anish/Documents/DECAWrittenAnalyzer.worktrees/deca-interactive-agent-webapp/src/app/layout.tsx)

## Rubric Sourcing Status

Prepared-event rubric resources are now wired from DECA event pages on `deca.org` and stored in [`src/lib/preparedEvents.ts`](/Users/anish/Documents/DECAWrittenAnalyzer.worktrees/deca-interactive-agent-webapp/src/lib/preparedEvents.ts):

- 23 prepared events included
- Event page link for each event
- Guidelines PDF for each event
- Evaluation-form or performance-indicator PDFs when surfaced on the event page

The UI reads this source-of-truth directly in [`src/app/page.tsx`](/Users/anish/Documents/DECAWrittenAnalyzer.worktrees/deca-interactive-agent-webapp/src/app/page.tsx).
