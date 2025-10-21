const puppeteer = require('puppeteer');

(async () => {
  const base = 'http://localhost:3000/BudgetIQ';
  const dashboard = base + '#/dashboard';
  const accounts = base + '#/accounts';

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Intercept API calls and return mock responses to avoid hitting remote backend
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('/api/accounts')) {
      // Return empty accounts by default
      req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    if (url.includes('/api/transactions')) {
      req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }
    // Fallback to continue for other requests (static files, etc.)
    req.continue();
  });

  // Inject localStorage before any scripts run
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('token', 'fake-token-123');
    localStorage.setItem('user', JSON.stringify({ id: 'u-1', name: 'Puppeteer Test' }));
  });

  page.on('console', msg => console.log(`${msg.type().toUpperCase()}: ${msg.text()}`));
  page.on('pageerror', err => console.log('PAGEERROR:', err.toString()));

  await page.goto(dashboard, { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('NAVIGATED TO DASHBOARD');

  try {
    await page.waitForSelector('[data-testid="quick-add-fab"]', { visible: true, timeout: 5000 });
    console.log('FOUND quick-add-fab');
    await page.click('[data-testid="quick-add-fab"]');
    console.log('Clicked quick-add-fab');
    await page.waitForSelector('[data-testid="quick-add-submit"]', { visible: true, timeout: 5000 });
    console.log('Quick Add dialog opened');
  } catch (e) {
    console.log('quick-add-fab/quick-add dialog failed:', e.message);
  }

  try {
    await page.goto(accounts, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('[data-testid="add-account-btn"]', { visible: true, timeout: 5000 });
    console.log('FOUND add-account-btn');

    const strategies = [
      async () => await page.click('[data-testid="add-account-btn"]'),
      async () => await page.evaluate(() => { const el = document.querySelector('[data-testid="add-account-btn"]'); if (el) el.click(); }),
      async () => await page.evaluate(() => { const el = document.querySelector('[data-testid="add-account-btn"]'); if (el) ['pointerdown','mousedown','mouseup','click'].forEach(t=>el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }))); })
    ];

    let opened = false;
    for (const strat of strategies) {
      try { await strat(); } catch (e) { /* ignore */ }
      try {
        await page.waitForSelector('[data-testid="submit-account-btn"]', { visible: true, timeout: 3000 });
        opened = true;
        break;
      } catch (e) {
        // continue to next strategy
      }
    }

    if (opened) {
      console.log('Add Account dialog opened');
    } else {
      console.log('submit-account-btn not found within attempts, gathering DOM diagnostics for debugging');
      const diagnostics = await page.evaluate(() => {
        const info = {};
        info.bodySnippet = document.body.innerHTML.slice(0, 8000);
        const els = Array.from(document.querySelectorAll('[data-testid="submit-account-btn"]'));
        info.submitCount = els.length;
        info.submits = els.map(el => ({ outerHTML: el.outerHTML ? el.outerHTML.slice(0,2000) : '', disabled: el.disabled, hidden: el.hidden, style: window.getComputedStyle(el).cssText, rect: el.getBoundingClientRect() }));
        const dialogs = Array.from(document.querySelectorAll('[role="dialog"], .dialog-content, [data-state]'));
        info.dialogCount = dialogs.length;
        info.dialogs = dialogs.map(d => ({ outerHTML: d.outerHTML ? d.outerHTML.slice(0,2000) : String(d), style: window.getComputedStyle(d).cssText }));
        const portalCandidates = Array.from(document.body.children).map(c => ({ tag: c.tagName, id: c.id, class: c.className, innerStart: c.innerHTML ? c.innerHTML.slice(0,500) : '' }));
        info.portalCandidates = portalCandidates.slice(0,50);
        return info;
      });

      console.log('DIAGNOSTICS: submitCount=', diagnostics.submitCount);
      diagnostics.submits.forEach((s, i) => {
        console.log(`SUBMIT[${i}] outerHTML:`, s.outerHTML);
        console.log(`SUBMIT[${i}] disabled:`, s.disabled, 'hidden:', s.hidden, 'rect:', JSON.stringify(s.rect));
        console.log(`SUBMIT[${i}] style:`, s.style.slice(0,200));
      });
      console.log('DIAGNOSTICS: dialogCount=', diagnostics.dialogCount);
      diagnostics.dialogs.forEach((d, i) => {
        console.log(`DIALOG[${i}] outerHTML start:`, d.outerHTML);
        console.log(`DIALOG[${i}] style:`, d.style.slice(0,200));
      });
      console.log('DIAGNOSTICS: portalCandidates (first 10):');
      diagnostics.portalCandidates.slice(0,10).forEach((p, i) => {
        console.log(`PORTAL[${i}] tag=${p.tag} id=${p.id} class=${p.class} innerStart=${p.innerStart.slice(0,200)}`);
      });

      throw new Error('submit-account-btn not found');
    }
  } catch (e) {
    console.log('add-account-btn/add-account dialog failed:', e.message);
  }

  await browser.close();
  console.log('DONE');
})();