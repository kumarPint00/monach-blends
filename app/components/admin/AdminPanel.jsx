"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ADMIN_PASSWORD, BR, DEF_JOBS, DEF_SETTINGS, DEF_SVCS, G, GB, IV, MU, TENANT_ID, DEFAULT_CONTENT } from "../../config/siteConfig";
import { useCol } from "../../hooks/useFirestoreData";
import { Btn, GoldText, SecTitle } from "../ui";

function ContentEditor({draft,setDraft,saveContent,contentSaved,contentError}) {
  return (
    <div>
      <div style={{background:"#111",border:`1px solid ${BR}`,borderTop:`2px solid ${G}`,padding:24,marginBottom:16}}>
        <GoldText sz={15} ls={2} style={{display:"block",marginBottom:12}}>Tenant Content</GoldText>
        <p style={{fontSize:13,color:MU,lineHeight:1.7,marginBottom:16}}>
          This JSON controls public page text, navigation labels, hero copy, marquees, cards, dealer content, careers content, contact text, and footer text for tenant: {TENANT_ID}.
        </p>
        {contentError&&<div style={{color:"rgba(220,80,80,.9)",fontSize:13,marginBottom:12}}>{contentError}</div>}
        <textarea value={draft} onChange={e=>setDraft(e.target.value)}
          spellCheck={false}
          style={{width:"100%",minHeight:520,background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,
            fontFamily:"ui-monospace,SFMono-Regular,Menlo,monospace",fontSize:12,lineHeight:1.6,
            padding:"14px 16px",outline:"none",resize:"vertical",whiteSpace:"pre"}}/>
        <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
          <Btn onClick={saveContent}>{contentSaved?"✓ Saved Tenant Content":"Save Tenant Content"}</Btn>
          <Btn outline onClick={()=>setDraft(JSON.stringify(DEFAULT_CONTENT,null,2))}>Reset to Defaults</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Admin ────────────────────────────────────────────────────
export default function Admin({onClose,contentTools}) {
  const [auth,setAuth]=useState(false);
  const [pw,setPw]=useState("");
  const [tab,setTab]=useState("jobs");
  const jobs=useCol("jobs",DEF_JOBS);
  const svcs=useCol("services",DEF_SVCS);
  const contacts=useCol("contacts",null);
  const [newJob,setNewJob]=useState(null);
  const [editJob,setEditJob]=useState(null);
  const [newSvc,setNewSvc]=useState(null);
  const [editSvc,setEditSvc]=useState(null);
  const [cfg,setCfg]=useState(DEF_SETTINGS);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{
    getDoc(doc(db,"tenants",TENANT_ID)).then(async tenant=>{
      if(tenant.exists() && tenant.data().settings) setCfg(tenant.data().settings);
      else {
        const d = await getDoc(doc(db,"settings","contact"));
        if(d.exists()) setCfg(d.data().value);
      }
    });
  },[]);

  const saveSettings=async()=>{
    await setDoc(doc(db,"settings","contact"),{value:cfg});
    await setDoc(doc(db,"tenants",TENANT_ID),{settings:cfg,updatedAt:serverTimestamp()},{merge:true});
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  if(!auth) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#060606",paddingTop:68}}>
      <div style={{background:"#111",border:`1px solid ${BR}`,borderTop:`2px solid ${G}`,padding:48,maxWidth:360,width:"100%",textAlign:"center"}}>
        <SecTitle mb={28}>ADMIN LOGIN</SecTitle>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&(pw===ADMIN_PASSWORD?setAuth(true):alert("Wrong password"))}
          placeholder="Admin password" style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",marginBottom:16,textAlign:"center"}}/>
        <Btn onClick={()=>pw===ADMIN_PASSWORD?setAuth(true):alert("Wrong password")}>Enter</Btn>
        <div style={{marginTop:16}}><Btn outline onClick={onClose}>← Back to Site</Btn></div>
      </div>
    </div>
  );

  const TABS=[{k:"content",l:"Tenant Content"},{k:"jobs",l:"Jobs"},{k:"services",l:"Services"},{k:"contacts",l:"Enquiries"},{k:"settings",l:"Settings"}];
  const lbl = t => <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,color:MU,marginBottom:6,textTransform:"uppercase"}}>{t}</label>;
  const inp = (val,onChange) => <input value={val||""} onChange={onChange} style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"10px 14px",outline:"none",marginBottom:10}}/>;

  return (
    <div style={{minHeight:"100vh",padding:"90px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <SecTitle>ADMIN PANEL</SecTitle>
        <Btn outline onClick={onClose}>← View Site</Btn>
      </div>
      <div style={{display:"flex",gap:2,marginBottom:28,borderBottom:`1px solid ${BR}`}}>
        {TABS.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{background:"none",border:"none",borderBottom:tab===t.k?`2px solid ${G}`:"2px solid transparent",
              cursor:"pointer",fontFamily:"Cinzel,serif",fontSize:11,letterSpacing:2,
              color:tab===t.k?GB:MU,padding:"10px 18px",transition:"color .2s"}}>
            {t.l}
          </button>
        ))}
      </div>

      {tab==="content"&&<ContentEditor {...contentTools}/>}

      {/* JOBS */}
      {tab==="jobs"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontFamily:"Cinzel,serif",fontSize:13}}>{jobs.filter(j=>j.active).length} active / {jobs.length} total</span>
          <Btn sm onClick={()=>setNewJob({title:"",location:"",type:"Full-time",dept:"",active:true})}>+ Add Job</Btn>
        </div>
        {newJob&&<div style={{background:"#111",border:`1px solid rgba(184,134,11,.4)`,padding:28,marginBottom:16}}>
          <GoldText sz={13} ls={1} style={{display:"block",marginBottom:18}}>New Opening</GoldText>
          {[["Job Title","title"],["Location","location"],["Department","dept"]].map(([l,k])=>(
            <div key={k}>{lbl(l)}{inp(newJob[k],e=>setNewJob(j=>({...j,[k]:e.target.value})))}</div>
          ))}
          {lbl("Type")}
          <select value={newJob.type} onChange={e=>setNewJob(j=>({...j,type:e.target.value}))}
            style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"10px 14px",outline:"none",marginBottom:10}}>
            {["Full-time","Part-time","Contract","Internship"].map(o=><option key={o}>{o}</option>)}
          </select>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn sm onClick={async()=>{await addDoc(collection(db,"jobs"),{...newJob,_ts:serverTimestamp()});setNewJob(null);}}>Save to Firebase</Btn>
            <Btn sm outline onClick={()=>setNewJob(null)}>Cancel</Btn>
          </div>
        </div>}
        {jobs.map(j=>(
          <div key={j.id} style={{background:"#111",border:`1px solid ${BR}`,padding:24,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            {editJob===j.id?(
              <div style={{flex:"1 1 520px"}}>
                {[["Job Title","title"],["Location","location"],["Department","dept"],["Type","type"]].map(([l,k])=>(
                  <div key={k}>{lbl(l)}{inp(j[k],e=>updateDoc(doc(db,"jobs",j.id),{[k]:e.target.value}))}</div>
                ))}
              </div>
            ):(
              <div>
                <div style={{fontFamily:"Cinzel,serif",fontSize:14,marginBottom:5}}>{j.title}</div>
                <div style={{fontSize:12,color:MU}}>{j.location} · {j.type} · {j.dept}</div>
              </div>
            )}
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:11,color:j.active?"#4caf50":"rgba(248,244,236,.3)",fontFamily:"Cinzel,serif"}}>{j.active?"● Active":"● Hidden"}</span>
              <Btn sm outline onClick={()=>setEditJob(editJob===j.id?null:j.id)}>{editJob===j.id?"Done":"Edit"}</Btn>
              <Btn sm onClick={()=>updateDoc(doc(db,"jobs",j.id),{active:!j.active})}>{j.active?"Hide":"Show"}</Btn>
              <Btn danger onClick={()=>deleteDoc(doc(db,"jobs",j.id))}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>}

      {/* SERVICES */}
      {tab==="services"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{fontFamily:"Cinzel,serif",fontSize:13}}>{svcs.length} services</span>
          <Btn sm onClick={()=>setNewSvc({num:String(svcs.length+1).padStart(2,"0"),title:"",desc:"",tag:""})}>+ Add Service</Btn>
        </div>
        {newSvc&&<div style={{background:"#111",border:`1px solid rgba(184,134,11,.4)`,padding:28,marginBottom:16}}>
          <GoldText sz={13} ls={1} style={{display:"block",marginBottom:18}}>New Service</GoldText>
          {[["Number","num"],["Title","title"],["Tag","tag"]].map(([l,k])=>(
            <div key={k}>{lbl(l)}{inp(newSvc[k],e=>setNewSvc(s=>({...s,[k]:e.target.value})))}</div>
          ))}
          {lbl("Description")}
          <textarea value={newSvc.desc||""} onChange={e=>setNewSvc(s=>({...s,desc:e.target.value}))}
            style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"10px 14px",outline:"none",marginBottom:10,resize:"vertical",minHeight:80}}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn sm onClick={async()=>{await addDoc(collection(db,"services"),{...newSvc,_ts:serverTimestamp()});setNewSvc(null);}}>Save to Firebase</Btn>
            <Btn sm outline onClick={()=>setNewSvc(null)}>Cancel</Btn>
          </div>
        </div>}
        {svcs.map(s=>(
          <div key={s.id} style={{background:"#111",border:`1px solid ${BR}`,padding:24,marginBottom:10}}>
            {editSvc===s.id?(
              <div>
                {lbl("Number")}{inp(s.num,e=>updateDoc(doc(db,"services",s.id),{num:e.target.value}))}
                {lbl("Title")}{inp(s.title,e=>updateDoc(doc(db,"services",s.id),{title:e.target.value}))}
                {lbl("Description")}
                <textarea value={s.desc||""} onChange={e=>updateDoc(doc(db,"services",s.id),{desc:e.target.value})}
                  style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"10px 14px",outline:"none",marginBottom:10,resize:"vertical",minHeight:80}}/>
                {lbl("Tag")}{inp(s.tag,e=>updateDoc(doc(db,"services",s.id),{tag:e.target.value}))}
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <Btn sm onClick={()=>setEditSvc(null)}>Done</Btn>
                  <Btn danger onClick={()=>deleteDoc(doc(db,"services",s.id))}>Delete</Btn>
                </div>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:14}}>
                <div>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:14,marginBottom:5}}>{s.num} — {s.title}</div>
                  <div style={{fontSize:12,color:MU,maxWidth:620}}>{(s.desc||"").slice(0,90)}…</div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <Btn sm onClick={()=>setEditSvc(s.id)}>Edit</Btn>
                  <Btn danger onClick={()=>deleteDoc(doc(db,"services",s.id))}>Delete</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>}

      {/* CONTACTS */}
      {tab==="contacts"&&<div>
        <div style={{fontFamily:"Cinzel,serif",fontSize:13,marginBottom:20}}>{contacts.length} enquiries received</div>
        {contacts.length===0&&<div style={{color:MU,fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:16,textAlign:"center",padding:40}}>No enquiries yet — they appear here once submitted via the Contact page.</div>}
        {[...contacts].sort((a,b)=>(b._ts?.seconds||0)-(a._ts?.seconds||0)).map(c=>(
          <div key={c.id} style={{background:"#111",border:`1px solid ${BR}`,padding:24,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontFamily:"Cinzel,serif",fontSize:13}}>{c.name} {c.company?"— "+c.company:""}</span>
              <span style={{fontSize:11,color:G,fontFamily:"Cinzel,serif"}}>{c.type}</span>
            </div>
            <div style={{fontSize:12,color:MU,marginBottom:8}}>{c.email}{c.phone?" · "+c.phone:""}</div>
            {(c.tier||c.state||c.district||c.careerRole)&&(
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                {[c.tier,c.state,c.district,c.careerRole].filter(Boolean).map(v=>(
                  <span key={v} style={{fontSize:11,color:GP,border:`1px solid rgba(184,134,11,.18)`,padding:"3px 10px"}}>{v}</span>
                ))}
              </div>
            )}
            <div style={{fontSize:13,color:"rgba(248,244,236,.65)",lineHeight:1.7}}>{c.message}</div>
            {c.experience&&<div style={{fontSize:12,color:MU,lineHeight:1.7,marginTop:10,borderTop:"1px solid rgba(184,134,11,.08)",paddingTop:10}}>{c.experience}</div>}
            <div style={{fontSize:11,color:"rgba(248,244,236,.22)",marginTop:10}}>
              {c._ts?.toDate?.()?.toLocaleString("en-IN")||""}
            </div>
          </div>
        ))}
      </div>}

      {/* SETTINGS */}
      {tab==="settings"&&<div style={{maxWidth:560}}>
        <div style={{fontFamily:"Cinzel,serif",fontSize:13,marginBottom:22}}>Site Contact Details</div>
        {[["Phone","phone"],["Email","email"],["Address","address"],["Business Hours","hours"]].map(([l,k])=>(
          <div key={k} style={{marginBottom:16}}>
            {lbl(l)}
            <input value={cfg[k]||""} onChange={e=>setCfg(c=>({...c,[k]:e.target.value}))}
              style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"10px 14px",outline:"none"}}/>
          </div>
        ))}
        <Btn onClick={saveSettings}>{saved?"✓ Saved to Firebase!":"Save Changes"}</Btn>
      </div>}
    </div>
  );
}
