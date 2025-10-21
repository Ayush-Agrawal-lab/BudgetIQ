const puppeteer = require('puppeteer');

(async () => {
  const url = 'http://localhost:3000/BudgetIQ';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', msg => {
    logs.push({type: msg.type(), text: msg.text()});
    console.log(`${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log('PAGEERROR:', err.toString());
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('PAGE LOADED');

  // Try opening Quick Add FAB
  try {
    await page.waitForSelector('[data-testid="quick-add-fab"]', {visible: true, timeout: 5000});
    await page.click('[data-testid="quick-add-fab"]');
    console.log('Clicked Quick Add FAB');
    await page.waitForSelector('[data-testid="quick-add-submit"]', {visible: true, timeout: 5000});
    console.log('Quick Add dialog opened');
  } catch (e) {
    console.log('Quick Add open failed:', e.message);
  }

  // Try opening Add Account
  try {
    await page.waitForSelector('[data-testid="add-account-btn"]', {visible: true, timeout: 5000});
    await page.click('[data-testid="add-account-btn"]');
    console.log('Clicked Add Account');
    await page.waitForSelector('[data-testid="submit-account-btn"]', {visible: true, timeout: 5000});
    console.log('Add Account dialog opened');
  } catch (e) {
    console.log('Add Account open failed:', e.message);
  }

  // Collect any console warnings that contain 'Warning' or 'aria' or 'Description'
  // Already printed via page.on('console')

  await browser.close();
  console.log('Browser closed');
})();
