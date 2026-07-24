"use client";

import { useEffect, useState } from "react";
import { BR, DEFAULT_CONTENT, G, GB, GG, GP, IV, LOGO, MU } from "../../config/siteConfig";

export const GoldText = ({children,sz=15,ls=2,style={}}) => (
  <span style={{fontFamily:"Cinzel,serif",fontSize:sz,fontWeight:900,letterSpacing:ls,
    background:GG,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",...style}}>
    {children}
  </span>
);

export const BrandText = ({children,sz=24,style={}}) => (
  <span style={{fontFamily:'"Snell Roundhand","Brush Script MT",cursive',fontSize:sz,fontWeight:900,
    letterSpacing:0,textTransform:"none",fontStyle:"italic",background:GG,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",...style}}>
    {children}
  </span>
);

export const Btn = ({children,onClick,full,danger,outline,sm}) => {
  const base = {cursor:"pointer",fontFamily:"Cinzel,serif",letterSpacing:2,
    textTransform:"uppercase",border:"none",transition:"transform .2s,opacity .2s"};
  if(danger) return <button onClick={onClick} style={{...base,background:"none",border:"1px solid rgba(220,60,60,.35)",color:"rgba(220,80,80,.8)",fontSize:9,padding:"7px 14px"}}>{children}</button>;
  if(outline) return <button onClick={onClick} style={{...base,background:"none",border:`1px solid rgba(184,134,11,.5)`,color:G,fontSize:sm?9:10,fontWeight:600,padding:sm?"8px 18px":"13px 34px"}}>{children}</button>;
  return <button onClick={onClick} style={{...base,background:GG,color:"#000",fontSize:sm?9:10,fontWeight:700,
    padding:sm?"8px 18px":full?"15px":"13px 34px",width:full?"100%":undefined,
    boxShadow:"0 0 24px rgba(184,134,11,.3)"}}>{children}</button>;
};

export const SecEye = ({children}) => <span style={{fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:5,textTransform:"uppercase",color:G,display:"block",marginBottom:12}}>{children}</span>;
export const SecTitle = ({children,white,mb=48}) => (
  <div style={{fontFamily:"Cinzel,serif",fontSize:"clamp(22px,4vw,44px)",fontWeight:900,letterSpacing:2,
    marginBottom:mb,lineHeight:1.1,
    ...(white?{color:IV}:{background:GG,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"})}}>
    {children}
  </div>
);

export function AgeGate({copy}) {
  const [ok,setOk] = useState(null);
  const [consent,setConsent] = useState(false);
  useEffect(()=>{
    setOk(window.localStorage.getItem("monarch_age_confirmed")==="yes");
  },[]);
  if(ok===true) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"min(460px,100%)",background:"#111",border:`1px solid ${BR}`,borderTop:`2px solid ${G}`,padding:34,textAlign:"center",boxShadow:"0 24px 80px rgba(0,0,0,.55)"}}>
        <GoldText sz={22} ls={2} style={{display:"block",marginBottom:16}}>{ok===false?copy?.blockedTitle:copy?.title}</GoldText>
        <p style={{fontSize:14,color:MU,lineHeight:1.8,marginBottom:24}}>{ok===false?copy?.blockedText:copy?.text}</p>
        {ok===false?(
          <Btn outline onClick={()=>window.location.href="https://www.google.com"}>{copy?.no || "Leave Site"}</Btn>
        ):(
          <div>
            <label style={{display:"flex",alignItems:"flex-start",gap:12,textAlign:"left",fontSize:13,color:GP,lineHeight:1.7,marginBottom:24,cursor:"pointer"}}>
              <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}
                style={{width:18,height:18,marginTop:2,accentColor:G,flexShrink:0}}/>
              <span>{copy?.consentLabel || DEFAULT_CONTENT.ageGate.consentLabel}</span>
            </label>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <Btn onClick={()=>{if(consent){window.localStorage.setItem("monarch_age_confirmed","yes");setOk(true);}}}>{copy?.yes}</Btn>
              <Btn outline onClick={()=>setOk(false)}>{copy?.no}</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductsSection({products}) {
  const list = products?.items || DEFAULT_CONTENT.products.items;
  const fallback = products?.fallbackImage || LOGO;
  return (
    <section style={{padding:"80px 60px",maxWidth:1300,margin:"0 auto"}}>
      <SecEye>{products?.eye || DEFAULT_CONTENT.products.eye}</SecEye>
      <SecTitle mb={22}>{products?.title || DEFAULT_CONTENT.products.title}</SecTitle>
      <p style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:18,color:MU,lineHeight:1.7,maxWidth:720,marginBottom:36}}>
        {products?.intro || DEFAULT_CONTENT.products.intro}
      </p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(184,134,11,.15)"}}>
        {list.map(item=>(
          <div key={item.name} style={{background:"#0A0A0A",minHeight:360,display:"flex",flexDirection:"column"}}>
            <div style={{height:190,background:"#050505",overflow:"hidden",borderBottom:"1px solid rgba(184,134,11,.14)"}}>
              <img src={item.image || fallback} alt={item.name} onError={e=>{e.currentTarget.src=fallback;}}
                style={{width:"100%",height:"100%",objectFit:"cover",filter:"saturate(.9) contrast(1.05)"}}/>
            </div>
            <div style={{padding:24,flex:1}}>
              <h3 style={{fontFamily:"Cinzel,serif",fontSize:14,color:GP,letterSpacing:1,marginBottom:10}}>{item.name}</h3>
              <p style={{fontSize:13,color:MU,lineHeight:1.75}}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export const PageHero = ({eye,h1,sub}) => (
  <div style={{height:"44vh",minHeight:380,background:"#000",display:"flex",alignItems:"center",
    justifyContent:"center",textAlign:"center",position:"relative",overflow:"hidden",paddingTop:68}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 70% at 50% 50%,rgba(184,134,11,.09) 0%,transparent 70%)"}}/>
    <div style={{position:"relative"}}>
      <p style={{fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:5,color:G,textTransform:"uppercase",marginBottom:14}}>{eye}</p>
      <h1 style={{fontFamily:"Cinzel,serif",fontSize:"clamp(26px,5vw,56px)",fontWeight:900,letterSpacing:4,
        background:GG,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{h1}</h1>
      <p style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:17,color:MU,marginTop:12,letterSpacing:1}}>{sub}</p>
      <div style={{width:100,height:1,background:`linear-gradient(90deg,transparent,${G},${GB},${G},transparent)`,margin:"18px auto 0"}}/>
    </div>
  </div>
);



export function Marquee({items=DEFAULT_CONTENT.marquee}) {
  return (
    <div style={{background:"#111",borderTop:`1px solid ${BR}`,borderBottom:`1px solid ${BR}`,padding:"12px 0",overflow:"hidden"}}>
      <div style={{display:"flex",animation:"marquee 26s linear infinite",width:"max-content"}}>
        {[...items,...items].map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"0 34px",whiteSpace:"nowrap",borderRight:`1px solid ${BR}`}}>
            <span style={{fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:3,textTransform:"uppercase",color:GB}}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

