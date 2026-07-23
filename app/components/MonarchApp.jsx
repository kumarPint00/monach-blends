"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection, addDoc, onSnapshot,
  updateDoc, deleteDoc, doc,
  serverTimestamp, setDoc, getDoc
} from "firebase/firestore";
import { db } from "../firebase";

// ─── Logo ────────────────────────────────────────────────────
const LOGO = "/monachblendlogo.jpeg";

// ─── Claude AI ───────────────────────────────────────────────
async function askClaude(msg) {
  try {
    const r = await fetch("/api/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:msg})
    });
    const d = await r.json();
    return d.text || "Sorry, I could not process that.";
  } catch { return "Connection error. Please try again."; }
}

// ─── Default data ─────────────────────────────────────────────
const DEF_JOBS = [
  {title:"Production Supervisor",location:"Gujarat",type:"Full-time",dept:"Manufacturing",active:true},
  {title:"Quality Control Analyst",location:"Gujarat",type:"Full-time",dept:"QA/QC",active:true},
  {title:"Sales & Distribution Executive",location:"Pan India",type:"Full-time",dept:"Sales",active:true},
  {title:"Machinery Sales Executive",location:"Pan India",type:"Full-time",dept:"Machinery",active:true},
  {title:"Compliance & Legal Officer",location:"Gujarat",type:"Full-time",dept:"Legal",active:true},
];
const DEF_SVCS = [
  {num:"01",title:"Premium Cigarette Manufacturing",desc:"Full-scale production using hand-picked tobacco leaves and a proprietary North American formula refined over 2+ years of R&D.",tag:"Core Product"},
  {num:"02",title:"Exclusive Machinery Sales",desc:"We hold exclusive master rights to sell our proprietary cigarette-making machinery across India and neighbouring countries. Tube system fully customisable per blend, size, filter and output.",tag:"Exclusive Rights"},
  {num:"03",title:"Dealer & Distributor Programme",desc:"Three-tier partnership — retail dealer, area distributor, and state master distributor — with exclusive territory rights, competitive margins, and full support.",tag:"Partnerships"},
  {num:"04",title:"Custom Branding & Packaging",desc:"Fully COTPA-compliant custom label design and packaging for B2B clients. Pictorial warnings, legal text, and premium aesthetics all handled in-house.",tag:"B2B"},
  {num:"05",title:"Trade & Distribution Logistics",desc:"Pan-India distribution with reliable stock management and timely delivery to all wholesale and retail partners.",tag:"Logistics"},
  {num:"06",title:"Regulatory & Compliance Advisory",desc:"Expert guidance on GST filings, excise documentation, and COTPA compliance — keeping your operations fully legal.",tag:"Advisory"},
];
const DEF_SETTINGS = {phone:"+91 99989 08799 / +91 94096 78113",email:"shreesiddheshwarienterprisepvt@gmail.com",address:"Gujarat, India",hours:"Mon–Sat  9:00 AM – 6:00 PM IST"};
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "monarch-blends";
const DEFAULT_CONTENT = {
  brandName:"MONARCH BLENDS",
  companyName:"Shree Siddheshwari Enterprise Pvt. Ltd.",
  logoAlt:"Monarch Blends",
  nav:[
    {k:"home",l:"Home"},{k:"about",l:"About"},{k:"services",l:"Services"},
    {k:"dealer",l:"Dealer / Distributor"},{k:"careers",l:"Careers"},{k:"contact",l:"Contact"}
  ],
  chatWelcome:"Welcome to Monarch Blends. Ask me about our products, dealer programme, or machinery rights.",
  chatPlaceholder:"Ask about Monarch Blends…",
  home:{
    eyebrow:"North American Formula ◆ Made in India ◆ Hand-Picked Tobacco",
    title:"MONARCH BLENDS",
    subtitle:"The Sovereign Standard in Premium Tobacco",
    subtitle2:"By Shree Siddheshwari Enterprise Pvt. Ltd.",
    location:"Est. Gujarat, India",
    primaryCta:"Become a Partner",
    secondaryCta:"Our Heritage",
    pillarsEye:"The Monarch Difference",
    pillarsTitle:"Crafted Without Compromise",
    pillars:[
      {n:"01",h:"Hand-Picked Tobacco",p:"Only the highest-grade leaves selected by hand at source — a sovereign blend begins long before the factory floor."},
      {n:"02",h:"North American Formula",p:"Developed by expert tobacco scientists in North America, bringing world-class blending precision to a proudly Indian brand."},
      {n:"03",h:"2+ Years of R&D",p:"Over two years of intensive research went into perfecting Monarch Blends before a single product reached market."},
      {n:"04",h:"100% Compliant",p:"Full adherence to COTPA, GST, and all Indian regulations. Ethical, transparent, and legally sound — always."}
    ],
    storyEye:"From Seed to Sovereign",
    storyTitle:"The Monarch Story",
    story:[
      {ico:"🌿",h:"Premium Leaves",p:"Every blend starts with carefully hand-picked, high-quality tobacco leaves selected at origin for character and consistency."},
      {ico:"🔬",h:"Scientific Formula",p:"Developed in North America over 2+ years — refined with rigorous scientific methodology until it met our exacting standard."},
      {ico:"🏭",h:"Indian Manufacturing",p:"Proudly manufactured in Gujarat, India — combining international formulation with the spirit of Indian enterprise."},
      {ico:"👑",h:"The Sovereign Result",p:"Monarch Blends — a premium tobacco product standing apart in quality, compliance, and brand equity across India."}
    ]
  },
  marquee:["Hand-Picked Tobacco","Formulated in North America","Made in India 🇮🇳","2+ Years R&D","100% Compliant","Exclusive Machinery Rights","Pan India Distribution","Customisable Tubes"],
  heroes:{
    about:{eye:"Our Heritage",h1:"About Monarch Blends",sub:"Global expertise. Indian craft. Royal ambition."},
    services:{eye:"What We Do",h1:"Our Services",sub:"From leaf to distribution — a complete sovereign ecosystem"},
    dealer:{eye:"Business Opportunity",h1:"Partner with Monarch Blends",sub:"Join the sovereign network across India and beyond"},
    careers:{eye:"Join Our Team",h1:"Careers at Monarch Blends",sub:"Build something sovereign from the ground up"},
    contact:{eye:"Get In Touch",h1:"Contact Us",sub:"Dealers, partners, machinery buyers, job seekers — we welcome you"}
  },
  about:{
    title:"The Making of a Sovereign Brand",
    paragraphs:[
      "Monarch Blends is the result of a deliberate, patient pursuit of excellence. Created by Shree Siddheshwari Enterprise Private Limited and headquartered in Gujarat, we set out to build something the Indian market had never seen: a truly premium tobacco product born from North American scientific expertise and Indian manufacturing pride.",
      "We source only hand-picked, high-quality tobacco leaves. Our blend was formulated in North America by expert tobacco scientists and refined over 2+ years of R&D. The result competes globally while being proudly Made in India.",
      "We also hold the exclusive master rights to sell our proprietary cigarette manufacturing machinery across India and neighbouring countries — creating a complete ecosystem for our partners that goes well beyond the product itself."
    ],
    quote:"Our formula was not rushed. Over two years of research and development — testing, refining, perfecting — went into every aspect of Monarch Blends before a single product reached a retailer.",
    valuesTitle:"Our Core Values",
    values:[
      {n:"I.",h:"Quality Without Compromise",p:"Hand-picked tobacco, North American formulation, 2+ years R&D — quality is embedded in every decision."},
      {n:"II.",h:"Integrity & Full Compliance",p:"100% adherence to all regulatory requirements. Transparent dealings with every partner, always."},
      {n:"III.",h:"Partnership First",p:"We grow only when our dealers and distributors grow. Their success is our foundation."},
      {n:"IV.",h:"Indian Pride, Global Standard",p:"Made in India, formulated to world-class standards — we carry both identities with equal pride."},
      {n:"V.",h:"Innovation & Patience",p:"We invested 2+ years before launch because great things cannot be rushed. That patience defines us."}
    ]
  },
  services:{eye:"Core Capabilities",title:"The Full Monarch Offering"},
  dealer:{
    tiersEye:"Partnership Tiers",
    tiersTitle:"Choose Your Level",
    tiers:[
      {feat:false,badge:"Retail Dealer",icon:"🏪",title:"Retail Dealer",desc:"Sell Monarch Blends directly through your outlet. The perfect entry into one of India's fastest-growing premium tobacco brands.",items:["Low minimum order quantity","Attractive retail margins","POS & branding materials","Consistent supply guarantee","Promotional campaign support"]},
      {feat:true,badge:"Most Popular",icon:"🏢",title:"Area Distributor",desc:"Distribute across your district or region. Exclusive area rights, higher margins, and full commercial support.",items:["Exclusive territory rights","Superior volume margins","Dedicated sales support team","Priority stock allocation","Co-branded marketing materials"]},
      {feat:false,badge:"State Master",icon:"🌐",title:"State Distributor",desc:"Become the master distributor for your entire state. Build a full dealer network with state-wide exclusivity.",items:["Full state-level exclusivity","Best-in-class margins","Direct factory pricing","Full marketing ecosystem","Personal relationship manager"]}
    ],
    machineryEye:"Exclusive Rights",
    machineryTitle:"Machinery & Tube — Master Rights for India",
    machineryParagraphs:[
      "Shree Siddheshwari Enterprise Pvt. Ltd. holds the exclusive master rights to sell our proprietary cigarette-manufacturing machinery across India and neighbouring countries.",
      "Our tube system can be fully customised to your exact specification — blend type, filter, cigarette size, and packaging — giving partners complete production flexibility.",
      "Whether you produce Monarch Blends or build your own line, our machinery + tube solution provides the complete infrastructure to do so."
    ],
    machineryBadge:"◆ Exclusive India & Neighbouring Country Rights",
    machineryFeatures:[
      {ico:"⚙️",h:"Precision Machinery",p:"High-output machines with consistent quality and low maintenance."},
      {ico:"🧩",h:"Custom Tubes",p:"Tailored to your exact blend, size, filter, and packaging."},
      {ico:"🌏",h:"India + Neighbours",p:"Exclusive rights to sell across India and neighbouring countries."},
      {ico:"🤝",h:"Full Setup Support",p:"Installation, training, and after-sales support included."}
    ],
    benefitsEye:"Partner Benefits",
    benefitsTitle:"The Monarch Partner Advantage",
    benefits:[
      {ico:"💰",h:"Competitive Margins",p:"Transparent margins at every tier — structured to keep your business profitable from day one."},
      {ico:"🔒",h:"Protected Territory",p:"Registered distributors receive exclusive territory rights. No undercutting — guaranteed."},
      {ico:"📊",h:"Marketing Support",p:"Branded POS materials, trade campaigns, and promotional tools for your territory."},
      {ico:"📞",h:"Dedicated Manager",p:"A relationship manager handles your orders, logistics, compliance, and support needs."}
    ],
    ctaTitle:"Ready to Join the Monarch Network?",
    ctaText:"Contact us today and our partnership team will respond within 2 business days.",
    ctaButton:"Apply for Partnership"
  },
  careers:{
    intro:"We are a young, ambitious brand — looking for people who share that ambition. At Monarch Blends, you are not joining a legacy. You are helping build one.",
    openingsEye:"Open Positions",
    openingsTitle:"Current Openings",
    empty:"No active openings at the moment. Check back soon.",
    benefitsEye:"Benefits",
    benefitsTitle:"What We Offer",
    perks:[
      {ico:"💰",h:"Competitive Pay",p:"Market-aligned salary with performance bonuses."},
      {ico:"📈",h:"Real Growth",p:"Early-stage brand = real career advancement."},
      {ico:"🏥",h:"Health Cover",p:"Medical insurance for you and your family."},
      {ico:"🌎",h:"Global Exposure",p:"Work with North American formulations and international standards."},
      {ico:"🎓",h:"Learning & Dev",p:"Workshops, training, and skill-building programmes."}
    ]
  },
  contact:{heading:"Reach Out",formTitle:"Send a Message",successTitle:"Message Received",successText:"Thank you for reaching out. We will respond within 1–2 business days.",successButton:"Send Another",sendButton:"Send Message ◆",savingButton:"Saving to Firebase…"},
  footer:{tagline:"Hand-Picked Tobacco ◆ Formulated in North America ◆ Made in India",copyright:"© 2025 Shree Siddheshwari Enterprise Pvt. Ltd.",rights:"All Rights Reserved · Gujarat, India"}
};

// ─── Design tokens ────────────────────────────────────────────
const G  = "#B8860B";
const GB = "#F0C040";
const GP = "#E8D5A3";
const IV = "#F8F4EC";
const MU = "rgba(248,244,236,0.5)";
const BR = "rgba(184,134,11,0.2)";
const GG = `linear-gradient(135deg,${G},${GB},${GP},${GB},${G})`;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "monarch2024";

function mergeContent(base, override) {
  if(Array.isArray(base)) return Array.isArray(override) ? override : base;
  if(!base || typeof base !== "object") return override ?? base;
  const out = {...base};
  Object.keys(override || {}).forEach(key => {
    out[key] = mergeContent(base[key], override[key]);
  });
  return out;
}

// ─── Reusable tiny components ─────────────────────────────────
const GoldText = ({children,sz=15,ls=2,style={}}) => (
  <span style={{fontFamily:"Cinzel,serif",fontSize:sz,fontWeight:900,letterSpacing:ls,
    background:GG,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",...style}}>
    {children}
  </span>
);

const Btn = ({children,onClick,full,danger,outline,sm}) => {
  const base = {cursor:"pointer",fontFamily:"Cinzel,serif",letterSpacing:2,
    textTransform:"uppercase",border:"none",transition:"transform .2s,opacity .2s"};
  if(danger) return <button onClick={onClick} style={{...base,background:"none",border:"1px solid rgba(220,60,60,.35)",color:"rgba(220,80,80,.8)",fontSize:9,padding:"7px 14px"}}>{children}</button>;
  if(outline) return <button onClick={onClick} style={{...base,background:"none",border:`1px solid rgba(184,134,11,.5)`,color:G,fontSize:sm?9:10,fontWeight:600,padding:sm?"8px 18px":"13px 34px"}}>{children}</button>;
  return <button onClick={onClick} style={{...base,background:GG,color:"#000",fontSize:sm?9:10,fontWeight:700,
    padding:sm?"8px 18px":full?"15px":"13px 34px",width:full?"100%":undefined,
    boxShadow:"0 0 24px rgba(184,134,11,.3)"}}>{children}</button>;
};

const SecEye = ({children}) => <span style={{fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:5,textTransform:"uppercase",color:G,display:"block",marginBottom:12}}>{children}</span>;
const SecTitle = ({children,white,mb=48}) => (
  <div style={{fontFamily:"Cinzel,serif",fontSize:"clamp(22px,4vw,44px)",fontWeight:900,letterSpacing:2,
    marginBottom:mb,lineHeight:1.1,
    ...(white?{color:IV}:{background:GG,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"})}}>
    {children}
  </div>
);

const PageHero = ({eye,h1,sub}) => (
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

// ─── Firebase hook ────────────────────────────────────────────
function useCol(name, seed) {
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

function useTenantContent() {
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

// ─── AI Chat widget ───────────────────────────────────────────
function Chat({welcome,placeholder}) {
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

// ─── Marquee ──────────────────────────────────────────────────
function Marquee({items=DEFAULT_CONTENT.marquee}) {
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

// ─── Admin ────────────────────────────────────────────────────
function Admin({onClose,contentTools}) {
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
            <div style={{fontSize:13,color:"rgba(248,244,236,.65)",lineHeight:1.7}}>{c.message}</div>
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

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [page,setPage] = useState("home");
  const [admin,setAdmin] = useState(false);
  const contentTools = useTenantContent();
  const content = contentTools.content;
  const jobs    = useCol("jobs",DEF_JOBS);
  const svcs    = useCol("services",DEF_SVCS);
  const [settings,setSettings] = useState(DEF_SETTINGS);
  const [form,setForm] = useState({name:"",company:"",email:"",phone:"",type:"Dealer / Distributor Enquiry",message:""});
  const [sent,setSent] = useState(false);
  const [sending,setSending] = useState(false);

  useEffect(()=>{
    getDoc(doc(db,"tenants",TENANT_ID)).then(async tenant=>{
      if(tenant.exists() && tenant.data().settings) setSettings(tenant.data().settings);
      else {
        const d = await getDoc(doc(db,"settings","contact"));
        if(d.exists()) setSettings(d.data().value);
      }
    });
  },[page]);

  const go = p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };

  const submitForm = async()=>{
    if(!form.name||!form.email) return;
    setSending(true);
    await addDoc(collection(db,"contacts"),{...form,_ts:serverTimestamp()});
    setSending(false); setSent(true);
  };

  if(admin) return <Admin onClose={()=>setAdmin(false)} contentTools={contentTools}/>;

  const NAV=content.nav || DEFAULT_CONTENT.nav;

  const FInput=({label,field,type="text",ph,full})=>(
    <div style={{marginBottom:16,gridColumn:full?"1 / -1":undefined}}>
      <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>{label}</label>
      <input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}
        style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",transition:"border-color .2s"}}
        onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BR}/>
    </div>
  );

  return (
    <div className="site-shell" style={{fontFamily:"Inter,sans-serif",background:"#060606",color:IV,minHeight:"100vh",overflowX:"hidden"}}>

      {/* ── NAV ── */}
      <nav className="site-nav" style={{position:"fixed",top:0,left:0,right:0,zIndex:500,height:68,
        background:"rgba(6,6,6,.95)",backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${BR}`,display:"flex",alignItems:"center",
        justifyContent:"space-between",padding:"0 36px"}}>
        <div className="site-brand" style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>go("home")}>
          <div style={{width:42,height:42,borderRadius:"50%",padding:2,
            background:`conic-gradient(${G},${GB},${GP},${GB},${G})`,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img src={LOGO} alt="MB" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}/>
          </div>
          <div>
            <GoldText sz={15} ls={3}>{content.brandName}</GoldText>
            <div style={{fontSize:8,color:"rgba(248,244,236,.4)",letterSpacing:2,textTransform:"uppercase",marginTop:2}}>{content.companyName}</div>
          </div>
        </div>
        <div className="site-nav-actions" style={{display:"flex",gap:0}}>
          {NAV.map(p=>(
            <button key={p.k} onClick={()=>go(p.k)}
              style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Cinzel,serif",fontSize:10,
                fontWeight:600,color:page===p.k?GB:MU,letterSpacing:2,textTransform:"uppercase",
                padding:"8px 13px",borderBottom:page===p.k?`1px solid ${GB}`:"1px solid transparent",
                transition:"color .2s"}}>
              {p.l}
            </button>
          ))}
          <button onClick={()=>setAdmin(true)}
            style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Cinzel,serif",fontSize:9,
              color:G,letterSpacing:2,padding:"8px 13px"}}>⚙ Admin</button>
        </div>
      </nav>

      {/* ═══════════ HOME ═══════════ */}
      {page==="home"&&<>
        {/* HERO */}
        <section style={{height:"100vh",minHeight:700,background:"#000",display:"flex",
          alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",paddingTop:68}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 50% 40%,rgba(184,134,11,.1) 0%,transparent 70%)"}}/>
          <div style={{position:"absolute",inset:0,
            backgroundImage:"linear-gradient(rgba(184,134,11,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(184,134,11,.05) 1px,transparent 1px)",
            backgroundSize:"80px 80px",
            WebkitMaskImage:"radial-gradient(ellipse 70% 70% at 50% 50%,black 0%,transparent 80%)"}}/>
          <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:900,padding:"0 24px"}}>
            {/* LOGO */}
            <div style={{position:"relative",width:190,height:190,margin:"0 auto 36px"}}>
              <div style={{position:"absolute",inset:-20,borderRadius:"50%",
                background:"radial-gradient(ellipse,rgba(184,134,11,.18) 0%,transparent 70%)",
                animation:"breathe 4s ease-in-out infinite"}}/>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",
                background:`conic-gradient(${G},${GB},${GP},${GB},${G})`,
                animation:"spin 22s linear infinite"}}/>
              <div style={{position:"absolute",inset:3,borderRadius:"50%",background:"#000"}}/>
              <div style={{position:"absolute",inset:9,borderRadius:"50%",overflow:"hidden",
                border:"1px solid rgba(184,134,11,.5)",background:"#111"}}>
                <img src={LOGO} alt={content.logoAlt} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            </div>
            <div style={{fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:5,textTransform:"uppercase",
              color:G,borderBottom:"1px solid rgba(184,134,11,.3)",display:"inline-block",paddingBottom:10,marginBottom:26}}>
              {content.home?.eyebrow}
            </div>
            <h1 style={{fontFamily:"Cinzel,serif",fontSize:"clamp(36px,8vw,90px)",fontWeight:900,
              letterSpacing:6,lineHeight:.95,background:GG,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:20}}>
              {content.home?.title}
            </h1>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",
              fontSize:"clamp(15px,2vw,21px)",color:MU,letterSpacing:2,marginBottom:34,lineHeight:1.6}}>
              {content.home?.subtitle}<br/>{content.home?.subtitle2}
            </p>
            <div style={{display:"flex",alignItems:"center",gap:18,justifyContent:"center",marginBottom:34}}>
              <div style={{width:60,height:1,background:`linear-gradient(90deg,transparent,${G})`}}/>
              <span style={{fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:3,color:G}}>{content.home?.location}</span>
              <div style={{width:60,height:1,background:`linear-gradient(90deg,${G},transparent)`}}/>
            </div>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <Btn onClick={()=>go("dealer")}>{content.home?.primaryCta}</Btn>
              <Btn outline onClick={()=>go("about")}>{content.home?.secondaryCta}</Btn>
            </div>
          </div>
        </section>

        <Marquee items={content.marquee}/>

        {/* PILLARS */}
        <section style={{padding:"88px 60px",maxWidth:1300,margin:"0 auto"}}>
          <SecEye>{content.home?.pillarsEye}</SecEye>
          <SecTitle>{content.home?.pillarsTitle}</SecTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(184,134,11,.15)"}}>
            {(content.home?.pillars||[]).map(x=>(
              <div key={x.n} style={{background:"#0A0A0A",padding:"40px 28px",transition:"background .3s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#141414"}
                onMouseLeave={e=>e.currentTarget.style.background="#0A0A0A"}>
                <span style={{fontFamily:"Cinzel,serif",fontSize:44,fontWeight:900,color:"rgba(184,134,11,.15)",lineHeight:1,marginBottom:14,display:"block"}}>{x.n}</span>
                <h3 style={{fontFamily:"Cinzel,serif",fontSize:14,fontWeight:700,letterSpacing:1,marginBottom:10}}>{x.h}</h3>
                <p style={{fontSize:13,color:MU,lineHeight:1.8}}>{x.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STORY */}
        <div style={{background:"#111",borderTop:"1px solid rgba(184,134,11,.15)",borderBottom:"1px solid rgba(184,134,11,.15)",padding:"88px 60px"}}>
          <div style={{textAlign:"center",maxWidth:1300,margin:"0 auto"}}>
            <SecEye>{content.home?.storyEye}</SecEye>
            <SecTitle mb={0}>{content.home?.storyTitle}</SecTitle>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1px 1fr 1px 1fr 1px 1fr",maxWidth:1300,margin:"50px auto 0"}}>
            {(content.home?.story||[]).flatMap((item,index)=>index===0?[item]:[null,item]).map((x,i)=>x===null
              ?<div key={i} style={{background:"rgba(184,134,11,.15)"}}/>
              :<div key={i} style={{padding:"0 36px",textAlign:"center"}}>
                <span style={{fontSize:36,marginBottom:18,display:"block"}}>{x.ico}</span>
                <h4 style={{fontFamily:"Cinzel,serif",fontSize:12,color:GB,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{x.h}</h4>
                <p style={{fontSize:13,color:MU,lineHeight:1.8}}>{x.p}</p>
              </div>
            )}
          </div>
        </div>
      </>}

      {/* ═══════════ ABOUT ═══════════ */}
      {page==="about"&&<>
        <PageHero {...content.heroes?.about}/>
        <div style={{padding:"80px 60px",maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"start"}}>
            <div>
              <SecTitle mb={26}>{content.about?.title}</SecTitle>
              {(content.about?.paragraphs||[]).map((p,i)=><p key={i} style={{fontSize:14,color:MU,lineHeight:1.9,marginBottom:16}}>{p}</p>)}
              <blockquote style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:18,color:GP,
                lineHeight:1.65,borderLeft:`2px solid ${G}`,paddingLeft:22,margin:"26px 0"}}>
                "{content.about?.quote}"
              </blockquote>
            </div>
            <div style={{background:"#111",border:`1px solid ${BR}`,borderTop:`2px solid ${G}`,padding:42}}>
              <GoldText sz={16} ls={2} style={{display:"block",marginBottom:30}}>{content.about?.valuesTitle}</GoldText>
              {(content.about?.values||[]).map((v,i)=>(
                <div key={v.n} style={{padding:"16px 0",borderBottom:i<4?"1px solid rgba(184,134,11,.08)":"none",display:"flex",gap:16}}>
                  <span style={{fontFamily:"Cinzel,serif",fontSize:11,color:G,letterSpacing:1,flexShrink:0,marginTop:2}}>{v.n}</span>
                  <div>
                    <strong style={{display:"block",fontFamily:"Cinzel,serif",fontSize:12,color:IV,letterSpacing:1,marginBottom:5}}>{v.h}</strong>
                    <p style={{fontSize:12,color:MU,lineHeight:1.7}}>{v.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>}

      {/* ═══════════ SERVICES ═══════════ */}
      {page==="services"&&<>
        <PageHero {...content.heroes?.services}/>
        <section style={{padding:"80px 60px",maxWidth:1300,margin:"0 auto"}}>
          <SecEye>{content.services?.eye}</SecEye>
          <SecTitle>{content.services?.title}</SecTitle>
          <div style={{borderTop:"1px solid rgba(184,134,11,.12)"}}>
            {svcs.map(s=>(
              <div key={s.id} style={{display:"grid",gridTemplateColumns:"90px 1fr",
                borderBottom:"1px solid rgba(184,134,11,.12)",transition:"background .3s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#111"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{borderRight:"1px solid rgba(184,134,11,.12)",display:"flex",alignItems:"center",justifyContent:"center",padding:"34px 16px"}}>
                  <span style={{fontFamily:"Cinzel,serif",fontSize:26,fontWeight:900,color:"rgba(184,134,11,.25)"}}>{s.num}</span>
                </div>
                <div style={{padding:"34px 36px"}}>
                  <h3 style={{fontFamily:"Cinzel,serif",fontSize:17,fontWeight:700,letterSpacing:1,marginBottom:10}}>{s.title}</h3>
                  <p style={{fontSize:13,color:MU,lineHeight:1.8}}>{s.desc}</p>
                  <span style={{display:"inline-block",marginTop:12,fontFamily:"Cinzel,serif",fontSize:8,letterSpacing:2,
                    color:G,border:`1px solid rgba(184,134,11,.3)`,padding:"3px 12px",textTransform:"uppercase"}}>{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>}

      {/* ═══════════ DEALER ═══════════ */}
      {page==="dealer"&&<>
        <PageHero {...content.heroes?.dealer}/>

        {/* TIERS */}
        <section style={{padding:"80px 60px",maxWidth:1300,margin:"0 auto"}}>
          <SecEye>{content.dealer?.tiersEye}</SecEye>
          <SecTitle>{content.dealer?.tiersTitle}</SecTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,background:"rgba(184,134,11,.15)"}}>
            {(content.dealer?.tiers||[]).map(t=>(
              <div key={t.title} style={{background:t.feat?"#141414":"#0A0A0A",padding:"44px 32px",
                position:"relative",transition:"background .3s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#1a1a1a"}
                onMouseLeave={e=>e.currentTarget.style.background=t.feat?"#141414":"#0A0A0A"}>
                <div style={{fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,
                  color:t.feat?"#000":G,
                  background:t.feat?GG:"none",
                  border:t.feat?"none":`1px solid rgba(184,134,11,.4)`,
                  display:"inline-block",padding:"4px 14px",marginBottom:22}}>{t.badge}</div>
                <span style={{fontSize:38,display:"block",marginBottom:18}}>{t.icon}</span>
                <h3 style={{fontFamily:"Cinzel,serif",fontSize:19,fontWeight:700,letterSpacing:1,marginBottom:14}}>{t.title}</h3>
                <p style={{fontSize:13,color:MU,lineHeight:1.85,marginBottom:26}}>{t.desc}</p>
                <ul style={{listStyle:"none",padding:0}}>
                  {t.items.map(item=>(
                    <li key={item} style={{fontSize:12,color:MU,padding:"8px 0",
                      borderBottom:"1px solid rgba(184,134,11,.08)",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:4,height:4,background:G,borderRadius:"50%",flexShrink:0}}/>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* MACHINERY */}
        <div style={{background:"#111",borderTop:"1px solid rgba(184,134,11,.15)",borderBottom:"1px solid rgba(184,134,11,.15)",padding:"80px 60px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:72,maxWidth:1300,margin:"0 auto",alignItems:"start"}}>
            <div>
              <SecEye>{content.dealer?.machineryEye}</SecEye>
              <SecTitle mb={22}>{content.dealer?.machineryTitle}</SecTitle>
              {(content.dealer?.machineryParagraphs||[]).map((p,i)=><p key={i} style={{fontSize:14,color:MU,lineHeight:1.9,marginBottom:16}}>{p}</p>)}
              <div style={{display:"inline-flex",alignItems:"center",gap:10,border:`1px solid ${G}`,
                padding:"10px 22px",marginTop:8,fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:2,color:G,textTransform:"uppercase"}}>
                {content.dealer?.machineryBadge}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,background:"rgba(184,134,11,.15)"}}>
              {(content.dealer?.machineryFeatures||[]).map(f=>(
                <div key={f.h} style={{background:"#0A0A0A",padding:"28px 22px",transition:"background .3s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#141414"}
                  onMouseLeave={e=>e.currentTarget.style.background="#0A0A0A"}>
                  <span style={{fontSize:24,marginBottom:10,display:"block"}}>{f.ico}</span>
                  <h4 style={{fontFamily:"Cinzel,serif",fontSize:12,color:GP,marginBottom:7,letterSpacing:1}}>{f.h}</h4>
                  <p style={{fontSize:12,color:MU,lineHeight:1.7}}>{f.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BENEFITS */}
        <section style={{padding:"80px 60px",maxWidth:1300,margin:"0 auto"}}>
          <SecEye>{content.dealer?.benefitsEye}</SecEye>
          <SecTitle>{content.dealer?.benefitsTitle}</SecTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(184,134,11,.15)"}}>
            {(content.dealer?.benefits||[]).map(b=>(
              <div key={b.h} style={{background:"#0A0A0A",padding:"36px 24px",textAlign:"center",transition:"background .3s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#141414"}
                onMouseLeave={e=>e.currentTarget.style.background="#0A0A0A"}>
                <span style={{fontSize:32,marginBottom:14,display:"block"}}>{b.ico}</span>
                <h3 style={{fontFamily:"Cinzel,serif",fontSize:13,color:IV,marginBottom:10,letterSpacing:1}}>{b.h}</h3>
                <p style={{fontSize:13,color:MU,lineHeight:1.75}}>{b.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DEALER CTA */}
        <div style={{background:"#000",borderTop:"1px solid rgba(184,134,11,.15)",padding:"80px 60px",textAlign:"center"}}>
          <SecTitle>{content.dealer?.ctaTitle}</SecTitle>
          <p style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:18,color:MU,marginBottom:32,maxWidth:600,margin:"0 auto 32px"}}>
            {content.dealer?.ctaText}
          </p>
          <Btn onClick={()=>go("contact")}>{content.dealer?.ctaButton}</Btn>
        </div>
      </>}

      {/* ═══════════ CAREERS ═══════════ */}
      {page==="careers"&&<>
        <PageHero {...content.heroes?.careers}/>
        <section style={{padding:"80px 60px",maxWidth:1000,margin:"0 auto"}}>
          <p style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:20,color:MU,
            lineHeight:1.7,textAlign:"center",maxWidth:700,margin:"0 auto 56px"}}>
            "{content.careers?.intro}"
          </p>
          <SecEye>{content.careers?.openingsEye}</SecEye>
          <SecTitle mb={28}>{content.careers?.openingsTitle}</SecTitle>
          <div style={{borderTop:"1px solid rgba(184,134,11,.12)"}}>
            {jobs.filter(j=>j.active).length===0&&(
              <div style={{padding:"40px 0",color:MU,fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:16,textAlign:"center"}}>
                {content.careers?.empty}
              </div>
            )}
            {jobs.filter(j=>j.active).map(j=>(
              <div key={j.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                gap:20,padding:"26px 30px",borderBottom:"1px solid rgba(184,134,11,.1)",
                flexWrap:"wrap",transition:"background .3s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#111"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:15,fontWeight:700,letterSpacing:1,marginBottom:8}}>{j.title}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[`📍 ${j.location}`,j.type,j.dept].map(t=>(
                      <span key={t} style={{fontSize:11,color:MU,border:`1px solid rgba(184,134,11,.18)`,padding:"3px 10px"}}>{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={()=>go("contact")}
                  style={{background:"none",border:`1px solid rgba(184,134,11,.45)`,color:G,cursor:"pointer",
                    fontFamily:"Cinzel,serif",fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                    padding:"10px 22px",whiteSpace:"nowrap",transition:"background .25s,color .25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background=G;e.currentTarget.style.color="#000";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=G;}}>
                  Apply
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* PERKS */}
        <div style={{background:"#111",borderTop:"1px solid rgba(184,134,11,.15)",padding:"70px 60px"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <SecEye>{content.careers?.benefitsEye}</SecEye>
            <SecTitle mb={32}>{content.careers?.benefitsTitle}</SecTitle>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:1,background:"rgba(184,134,11,.15)"}}>
              {(content.careers?.perks||[]).map(p=>(
                <div key={p.h} style={{background:"#0A0A0A",padding:"28px 18px",textAlign:"center",transition:"background .3s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#141414"}
                  onMouseLeave={e=>e.currentTarget.style.background="#0A0A0A"}>
                  <span style={{fontSize:26,marginBottom:12,display:"block"}}>{p.ico}</span>
                  <h4 style={{fontFamily:"Cinzel,serif",fontSize:11,color:GP,marginBottom:6,letterSpacing:1}}>{p.h}</h4>
                  <p style={{fontSize:11,color:MU,lineHeight:1.65}}>{p.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>}

      {/* ═══════════ CONTACT ═══════════ */}
      {page==="contact"&&<>
        <PageHero {...content.heroes?.contact}/>
        <div style={{padding:"80px 60px",maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:72}}>
            <div>
              <GoldText sz={22} ls={2} style={{display:"block",marginBottom:36}}>{content.contact?.heading}</GoldText>
              {[{ico:"📍",l:"Address",v:`${content.brandName}
${content.companyName}
${settings.address}`},
                {ico:"📞",l:"Phone",v:settings.phone},
                {ico:"✉️",l:"Email",v:settings.email},
                {ico:"⏰",l:"Business Hours",v:settings.hours},
              ].map(c=>(
                <div key={c.l} style={{display:"flex",gap:18,marginBottom:28,alignItems:"flex-start"}}>
                  <div style={{width:44,height:44,border:`1px solid rgba(184,134,11,.25)`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,color:G}}>{c.ico}</div>
                  <div>
                    <span style={{fontFamily:"Cinzel,serif",fontSize:9,textTransform:"uppercase",
                      letterSpacing:2,color:G,marginBottom:5,display:"block"}}>{c.l}</span>
                    <span style={{fontSize:13,color:MU,lineHeight:1.65,whiteSpace:"pre-line"}}>{c.v}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#111",border:`1px solid ${BR}`,borderTop:`2px solid ${G}`,padding:42}}>
              <GoldText sz={18} ls={2} style={{display:"block",marginBottom:28}}>{content.contact?.formTitle}</GoldText>
              {sent?(
                <div style={{textAlign:"center",padding:"40px 20px",animation:"fadeIn .5s ease"}}>
                  <div style={{fontSize:48,marginBottom:16}}>👑</div>
                  <GoldText sz={20} ls={1} style={{display:"block",marginBottom:10}}>{content.contact?.successTitle}</GoldText>
                  <p style={{fontSize:13,color:MU,marginBottom:24}}>{content.contact?.successText}</p>
                  <Btn onClick={()=>setSent(false)}>{content.contact?.successButton}</Btn>
                </div>
              ):(
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <FInput label="Full Name" field="name" ph="Your name"/>
                    <FInput label="Company" field="company" ph="Your company"/>
                    <FInput label="Email" field="email" type="email" ph="email@example.com"/>
                    <FInput label="Phone" field="phone" type="tel" ph="+91 99989 08799"/>
                  </div>
                  <div style={{marginBottom:16}}>
                    <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>Enquiry Type</label>
                    <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                      style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,
                        fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",cursor:"pointer"}}
                      onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BR}>
                      {["Dealer / Distributor Enquiry","Machinery Purchase","Business Partnership","Career / Job Application","General Enquiry"].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div style={{marginBottom:16}}>
                    <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>Message</label>
                    <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                      placeholder="Tell us about your enquiry…"
                      style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,
                        fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",
                        resize:"vertical",minHeight:100,transition:"border-color .2s"}}
                      onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BR}/>
                  </div>
                  <Btn full onClick={submitForm}>{sending?content.contact?.savingButton:content.contact?.sendButton}</Btn>
                </>
              )}
            </div>
          </div>
        </div>
      </>}

      {/* ── FOOTER ── */}
      <footer style={{background:"#000",borderTop:"1px solid rgba(184,134,11,.15)",padding:"0 60px 32px"}}>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${G},${GB},${G},transparent)`,marginBottom:36}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20,maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,borderRadius:"50%",padding:2,background:`conic-gradient(${G},${GB},${GP},${GB},${G})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <img src={LOGO} alt="MB" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}/>
            </div>
            <div>
              <GoldText sz={14} ls={3}>{content.brandName}</GoldText>
              <div style={{fontSize:8,color:"rgba(248,244,236,.35)",letterSpacing:2,textTransform:"uppercase",marginTop:2}}>{content.companyName}</div>
            </div>
          </div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:13,color:"rgba(248,244,236,.3)",textAlign:"center",lineHeight:1.7}}>
            {content.footer?.tagline}
          </div>
          <div style={{fontSize:11,color:"rgba(248,244,236,.22)",textAlign:"right",letterSpacing:1,lineHeight:1.8}}>
            {content.footer?.copyright}<br/>{content.footer?.rights}
          </div>
        </div>
      </footer>

      <Chat welcome={content.chatWelcome} placeholder={content.chatPlaceholder}/>
    </div>
  );
}
