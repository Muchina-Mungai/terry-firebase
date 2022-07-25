  import { browser } from "./browser.js";
  import fs from 'fs/promises';
  const browserInstance=await browser();
  const page=async(link)=>{
    const page=await browserInstance.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(link);
    return page;
    
  }
    const propertyListings=[];
    const goToRoot=async(link)=>{
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
  
    const nextPage=await browserTab.$$eval("ul.pagination> li:last-child > a"
    ,anchors=>{
      return anchors.map(anchor=>{
        try{
          return anchor.href
        }
        catch(ex){
          return false;
        }
      
      })
    });
    console.log(properties[0]);
    for(const propertyListing of properties){
      propertyListings.push(await visitProductPage(propertyListing));
    }
    fs.appendFile('data.txt',propertyListings.join(','));
    }
  /**
    * 
    * @param {*} link 
    * The actual scraping of one property will be done in this function
    */
    const visitProductPage=async(productObject)=>{
      let link=productObject.readMore;
      const productPage=await page(link);
      /* Data to fetch
      listing document fields:
bathrooms: (int),,city:(string),
furnished:bool,geolocation:map,lat:number,lng:number,imgUrls:(array of strings)
,name:(string,offer:tru,parking: boolea,regularPrice: (string)
type: “buy”,userRef: "webscraper",email: (string),phoneNumber: (string)

      */
      await productPage.click(".btn.btn-base.showPhone");
      const phone=await productPage.$eval(
        "span[data-type='phoneNumber']>a.underline"
        ,anchor=>anchor.textContent
        );
      const images=await productPage.$$eval(".lSPager.lSGallery>li>a>img"
      ,imgs=>{
        return imgs.map(img=>img.src);
      });
      productObject["imgUrls"]=images;
      productObject["phoneNumber"]=phone;
      productObject["description"]=await productPage.$eval(
        "p[itemprop='description']",paragraph=>paragraph.textContent);
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
    goToRoot("https://kenyapropertycentre.com/for-sale");

 

 
 
