// ─── Logo ────────────────────────────────────────────────────
export const LOGO = "/monachblendlogo.jpeg";

// ─── Claude AI ───────────────────────────────────────────────
export async function askClaude(msg) {
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
export const DEF_JOBS = [
  {title:"Quality Control Analyst",location:"Gujarat",type:"Full-time",dept:"QA/QC",active:true},
  {title:"Sales & Distribution Executive",location:"Pan India",type:"Full-time",dept:"Sales",active:true},
  {title:"Machinery Sales Executive",location:"Pan India",type:"Full-time",dept:"Machinery",active:true},
  {title:"Machine Technician",location:"Gujarat",type:"Full-time",dept:"Machinery",active:true},
  {title:"Electrical Technician",location:"Gujarat",type:"Full-time",dept:"Maintenance",active:true},
  {title:"Skilled Worker",location:"Gujarat",type:"Full-time",dept:"Manufacturing",active:true},
  {title:"Marketing Manager",location:"Pan India",type:"Full-time",dept:"Marketing",active:true},
  {title:"Forklift Driver & Truck Driver",location:"Gujarat",type:"Full-time",dept:"Logistics",active:true},
  {title:"Shift Supervisor",location:"Gujarat",type:"Full-time",dept:"Manufacturing",active:true},
  {title:"Research and Development Department",location:"Gujarat",type:"Full-time",dept:"R&D",active:true},
];
export const DEF_SVCS = [
  {num:"01",title:"Premium Cigarette Manufacturing",desc:"Full-scale production using hand-picked tobacco leaves and a proprietary North American formula refined over 2+ years of R&D.",tag:"Core Product"},
  {num:"02",title:"Exclusive Machinery Sales and Support",desc:"We hold exclusive master rights to sell our proprietary cigarette-making machinery across India and neighbouring countries. Our cigarette paper tube system is fully customisable per blend, size, filter, and output specification.",tag:"Exclusive Rights"},
  {num:"03",title:"Dealer & Distributor Programme",desc:"Three-tier partnership: retail dealer, area distributor, and state master distributor, with exclusive territory rights, competitive margins, and full support at every level.",tag:"Partnerships"},
  {num:"04",title:"Custom Branding & Packaging",desc:"Fully COTPA-compliant custom label design and packaging for B2B clients. Pictorial warnings, legal text, and premium aesthetics are handled in-house.",tag:"B2B"},
  {num:"05",title:"Trade & Distribution Logistics",desc:"Pan-India distribution with reliable stock management and timely delivery to wholesale and retail partners.",tag:"Logistics"},
];
export const DEF_SETTINGS = {phone:"+91 99989 08799 / +91 94096 78113",email:"shreesiddheshwarienterprisepvt@gmail.com",address:"Gujarat, India",hours:"Mon–Sat  9:00 AM – 6:00 PM IST"};
export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "monarch-blends";
export const CONTENT_VERSION = "2026-07-24-brand-font";
export const AGE_GATE_ENABLED = false;
export const INDIAN_REGIONS = [
  {state:"Andhra Pradesh",districts:["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"]},
  {state:"Arunachal Pradesh",districts:["Anjaw","Changlang","East Kameng","East Siang","Kurung Kumey","Lohit","Lower Dibang Valley","Lower Subansiri","Papum Pare","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"]},
  {state:"Assam",districts:["Baksa","Barpeta","Bongaigaon","Cachar","Darrang","Dhemaji","Dhubri","Dibrugarh","Goalpara","Golaghat","Hailakandi","Jorhat","Kamrup","Karbi Anglong","Lakhimpur","Nagaon","Sivasagar","Sonitpur","Tinsukia"]},
  {state:"Bihar",districts:["Araria","Aurangabad","Bhagalpur","Bhojpur","Darbhanga","Gaya","Katihar","Madhubani","Muzaffarpur","Nalanda","Patna","Purnia","Rohtas","Samastipur","Saran","Siwan","Vaishali"]},
  {state:"Chhattisgarh",districts:["Balod","Baloda Bazar","Bastar","Bilaspur","Dhamtari","Durg","Janjgir-Champa","Korba","Mahasamund","Raigarh","Raipur","Rajnandgaon","Surguja"]},
  {state:"Goa",districts:["North Goa","South Goa"]},
  {state:"Gujarat",districts:["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kutch","Kheda","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"]},
  {state:"Haryana",districts:["Ambala","Bhiwani","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"]},
  {state:"Himachal Pradesh",districts:["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"]},
  {state:"Jharkhand",districts:["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Palamu","Ranchi","West Singhbhum"]},
  {state:"Karnataka",districts:["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chikkamagaluru","Dakshina Kannada","Dharwad","Hassan","Kalaburagi","Mysuru","Shivamogga","Tumakuru","Udupi","Vijayapura"]},
  {state:"Kerala",districts:["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"]},
  {state:"Madhya Pradesh",districts:["Bhopal","Chhindwara","Dewas","Gwalior","Indore","Jabalpur","Katni","Morena","Ratlam","Rewa","Sagar","Satna","Sehore","Ujjain","Vidisha"]},
  {state:"Maharashtra",districts:["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Chandrapur","Dhule","Jalgaon","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nashik","Pune","Raigad","Sangli","Satara","Solapur","Thane"]},
  {state:"Manipur",districts:["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Senapati","Tamenglong","Thoubal","Ukhrul"]},
  {state:"Meghalaya",districts:["East Garo Hills","East Khasi Hills","Jaintia Hills","Ri Bhoi","South Garo Hills","West Garo Hills","West Khasi Hills"]},
  {state:"Mizoram",districts:["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"]},
  {state:"Nagaland",districts:["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"]},
  {state:"Odisha",districts:["Angul","Balangir","Balasore","Bargarh","Bhadrak","Cuttack","Dhenkanal","Ganjam","Jagatsinghpur","Jajpur","Kalahandi","Kendrapara","Khordha","Koraput","Mayurbhanj","Puri","Sambalpur","Sundargarh"]},
  {state:"Punjab",districts:["Amritsar","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Ludhiana","Mansa","Moga","Pathankot","Patiala","Sangrur"]},
  {state:"Rajasthan",districts:["Ajmer","Alwar","Bharatpur","Bhilwara","Bikaner","Chittorgarh","Jaipur","Jaisalmer","Jodhpur","Kota","Nagaur","Pali","Sikar","Sri Ganganagar","Udaipur"]},
  {state:"Sikkim",districts:["East Sikkim","North Sikkim","South Sikkim","West Sikkim"]},
  {state:"Tamil Nadu",districts:["Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kancheepuram","Madurai","Namakkal","Salem","Thanjavur","Thoothukudi","Tiruchirappalli","Tirunelveli","Vellore","Virudhunagar"]},
  {state:"Telangana",districts:["Adilabad","Hyderabad","Jagtial","Karimnagar","Khammam","Mahabubnagar","Medchal-Malkajgiri","Nalgonda","Nizamabad","Rangareddy","Sangareddy","Siddipet","Warangal"]},
  {state:"Tripura",districts:["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"]},
  {state:"Uttar Pradesh",districts:["Agra","Aligarh","Bareilly","Ghaziabad","Gorakhpur","Jhansi","Kanpur Nagar","Lucknow","Meerut","Moradabad","Prayagraj","Saharanpur","Varanasi"]},
  {state:"Uttarakhand",districts:["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"]},
  {state:"West Bengal",districts:["Bankura","Birbhum","Darjeeling","Hooghly","Howrah","Jalpaiguri","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Medinipur","Purba Medinipur","South 24 Parganas"]},
  {state:"Andaman and Nicobar Islands",districts:["Nicobar","North and Middle Andaman","South Andaman"]},
  {state:"Chandigarh",districts:["Chandigarh"]},
  {state:"Dadra and Nagar Haveli and Daman and Diu",districts:["Dadra and Nagar Haveli","Daman","Diu"]},
  {state:"Delhi",districts:["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"]},
  {state:"Jammu and Kashmir",districts:["Anantnag","Baramulla","Budgam","Doda","Jammu","Kathua","Kupwara","Poonch","Pulwama","Rajouri","Srinagar","Udhampur"]},
  {state:"Ladakh",districts:["Kargil","Leh"]},
  {state:"Lakshadweep",districts:["Lakshadweep"]},
  {state:"Puducherry",districts:["Karaikal","Mahe","Puducherry","Yanam"]},
];
export const DEFAULT_CONTENT = {
  version:CONTENT_VERSION,
  brandName:"Monarch Blends",
  companyName:"Shree Siddheshwari Enterprise Pvt. Ltd.",
  logoAlt:"Monarch Blends",
  ageGate:{
    title:"18+ User Consent",
    text:"This website contains tobacco-related business information and is intended only for users aged 18 years or above.",
    consentLabel:"I confirm that I am 18 years or older and consent to view this website.",
    yes:"Enter Site",
    no:"Leave Site",
    blockedTitle:"Access Restricted",
    blockedText:"You must be 18 years or older to view this website."
  },
  nav:[
    {k:"home",l:"Home"},{k:"about",l:"About"},{k:"services",l:"Services"},
    {k:"dealer",l:"Dealer / Distributor"},{k:"careers",l:"Careers"},{k:"contact",l:"Contact"}
  ],
  chatWelcome:"Welcome to Monarch Blends. Ask me about our products, dealer programme, or machinery rights.",
  chatPlaceholder:"Ask about Monarch Blends…",
  home:{
    eyebrow:"Formulated in North America ◆ Made in India ◆ Hand-Picked Tobacco",
    title:"Monarch Blends",
    subtitle:"The Sovereign Standard in Premium Tobacco",
    subtitle2:"By Shree Siddheshwari Enterprise Pvt. Ltd.",
    location:"Est. Gujarat, India",
    primaryCta:"Become a Partner",
    secondaryCta:"Our Heritage",
    pillarsEye:"The Monarch Difference",
    pillarsTitle:"Crafted Without Compromise",
    pillars:[
      {n:"01",h:"Hand-Picked Tobacco",p:"Only the highest-grade leaves selected by hand at source — a sovereign blend begins long before the factory floor."},
      {n:"02",h:"Formulated in North America",p:"Developed by tobacco expert in North America, bringing world-class blending precision to a proudly Indian brand."},
      {n:"03",h:"2+ Years of R&D",p:"Over two years of intensive research went into perfecting Monarch Blends before a single product reached market."},
      {n:"04",h:"100% Compliant",p:"Full adherence to COTPA, GST, and all Indian regulations. Ethical, transparent, and legally sound — always."}
    ],
    storyEye:"From Seed to Sovereign",
    storyTitle:"The Monarch Story",
    story:[
      {ico:"🌿",h:"Premium Leaves",p:"Every blend starts with carefully hand-picked, high-quality tobacco leaves selected at origin for character and consistency."},
      {ico:"🔬",h:"Scientific Formula",p:"Developed by tobacco expert in North America over 2+ years and refined until it met our exacting standard."},
      {ico:"🏭",h:"Indian Manufacturing",p:"Proudly manufactured in Gujarat, India — combining international formulation with the spirit of Indian enterprise."},
      {ico:"👑",h:"The Sovereign Result",p:"Monarch Blends — a premium tobacco product standing apart in quality, compliance, and brand equity across India."}
    ]
  },
  marquee:["Hand-Picked Tobacco","Formulated in North America","Made in India 🇮🇳","2+ Years R&D","100% Compliant","Exclusive Machinery Rights","Pan India Distribution","Customisable Tubes"],
  products:{
    eye:"Our Product Section",
    title:"Our Products",
    intro:"A focused portfolio built for B2B partners, dealers, distributors, and manufacturing clients.",
    items:[
      {name:"Cigarettes",desc:"Premium cigarette products developed for consistent quality, compliant trade, and strong retail presentation.",image:"/products/cigarettes.jpg"},
      {name:"Paper Tube",desc:"Customisable cigarette paper tube solutions by blend, size, filter, and output specification.",image:"/products/paper-tube.jpg"},
      {name:"Cigarette Making Machine",desc:"Proprietary cigarette-making machinery with sales support for India and neighbouring countries.",image:"/products/cigarette-making-machine.jpg"},
      {name:"Chemical",desc:"Business-grade chemical supply support for authorised tobacco manufacturing and packaging requirements.",image:"/products/chemical.jpg"}
    ],
    fallbackImage:"/monachblendlogo.jpeg"
  },
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
      "We source only hand-picked, high-quality tobacco leaves. Developed by tobacco expert in North America and refined over 2+ years of R&D, the result competes globally while being proudly Made in India.",
      "We also hold the exclusive master rights to sell our proprietary cigarette manufacturing machinery across India and neighbouring countries — creating a complete ecosystem for our partners that goes well beyond the product itself."
    ],
    quote:"Our formula was not rushed. Over two years of research and development — testing, refining, perfecting — went into every aspect of Monarch Blends before a single product reached a retailer.",
    valuesTitle:"Our Core Values",
    values:[
      {n:"I.",h:"Quality Without Compromise",p:"Hand-picked tobacco, formulated in North America, 2+ years R&D — quality is embedded in every decision."},
      {n:"II.",h:"Integrity & Full Compliance",p:"100% adherence to all regulatory requirements. Transparent dealings with every partner, always."},
      {n:"III.",h:"Partnership First",p:"We grow only when our dealers and distributors grow. Their success is our foundation."},
      {n:"IV.",h:"Indian Pride, Global Standard",p:"Made in India, formulated to world-class standards — we carry both identities with equal pride."},
      {n:"V.",h:"Innovation & Patience",p:"We invested 2+ years before launch because great things cannot be rushed. That patience defines us."}
    ]
  },
  services:{eye:"Core Capabilities",title:"The Full Monarch Offering"},
  dealer:{
    tiersEye:"Partnership Tiers",
    tiersTitle:"Partnership Tiers",
    tiers:[
      {feat:false,badge:"Retail Dealer",icon:"🏪",title:"Retail Dealer",desc:"Sell Monarch Blends directly through your outlet. The perfect entry into one of India's fastest-growing premium tobacco brands.",items:["Low minimum order quantity","Attractive retail margins","POS & branding materials","Consistent supply guarantee","Promotional campaign support"]},
      {feat:true,badge:"Most Popular",icon:"🏢",title:"Area Distributor",desc:"Distribute across your district or region. Exclusive area rights, higher margins, and full commercial support.",items:["Exclusive territory rights","Superior volume margins","Dedicated sales support team","Priority stock allocation","Co-branded marketing materials"]},
      {feat:false,badge:"State Master",icon:"🌐",title:"State Distributor",desc:"Become the master distributor for your entire state. Build a full dealer network with state-wide exclusivity.",items:["Full state-level exclusivity","Best-in-class margins","Direct factory pricing","Full marketing ecosystem","Personal relationship manager"]}
    ],
    applyButton:"Apply",
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
  contact:{
    heading:"Reach Out",
    formTitle:"Send a Message",
    successTitle:"Message Received",
    successText:"Thank you for reaching out. We will respond within 1–2 business days.",
    successButton:"Send Another",
    sendButton:"Send Message ◆",
    savingButton:"Saving to Firebase…",
    enquiryTypes:["Dealer / Distributor Enquiry","Machinery Purchase","Business Partnership","Career / Job Application","Quality Control Analyst","Sales & Distribution Executive","Machinery Sales Executive","Machine Technician","Electrical Technician","Skilled Worker","Marketing Manager","Forklift Driver & Truck Driver","General Enquiry"],
    careerRoles:["Quality Control Analyst","Sales & Distribution Executive","Machinery Sales Executive","Machine Technician","Electrical Technician","Skilled Worker","Marketing Manager","Forklift Driver & Truck Driver"],
    tierLabel:"Partnership Tier",
    stateLabel:"State",
    districtLabel:"District",
    experienceLabel:"Current / Past Business or Work Experience",
    experiencePlaceholder:"Share details about your current or past business/work experience.",
    regions:INDIAN_REGIONS
  },
  footer:{tagline:"Hand-Picked Tobacco ◆ Formulated in North America ◆ Made in India",copyright:"© 2025 Shree Siddheshwari Enterprise Pvt. Ltd.",rights:"All Rights Reserved · Gujarat, India"}
};

// ─── Design tokens ────────────────────────────────────────────
export const G  = "#B8860B";
export const GB = "#F0C040";
export const GP = "#E8D5A3";
export const IV = "#F8F4EC";
export const MU = "rgba(248,244,236,0.5)";
export const BR = "rgba(184,134,11,0.2)";
export const GG = `linear-gradient(135deg,${G},${GB},${GP},${GB},${G})`;
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "monarch2024";

export function mergeContent(base, override) {
  if(Array.isArray(base)) return Array.isArray(override) ? override : base;
  if(!base || typeof base !== "object") return override ?? base;
  const out = {...base};
  Object.keys(override || {}).forEach(key => {
    out[key] = mergeContent(base[key], override[key]);
  });
  return out;
}

