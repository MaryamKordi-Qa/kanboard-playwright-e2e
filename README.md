# kanboard-playwright-e2e

End-to-end UI tests for [Kanboard](https://kanboard.org/), written with Playwright and TypeScript. I wrote them to show how I automate a real web app: readable page objects, tests that do not depend on each other, a CI pipeline, and honest notes about the problems I found along the way. Kanboard runs in Docker, both on my machine and in CI, so the tests do not depend on any external site.

## Project structure

```
pages/        page objects (LoginPage, BoardPage, TaskPage)
tests/        spec files and the auth setup
test-data/    users and task data
docker/       config for the Kanboard test instance
.github/      GitHub Actions workflow
```

I used the Page Object Model so selectors live in one place. If Kanboard's markup changes, I fix one locator in a page class instead of editing every test.

## Running it locally

You need Node.js and Docker.

1. Start Kanboard:

   ```
   docker run -d --name kanboard -p 8080:80 -v kanboard_data:/var/www/app/data -v kanboard_plugins:/var/www/app/plugins kanboard/kanboard:latest
   ```

   Kanboard will be available at http://localhost:8080.

2. Copy the test config into the container. It raises the brute-force limits so the wrong-password tests do not trigger a captcha:

   ```
   docker cp docker/config.php kanboard:/var/www/app/data/config.php
   ```

3. A fresh Kanboard install has the default login `admin` / `admin`. Log in once and change the password.

4. Install dependencies and browsers:

   ```
   npm install
   npx playwright install
   ```

5. Copy `.env.example` to `.env` and fill in your values:

   ```
   KANBOARD_PASSWORD=your-admin-password
   BASE_URL=http://localhost:8080
   ```

6. Run the tests:

   ```
   npx playwright test
   ```

   Add `--headed` to watch the browser, or run `npx playwright show-report` after a run to open the HTML report.

The tests run with a single worker (set in `playwright.config.ts`). The project the tests use (QA Automation Practice) is created by the auth setup if it does not exist yet, so there is nothing to prepare by hand.

## CI

The workflow in `.github/workflows/playwright.yml` runs on every push and pull request to `main`:

- starts a fresh Kanboard container and mounts `docker/config.php`
- waits until the app answers
- runs the whole suite on Chromium, Firefox and WebKit
- uploads the HTML report every time, and traces and screenshots when something fails

CI retries failed tests. A test that fails once and passes on retry is reported as flaky and does not fail the build. See "Known issues" below.

In CI every run starts from an empty Kanboard. On my machine tasks pile up between runs, so task titles get a timestamp suffix to keep tests independent. I do not clean up test data automatically yet.

## Current coverage

- **Login:** valid credentials, wrong password, nonexistent username, empty username, empty password. Login is done once in `auth.setup.ts` and the session is reused through `storageState`.
- **Create task:** create a task from the board, check it shows up, open it and check the description.
- **Create task (negative):** an empty title shows "The title is required" and the form stays open.
- **Edit task** and **delete task.**
- **Drag and drop:** move a task to another column and check the result again after a page reload.

I prefer to add tests one at a time and keep them stable instead of writing many flaky ones.

## Things I ran into

- **Repeated titles.** Each run creates a new task, so a fixed title made locators match several cards after a few runs (strict mode violation). Titles now get a timestamp suffix, so every run is independent.
- **Two links per card.** Task cards have more than one link (the edit icon and the title), so I locate the card through the link's visible text, not by role alone.
- **Works locally, fails in CI.** My first locator relied on the `title` attribute of the task link. It worked locally, but failed in CI, because my local board used a different card layout than a fresh Kanboard. Finding this took a run on a clean environment, which is the reason I set up CI.
- **Random login failures.** Kanboard shows a captcha after a few failed logins for the same user, so the error message never appeared. I raised the thresholds in `docker/config.php`.
- **Parallel runs.** Tests were flaky when run in parallel, because all workers share one admin account and one SQLite database. I run them with a single worker.
- **Two columns with the same id.** My first column locator matched two elements (strict mode violation). Kanboard renders an expanded and a collapsed version of every column, so the locator now targets only the expanded one.
- **Flaky drag and drop.** The move test passed only some of the time. In the Playwright trace I saw that the board's save request (`POST ... action=save`) was `canceled`: my test reloaded the page right after the drop, and the reload cancelled the request, so the task went back to the first column. The page showed the new position, but the server never saved it. The fix is to wait for the save response before continuing (`waitForResponse`, created before the mouse is released).
- **Drag and drop on other browsers and a crowded board.** After that fix the test still failed on WebKit and sometimes on a long board. On WebKit the drop was not registered when the mouse jumped to the target in one move, so the mouse now moves in steps. On a board with many tasks the card could be below the visible area, so the mouse missed it. Now the card is scrolled into view before the drag. After these fixes the move test passed on all three browsers in CI.

## Known issues

- On Firefox in CI, a few tests (create, edit, delete, move) are sometimes flaky. The task form is only partly rendered: the Description field or the Save button is missing, and the test times out. They pass on retry. I could not reproduce this on my machine in 10 runs and I have not found the cause. My guess is that a click happens before Kanboard's JavaScript is ready, but I have not proven it.
- The Docker command uses the `latest` Kanboard image, so a future version of Kanboard may behave differently from the one I tested with.

## To do

- Create and clean up test data through the Kanboard API instead of the UI
- More negative tests for forms
- Comments and subtasks
- Find the cause of the Firefox flakiness in CI