import asyncio
from playwright.async_api import async_playwright

async def validate_page_title():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Step 1: Navigate to sample page
        await page.goto("https://example.com")

        # Step 2: Fetch page title
        title = await page.title()
        print("Page Title:", title)

        # Step 3: Assert title
        expected_title = "Example Domain"
        assert title == expected_title, f"Title mismatch! Expected: {expected_title}, Got: {title}"
        print("Title validation passed!")

        await browser.close()

asyncio.run(validate_page_title())
