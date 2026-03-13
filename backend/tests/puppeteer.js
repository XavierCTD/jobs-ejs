const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword } = require("../utils/seed_db");

let testUser = null;

let page = null;
let browser = null;

describe("jobs-ejs puppeteer test", function () {
  before(async function () {
    this.timeout(10000);
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });

  describe("index page test", function () {
    this.timeout(10000);
    it("finds the welcome title", async () => {
      await page.waitForSelector("h1 ::-p-text(Welcome to CoderPlanet-X!)");
    });
    it("opens notes page from nav", async () => {
      const notesLink = await page.waitForSelector("a ::-p-text(Notes)");
      await notesLink.click();
      await page.waitForNavigation();
      await page.waitForSelector("h1 ::-p-text(Notes)");
    });
  });

  describe("notes page test", function () {
    this.timeout(20000);
    it("resolves the create note form", async () => {
      await page.waitForSelector("h3 ::-p-text(Create Note)");
      await page.waitForSelector('input[type="text"]');
      await page.waitForSelector('textarea[placeholder="Type Here"]');
      await page.waitForSelector("button ::-p-text(Add note)");
    });
  });
});
