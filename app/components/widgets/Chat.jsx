"use client";

import { useEffect, useRef, useState } from "react";
import { askClaude, BR, DEFAULT_CONTENT, G, GG, GP, IV, MU } from "../../config/siteConfig";
import { GoldText } from "../ui";

export default function Chat({welcome,placeholder}) {
  const [open,setOpen] = useState(false);
  const [msgs,setMsgs] = useState([{from:"bot",text:welcome || DEFAULT_CONTENT.chatWelcome}]);
  const [inp,setInp] = useState("");
  const [busy,setBusy] = useState(false);
  const end = useRef(null);
  useEffect(()=>end.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const send = async()=>{
    if(!inp.trim()||busy) return;
    const q=inp.trim(); setInp(""); setBusy(true);
    setMsgs(m=>[...m,{from:"user",text:q}]);
    const r=await askClaude(q);
    setMsgs(m=>[...m,{from:"bot",text:r}]); setBusy(false);
  };
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:999,width:340}}>
      {open && <div style={{background:"#111",border:`1px solid rgba(184,134,11,.3)`,borderTop:`2px solid ${G}`,marginBottom:10,borderRadius:2}}>
        <div style={{background:"#0A0A0A",padding:"13px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${BR}`}}>
          <GoldText sz={11} ls={2}>MONARCH AI</GoldText>
          <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:MU,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{height:240,overflowY:"auto",padding:14}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{marginBottom:10,fontSize:13,lineHeight:1.6,color:m.from==="bot"?GP:MU,textAlign:m.from==="user"?"right":"left"}}>
              {m.from==="bot"&&<span style={{color:G,fontFamily:"Cinzel,serif",fontSize:8,letterSpacing:1,marginRight:6}}>MB</span>}
              {m.text}
              {m.from==="user"&&<span style={{color:G,fontFamily:"Cinzel,serif",fontSize:8,letterSpacing:1,marginLeft:6}}>You</span>}
            </div>
          ))}
          {busy&&<div style={{fontSize:12,color:MU}}>…</div>}
          <div ref={end}/>
        </div>
        <div style={{display:"flex",borderTop:`1px solid ${BR}`}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder={placeholder || DEFAULT_CONTENT.chatPlaceholder}
            style={{flex:1,background:"#0A0A0A",border:"none",color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"11px 14px",outline:"none"}}/>
          <button onClick={send} style={{background:GG,border:"none",color:"#000",cursor:"pointer",padding:"0 16px",fontFamily:"Cinzel,serif",fontSize:10,fontWeight:700}}>SEND</button>
        </div>
      </div>}
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:50,height:50,background:GG,borderRadius:"50%",border:"none",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto",
          fontSize:20,boxShadow:"0 4px 20px rgba(184,134,11,.45)"}}>👑</button>
    </div>
  );
}
