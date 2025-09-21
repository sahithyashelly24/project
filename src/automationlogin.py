import asyncio
from playwright.async_api import async_playwright

async def automate_login():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # headless=False to see browser
        page = await browser.new_page()
        
        # Step 1: Open login page
        await page.goto("https://auth.techademy.com/realms/IBM/protocol/openid-connect/auth?client_id=public-techademy-client&redirect_uri=https%3A%2F%2Fone.techademy.com%2Fmain%2FIBM&state=074424d1-76c8-4700-96bf-2fc6657e11e7&response_mode=fragment&response_type=code&scope=openid&nonce=9e5ff32a-ab60-4820-8152-e182a54197b3&login")  # Replace with real login URL
        
        # Step 2: Fill in credentials
        await page.fill("#username", "testuser")       # Replace with actual selector
        await page.fill("#password", "password123")    # Replace with actual selector
        
        # Step 3: Click login
        await page.click("#loginButton")               # Replace with actual selector
        
        # Verify dashboard redirection
        await page.wait_for_url("https://one.techademy.com/main/IBM")  # Replace with actual dashboard URL
        print("Login Successful and Dashboard Loaded")
        
        await browser.close()

# Run the task
asyncio.run(automate_login())
