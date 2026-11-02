# kanboard-playwright-e2e



![Playwright tests](https://github.com/MaryamKordi-Qa/kanboard-playwright-e2e/actions/workflows/playwright.yml/badge.svg)



UI tests for [Kanboard](https://kanboard.org/), written with Playwright and TypeScript. I built this to practice test automation on a real kanban app instead of a toy demo page. Kanboard runs in Docker, both on my machine and in CI, so the tests don't depend on any external site.

## What's in here

pages/       page objects (LoginPage, BoardPage, TaskPage)
tests/       spec files and the auth setup
test-data/   users and task data
docker/      config for the Kanboard test instance
.github/     GitHub Actions workflow
I used the Page Object Model so selectors live in one place. If Kanboard's markup changes, I fix a locator in a page class instead of editing every test.

## Running it locally

You need Node.js and Docker.

1. Start Kanboard:

  
   docker run -d --name kanboard -p 8080:80 \
     -v kanboard_data:/var/www/app/data \
     -v kanboard_plugins:/var/www/app/plugins \
     kanboard/kanboard:latest
   
   Kanboard will be available at http://localhost:8080.

2. Copy the test config into the container. It raises the brute-force limits so the wrong-password tests don't trigger a captcha:

  
   docker cp docker/config.php kanboard:/var/www/app/data/config.php
   
3. A fresh Kanboard install has the default login admin / admin. Log in once and change the password.

4. Install dependencies and browsers:

  
   npm install
   npx playwright install
   
5. Copy .env.example to .env and fill in your values:

  
   KANBOARD_PASSWORD=your-admin-password
   BASE_URL=http://localhost:8080
   
6. Run the tests:

  
   npx playwright test
   
   Add --headed to watch the browser, or run npx playwright show-report after a run to open the HTML report.

The project the tests use (QA Automation Practice) is created by the auth setup if it doesn't exist yet, so there is nothing to prepare by hand.

## CI

The workflow in .github/workflows/playwright.yml runs on every push and pull request to main:

- starts a fresh Kanboard container and mounts docker/config.php
- waits until the app answers
- runs the whole suite on Chromium, Firefox and WebKit
- uploads the HTML report every time, and traces and screenshots when something fails

Every run starts from an empty Kanboard, so the tests can't depend on leftovers from earlier runs.

## Current coverage

- Login: valid credentials, wrong password, nonexistent username, empty username, empty password
- Login is done once in auth.setup.ts and the session is reused through storageState
- Create a task from the board, check it shows up, open it and check the description

I'd rather add tests one at a time and keep them stable than write a lot of flaky ones.

## Things I ran into

- Each run creates a new task, so a fixed title made locators match several cards after a few runs (strict mode violation). Titles now get a timestamp suffix so every run is independent.
- Task cards have more than one link (edit icon and title), so I locate the card through the link's visible text, not by role alone.
- My first locator relied on the title attribute of the task link. It worked locally, but failed in CI: my local board used a different card layout than a fresh Kanboard. Finding this took a run on a clean environment, which is the reason I set up CI.
- The login tests failed randomly. Kanboard shows a captcha after a few failed logins for the same user, so the error message never appeared. I raised the thresholds in docker/config.php.
- Tests were still flaky when run in parallel, because all workers share one admin account and one SQLite database. I run them with a single worker.

## To do

- Edit and delete task
- Drag and drop between columns, with a check after reload