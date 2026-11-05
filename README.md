# Kanboard QA Automation

End-to-end UI and API test automation for [Kanboard](https://kanboard.org), built with Playwright and TypeScript. The tests run on Chromium, Firefox and WebKit, locally and in GitHub Actions against a fresh Kanboard in Docker.

![CI]([![Playwright tests](https://github.com/MaryamKordi-Qa/kanboard-playwright-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/MaryamKordi-Qa/kanboard-playwright-e2e/actions/workflows/playwright.yml))

## What is tested

UI tests
- Create a task, including validation for an empty title
- Edit a task title
- Delete a task
- Move a task to another column (drag and drop)

API tests (Kanboard JSON-RPC)
- Create a task
- Delete a task
- A request with an invalid token is rejected (401)

## Tech stack

- Playwright + TypeScript
- Page Object Model
- Kanboard JSON-RPC API
- Docker (Kanboard environment)
- GitHub Actions (CI)

## Project structure

api/          API helper (TaskApi)
pages/        Page Objects (LoginPage, BoardPage, TaskPage)
test-data/    Test data and helpers
tests/
  auth.setup.ts   Logs in once and saves the session
  tasks/          UI tests
  api/            API tests
docker/           Kanboard config (generated in CI)
## Getting started

1. Create docker/config.php (raises the login captcha and lockdown thresholds so repeated test logins are not blocked):
  
   <?php
   define('BRUTEFORCE_CAPTCHA', 1000);
   define('BRUTEFORCE_LOCKDOWN', 2000);
   
2. Start Kanboard:
  
   docker run -d --name kanboard -p 8080:80 \
     -v "$(pwd)/docker/config.php:/var/www/app/data/config.php" \
     kanboard/kanboard:latest
   
3. Install dependencies:
  
   npm install
   npx playwright install
   
4. Create a .env file (see .env.example):
  
   BASE_URL=http://localhost:8080
   KANBOARD_API_TOKEN=your_api_token
   
   The API token is in Kanboard under Settings > API.
5. Run the tests:
  
   npx playwright test
   
6. Open the report:
  
   npx playwright show-report
   
## How the tests are built

- Login once. A setup project logs in as admin, makes sure the QA Automation Practice project exists, and saves the session. All other tests reuse it.
- API for test setup and cleanup. Tests create and remove their data through Kanboard's JSON-RPC API (api/TaskApi.ts) instead of the UI.
  - Faster and more stable: a failure while creating test data does not fail a test that checks something else (for example, the delete test does not depend on the create form).
  - Always clean: created tasks are removed in a finally block, so the board stays clean even when a test fails.
  - The create test is the exception: it creates the task through the UI, because that is the behavior under test. Only its cleanup uses the API (the task is found by its title).
- Unique test data. Every task title has a timestamp suffix, so runs never collide.
- CI. The workflow generates docker/config.php, starts a fresh Kanboard in Docker, waits until it responds, runs all tests, and uploads the HTML report and traces.

## Challenges and how I solved them

- Repeated titles. Each run creates a new task, so a fixed title made locators match several cards after a few runs (strict mode violation). Titles now get a timestamp suffix, so every run is independent.
- Two links per card. Task cards have more than one link (the edit icon and the title), so I locate the card through the link's visible text, not by role alone.
- Works locally, fails in CI. My first locator relied on the title attribute of the task link. It worked locally, but failed in CI, because my local board used a different card layout than a fresh Kanboard. Finding this took a run on a clean environment, which is the reason I set up CI.
- Random login failures. Kanboard shows a captcha after a few failed logins for the same user, so the error message never appeared. I raised the thresholds in docker/config.php.
- Parallel runs. Tests were flaky when run in parallel, because all workers share one admin account and one SQLite database. I run them with a single worker.
- Two columns with the same id. My first column locator matched two elements (strict mode violation). Kanboard renders an expanded and a collapsed version of every column, so the locator now targets only the expanded one.
- Flaky drag and drop. The move test passed only some of the time. In the Playwright trace I saw that the board's save request (POST ... action=save) was canceled: my test reloaded the page right after the drop, and the reload cancelled the request, so the task went back to the first column. The page showed the new position, but the server never saved it. The fix is to wait for the save response before continuing (waitForResponse, created before the mouse is released).
- Drag and drop on other browsers and a crowded board. After that fix the test still failed on WebKit and sometimes on a long board. On WebKit the drop was not registered when the mouse jumped to the target in one move, so the mouse now moves in steps. On a board with many tasks the card could be below the visible area, so the mouse missed it. Now the card is scrolled into view before the drag. After these fixes the move test passed on all three browsers in CI.
- API returns 401 in CI. A fresh Kanboard in CI generates its own API token, so the token from my local setup was rejected and every test that used the API failed. The workflow now generates docker/config.php and sets API_AUTHENTICATION_TOKEN from a GitHub secret, so the server and the tests use the same token. The token is never committed.

## Known issues

- On Firefox in CI, a few tests (create, edit, delete, move) are sometimes flaky. The task form is only partly rendered: the Description field or the Save button is missing, and the test times out. They pass on retry. I could not reproduce this on my machine in 10 runs and I have not found the cause. My guess is that a click happens before Kanboard's JavaScript is ready, but I have not proven it.
- The Docker command uses the latest Kanboard image, so a future version of Kanboard may behave differently from the one I tested with.

## To do

- More negative tests for forms
- Comments and subtasks
- Find the cause of the Firefox flakiness in CI