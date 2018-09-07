const puppeteer = require("puppeteer");
const chalk = require("chalk");
const Novel = require("./db");
const { insertNovel, findByName,updateCounter } = Novel;
async function search(keyword) {
  console.log(chalk.green(`正在搜索数据库 ${keyword}...`));
  let novel = await findByName(keyword);
  if(novel){
    console.log(chalk.yellow("搜索结果: " + novel.resourceLink));
    updateCounter(novel);
    return novel.resourceLink;
  }
  else{
    console.log(chalk.red(`未找到 ${keyword} 相关数据...`));
    let searchRes = await searchBySpy(keyword);
    if(searchRes) return searchRes;
    else return '暂时找不到相关数据,请尝试输入其他关键字'
  }
}

const searchBySpy = async keyword => {
  let resourceLink;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://www.panduoduo.net");
  // 点击搜索框拟人输入
  console.log(chalk.green(`正在尝试网盘搜索 ${keyword}...`));
  await page.type("#k", keyword, { delay: 100 });
  await page.keyboard.press("Enter");
  await page.waitFor(500);
  const textTypeBtn = await page.$(
    "[title='搜索文件类型：txt pdf chm rtf epub mobi azw azw3 kfx']"
  );
  await textTypeBtn.click();
  await page.waitFor(500);
  try {
    const href = await page.$eval(".search-page .row h3 a", e => e.href);
    await page.goto(href);
    resourceLink = await page.$eval(".dbutton2", e => e.href);
    Novel.insertNovel({name:keyword,resourceLink})
    console.log(chalk.yellow("网盘搜索结果: " + resourceLink));
    console.log(chalk.green('录入本地数据库中...'));
    await browser.close();
    return resourceLink;
  } catch (err) {
    console.log(chalk.red(`网盘未找到 ${keyword} 相关数据...`));
    await browser.close();
    return null;
  }
};

module.exports = {
  search
}
