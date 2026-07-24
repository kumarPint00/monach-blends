"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AGE_GATE_ENABLED, BR, DEF_JOBS, DEF_SETTINGS, DEF_SVCS, DEFAULT_CONTENT, G, GB, GG, GP, IV, LOGO, MU, TENANT_ID } from "../config/siteConfig";
import { useCol, useTenantContent } from "../hooks/useFirestoreData";
import { AgeGate, BrandText, Btn, GoldText, Marquee, PageHero, ProductsSection, SecEye, SecTitle } from "./ui";

const Admin = dynamic(() => import("./admin/AdminPanel"), { ssr:false });
const Chat = dynamic(() => import("./widgets/Chat"), { ssr:false });

// ─── MAIN APP ─────────────────────────────────────────────────
export default function MonarchApp() {
  const [page,setPage] = useState("home");
  const [admin,setAdmin] = useState(false);
  const contentTools = useTenantContent();
  const content = contentTools.content;
  const jobs    = useCol("jobs",DEF_JOBS);
  const svcs    = useCol("services",DEF_SVCS);
  const [settings,setSettings] = useState(DEF_SETTINGS);
  const [form,setForm] = useState({name:"",company:"",email:"",phone:"",type:"Dealer / Distributor Enquiry",tier:"",state:"",district:"",careerRole:"",experience:"",message:""});
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
  const dealerTierTitles = (content.dealer?.tiers || DEFAULT_CONTENT.dealer.tiers).map(t=>t.title);
  const regions = content.contact?.regions || DEFAULT_CONTENT.contact.regions;
  const selectedRegion = regions.find(r=>r.state===form.state);
  const isDealerType = form.type==="Dealer / Distributor Enquiry";
  const isCareerType = form.type==="Career / Job Application" || (content.contact?.careerRoles || []).includes(form.type);
  const needsDistrict = isDealerType && form.tier && form.tier!=="State Distributor";
  const applyForTier = tier => {
    setForm(f=>({...f,type:"Dealer / Distributor Enquiry",tier,careerRole:""}));
    go("contact");
  };
  const applyForJob = role => {
    setForm(f=>({...f,type:"Career / Job Application",careerRole:role,tier:"",state:"",district:""}));
    go("contact");
  };

  const submitForm = async()=>{
    if(!form.name||!form.email) return;
    setSending(true);
    const careerRoles = content.contact?.careerRoles || DEFAULT_CONTENT.contact.careerRoles;
    await addDoc(collection(db,"contacts"),{...form,careerRole:isCareerType?(form.careerRole || careerRoles[0] || ""):form.careerRole,tenantId:TENANT_ID,_ts:serverTimestamp()});
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
      {AGE_GATE_ENABLED&&<AgeGate copy={content.ageGate || DEFAULT_CONTENT.ageGate}/>}

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
            <BrandText sz={24}>{content.brandName}</BrandText>
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
            <h1 style={{lineHeight:.95,marginBottom:20}}>
              <BrandText sz="clamp(54px,10vw,118px)" style={{display:"inline-block"}}>
              {content.home?.title}
              </BrandText>
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
        <ProductsSection products={content.products}/>

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
        <div style={{background:"#111",borderTop:"1px solid rgba(184,134,11,.15)",borderBottom:"1px solid rgba(184,134,11,.15)"}}>
          <ProductsSection products={content.products}/>
        </div>
      </>}

      {/* ═══════════ SERVICES ═══════════ */}
      {page==="services"&&<>
        <PageHero {...content.heroes?.services}/>
        <ProductsSection products={content.products}/>
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
                <div style={{marginTop:26}}>
                  <Btn full sm onClick={()=>applyForTier(t.title)}>{content.dealer?.applyButton || "Apply"}</Btn>
                </div>
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
                <button onClick={()=>applyForJob(j.title)}
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
                    <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value,tier:e.target.value==="Dealer / Distributor Enquiry"?f.tier:"",careerRole:e.target.value==="Career / Job Application"?f.careerRole:""}))}
                      style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,
                        fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",cursor:"pointer"}}
                      onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BR}>
                      {(content.contact?.enquiryTypes || DEFAULT_CONTENT.contact.enquiryTypes).map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  {isDealerType&&(
                    <>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                        <div style={{marginBottom:16}}>
                          <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>{content.contact?.tierLabel || "Partnership Tier"}</label>
                          <select value={form.tier} onChange={e=>setForm(f=>({...f,tier:e.target.value,district:e.target.value==="State Distributor"?"":f.district}))}
                            style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",cursor:"pointer"}}>
                            <option value="">Select tier</option>
                            {dealerTierTitles.map(o=><option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div style={{marginBottom:16}}>
                          <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>{content.contact?.stateLabel || "State"}</label>
                          <select value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value,district:""}))}
                            style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",cursor:"pointer"}}>
                            <option value="">Select state</option>
                            {regions.map(r=><option key={r.state}>{r.state}</option>)}
                          </select>
                        </div>
                      </div>
                      {needsDistrict&&(
                        <div style={{marginBottom:16}}>
                          <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>{content.contact?.districtLabel || "District"}</label>
                          <select value={form.district} onChange={e=>setForm(f=>({...f,district:e.target.value}))}
                            disabled={!selectedRegion}
                            style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",cursor:"pointer",opacity:selectedRegion?1:.55}}>
                            <option value="">{selectedRegion?"Select district":"Select state first"}</option>
                            {(selectedRegion?.districts || []).map(d=><option key={d}>{d}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  )}
                  {isCareerType&&(
                    <div style={{marginBottom:16}}>
                      <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>Career Job Type</label>
                      <select value={form.careerRole || (content.contact?.careerRoles || [])[0] || ""} onChange={e=>setForm(f=>({...f,careerRole:e.target.value}))}
                        style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",cursor:"pointer"}}>
                        {[...new Set([...(content.contact?.careerRoles || DEFAULT_CONTENT.contact.careerRoles),...jobs.filter(j=>j.active).map(j=>j.title)])].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  )}
                  {(isDealerType||isCareerType)&&(
                    <div style={{marginBottom:16}}>
                      <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:MU,marginBottom:7}}>{content.contact?.experienceLabel || "Current / Past Business or Work Experience"}</label>
                      <textarea value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))}
                        placeholder={content.contact?.experiencePlaceholder || "Share details about your experience."}
                        style={{width:"100%",background:"#0A0A0A",border:`1px solid ${BR}`,color:IV,fontFamily:"Inter,sans-serif",fontSize:13,padding:"12px 14px",outline:"none",resize:"vertical",minHeight:86,transition:"border-color .2s"}}
                        onFocus={e=>e.target.style.borderColor=G} onBlur={e=>e.target.style.borderColor=BR}/>
                    </div>
                  )}
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
              <BrandText sz={22}>{content.brandName}</BrandText>
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
