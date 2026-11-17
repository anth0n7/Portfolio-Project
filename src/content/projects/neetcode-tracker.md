---
title: NeetCode Tracker
kind: Desktop app
order: 2
summary: A spaced-repetition app for the NeetCode 250. It schedules reviews with SM-2 and runs as a native Mac app, with all data in one local SQLite file.
tech: [Next.js, TypeScript, SQLite, Drizzle ORM, Electron, Tailwind CSS, Vitest]
links:
  - { label: GitHub, href: "https://github.com/anth0n7/neetcode-tracker" }
---

## The problem

Solving a problem once doesn't mean you'll remember the pattern a month later. I was working through the NeetCode 250 and wanted something to tell me each morning which solved problems to look at again, instead of rereading everything or trusting my memory.

## What I built

A personal Mac app for the NeetCode 250. After each attempt you log how it went: **Easy**, **Struggled** or **Needed solution**. The app schedules the next review with the SM-2 algorithm and shows:

- what's **due today**,
- every problem grouped by **pattern**, so weak areas are visible,
- your **progress**, plus a one-line key insight per problem (the idea, not the code).

The goal I set was that logging an attempt takes under 10 seconds.

## How it's put together

- **App:** Next.js (App Router) and TypeScript, styled with Tailwind CSS.
- **Data:** SQLite through Drizzle ORM on libSQL. The whole database is a single file on your Mac. There's no account, no sync and no server somewhere else.
- **Desktop shell:** Electron starts the built Next.js server on a free `127.0.0.1` port and shows it in one window.
- **Scheduler:** a pure module that takes `today` as a parameter and never reads the clock or the database, which makes it easy to test.
- **Tests:** Vitest, run against throwaway SQLite files, covering the scheduler, backups, queries and API routes.

## Decisions worth explaining

### Shipping a web stack as a native app

Electron has to find a free port, start the server, wait until it actually answers, and then open the window. If startup fails, the app shows a plain-language reason (damaged database, full disk, no permission) in a dialog instead of a blank window, and links to other sites open in your default browser.

### Protecting the data

The app backs the database up at most once a day, keeps the seven newest backups, and always takes a fresh one before changing the database structure after an update. A damaged file shows a clear message and the README walks through restoring a backup. Reinstalling the app never touches your data.

### Localhost only, on purpose

The app has no login and has delete endpoints, so every server binds to `127.0.0.1`. Without that flag `next start` listens on all interfaces. Nothing is reachable from another device.

### A sandbox that can't touch real data

There are separate development, sandbox and test databases, and the real one isn't opened by accident because `DATABASE_PATH` has no default. Fixture data is only allowed into the dev and test databases, so it can't leak into the real one. Manual checks use a sandbox filled with sample attempts.

### A scheduler with no hidden inputs

Because the scheduling logic is pure, a test can pass in any date and any history and check exactly when the next review lands, without freezing time or setting up a database.

## Where it stands

It runs on macOS (built and tested on Apple Silicon) and installs with one command. It's deliberately single-user, with no sync or phone version. A downloadable build and a short demo video are the next things I'm adding to this page.
