  // import { db } from "../config/firebase.config.js";
  import { db } from '../config/firebase-terry.config.js';
  import {collection,doc,addDoc,deleteDoc,query,where, getDocs, setDoc} from 'firebase/firestore';
  import dayjs from "dayjs";
import { organizeListing } from "./db-structure.js";
 
  export  const addOneProperty=async(prop,collectionName,country)=>{
    let property=await organizeListing(prop,country);
    let docName=property?.name+" "+prop.address;
    try{
      console.log(`Preparing to write ${property.name} to database`)
      const docRef=await addDoc(collection(db,collectionName),property);
      console.log(`Mmmmh ... write to database went on 
      as planned New Document Id: ${docRef.id}`);
    }
    catch(ex){
      console.log("Error writing to database");
      console.error(ex);
    }
  }

  /*
  June 27, 2022 at 1:17:31 AM UTC-7) month\s,\syear\sat\shr:min:sec\sAM/PM\sUTC
  */