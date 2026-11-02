# kanboard-playwright-e2e

UI tests for [Kanboard](https://kanboard.org/), written with Playwright and TypeScript. I built this to practice test automation on a real kanban app instead of a toy demo page. Kanboard runs locally in Docker, so the tests don't depend on any external site.

## What's in here

pages/       page objects (LoginPage, BoardPage, TaskPage)
tests/       spec files
test-data/   users and task data
docs/        notes
I used the Page Object Model so selectors live in one place. If Kanboard's markup changes, I fix a locator in a page class instead of editing every test.

## Running it

You need Node.js and Docker.

1. Start Kanboard:

  
   docker run -d --name kanboard -p 8080:80 \
     -v kanboard_data:/var/www/app/data \
     -v kanboard_plugins:/var/www/app/plugins \
     kanboard/kanboard:latest
   
   Default login is admin / admin. Open the app once and create a project called QA Automation Practice, since the tests look for it by name.

   Kanboard will be available at http://localhost:8080.

   Then copy the test config into the container. It raises the brute-force limits so the wrong-password tests don't trigger a captcha:

  
   docker cp docker/config.php kanboard:/var/www/app/data/config.php

2. Install dependencies and browsers:

  
   npm install
   npx playwright install
   
3. Copy .env.example to .env and fill in the password.

4. Run the tests:

  
   npx playwright test
   
   Add --headed to watch the browser, or run npx playwright show-report after a run to open the HTML report.

## Current coverage

- Create a task from the board, check it shows up, open it and check the description

More is coming (see below). I'd rather add tests one at a time and keep them stable than write a lot of flaky ones.

## Things I ran into

- Each run creates a new task, so a fixed title made locators match several cards after a few runs (strict mode violation). Titles now get a timestamp suffix so every run is independent.
- Task cards have two links (edit icon and title), so I locate the card by the title link's title attribute instead of by role and text.
- The login tests failed randomly. Kanboard shows a captcha after a few failed logins for the same user, so the error message never appeared. I raised the thresholds in docker/config.php.
- Tests were still flaky when run in parallel, because all workers share one admin account and one SQLite database. I run them with a single worker.

## To do

- Login tests (valid and invalid credentials)
- Reuse login state between tests with storageState
- Edit and delete task
- Drag and drop between columns
- GitHub Actions pipeline with Kanboard started in a Docker service