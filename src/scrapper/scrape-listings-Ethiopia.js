  import { browser } from "./browser.js";
  import fs from 'fs/promises';
  import { addOneProperty } from "../database/write-listings.js";
  const firstPageUrl="https://ethiopiapropertycentre.com/for-sale";
  const COUNTRY="ETHIOPIA";
  const DB_COLLECTION="listings";
  const browserInstance=await browser();
  const page=async(link)=>{
    const page=await browserInstance.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(link);
    // await page.waitForTimeout(10000);

    return page;
    
  }
    const propertyListings=[];
    export const goToRootEthiopia=async(link=firstPageUrl)=>{
    const browserTab=await page(link);
    await browserTab.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');
    await browserTab.waitForSelector('.row.property-list');
    const properties=await browserTab.$$eval('.row.property-list',propertiesList=>{
      return propertiesList.map(property=>{
        let propertyInfo={};
        propertyInfo["readMore"]=property.querySelector('div.description>a').href
        try{ 
          propertyInfo["address"]=property.querySelector("address>strong").textContent
      }
        catch(ex){
          propertyInfo["address"]="NOT SET";
          
        }
        try{
          propertyInfo["price"]={
        currency:property.querySelector("span.pull-sm-left>span.price:first-child").textContent,
        value:property.querySelector('span.pull-sm-left>span.price:nth-child(2)').textContent
        }
      }
      catch(ex){
        console.log(ex);
        propertyInfo["price"]="Not Stated";
      }

        try{
        propertyInfo['title']=property.querySelector('a>h4.content-title').textContent
        }
        catch(ex){
          console.log(ex);
          propertyInfo['title']="Title not set";
        }

        return propertyInfo;
      });
    });
    const nextPage=await browserTab.$eval("ul.pagination>li:last-child>a"
    ,anchor=>{
        try{
          return anchor.href
        }
        catch(ex){
          return false;
        }
      
    
    });

    for(const propertyListing of properties){
    let completePropertyListing= await visitProductPage(propertyListing);
      await addOneProperty(completePropertyListing,DB_COLLECTION,COUNTRY);
      await fs.writeFile(`${COUNTRY}-listings.json`,JSON.stringify(completePropertyListing,null,"\t"));
    }
    console.log(`${nextPage?nextPage:"Next Page Not Available"}`);
    await browserTab.close();
    if(nextPage){
    goToRootEthiopia(nextPage);
    }
    return;
    }
  /**
    * 
    * @param {*} link 
    * The actual scraping of one property will be done in this function
    */
    const visitProductPage=async(productObject)=>{
      let link=productObject.readMore;
      const productPage=await page(link);
    try{
      await productPage.click(".btn.btn-base.showPhone");
      const phone=await productPage.$$eval(
        "span[data-type='phoneNumber']>a.underline"
        ,anchors=>{
          
          let phoneNums= anchors.map(anchor=>{
            return anchor.textContent
          })
          return [...new Set(phoneNums)];
        }
        );
      productObject["phoneNumber"]=phone;

    }
    catch(ex){
      productObject["phoneNumber"]="Not Specified";
      console.log(ex);
    }
    
      const images=await productPage.$$eval(".lSPager.lSGallery>li>a>img"
      ,imgs=>{
        return imgs.map(img=>img.src);
      });
      productObject["imgUrls"]=images;
      productObject["description"]=await productPage.$eval(
        "p[itemprop='description']",paragraph=>paragraph.textContent);
        productObject["tabulatedDetails"]=await productPage.$$eval(
          "table.table>tbody>tr>td",tableCells=>{
            var data={};
            tableCells.forEach(tableCell=>{
              try{
              let detail=(tableCell.textContent.split(":"));
              if(detail.length==2)
              data[`${detail[0].trim()}`]=detail[1].trim();
              }
              catch(ex){
                console.log(ex);
                return data;
              }
              console.log(data);
              
            }
            
            )
            return data;
          })
      try{
        await productPage.click("a[href='#tab-area-guide']");
        console.log(productObject);
        await productPage.waitForTimeout(4000);
        const mapData=await productPage.evaluate(async ()=>{
            let defaultCordinates="Not Available On Website";
            try{
            let cordinates=[];
            let lat=await window?.map?.getCenter().lat()||defaultCordinates;
            let lng=await window?.map?.getCenter().lng()||defaultCordinates;
            cordinates.push(lat);
            cordinates.push(lng);
            console.log(`Coordinates ${cordinates}`);
            return Promise.resolve([lat,lng]);
          }
          catch(ex){
            console.log(ex);
            return 0;
          }
        }
        )
        if(mapData.length==2)
        productObject["geolocation"]={
          lat:mapData[0],
          lng:mapData[1]
        }
      }
      catch(ex){
        console.log(ex);
      }
    

      console.log(productObject);
      await productPage.close();
      return productObject;
      
    }
    // goToRootEthiopia();





