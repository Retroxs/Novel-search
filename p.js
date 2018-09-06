const puppeteer = require('puppeteer');
const chalk = require('chalk')
exports.search = async (keyword) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.panduoduo.net');
    // 点击搜索框拟人输入
    console.log(chalk.green(`正在搜索 ${keyword}...`))
    await page.type('#k', keyword, {delay: 100});
    await page.keyboard.press('Enter');
    await page.waitFor(2000);
    const href = await page.$eval('.search-page .row h3 a',e=>e.href);
    await page.goto(href);
    const resourceLink = await page.$eval('.dbutton2',e=>e.href);
    console.log(chalk.yellow('搜索结果: '+ resourceLink))
    await browser.close();
    return resourceLink;
}



