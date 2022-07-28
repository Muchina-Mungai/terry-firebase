  import puppeteer from "puppeteer-extra";
  import  StealthPlugin from 'puppeteer-extra-plugin-stealth';
  import  AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
  puppeteer.use(StealthPlugin());
  puppeteer.use(AdblockerPlugin({blockTrackers:true}));
  export const browser=async ()=>{
  return await puppeteer.launch({
    headless:false,
    args:['--no-sandbox','--disable-setuid-sandbox'],
    defaultViewport:null
})}

 