"use client";

import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CONTENT_VERSION, DEF_SETTINGS, DEFAULT_CONTENT, TENANT_ID, mergeContent } from "../config/siteConfig";

export function useCol(name, seed) {
  const [data,setData] = useState([]);
  const seeded = useRef(false);
  useEffect(() => {
    const unsub = onSnapshot(collection(db,name), async snap => {
      if(snap.empty && seed && !seeded.current){
        seeded.current = true;
        for(const item of seed) await addDoc(collection(db,name),{...item,_ts:serverTimestamp()});
      } else {
        setData(snap.docs.map(d=>({id:d.id,...d.data()})));
      }
    });
    return unsub;
  },[name]);
  return data;
}

export function useTenantContent() {
  const [content,setContent] = useState(DEFAULT_CONTENT);
  const [draft,setDraft] = useState(JSON.stringify(DEFAULT_CONTENT,null,2));
  const [contentSaved,setContentSaved] = useState(false);
  const [contentError,setContentError] = useState("");

  useEffect(() => {
    const ref = doc(db,"tenants",TENANT_ID);
    const unsub = onSnapshot(ref, async snap => {
      if(!snap.exists()){
        await setDoc(ref,{content:DEFAULT_CONTENT,settings:DEF_SETTINGS,updatedAt:serverTimestamp()});
        return;
      }
      if(snap.data().content?.version !== CONTENT_VERSION){
        await setDoc(ref,{content:DEFAULT_CONTENT,settings:snap.data().settings || DEF_SETTINGS,updatedAt:serverTimestamp()},{merge:true});
        return;
      }
      const nextContent = mergeContent(DEFAULT_CONTENT,snap.data().content);
      setContent(nextContent);
      setDraft(JSON.stringify(nextContent,null,2));
    });
    return unsub;
  },[]);

  const saveContent = async()=>{
    try {
      const parsed = JSON.parse(draft);
      await setDoc(doc(db,"tenants",TENANT_ID),{content:parsed,updatedAt:serverTimestamp()},{merge:true});
      setContent(parsed);
      setContentError("");
      setContentSaved(true);
      setTimeout(()=>setContentSaved(false),2000);
    } catch {
      setContentError("Invalid JSON. Please fix the content before saving.");
    }
  };

  return {content,draft,setDraft,saveContent,contentSaved,contentError};
}
