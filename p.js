const puppeteer = require("puppeteer");
const chalk = require("chalk");
const Novel = require("./db");
const { insertNovel, findByName, updateCounter } = Novel;

async function search(keyword) {
  console.time("searchTime");
  console.log(chalk.green(`正在搜索数据库 ${keyword}...`));
  let novel = await findByName(keyword);
  if (novel) {
    console.log(chalk.yellow("搜索结果: " + novel.resourceLink));
    updateCounter(novel);
    console.timeEnd("searchTime");
    return novel.resourceLink;
  } else {
    console.log(chalk.red(`未找到 ${keyword} 相关数据...`));
    let searchRes = await searchBySpy(keyword);
    if (searchRes) {
      console.timeEnd("searchTime");
      return searchRes;
    } else {
      console.timeEnd("searchTime");
      return "暂时找不到相关数据,请尝试输入其他关键字";
    }
  }
}

function generateUrl(keyword) {
  return `http://www.panduoduo.net/s/comb/n-${keyword}&f-f2`;
}

async function parseOriginUrl(page, url) {
  let a = await page.goto(url);
  await page.waitFor(1000);
  let target = await page.target();
  let originUrl = await target.url();
  return originUrl;
}

const searchBySpy = async keyword => {
  let resourceLink;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(generateUrl(keyword));
  console.log(chalk.green(`正在尝试网盘搜索 ${keyword}...`));
  try {
    const href = await page.$eval(".search-page .row h3 a", e => e.href);
    await page.goto(href);
    let pddLink = await page.$eval(".dbutton2", e => e.href);
    resourceLink = await parseOriginUrl(page, pddLink);
    insertNovel({ name: keyword, resourceLink });
    console.log(chalk.yellow("网盘搜索结果: " + resourceLink));
    console.log(chalk.green("录入本地数据库中..."));
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
};
