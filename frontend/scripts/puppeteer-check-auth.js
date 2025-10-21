const puppeteer = require('puppeteer');

(async () => {
  const base = 'http://localhost:3000/BudgetIQ';
  const dashboard = base + '#/dashboard';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`${msg.type().toUpperCase()}: ${msg.text()}`));
  page.on('pageerror', err => console.log('PAGEERROR:', err.toString()));

  // Preload localStorage with fake auth
  await page.goto(base, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.setItem('token', 'fake-token-123');
    localStorage.setItem('user', JSON.stringify({ id: 'u-1', name: 'Puppeteer Test', email: 'puppeteer@example.com' }));
  });

  // Navigate to dashboard which requires auth
  await page.goto(dashboard, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('NAVIGATED TO DASHBOARD');

  try {
    await page.waitForSelector('[data-testid="quick-add-fab"]', { visible: true, timeout: 5000 });
    console.log('FOUND quick-add-fab');
  } catch (e) {
    console.log('quick-add-fab NOT FOUND:', e.message);
  }

  try {
    // Navigate to accounts page to find add-account button
    await page.goto(base + '#/accounts', { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('[data-testid="add-account-btn"]', { visible: true, timeout: 5000 });
    console.log('FOUND add-account-btn');
  } catch (e) {
    console.log('add-account-btn NOT FOUND:', e.message);
  }

  // Keep console logs printed then close
  await browser.close();
  console.log('DONE');
})();
