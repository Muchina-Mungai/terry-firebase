  import { db } from "../config/firebase.config.js";
  import {collection,getDocs} from 'firebase/firestore';

  const docs=async (db,collectionName)=>{
    const collectionRef=collection(db,collectionName);
    const data=await getDocs(collectionRef);
    return data;
  }
  const records=await docs(db,'listings');
  records.docs.forEach(record=>{
    console.log(record.data());
  })
  