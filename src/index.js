  import { browser } from "./scrapper/browser.js";
  import { goToRootKenya } from './scrapper/scrape-listings.js';
  import {goToRootEthiopia} from './scrapper/scrape-listings-Ethiopia.js'
  import { visitListingsPage } from './scrapper/scrape-listings-South-Africa.js';
  import {goToRootNigeria} from './scrapper/scrape-listings-Nigeria.js'
  import {goToRootGhana} from './scrapper/scrape-listings-Ghana.js'
  /* 
  This script will do the scraping without creating a server

  */
  const browserInstance=await browser();
  export const testScrapers=()=>{
  try{
    goToRootKenya(browserInstance);
  }
  catch(ex){
    console.log(ex)
  }

  try{
    goToRootNigeria(browserInstance)
  }
  catch(ex){
    console.log(ex)
  }

  try{
    visitListingsPage(browserInstance);
  }
  catch(ex){
    console.log(ex)
  }

  try{
    goToRootGhana(browserInstance)
  }
  catch(ex){
    console.log(ex)
  }
  try{
    console.log("calling the Ethiopia Scraper");
    goToRootEthiopia(browserInstance)
  }
  catch(ex){
    console.log(ex)
  }
  }
  testScrapers();