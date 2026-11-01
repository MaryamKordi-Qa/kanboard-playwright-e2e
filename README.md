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

  
   docker run -d --name kanboard -p 80:80 \
     -v kanboard_data:/var/www/app/data \
     -v kanboard_plugins:/var/www/app/plugins \
     kanboard/kanboard:latest
   
   Default login is admin / admin. Open the app once and create a project called QA Automation Practice, since the tests look for it by name.

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

## To do

- Login tests (valid and invalid credentials)
- Reuse login state between tests with storageState
- Edit and delete task
- Drag and drop between columns
- GitHub Actions pipeline with Kanboard started in a Docker service