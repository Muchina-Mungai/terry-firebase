 import dayjs from "dayjs";
 export const listingDocument={
    city: '0',
    country: '0',
    name: 'null',
    geolocation: { lat: 0, lng: 0 },
    timestamp: 'null',
    offer: true,
    imgUrls:[],
    bedrooms: 0,
    furnished: true,
    type: 'null',
    email: 'null',
    regularPrice: 'null',
    phoneNumber: 'null',
    userRef: 'null',
    parking: true,
    bathrooms: 0
  }
 export  const organizeListing=async(property,country)=>{
  listingDocument.city=property.address.split(",").pop().trim();
  listingDocument.country=country;
  listingDocument.name=property?.title;
  listingDocument.geolocation=property?.geolocation||"Geocordinates Not Found";
  listingDocument.offer=true;
  listingDocument.imgUrls=property.imgUrls
  listingDocument.bedrooms=Number(property.tabulatedDetails?.Bedrooms||property.title.trim().charAt(0));
  listingDocument.type="Buy";
  listingDocument.email=property?.email||"Not Set";
  listingDocument.regularPrice=property?.price?.currency+" "+property?.price?.value;
  listingDocument.phoneNumber=property?.phoneNumber;
  listingDocument.furnished=("furnished" in property.tabulatedDetails)?
  property.tabulatedDetails.furnished:true;
  listingDocument.userRef="Web Scraper";
  listingDocument.parking='Parking Spaces' in property.tabulatedDetails
  listingDocument.bathrooms='Bathrooms' in property.tabulatedDetails?
  Number(property.tabulatedDetails["Bathrooms"]):"Not Specified"


  let today=dayjs();
  let time=today.format("MMMM DD,YYYY").toString()+
  " at "+today.format("hh:mm:ss A").toString()+" UTC"+
  today.format("ZZ").toString().slice(0,3);
  listingDocument.timestamp=time;
  listingDocument.description=property?.description;
  return listingDocument
 }
