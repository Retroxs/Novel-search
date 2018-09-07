const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let a = await page.goto("http://pdd.19mi.net/go/48918651");
  await page.waitFor(1000);
  let target = await page.target();
  let url = await target.url();
  console.log(url);
})();
