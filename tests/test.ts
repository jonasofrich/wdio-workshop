import { browser, expect } from "@wdio/globals";
import assert from "node:assert";

const runLocal = browser.isSauce ? describe.skip : describe;
const runSauce = browser.isSauce ? describe : describe.skip;

describe("example test", () => {
    it("should be able to complete todos", async () => {
        await browser.url("https://vue-todomvc.webdriver.io/", {
            onBeforeLoad: () => {
                localStorage.setItem("vue-todomvc", JSON.stringify([{
                    "id": 1,
                    "title": "First",
                    "completed": false
                  }, {
                    "id": 2,
                    "title": "Second",
                    "completed": false
                  }, {
                    "id": 3,
                    "title": "Third",
                    "completed": false
                  }]))
            }
        });
        //const todoInput = browser.$('.new-todo');
        //await todoInput.setValue("first\nsecond\nthird\n");
        const secondToggleInput = browser.$('.todo-list li:nth-child(2)').$('.toggle'); 
        await secondToggleInput.click();
        const remainingItems = await browser.$$('.todo').length - await browser.$$('.completed').length;
        expect(remainingItems).toBe(2);
    })
});

runLocal("lighthouse (local)", () => {

  before(async () => {
    await browser.emulateDevice('iPhone X')
    await browser.enablePerformanceAudits({
      networkThrottling: 'Good 3G',
      formFactor: 'mobile',
      cpuThrottling: 4
    });
  })

  it("should load with good performance score", async () => {
      await browser.url("https://vue-todomvc.webdriver.io/");
      const score = await browser.getPerformanceScore()
      const metrics = await browser.getMetrics();
      console.log("Score: " + score);
      console.log("Speed index: " + metrics.speedIndex);
      assert.ok(score >= .8);
      assert.ok(metrics.speedIndex < 1500);
  })

  after(async () => {
    await browser.disablePerformanceAudits();
  })
});


runSauce("lighthouse (cloud)", () => {

  before(async () => {
    await browser.emulateDevice('iPhone X')
    await browser.enablePerformanceAudits({
      networkThrottling: 'Good 3G',
      formFactor: 'mobile',
      cpuThrottling: 4
    });
  })

  it("should load with good speed index", async () => {
      await browser.url("https://vue-todomvc.webdriver.io/");
      const score = await browser.getPerformanceScore()
      const metrics = await browser.getMetrics();
      console.log("Score: " + score);
      console.log("Speed index: " + metrics.speedIndex);
      assert.ok(score >= .8);
      assert.ok(metrics.speedIndex < 1500);
  })

  after(async () => {
    await browser.disablePerformanceAudits();
  })
});

runLocal("check PWA", () => {
  it("should be PWA", async () => {
      await browser.url("https://webdriver.io/");
      const result = await browser.checkPWA();
      console.log("ISPWA")
      console.log(result)
      expect(result.passed).toBe(true);
  })
});