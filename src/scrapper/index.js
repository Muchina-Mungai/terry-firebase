  import { goToRootKenya } from './scrapper/scrape-listings.js';
  import {goToRootEthiopia} from './scrapper/scrape-listings-Ethiopia.js'
  import { visitListingsPage } from './scrapper/scrape-listings-South-Africa.js';
  import {goToRootNigeria} from './scrapper/scrape-listings-Nigeria.js'
  import {goToRootGhana} from './scrapper/scrape-listings-Ghana.js'
  /* 
  This script will do the scraping without creating a server

  */
  export const testScrapers=()=>{
  try{
    goToRootKenya();
  }
  catch(ex){
    console.log(ex)
  }

  try{
    goToRootNigeria()
  }
  catch(ex){
    console.log(ex)
  }

  try{
    visitListingsPage();
  }
  catch(ex){
    console.log(ex)
  }

  try{
    goToRootGhana()
  }
  catch(ex){
    console.log(ex)
  }
  try{
    goToRootEthiopia()
  }
  catch(ex){
    console.log(ex)
  }
  }