---
title: Job Search Copilot
kind: Web app
order: 1
summary: A job application tracker with three AI features. It parses postings into structured data, scores résumé fit with embeddings, and drafts résumé edits and cover letters without inventing experience.
tech: [React, TypeScript, Express, PostgreSQL, Clerk, Claude API, Voyage AI, Tailwind CSS]
links:
  - { label: Live demo, href: "https://job-search-copilot-eta.vercel.app" }
  - { label: GitHub, href: "https://github.com/anth0n7/job-search-copilot" }
cover: ../../assets/projects/jsc-Applications.png
coverAlt: "The Applications page listing tracked applications with status badges and an add-application form"
gallery:
  - src: ../../assets/projects/jsc-ApplicationView.png
    alt: "An application page showing contacts, interview stages and the job posting"
    caption: "One page per application: company, contacts, interview stages, posting, match history and suggestions."
  - src: ../../assets/projects/jsc-Matches.png
    alt: "Three saved résumé matches with scores and skill lists"
    caption: "Every match is saved, so you can watch the score change as the résumé improves."
  - src: ../../assets/projects/jsc-Suggestions.png
    alt: "Suggested résumé changes with the original line, a rewrite and the reason"
    caption: "Line-by-line rewrite suggestions: the original, a rewrite, and why."
  - src: ../../assets/projects/jsc-CoverLetter.png
    alt: "A generated cover letter draft"
    caption: "A cover letter draft built from the posting and the skills the match found missing."
---

## The problem

Job hunting means juggling applications, companies, contacts and interview stages, and guessing whether your résumé actually fits a posting. I wanted one place to track all of it, and I wanted a project that went past basic CRUD and used AI for something real, not as a demo feature bolted on.

## What I built

A tracker for companies, applications, contacts and interview stages, with a page per application that gathers everything related to it. On top of that sit three AI features:

- **Posting parser.** Paste a job description and Claude returns the seniority level, required skills and responsibilities as structured data.
- **Résumé match.** Voyage AI embeddings and cosine similarity give an overall score. Separately, Claude lists which required skills the résumé shows and which are missing.
- **Suggestions.** Line-by-line résumé rewrites (original, rewrite, reason) and a cover letter draft, based on the posting and the missing skills.

## How it's put together

- **Client:** React, Vite, Tailwind CSS and React Router, deployed on Vercel.
- **API:** Express in TypeScript, split into one route file per resource, with shared auth middleware.
- **Database:** PostgreSQL. Parsed postings and suggestions are stored in JSON columns because real postings don't share one shape. Skill lists are plain text arrays.
- **Auth:** Clerk, with every query scoped to the signed-in user.
- **AI:** Claude for parsing, skill comparison and writing. Voyage AI for embeddings.

## Decisions worth explaining

### Guardrails on model output

The suggestion prompts forbid inventing skills or experience, because it's easy for a model to "helpfully" exaggerate and that's not something I want in a real cover letter. Even when told to return only JSON, the model sometimes wraps it in a markdown code block, so responses are cleaned before parsing instead of trusting that the instruction was followed.

### An authorization bug I found and fixed

Contacts and interview stages have no `user_id` column of their own. Ownership is checked by joining back to the company or application they belong to, so a plain `user_id` check isn't enough. While building this I found that a user could re-point an application or contact they owned at a company they didn't own, just by changing an ID in the request. I fixed it by also checking that the new company belongs to the user, using join-based ownership checks for tables without a direct user column.

### No vector database

pgvector is the expected tool for embeddings, but it's built for searching across many stored vectors. I only ever compare two: one résumé and one posting. So I wrote the cosine similarity directly instead of adding an extension I didn't need.

### Keep every match

Each match is saved along with the résumé text used at the time. Looking back at an old score, I can see exactly which version of the résumé produced it, not just the number.

### Cleaning up my own code

Auth checks started out copy-pasted everywhere. Once I noticed, I moved them into shared Express middleware and a small React hook that attaches the token to every request, split the routes by resource, and added a global React Context error system so backend errors show up on screen instead of only in the console.

## Where it stands

It's live, with real accounts and per-user data, built across 45 commits. Next on my list: automated tests, CI with GitHub Actions, caching AI responses so the same call isn't made twice, and résumé PDF upload instead of pasted text.
