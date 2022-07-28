  import { browser } from "./browser.js";
  import fs from 'fs/promises';
  import { addOneProperty } from "../database/write-listings.js";
  const firstPageUrl="https://kenyapropertycentre.com/for-sale";
  const COUNTRY="KENYA";
  const COLLECTION='LISTINGS';
  const browserInstance=await browser();
  const page=async(link)=>{
    const page=await browserInstance.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(link);
    return page;
    
  }
    const propertyListings=[];
    export const goToRootKenya=async(link=firstPageUrl)=>{
    const browserTab=await page(link);
    const properties=await browserTab.$$eval('.row.property-list'
    ,propertiesList=>{
      return propertiesList.map(property=>{
        let propertyInfo={};
        propertyInfo["readMore"]=property.querySelector('div.description>a').href
        try{ 
          propertyInfo["address"]=property.querySelector("address>strong").textContent
      }
        catch(ex){
          propertyInfo["address"]="NOT SET";
        }
        propertyInfo["price"]={
         currency:property.querySelector('span.pull-sm-left>span.price:first-child').textContent,
         value:property.querySelector('span.pull-sm-left>span.price:nth-child(2)').textContent
        }
        propertyInfo['title']=property.querySelector('a>h4.content-title').textContent

        return propertyInfo;
      });
    });
  
    const nextPage=await browserTab.$eval("ul.pagination> li:last-child > a"
    ,anchor=>{
        try{
          return anchor.href||false
        }
        catch(ex){
          return false;
        }
     
    });
    for(const propertyListing of properties){
     let completePropertyListing= await visitProductPage(propertyListing);
      await addOneProperty(completePropertyListing,COLLECTION,COUNTRY);
      await fs.appendFile(`${COUNTRY}-listing.json`,JSON.stringify(completePropertyListing,null,"\t"));
    }
    await browserTab.close();
    if(nextPage){
    goToRootKenya(nextPage);
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
      const images=await productPage.$$eval(".lSPager.lSGallery>li>a>img"
      ,imgs=>{
        return imgs.map(img=>img.src);
      });
      productObject["imgUrls"]=images;
      productObject["phoneNumber"]=phone;
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
      await productPage.click("a[href='#tab-map']");
      console.log(productObject);
      await productPage.waitForTimeout(4000);
      const mapData=await productPage.evaluate(async ()=>{
          try{
          let cordinates=[];
          let lat=await window.map?.getCenter().lat();
          let lng=await window.map?.getCenter().lng();
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

      console.log(productObject);
      await productPage.close();
      return productObject;
      
    }
    // goToRootKenya(firstPageUrl);

 

 
 
