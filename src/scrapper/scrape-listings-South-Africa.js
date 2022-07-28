  import { addOneProperty } from '../database/write-listings.js';
  import fs from 'fs/promises';
import {browser} from './browser.js';
  const startUrl="https://www.century21global.com/for-sale-residential/South-Africa";
  const COUNTRY="SOUTH AFRICA";
  const WRITE_FIRESTORE_COLLECTION="listings";
  var browserInstance=null;
  const makePage=async(link)=>{
    const page=await browserInstance.newPage();
    page.setDefaultNavigationTimeout(0);
    return page;
  }
  var listingsTab=false;
  var detailsTab=false;
 export const visitListingsPage=async(browser,link=startUrl)=>{
      browserInstance=(browserInstance)?browserInstance:(await browser);
      listingsTab=(listingsTab)?listingsTab:(await makePage());
      detailsTab=(detailsTab)?detailsTab:(await makePage());
      await listingsTab.goto(link);
      await listingsTab.waitForSelector('.search-result');
      const properties=await listingsTab.$$eval('.search-result',listings=>{
        return listings.map(listing=>{
          let propertyInfo={};
          propertyInfo["readMore"]=listing?.querySelector('a.search-result-info').href||false;
          propertyInfo["address"]=listing.querySelector(".property-address+span.search-result-label").textContent.trim();
          propertyInfo["geolocation"]={
            lat:listing.querySelector(".map-coordinates").getAttribute('data-lat'),
            lng:listing.querySelector(".map-coordinates").getAttribute('data-lng')
          }
          // propertyInfo['title']
          let priceNative=listing.querySelector(".price-native").textContent;
          propertyInfo["price"]={currency:priceNative.split(" ").pop().trim(),
            value:/[0-9,]+/.exec(priceNative)[0]
        
        };
        try{
          let rooms=listing.querySelector('span.search-result-label:last-child').textContent;
          propertyInfo["tabulatedDetails"]={
            Bedrooms:rooms.split("-")[0].trim().split(" ")[0],
            Bathrooms:rooms.split("-")[1].trim().split(" ")[0]
          }
        }
        catch(ex){
          propertyInfo["tabulatedDetails"]={
            Bathrooms:false,
            Bedrooms:false
          }
        }
          return propertyInfo;
        });
      });
      
      const nextPage=await listingsTab.$eval("a[aria-label='Next']"
      ,anchor=>{
        return anchor?.href||false;
      });
      for(const property of properties){
        let completeListing=await visitDetailsPage(property);
        await fs.appendFile(`${COUNTRY}-listings.json`,JSON.stringify(completeListing,null,"\t"))
        await addOneProperty(completeListing,WRITE_FIRESTORE_COLLECTION,COUNTRY);
      }
      if(nextPage){
       await visitListingsPage(browserInstance,nextPage);
      }
      return;
    }
    // visitListingsPage(startUrl);


    const visitDetailsPage=async(propertyObject)=>{
      let link=propertyObject.readMore;
      console.log(`Opening ${link}`);
      await detailsTab.goto(link);
      propertyObject["imgUrls"]=await detailsTab.$$eval(".jcarousel li>img"
      ,images=>{
        return images.map(image=>image.src);
      });
      propertyObject['name']=await detailsTab.$eval(".detail-data-primary",
      detailParent=>(detailParent.textContent).trim()
      );
      propertyObject['extras']=await detailsTab.$$eval(
        '.row.features-list li',async extras=>{
          const FURNISHED_KEY="Interior Description";
          const FEATURES_KEY="Property Features";
          const RESERVED_PARKING_SPACES="Number of assigned or reserved parking spaces";
          let excessInfo={};
          excessInfo["furnished"]=false;
          extras.forEach(extraInfo=>{
            try{
              let keyName=extraInfo.querySelector('strong').textContent
              let wholeValue=extraInfo.textContent
              wholeValue=wholeValue.split(":");
              if(wholeValue.length>1){
              keyName=keyName.trim().replace(':','');
              console.log(`Keyname ${keyName}`);
              if(keyName==FURNISHED_KEY){
                excessInfo["furnished"]=wholeValue[1].trim()=="Unfurnished"?false:true;
              }
              else if(keyName==RESERVED_PARKING_SPACES){
                excessInfo["parking"]=Number(wholeValue[1].trim())?true:false;
              }
            }

            }
            catch(ex){
              console.log(ex);
            }
            
          });
          return await Promise.resolve(excessInfo);
        }
        );
        if("furnished" in propertyObject.extras){
          propertyObject.tabulatedDetails["furnished"]=propertyObject.extras.furnished
        }
        if("parking" in propertyObject.extras){
          propertyObject.tabulatedDetails["Parking Spaces"]=propertyObject.extras.parking
        }
        propertyObject["description"]=await detailsTab.$eval('.remarksSection',
        remarks=>remarks.textContent
        );
        propertyObject["phoneNumber"]=await detailsTab.$eval(".margin-left-40"
        ,details=>{
          let phone=details.textContent;
          phone=phone.split("\n").pop().split(':').pop().trim();
          return phone;
        });
        propertyObject["country"]=COUNTRY;
        propertyObject["city"]=propertyObject.address.split(',')[0].trim();
        if(propertyObject.city=='South Africa'){

        }
        propertyObject["title"]=await detailsTab.$eval(".col-xs-12",heading=>{
          return heading.textContent.split('\n').pop().trim()
        })
      console.log(`Listing  
      ${JSON.stringify(propertyObject,null,4)}`);
      return propertyObject;
    }