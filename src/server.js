  import express from 'express';
  import { Router } from 'express';
  import dotenv from 'dotenv';
  import { browser } from "./scrapper/browser.js";
  import { goToRootKenya } from './scrapper/scrape-listings.js';
  import {goToRootEthiopia} from './scrapper/scrape-listings-Ethiopia.js'
  import { visitListingsPage } from './scrapper/scrape-listings-South-Africa.js';
  import {goToRootNigeria} from './scrapper/scrape-listings-Nigeria.js'
  import {goToRootGhana} from './scrapper/scrape-listings-Ghana.js'
  dotenv.config();
  const browserInstance=await browser();
  const router=Router();
  const app=express();
  app.use('/scraper',router);
  router.get("/kenya",(req,res)=>{
    try{
      goToRootKenya(browserInstance);
      res.send("Scraping from the Kenyan Website")
    }
    catch(ex){
      console.log(ex);
      
    }
  });
  router.get('/ethiopia',(req,res)=>{
    try{
      goToRootEthiopia(browserInstance);
      res.send("Scraping from the Ethiopian Website")
    }
    catch(ex){
      console.log(ex);
      
    }
  })
  router.get('/ghana',(req,res)=>{
    try{
      res.send("Scraping from the Ghanaian Website")
      goToRootGhana(browserInstance);
    }
    catch(ex){
      console.log(ex);
      
    }
  }); 
  router.get('/nigeria',(req,res)=>{
    try{
      res.send("Scraping from the Nigerian Website");
      goToRootNigeria(browserInstance)
    }
    catch(ex){
      console.log(ex);
      
    }
  });
  router.get('/south-africa',(req,res)=>{
    try{
      res.send("Scraping from the South African Website")
      visitListingsPage(browserInstance);
    }
    catch(ex){
      console.log(ex);
      
    }
  });
  const PORT=process.env.PORT||5000;
  app.listen(PORT,()=>{
    console.log(`App started on port ${PORT}`);
  })