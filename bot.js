const login = require("facebook-chat-api");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const downloadPath = path.resolve("./download");
const delay = ms => new Promise(res => setTimeout(res, ms));

var files = fs.readdirSync(__dirname + "/download");
let fileNameToUpload = "";

const credential = {
  appState: JSON.parse(fs.readFileSync("appstate.json", "utf-8")),
};

const regexTikTokLink = new RegExp(
"^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|vm\.tiktok\.com\/|tiktok\.com\/)?"
);

// Create simple echo bot
login(credential, (err, api) => {
  if (err) return console.error(err);

  api.setOptions({ selfListen: true });

  api.listenMqtt((err, message) => {
    console.log(regexTikTokLink.test(message.body));
    if (regexTikTokLink.test(message.body)) {
      download(downloadPath, message.body).then(async () => {
          console.log("SEND MESSAGE");
          console.log("filename =",fileNameToUpload);
          await delay(5000)
          var files = fs.readdirSync(__dirname + "/download");
          for (var i in files) {
            if (path.extname(files[i]) === ".mp4") {
                console.log[files[i]]
              fileNameToUpload = "" + __dirname + "/download/" + files[i];
            }
          }

          var msg = {
            body: "Hey!",
            attachment: fs.createReadStream(fileNameToUpload),
          };
          console.log("ready to run")
          console.log(msg)
          console.log(fileNameToUpload)
          
          await api.sendMessage(msg, message.threadID).then(() => console.log("Sent"));
      });
    }
  });
});

async function download(downloadPath, url) {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto("https://snaptik.app/");

  await page.focus("#url");
  await page.keyboard.type(url);
  await page.click("#submiturl");
  await page.waitForSelector("#download-block > div > a:nth-child(1");
  await page.screenshot({ path: "screenshot.png" });
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });
  await page.click("#download-block > div > a:nth-child(1)");
  await page.screenshot({ path: "screenshot.png" });
}
