const puppeteer = require('puppeteer');

(async () => {
  const base = 'http://localhost:3000/BudgetIQ';
  const dashboard = base + '#/dashboard';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`PAGE_CONSOLE: ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log('PAGEERROR:', err.toString()));

  await page.goto(base, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('token', 'fake-token-123');
    localStorage.setItem('user', JSON.stringify({ id: 'u-1', name: 'Puppeteer Test' }));
  });

  await page.goto(dashboard, { waitUntil: 'networkidle2' });
  console.log('NAV TO DASHBOARD DONE');

  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('BODY LENGTH:', bodyHTML.length);

  console.log('HAS quick-add-fab:', bodyHTML.includes('quick-add-fab'));
  console.log('HAS add-account-btn:', bodyHTML.includes('add-account-btn'));

  // Print a small snippet around the add-account-btn if present
  if (bodyHTML.includes('add-account-btn')) {
    const idx = bodyHTML.indexOf('add-account-btn');
    console.log('SNIPPET around add-account-btn:', bodyHTML.substring(Math.max(0, idx-200), idx+200));
  }

  await browser.close();
  console.log('DONE');
})();