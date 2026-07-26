# DevShop testing instructions
Generate stable Playwright tests for the live app using process.env.TARGET_URL.
Use role-based selectors.
Do not use fixed waits like page.waitForTimeout().

## Required Test cases
1. Load Home page.
2. select category from the dropdown as gaming.
3. Add 3 product from the Product list bellow.
4. Complete checkout process.