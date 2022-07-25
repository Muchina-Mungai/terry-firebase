import fetch from 'node-fetch';
const API_KEY="AIzaSyDvdUHTb1gPqyS7VwTtWN5Y76npnl4Scco";
const queryAPI=async(address)=>{
  const URL="https://maps.googleapis.com/maps/api/js/GeocodeService.Search?4s%2C%20"
  +address+"&key="+API_KEY+"&7sUS&9sen-GB&callback=_xdc_._flnehu&token="+"39923";
  fetch(URL).then(
    data=>{
      console.log(data);
    }
  ).catch(err=>{
    console.log(err);
  })
}
queryAPI("Kilimani%2%20CNairobi");
/*
https://maps.googleapis.com/maps/api/js/GeocodeService.Search
?4s, Kilimani, Nairobi, Kenya&7sUS&9sen-GB&callback=_xdc_._flnehu&key=AIzaSyDvdUHTb1gPqyS7VwTtWN5Y76npnl4Scco&token=39923
*/