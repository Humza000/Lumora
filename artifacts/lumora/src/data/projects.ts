export interface Project {
  id: string;
  slug: string;
  title: string;
  industry: string;
  category: "Business" | "Trades" | "Restaurants" | "Healthcare" | "E-commerce";
  shortDescription: string;
  heroGradient: string;
  accentColor: string;
  badges: string[];
  challenge: string;
  solution: string;
  keyFeatures: string[];
  technologies: string[];
  results: { label: string; value: string }[];
  galleryGradients: string[];
  featured: boolean;
  previewUrl: string;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "peak-performance-gym",
    title: "Peak Performance Gym",
    industry: "Health & Fitness",
    category: "Business",
    shortDescription:
      "A bold, conversion-driven website for a premium gym chain — featuring online membership sign-ups, class booking, and a trainer showcase.",
    heroGradient: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
    accentColor: "#a855f7",
    badges: ["Membership Portal", "Class Booking", "Performance-First", "Mobile App"],
    challenge:
      "Peak Performance had an outdated website that failed to reflect their premium brand and drove potential members to competitors. Their class schedule was managed via phone calls, creating bottlenecks for both staff and clients. They needed a platform that matched the quality of their facilities.",
    solution:
      "We designed a high-energy, conversion-focused website with real-time class booking, automated membership management, and a trainer profile system. The dark, bold aesthetic was crafted to reflect the energy and ambition of their brand while keeping the UX clean and intuitive.",
    keyFeatures: [
      "Online membership sign-up with automated onboarding emails",
      "Real-time class schedule and booking system",
      "Trainer profiles with specialisations and availability",
      "Member portal for tracking progress and bookings",
      "SEO-optimised blog for fitness content marketing",
      "Fully responsive with PWA capabilities",
    ],
    technologies: ["Next.js", "Tailwind CSS", "Stripe", "PostgreSQL", "Framer Motion", "Vercel"],
    results: [
      { label: "Increase in Online Memberships", value: "+340%" },
      { label: "Reduction in Admin Time", value: "60%" },
      { label: "Avg. Page Load Time", value: "0.8s" },
      { label: "Mobile Conversion Rate", value: "+220%" },
    ],
    galleryGradients: [
      "from-[#0f0c29] to-[#302b63]",
      "from-[#302b63] to-[#24243e]",
      "from-[#1a1a2e] to-[#16213e]",
    ],
    featured: true,
    previewUrl: "https://www.equinox.com",
  },
  {
    id: "2",
    slug: "maison-co",
    title: "Maison & Co",
    industry: "Home & Lifestyle",
    category: "E-commerce",
    shortDescription:
      "A luxury e-commerce experience for a curated homewares brand — editorial photography, AR product preview, and a seamless checkout flow.",
    heroGradient: "from-[#f5f0eb] via-[#e8ddd3] to-[#d4c5b8]",
    accentColor: "#92400e",
    badges: ["E-commerce", "AR Preview", "Shopify Plus", "Editorial Design"],
    challenge:
      "Maison & Co had a strong product catalogue but a generic Shopify theme that did nothing to convey their premium positioning. Cart abandonment was high and average order value was below expectations. Their customers needed to feel confident buying high-ticket homewares online.",
    solution:
      "We built a bespoke Shopify Plus storefront with an editorial aesthetic — rich whitespace, large-format photography, and immersive product pages. AR product preview lets customers visualise pieces in their own homes, and a streamlined checkout reduced friction at every step.",
    keyFeatures: [
      "Custom Shopify Plus storefront with bespoke theme",
      "AR product visualisation (WebXR)",
      "Editorial-style collection pages with storytelling sections",
      "Wishlist and curated lookbook features",
      "Express checkout with Shop Pay, Apple Pay, and Afterpay",
      "Customer account portal with order tracking",
    ],
    technologies: ["Shopify Plus", "Liquid", "WebXR", "Alpine.js", "Cloudinary", "Klaviyo"],
    results: [
      { label: "Increase in Average Order Value", value: "+85%" },
      { label: "Cart Abandonment Reduction", value: "42%" },
      { label: "Revenue Growth (6 months)", value: "+190%" },
      { label: "Google PageSpeed Score", value: "97" },
    ],
    galleryGradients: [
      "from-[#f5f0eb] to-[#e8ddd3]",
      "from-[#e8ddd3] to-[#d4c5b8]",
      "from-[#ede0d4] to-[#f5f0eb]",
    ],
    featured: true,
    previewUrl: "https://www.heals.com",
  },
  {
    id: "3",
    slug: "sterling-legal-group",
    title: "Sterling Legal Group",
    industry: "Legal Services",
    category: "Business",
    shortDescription:
      "A trust-building, lead-generating website for a multi-practice law firm — professional, accessible, and engineered for high-value client acquisition.",
    heroGradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    accentColor: "#c9a96e",
    badges: ["Lead Generation", "CRM Integration", "Accessibility", "SEO"],
    challenge:
      "Sterling Legal Group's previous site looked like it was built in 2010. Prospective clients — often making stressful decisions — were bouncing quickly. The firm needed to project authority and empathy simultaneously, and their intake process was entirely manual.",
    solution:
      "We designed a deep navy and gold identity that communicates prestige and trust. Practice area pages were structured to answer the exact questions anxious clients search for, with clear CTAs and an automated intake form feeding directly into their CRM. WCAG 2.1 AA accessibility was implemented throughout.",
    keyFeatures: [
      "Practice area landing pages optimised for local SEO",
      "Automated client intake forms with CRM integration",
      "Attorney profiles with credentials and case results",
      "Secure client document portal",
      "Live chat widget integration",
      "WCAG 2.1 AA accessibility compliance",
    ],
    technologies: ["Next.js", "Sanity CMS", "HubSpot CRM", "Tailwind CSS", "Vercel", "Cloudflare"],
    results: [
      { label: "Increase in Qualified Leads", value: "+280%" },
      { label: "Avg. Time on Site", value: "4m 20s" },
      { label: "Organic Search Traffic Growth", value: "+165%" },
      { label: "Client Intake Time Saved / Week", value: "12hrs" },
    ],
    galleryGradients: [
      "from-[#1a1a2e] to-[#16213e]",
      "from-[#16213e] to-[#0f3460]",
      "from-[#0f3460] to-[#1a1a2e]",
    ],
    featured: true,
    previewUrl: "https://www.clarkhill.com",
  },
  {
    id: "4",
    slug: "the-workshop-cafe",
    title: "The Workshop Café",
    industry: "Food & Beverage",
    category: "Restaurants",
    shortDescription:
      "A warm, character-rich website for an independent café — online table reservations, a dynamic menu, and a loyalty programme integration.",
    heroGradient: "from-[#3b2314] via-[#6b3a1f] to-[#a0522d]",
    accentColor: "#f59e0b",
    badges: ["Online Reservations", "Dynamic Menu", "Loyalty Programme", "Local SEO"],
    challenge:
      "The Workshop Café had built a loyal following but relied entirely on phone bookings and word of mouth. No-shows were hurting revenue and there was no way to capture customer data for marketing. Their social media presence wasn't translating into bookings.",
    solution:
      "We created a site that felt as warm and characterful as the café itself — rich textures, earthy tones, and generous photography. An integrated reservation system reduced no-shows with SMS reminders, and a stamp-card loyalty scheme was digitised and embedded into the site.",
    keyFeatures: [
      "Real-time table reservation system with SMS reminders",
      "Dynamic seasonal menu updated via CMS",
      "Digital loyalty programme with QR code integration",
      "Events calendar for special nights and pop-ups",
      "Google Business integration for review management",
      "Gift voucher purchasing system",
    ],
    technologies: ["React", "Contentful CMS", "Stripe", "Twilio SMS", "Tailwind CSS", "Netlify"],
    results: [
      { label: "Reduction in No-Shows", value: "55%" },
      { label: "Online Bookings (Monthly)", value: "800+" },
      { label: "Loyalty Programme Sign-ups", value: "1,200" },
      { label: "Increase in Weekend Revenue", value: "+38%" },
    ],
    galleryGradients: [
      "from-[#3b2314] to-[#6b3a1f]",
      "from-[#6b3a1f] to-[#a0522d]",
      "from-[#a0522d] to-[#3b2314]",
    ],
    featured: false,
    previewUrl: "https://www.dishoom.com",
  },
  {
    id: "5",
    slug: "brightsmile-dental",
    title: "BrightSmile Dental",
    industry: "Healthcare",
    category: "Healthcare",
    shortDescription:
      "A reassuring, patient-first dental practice website — online appointment booking, treatment guides, and a before/after smile gallery.",
    heroGradient: "from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]",
    accentColor: "#0284c7",
    badges: ["Appointment Booking", "Patient Portal", "HIPAA Compliant", "Treatment Guides"],
    challenge:
      "BrightSmile was losing new patients to a competitor with a more modern online presence. Dental anxiety is real — their old site did nothing to reassure nervous patients or clearly explain treatments. Phone lines were overwhelmed with appointment requests.",
    solution:
      "We built a calm, clinical-yet-welcoming website centred on patient reassurance. Clear treatment pages with plain-English explanations, an easy online booking flow, and a smile gallery showcasing real results. The patient portal allows secure form submission and appointment management.",
    keyFeatures: [
      "24/7 online appointment booking with calendar sync",
      "Treatment explainer pages with FAQs and pricing guides",
      "Before & after gallery with filtering by treatment type",
      "Secure patient intake forms (HIPAA compliant)",
      "Dentist profile pages with patient reviews",
      "Emergency dental contact system",
    ],
    technologies: ["Next.js", "Tailwind CSS", "Cal.com API", "Contentful", "Cloudinary", "AWS"],
    results: [
      { label: "Online Appointments (Monthly)", value: "350+" },
      { label: "Reduction in Phone Enquiries", value: "68%" },
      { label: "New Patient Growth", value: "+145%" },
      { label: "Google Rating", value: "4.9★" },
    ],
    galleryGradients: [
      "from-[#e0f2fe] to-[#bae6fd]",
      "from-[#bae6fd] to-[#7dd3fc]",
      "from-[#7dd3fc] to-[#e0f2fe]",
    ],
    featured: false,
    previewUrl: "https://www.bupa.co.uk/dental",
  },
  {
    id: "6",
    slug: "tradecraft-plumbing",
    title: "TradeCraft Plumbing",
    industry: "Trades & Construction",
    category: "Trades",
    shortDescription:
      "A professional, no-nonsense website for a local plumbing business — instant quoting, emergency call-out, and a review showcase that builds instant trust.",
    heroGradient: "from-[#1e3a5f] via-[#2563a8] to-[#3b82f6]",
    accentColor: "#f97316",
    badges: ["Instant Quote Form", "Emergency CTA", "Google Reviews", "Local SEO"],
    challenge:
      "TradeCraft had 15 years of experience and hundreds of 5-star reviews, but their website looked unprofessional and didn't rank for any local search terms. They were relying on word of mouth while competitors with worse service were winning jobs via Google.",
    solution:
      "We built a clean, authoritative site that leads with their strongest asset: trust. Reviews are prominently displayed, services are crystal clear, and an instant quote form captures leads 24/7. Local SEO was built into the foundation — from schema markup to suburb-specific landing pages.",
    keyFeatures: [
      "Instant online quote form with automated follow-up",
      "Emergency call-out button with one-tap calling on mobile",
      "Google Reviews integration (live display)",
      "Service area pages for local suburb SEO",
      "Before & after project gallery",
      "Accreditation and licence badge display",
    ],
    technologies: ["React", "Tailwind CSS", "Google Places API", "Netlify Forms", "Vercel", "Schema.org"],
    results: [
      { label: "Increase in Google Organic Leads", value: "+310%" },
      { label: "Online Quote Requests (Monthly)", value: "120+" },
      { label: "Page 1 Keyword Rankings", value: "47" },
      { label: "Average Lead Response Time", value: "< 2hrs" },
    ],
    galleryGradients: [
      "from-[#1e3a5f] to-[#2563a8]",
      "from-[#2563a8] to-[#3b82f6]",
      "from-[#3b82f6] to-[#1e3a5f]",
    ],
    featured: false,
    previewUrl: "https://www.plumbingforce.co.uk",
  },
];

export const categories = ["All", "Business", "Trades", "Restaurants", "Healthcare", "E-commerce"] as const;
export type Category = (typeof categories)[number];
