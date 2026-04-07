import React, { useState, useMemo, useEffect } from "react";
import {
  Search, ShoppingCart, Heart, Bell, Menu, ChevronDown, Facebook, Linkedin, Instagram,
  Mail, Phone, MapPin, Clock, Star, Check, Truck, Shield, Headphones, Users, Package,
  Award, ThumbsUp, Zap, Lock, ChevronRight, ChevronLeft, Plus, Minus, X, Eye, ArrowRight,
  MessageCircle, User, Share2, Send, Flame, Info
} from "lucide-react";

// ==================== DATA ====================
const CATEGORIES = [
  "AI Tools", "Writing Tools", "Productivity", "Streaming", "Education",
  "VPN & Security", "Cloud Storage", "Software Keys", "Utilities", "Design Tools"
];

const DURATION_MULT = { "1 Month": 1, "3 Months": 2.7, "6 Months": 5, "12 Months": 9 };
const DURATIONS = Object.keys(DURATION_MULT);

const MARKS = {
  pen: <path d="M20 60 L50 20 L70 40 L40 70 L20 70 Z" />,
  spark: <path d="M45 10 L52 38 L80 45 L52 52 L45 80 L38 52 L10 45 L38 38 Z" />,
  brain: <path d="M30 25 Q20 25 20 40 Q15 45 20 55 Q20 70 35 70 L55 70 Q70 70 70 55 Q75 45 70 40 Q70 25 60 25 Q55 15 45 20 Q35 15 30 25 Z" />,
  bolt: <path d="M50 10 L25 50 L42 50 L35 85 L65 40 L48 40 L55 10 Z" />,
  play: <path d="M25 15 L25 75 L75 45 Z" />,
  cloud: <path d="M25 60 Q10 60 10 45 Q10 30 25 30 Q25 20 40 20 Q60 20 60 35 Q80 35 80 50 Q80 65 65 65 L25 65 Z" />,
  key: <path d="M55 30 A15 15 0 1 1 40 45 L15 70 L25 80 L30 75 L35 80 L42 73 L48 78 Z" />,
  grad: <path d="M10 35 L45 20 L80 35 L45 50 Z M20 42 L20 60 Q45 72 70 60 L70 42" />,
  shield: <path d="M45 10 L20 20 L20 45 Q20 70 45 85 Q70 70 70 45 L70 20 Z" />,
  music: <path d="M30 20 L70 15 L70 55 Q70 65 60 65 Q50 65 50 55 Q50 45 60 45 Q65 45 70 48 L70 25 L35 30 L35 65 Q35 75 25 75 Q15 75 15 65 Q15 55 25 55 Q30 55 35 58 Z" />,
  grid: <path d="M15 15 L40 15 L40 40 L15 40 Z M50 15 L75 15 L75 40 L50 40 Z M15 50 L40 50 L40 75 L15 75 Z M50 50 L75 50 L75 75 L50 75 Z" />,
  doc: <path d="M20 10 L55 10 L70 25 L70 80 L20 80 Z M55 10 L55 25 L70 25" />,
};

const MARK_COLORS = ["#6d28d9", "#0d9488", "#0891b2", "#7c3aed", "#4f46e5"];

const ProductMark = ({ type, colorIdx = 0, size = 80 }) => (
  <svg viewBox="0 0 90 90" width={size} height={size} style={{ color: MARK_COLORS[colorIdx % MARK_COLORS.length] }}>
    <g fill="currentColor" fillRule="evenodd">{MARKS[type]}</g>
  </svg>
);

const PRODUCTS = [
  { id: 1, slug: "paperpal-prime", name: "Paperpal Prime Subscription", cat: "Writing Tools", base: 8.99, stock: true, badge: "Bestseller", mark: "pen", ci: 0, watchers: 14, sold24: 23 },
  { id: 2, slug: "gamma-ai-pro", name: "Gamma AI Pro Subscription", cat: "AI Tools", base: 6.99, stock: true, badge: "New", mark: "spark", ci: 1, watchers: 8, sold24: 11 },
  { id: 3, slug: "beautiful-ai", name: "Beautiful.ai Subscription", cat: "AI Tools", base: 9.99, stock: true, mark: "grid", ci: 2, watchers: 5, sold24: 7 },
  { id: 4, slug: "iask-premium", name: "iAsk Premium Subscription", cat: "AI Tools", base: 4.99, stock: true, mark: "brain", ci: 3, watchers: 6, sold24: 9 },
  { id: 5, slug: "stealthgpt", name: "StealthGPT Subscription", cat: "AI Tools", base: 7.99, stock: false, mark: "bolt", ci: 0, watchers: 3, sold24: 4 },
  { id: 6, slug: "claude-pro", name: "Claude Pro Subscription", cat: "AI Tools", base: 6.99, stock: true, badge: "Hot", mark: "brain", ci: 0, watchers: 27, sold24: 41 },
  { id: 7, slug: "grok-premium", name: "Grok Premium Subscription", cat: "AI Tools", base: 8.99, stock: true, mark: "bolt", ci: 3, watchers: 9, sold24: 12 },
  { id: 8, slug: "jenni-ai", name: "Jenni AI Subscription", cat: "Writing Tools", base: 5.99, stock: true, mark: "pen", ci: 1, watchers: 4, sold24: 6 },
  { id: 9, slug: "quillbot", name: "QuillBot Premium Subscription", cat: "Writing Tools", base: 3.99, stock: true, badge: "Best Deal", mark: "pen", ci: 2, watchers: 11, sold24: 18 },
  { id: 10, slug: "perplexity-pro", name: "Perplexity Pro Subscription", cat: "AI Tools", base: 6.99, stock: true, mark: "spark", ci: 3, watchers: 15, sold24: 22 },
  { id: 11, slug: "netflix-premium", name: "Netflix Premium Subscription", cat: "Streaming", base: 3.49, stock: true, badge: "Bestseller", mark: "play", ci: 0, watchers: 38, sold24: 62 },
  { id: 12, slug: "disney-plus", name: "Disney+ Subscription", cat: "Streaming", base: 3.99, stock: true, mark: "play", ci: 2, watchers: 19, sold24: 28 },
  { id: 13, slug: "hbo-max", name: "HBO Max Subscription", cat: "Streaming", base: 4.49, stock: true, mark: "play", ci: 3, watchers: 12, sold24: 17 },
  { id: 14, slug: "prime-video", name: "Prime Video Subscription", cat: "Streaming", base: 2.99, stock: true, mark: "play", ci: 1, watchers: 10, sold24: 14 },
  { id: 15, slug: "google-one-2tb", name: "Google One 2TB Subscription", cat: "Cloud Storage", base: 4.99, stock: true, mark: "cloud", ci: 0, watchers: 7, sold24: 11 },
  { id: 16, slug: "google-workspace", name: "Google Workspace Subscription", cat: "Productivity", base: 5.99, stock: true, mark: "doc", ci: 1, watchers: 6, sold24: 9 },
  { id: 17, slug: "google-drive-100gb", name: "Google Drive 100GB Subscription", cat: "Cloud Storage", base: 1.99, stock: true, mark: "cloud", ci: 2, watchers: 4, sold24: 8 },
  { id: 18, slug: "microsoft-365", name: "Microsoft 365 Family Subscription", cat: "Productivity", base: 5.49, stock: true, badge: "-55%", mark: "doc", ci: 3, watchers: 21, sold24: 33 },
  { id: 19, slug: "windows-11-pro", name: "Windows 11 Pro Retail Key", cat: "Software Keys", base: 19.99, stock: true, badge: "Hot", mark: "key", ci: 0, watchers: 45, sold24: 71, keyOnly: true },
  { id: 20, slug: "office-2024", name: "Office 2024 Pro Plus Key", cat: "Software Keys", base: 29.99, stock: true, mark: "key", ci: 1, watchers: 32, sold24: 48, keyOnly: true },
  { id: 21, slug: "coursera-plus", name: "Coursera Plus Subscription", cat: "Education", base: 9.99, stock: true, mark: "grad", ci: 0, watchers: 13, sold24: 19 },
  { id: 22, slug: "duolingo-super", name: "Duolingo Super Subscription", cat: "Education", base: 1.99, stock: true, mark: "grad", ci: 2, watchers: 8, sold24: 14 },
  { id: 23, slug: "grammarly", name: "Grammarly Premium Subscription", cat: "Writing Tools", base: 2.99, stock: true, badge: "-83%", mark: "pen", ci: 3, watchers: 29, sold24: 44 },
  { id: 24, slug: "canva-pro", name: "Canva Pro Subscription", cat: "Design Tools", base: 2.49, stock: true, mark: "spark", ci: 2, watchers: 16, sold24: 25 },
  { id: 25, slug: "linkedin-premium", name: "LinkedIn Premium Career", cat: "Utilities", base: 4.99, stock: true, mark: "doc", ci: 0, watchers: 7, sold24: 10 },
  { id: 26, slug: "coursera-career", name: "Coursera Career Bundle", cat: "Education", base: 7.99, stock: false, mark: "grad", ci: 1, watchers: 2, sold24: 3 },
  { id: 27, slug: "nordvpn", name: "NordVPN Subscription", cat: "VPN & Security", base: 2.49, stock: true, badge: "-82%", mark: "shield", ci: 0, watchers: 26, sold24: 39 },
  { id: 28, slug: "expressvpn", name: "ExpressVPN Subscription", cat: "VPN & Security", base: 3.49, stock: true, mark: "shield", ci: 1, watchers: 18, sold24: 27 },
  { id: 29, slug: "surfshark", name: "Surfshark One Subscription", cat: "VPN & Security", base: 2.99, stock: true, mark: "shield", ci: 2, watchers: 9, sold24: 13 },
  { id: 30, slug: "apple-music", name: "Apple Music Subscription", cat: "Streaming", base: 2.49, stock: true, mark: "music", ci: 3, watchers: 14, sold24: 20 },
  { id: 31, slug: "apple-tv", name: "Apple TV+ Subscription", cat: "Streaming", base: 2.49, stock: true, mark: "play", ci: 0, watchers: 8, sold24: 11 },
  { id: 32, slug: "icloud-2tb", name: "iCloud+ 2TB Subscription", cat: "Cloud Storage", base: 3.99, stock: true, mark: "cloud", ci: 1, watchers: 6, sold24: 9 },
  { id: 33, slug: "spotify-premium", name: "Spotify Premium Subscription", cat: "Streaming", base: 3.49, stock: true, badge: "Bestseller", mark: "music", ci: 2, watchers: 31, sold24: 47 },
  { id: 34, slug: "youtube-premium", name: "YouTube Premium Subscription", cat: "Streaming", base: 2.49, stock: true, mark: "play", ci: 3, watchers: 22, sold24: 34 },
  { id: 35, slug: "tidal-hifi", name: "Tidal HiFi Plus Subscription", cat: "Streaming", base: 2.99, stock: true, mark: "music", ci: 0, watchers: 5, sold24: 7 },
  { id: 36, slug: "notion-plus", name: "Notion Plus Subscription", cat: "Productivity", base: 1.49, stock: true, mark: "doc", ci: 2, watchers: 11, sold24: 16 },
  { id: 37, slug: "malwarebytes", name: "Malwarebytes Premium Subscription", cat: "VPN & Security", base: 1.99, stock: true, mark: "shield", ci: 3, watchers: 6, sold24: 9 },
  { id: 38, slug: "1password", name: "1Password Family Subscription", cat: "VPN & Security", base: 2.49, stock: true, mark: "key", ci: 1, watchers: 8, sold24: 12 },
];

const REVIEWS = [
  { name: "Sarah Johnson", text: "Ordered Netflix Premium — delivered in under 10 minutes. Worked perfectly on day one. Visual Illusion has become my go-to.", rating: 5, source: "Trustpilot", avatar: "SJ" },
  { name: "Marcus Chen", text: "Bought Office 2024 Pro Plus. Legitimate key, activated instantly. Support answered my pre-sale question on WhatsApp within 2 minutes.", rating: 5, source: "Facebook", avatar: "MC" },
  { name: "Priya Patel", text: "Skeptical at first about the price of NordVPN. Turned out completely genuine, works across 5 devices. Saved me about $230.", rating: 5, source: "Trustpilot", avatar: "PP" },
  { name: "James O'Connor", text: "Grammarly Premium for 83% off felt too good to be true. It wasn't — legit account, no issues after 4 months.", rating: 5, source: "Facebook Group", avatar: "JO" },
  { name: "Amelia Wright", text: "Canva Pro annual subscription activated on my existing account without any hassle. Clean process.", rating: 4, source: "Trustpilot", avatar: "AW" },
  { name: "David Kim", text: "The Coursera Plus bundle is the real deal. Full access to the catalogue, certificates included.", rating: 5, source: "Facebook Page", avatar: "DK" },
  { name: "Fatima Al-Sayed", text: "Fast delivery of Spotify Premium, works on my family plan. Support helped me with account switching.", rating: 5, source: "Trustpilot", avatar: "FA" },
  { name: "Liam Brown", text: "Windows 11 Pro key activated on first try. Instructions were clear. Would order again.", rating: 5, source: "Facebook", avatar: "LB" },
  { name: "Sofia Martinez", text: "Disney+ account delivered quickly, whole family uses it. No issues for 6 months running.", rating: 5, source: "Trustpilot", avatar: "SM" },
];

const BLOGS = [
  { id: 1, title: "Claude vs ChatGPT in 2026: Which Writing Assistant Actually Ships Better Work?", excerpt: "A side-by-side comparison across long-form drafting, code review, and structured data tasks — with numbers, not vibes.", date: "Mar 28, 2026", author: "Editorial Team", mark: "brain", cat: "AI Tools" },
  { id: 2, title: "The Productivity Stack That Replaced 11 Apps With 3", excerpt: "How one small team cut their SaaS spend by 60% without losing a single workflow. The tools, the migration, the regrets.", date: "Mar 21, 2026", author: "Marcus L.", mark: "grid", cat: "Productivity" },
  { id: 3, title: "Netflix, Disney+, Prime: The Streaming Math for 2026", excerpt: "Price hikes, ad tiers, shared plans. What's actually worth paying for this year — and what to drop.", date: "Mar 14, 2026", author: "Priya R.", mark: "play", cat: "Streaming" },
  { id: 4, title: "QuillBot, Grammarly, Jenni: Writing Tool Shootout", excerpt: "Tested on 40 real documents. Which tool catches what, and where each one quietly fails.", date: "Mar 07, 2026", author: "Editorial Team", mark: "pen", cat: "Writing" },
  { id: 5, title: "VPN Buying Guide: Beyond the Marketing", excerpt: "Jurisdiction, logging policy, actual speed tests. The five questions that matter before you pay.", date: "Feb 28, 2026", author: "Security Desk", mark: "shield", cat: "VPN" },
  { id: 6, title: "Is Coursera Plus Worth $399? The Honest Math", excerpt: "We enrolled in 14 courses. Completed 9. Here's what the certificates actually did for careers.", date: "Feb 21, 2026", author: "Editorial Team", mark: "grad", cat: "Education" },
];

const FAQS = [
  { q: "How do I receive my product?", a: "Once your order is confirmed, login credentials, activation keys, or redemption codes are delivered to your email — typically within 5 to 30 minutes. Time-sensitive orders are often delivered within minutes during business hours." },
  { q: "Are the products authentic?", a: "Yes. Every product is sourced through legitimate channels and verified before delivery. If a product fails to activate, we replace it or issue a full refund." },
  { q: "How long does delivery take?", a: "Most digital products are delivered within 5 to 30 minutes during working hours. Larger subscription products may take up to 2 hours during peak periods." },
  { q: "What payment methods are accepted?", a: "We accept major credit and debit cards, PayPal, bKash, Nagad, Rocket, bank transfer, and select cryptocurrencies. All transactions are encrypted end-to-end." },
  { q: "How do I get support after purchase?", a: "Email support, live chat on our site, and WhatsApp are available. WhatsApp is typically the fastest route — average response under 5 minutes during working hours." },
];

const HOME_SECTIONS = [
  { title: "AI, Grammar and Writing Tools", ids: [1,2,3,4,5,6,7,8,9,10] },
  { title: "Streaming Collection", ids: [11,12,13,14,33,34,35] },
  { title: "Google Products", ids: [15,16,17] },
  { title: "Microsoft Products", ids: [18,19,20] },
  { title: "Edu-Tech Tools", ids: [21,22,26] },
  { title: "Utilities", ids: [23,24,25,36] },
  { title: "Security & VPN Tools", ids: [27,28,29,37,38] },
  { title: "Apple Products", ids: [30,31,32] },
];

const POLICY = {
  shared: {
    en: [
      "A shared account means multiple customers access the same account under controlled usage limits.",
      "Suitable for individual learners, freelancers, and budget-conscious users who do not need administrative access.",
      "Usage rules: do not change account password, email, or any profile information. Do not log out the account from shared devices.",
      "Device limit varies per product — typically one active device at a time for shared plans.",
      "Resale of shared account access is strictly prohibited and will result in immediate termination without refund.",
      "Account remains the property of Visual Illusion. Delivery is via email login credentials only.",
      "Violation of any rule above voids the warranty and forfeits any remaining balance on the subscription."
    ],
    bn: [
      "শেয়ার্ড অ্যাকাউন্ট মানে একই অ্যাকাউন্টে একাধিক গ্রাহক নির্দিষ্ট ব্যবহার-সীমার মধ্যে প্রবেশ করেন।",
      "এটি ব্যক্তিগত শিক্ষার্থী, ফ্রিল্যান্সার এবং বাজেট-সচেতন ব্যবহারকারীদের জন্য উপযোগী, যাদের প্রশাসনিক অ্যাক্সেস প্রয়োজন নেই।",
      "ব্যবহারের নিয়ম: অ্যাকাউন্টের পাসওয়ার্ড, ইমেইল বা প্রোফাইলের কোনো তথ্য পরিবর্তন করবেন না। শেয়ার্ড ডিভাইস থেকে অ্যাকাউন্ট লগ-আউট করবেন না।",
      "ডিভাইস লিমিট পণ্য অনুযায়ী ভিন্ন — সাধারণত শেয়ার্ড প্ল্যানে একসাথে একটি ডিভাইস সক্রিয় থাকে।",
      "শেয়ার্ড অ্যাকাউন্ট পুনরায় বিক্রি করা সম্পূর্ণ নিষিদ্ধ এবং তাৎক্ষণিকভাবে সেবা বাতিল হবে, কোনো রিফান্ড দেওয়া হবে না।",
      "অ্যাকাউন্টটির মালিকানা Visual Illusion-এর। ইমেইলের মাধ্যমে লগইন তথ্য দেওয়া হয়।",
      "উপরের যেকোনো নিয়ম লঙ্ঘন ওয়ারেন্টি বাতিল করে এবং সাবস্ক্রিপশনের বাকি সময়ের দাবি নষ্ট করে।"
    ]
  },
  terms: {
    en: [
      "Orders are placed through your Visual Illusion dashboard after signing in to a verified customer account.",
      "Sign-in is required to access order history, delivery details, and support tickets.",
      "Delivery is digital — credentials, keys, or redemption codes arrive via email within 5 to 30 minutes during working hours.",
      "WhatsApp support is available during posted working hours. Out-of-hours messages are answered on the next working day.",
      "Warranty covers activation failure, credential errors, and account lockout caused by us — not by customer misuse.",
      "Misuse, policy violation, or resale voids the warranty. No refund or replacement will be issued in such cases.",
      "Service hours: Mon–Sun, 9am–11pm. Delivery delays outside these hours are possible during high-volume periods."
    ],
    bn: [
      "সাইন ইন করে Visual Illusion ড্যাশবোর্ড থেকে অর্ডার সম্পন্ন করতে হবে।",
      "অর্ডার হিস্ট্রি, ডেলিভারি বিবরণ এবং সাপোর্ট টিকেট দেখতে সাইন-ইন বাধ্যতামূলক।",
      "ডেলিভারি ডিজিটাল — লগইন তথ্য, কী বা রিডেম্পশন কোড কর্মঘণ্টার মধ্যে ৫ থেকে ৩০ মিনিটের মধ্যে ইমেইলে পৌঁছে যায়।",
      "WhatsApp সাপোর্ট কর্মঘণ্টায় পাওয়া যাবে। কর্মঘণ্টার বাইরের বার্তার উত্তর পরবর্তী কর্মদিবসে দেওয়া হবে।",
      "ওয়ারেন্টি অ্যাক্টিভেশন ব্যর্থতা, ক্রেডেনশিয়াল ত্রুটি এবং আমাদের কারণে অ্যাকাউন্ট লকআউট কভার করে — গ্রাহকের অপব্যবহারের কারণে নয়।",
      "অপব্যবহার, নীতি লঙ্ঘন বা পুনঃবিক্রয় ওয়ারেন্টি বাতিল করে। এক্ষেত্রে কোনো রিফান্ড বা রিপ্লেসমেন্ট দেওয়া হবে না।",
      "সেবা সময়: সোম–রবি, সকাল ৯টা – রাত ১১টা। উচ্চ-চাপের সময়ে এই সময়ের বাইরে ডেলিভারি বিলম্ব সম্ভব।"
    ]
  },
  refund: {
    en: [
      "Refund is issued if the product cannot be delivered due to stock or sourcing failure on our end.",
      "Replacement is issued if credentials fail to activate within 24 hours of delivery, verified by screenshot evidence.",
      "Exchange to another product of equal value is available within 24 hours of delivery, provided credentials have not been used.",
      "Stock-related refunds are processed within 3 working days to the original payment method.",
      "Customer misuse — password change, policy violation, resale — permanently excludes the order from refund or replacement.",
      "Proof of failure is required for replacement claims: screenshot of error, timestamp, and account email."
    ],
    bn: [
      "আমাদের স্টক বা সোর্সিং ব্যর্থতার কারণে পণ্য সরবরাহ করা না গেলে রিফান্ড দেওয়া হয়।",
      "ডেলিভারির ২৪ ঘণ্টার মধ্যে ক্রেডেনশিয়াল অ্যাক্টিভেট না হলে স্ক্রিনশট প্রমাণসহ রিপ্লেসমেন্ট দেওয়া হয়।",
      "ক্রেডেনশিয়াল ব্যবহার না করা হলে ২৪ ঘণ্টার মধ্যে সমমূল্যের অন্য পণ্যে পরিবর্তন করা যাবে।",
      "স্টক-সম্পর্কিত রিফান্ড মূল পেমেন্ট পদ্ধতিতে ৩ কর্মদিবসের মধ্যে প্রক্রিয়া করা হয়।",
      "গ্রাহকের অপব্যবহার — পাসওয়ার্ড পরিবর্তন, নীতি লঙ্ঘন, পুনঃবিক্রয় — অর্ডারটিকে রিফান্ড বা রিপ্লেসমেন্ট থেকে স্থায়ীভাবে বাদ দেয়।",
      "রিপ্লেসমেন্ট দাবির জন্য ত্রুটির স্ক্রিনশট, টাইমস্ট্যাম্প এবং অ্যাকাউন্ট ইমেইলের প্রমাণ প্রয়োজন।"
    ]
  }
};

// ==================== PRIMITIVES ====================
const Btn = ({ children, variant = "primary", className = "", ...p }) => {
  const variants = {
    primary: "bg-violet-700 hover:bg-violet-800 text-white px-5 py-2.5 shadow-sm",
    ghost: "text-violet-700 hover:bg-violet-50 px-4 py-2",
    outline: "border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-5 py-2.5",
    dark: "bg-slate-900 hover:bg-black text-white px-5 py-2.5",
  };
  return <button className={`inline-flex items-center justify-center gap-2 font-medium text-sm rounded transition-colors ${variants[variant]} ${className}`} {...p}>{children}</button>;
};

const Chip = ({ children, tone = "violet", className = "" }) => {
  const tones = {
    violet: "bg-violet-50 text-violet-800 border-violet-200",
    red: "bg-red-50 text-red-700 border-red-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200"
  };
  return <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 border rounded ${tones[tone]} ${className}`}>{children}</span>;
};

const StarRow = ({ n = 5, size = 13 }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size} className={i < n ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
    ))}
  </div>
);

const SectionHead = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between mb-6 pb-3 border-b border-slate-900">
    <div>
      {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-violet-700 mb-1.5">{eyebrow}</p>}
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
    </div>
    {action}
  </div>
);

const ProductThumb = ({ p, size = 68 }) => (
  <div className="relative w-full aspect-square bg-white border border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-violet-300 transition-colors">
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, #6d28d9 1px, transparent 0)`,
      backgroundSize: "16px 16px"
    }} />
    <ProductMark type={p.mark} colorIdx={p.ci} size={size} />
  </div>
);

// ==================== PRODUCT CARD ====================
const ProductCard = ({ p, onOpen, onAdd }) => (
  <article className="group bg-white border border-slate-200 hover:border-slate-900 transition-all flex flex-col">
    <div className="relative">
      <button onClick={() => onOpen(p)} className="block w-full">
        <ProductThumb p={p} />
      </button>
      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
        {p.badge && <Chip tone={p.badge.startsWith("-") ? "red" : "violet"}>{p.badge}</Chip>}
        {!p.stock && <Chip tone="red">Out of Stock</Chip>}
      </div>
      <button onClick={() => onOpen(p)} className="absolute bottom-2 right-2 bg-slate-900 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Quick view">
        <Eye size={14} />
      </button>
    </div>
    <div className="p-3.5 flex flex-col flex-grow border-t border-slate-100">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{p.cat}</p>
      <button onClick={() => onOpen(p)} className="text-left">
        <h3 className="font-semibold text-slate-900 text-[13px] leading-snug line-clamp-2 min-h-[36px] hover:text-violet-700 transition-colors">{p.name}</h3>
      </button>
      <div className="flex items-baseline justify-between mt-2 mb-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] text-slate-500">from</span>
          <span className="text-base font-bold text-slate-900">${p.base.toFixed(2)}</span>
        </div>
        <span className="text-[10px] text-slate-400">{p.sold24} sold</span>
      </div>
      <button onClick={() => p.stock && onAdd(p)} disabled={!p.stock} className={`mt-auto w-full py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${p.stock ? "bg-slate-900 hover:bg-violet-700 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
        {p.stock ? "Add to Cart" : "Unavailable"}
      </button>
    </div>
  </article>
);

// ==================== HEADER ====================
const Header = ({ nav, navigate, cart, wishlist, catOpen, setCatOpen, query, setQuery, setCartOpen }) => {
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-900">
      <div className="bg-slate-900 text-slate-300 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Clock size={12} /> Mon–Sun: 9am–11pm</span>
            <span className="hidden md:flex items-center gap-1.5"><Mail size={12} /> support@visualillusion.shop</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-white"><Facebook size={13} /></a>
            <a href="#" className="hover:text-white"><Linkedin size={13} /></a>
            <a href="#" className="hover:text-white"><Instagram size={13} /></a>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
          <button onClick={() => navigate("home")} className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center relative">
              <div className="absolute inset-1 border border-violet-500" />
              <span className="text-white font-black text-lg relative">V</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-slate-900 text-[17px] leading-none tracking-tight">Visual Illusion</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-[0.2em] mt-0.5">Digital Marketplace</div>
            </div>
          </button>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => { setQuery(e.target.value); if (e.target.value) navigate("shop"); }} placeholder="Search Tools" className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-colors" />
              <button className="absolute right-0 top-0 bottom-0 bg-slate-900 hover:bg-violet-700 text-white text-xs font-semibold uppercase tracking-wider px-5 transition-colors">Search</button>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button className="p-2 text-slate-600 hover:text-violet-700 hidden sm:block relative">
              <Heart size={18} />
              {wishlist.length > 0 && <span className="absolute top-0.5 right-0.5 bg-violet-700 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
            </button>
            <button className="p-2 text-slate-600 hover:text-violet-700 hidden sm:block"><Bell size={18} /></button>
            <button onClick={() => setCartOpen(true)} className="flex items-center gap-2 p-2 pr-3 text-slate-700 hover:text-violet-700 relative">
              <ShoppingCart size={18} />
              <span className="text-xs font-bold hidden lg:inline">${cartTotal.toFixed(2)}</span>
              {cart.length > 0 && <span className="absolute top-0.5 right-0.5 bg-violet-700 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
            </button>
            <Btn className="hidden sm:inline-flex ml-2">Sign In</Btn>
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 py-2.5 border-b border-slate-200">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); if (e.target.value) navigate("shop"); }} placeholder="Search Tools" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm" />
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
          <div className="relative">
            <button onClick={() => setCatOpen(!catOpen)} className="flex items-center gap-2 bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 transition-colors">
              <Menu size={14} /> All Categories <ChevronDown size={14} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 bg-white shadow-2xl border border-slate-200 w-64 z-50">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => { setCatOpen(false); navigate("shop"); setQuery(c); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 border-b border-slate-100 last:border-0 transition-colors">{c}</button>
                ))}
              </div>
            )}
          </div>
          <nav className="flex items-center overflow-x-auto">
            {[["Home","home"],["Shop","shop"],["About Us","about"],["Reviews","reviews"],["Blogs","blogs"],["Contact Us","contact"]].map(([label, key]) => (
              <button key={key} onClick={() => navigate(key)} className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${nav === key ? "text-violet-700" : "text-slate-700 hover:text-violet-700"}`}>{label}</button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

// ==================== CART DRAWER ====================
const CartDrawer = ({ open, onClose, cart, setCart }) => {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const updateQty = (key, delta) => setCart(cart.map(i => i.key === key ? {...i, qty: Math.max(1, i.qty + delta)} : i));
  const remove = (key) => setCart(cart.filter(i => i.key !== key));
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60" />
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900">
          <h3 className="font-black text-base text-slate-900 uppercase tracking-wider">Cart ({cart.length})</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-slate-500 py-16 text-sm">Your cart is empty.</p>
          ) : cart.map(i => (
            <div key={i.key} className="flex gap-3 p-3 border border-slate-200">
              <div className="w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <ProductMark type={i.mark} colorIdx={i.ci} size={36} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 line-clamp-1">{i.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{i.variant} · ${i.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(i.key, -1)} className="w-6 h-6 border border-slate-300 text-slate-600 hover:border-slate-900"><Minus size={10} className="mx-auto" /></button>
                  <span className="text-xs font-bold w-6 text-center">{i.qty}</span>
                  <button onClick={() => updateQty(i.key, 1)} className="w-6 h-6 border border-slate-300 text-slate-600 hover:border-slate-900"><Plus size={10} className="mx-auto" /></button>
                  <button onClick={() => remove(i.key)} className="ml-auto text-[11px] text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-slate-900 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-bold text-slate-900">${total.toFixed(2)}</span>
            </div>
            <Btn variant="primary" className="w-full !py-3">Proceed to Checkout <ArrowRight size={14} /></Btn>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== FOOTER ====================
const Footer = ({ navigate }) => (
  <footer className="bg-slate-900 text-slate-300 mt-20">
    <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-2 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-2">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 bg-violet-700 flex items-center justify-center relative">
            <div className="absolute inset-1 border border-white/30" />
            <span className="text-white font-black text-lg relative">V</span>
          </div>
          <div>
            <div className="font-black text-white text-lg tracking-tight">Visual Illusion</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em]">Digital Marketplace</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed max-w-sm mb-5 text-slate-400">A trusted marketplace for digital tools, software keys, and premium subscriptions. Authentic products, instant delivery, verified support.</p>
        <div className="flex gap-2">
          {[Facebook, Linkedin, Instagram].map((Icon, i) => (
            <a key={i} href="#" className="w-9 h-9 bg-slate-800 hover:bg-violet-700 flex items-center justify-center transition-colors"><Icon size={15} /></a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-white font-black mb-4 text-xs uppercase tracking-[0.15em]">Quick Links</h4>
        <ul className="space-y-2.5 text-sm">
          {[["Home","home"],["Shop","shop"],["About Us","about"],["Reviews","reviews"],["Blogs","blogs"],["Contact","contact"]].map(([l,k])=>(
            <li key={k}><button onClick={()=>navigate(k)} className="text-slate-400 hover:text-white transition-colors">{l}</button></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-white font-black mb-4 text-xs uppercase tracking-[0.15em]">Categories</h4>
        <ul className="space-y-2.5 text-sm">
          {CATEGORIES.slice(0,6).map(c => (<li key={c}><a href="#" className="text-slate-400 hover:text-white transition-colors">{c}</a></li>))}
        </ul>
      </div>
      <div>
        <h4 className="text-white font-black mb-4 text-xs uppercase tracking-[0.15em]">Get in Touch</h4>
        <ul className="space-y-3 text-sm text-slate-400">
          <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-violet-400" /> 24 Market Street, Level 3, Digital District</li>
          <li className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-violet-400" /> +1 (555) 018-2210</li>
          <li className="flex items-center gap-2"><MessageCircle size={14} className="shrink-0 text-violet-400" /> WhatsApp: +1 (555) 018-2210</li>
          <li className="flex items-center gap-2"><Mail size={14} className="shrink-0 text-violet-400" /> support@visualillusion.shop</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <p>© 2026 Visual Illusion. All rights reserved.</p>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Payments:</span>
          {["VISA","MC","PAYPAL","AMEX","BTC","BKASH"].map(p => (
            <span key={p} className="bg-slate-800 px-2 py-1 text-[9px] font-bold text-slate-400 tracking-wider">{p}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ==================== HOME PAGE ====================
const HomePage = ({ onOpen, onAdd, navigate }) => {
  const bestSellers = PRODUCTS.filter(p => p.badge === "Bestseller" || p.badge === "Hot").slice(0,5);
  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 border-l border-b border-violet-500/30 pointer-events-none" />
            <div className="absolute top-8 right-8 w-32 h-32 border border-violet-500/40 pointer-events-none" />
            <div className="absolute bottom-0 right-24 w-2 h-24 bg-violet-500 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-5">
                <span className="w-8 h-px bg-violet-500" /> Trusted Since 2019
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
                The trusted<br/>digital product<br/><span className="text-violet-400">marketplace.</span>
              </h1>
              <p className="text-slate-400 mt-5 max-w-md text-sm leading-relaxed">Premium subscriptions, software keys, AI tools — authentic, verified, delivered in minutes. Not in hours.</p>
            </div>
            <div className="mt-8 flex gap-3 relative">
              <button onClick={()=>navigate("shop")} className="bg-violet-600 hover:bg-violet-500 text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 transition-colors">Shop Now →</button>
              <button onClick={()=>navigate("about")} className="border border-white/20 hover:border-white text-white font-bold uppercase tracking-wider text-xs px-6 py-3.5 transition-colors">Learn More</button>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-white border border-slate-900 p-5 flex flex-col justify-between min-h-[190px] relative overflow-hidden group hover:bg-violet-50 transition-colors">
              <div>
                <Chip tone="violet">AI Tools</Chip>
                <p className="font-black text-slate-900 mt-3 text-lg leading-tight">Up to 60% Off<br/>AI Premium</p>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-violet-700 group-hover:underline">Explore →</span>
                <ProductMark type="brain" colorIdx={0} size={40} />
              </div>
            </div>
            <div className="bg-violet-700 text-white p-5 flex flex-col justify-between min-h-[190px] relative overflow-hidden">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">Streaming</span>
                <p className="font-black mt-3 text-lg leading-tight">Netflix · Disney+<br/>from $2.99</p>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-violet-100 hover:underline">Explore →</span>
                <div className="text-white"><ProductMark type="play" colorIdx={0} size={40} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white border border-slate-900 p-6 md:p-7 flex items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-700" />
          <div className="pl-4">
            <Chip tone="violet">Featured Bundle</Chip>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">Productivity Bundle — Save 45%</h3>
            <p className="text-slate-600 text-sm mt-1">Notion, Grammarly, and Microsoft 365 together.</p>
          </div>
          <button onClick={()=>navigate("shop")} className="bg-slate-900 hover:bg-violet-700 text-white font-bold uppercase tracking-wider text-xs px-5 py-3 whitespace-nowrap hidden md:inline-flex items-center gap-2 transition-colors">Explore <ArrowRight size={14} /></button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-16">
        <SectionHead eyebrow="Top Picks" title="Best Selling Products" action={<button onClick={()=>navigate("shop")} className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-violet-700 flex items-center gap-1">See All <ChevronRight size={14} /></button>} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {bestSellers.map(p => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />)}
        </div>
      </section>

      {HOME_SECTIONS.map(sec => {
        const items = PRODUCTS.filter(p => sec.ids.includes(p.id)).slice(0,5);
        return (
          <section key={sec.title} className="max-w-7xl mx-auto px-4 mt-14">
            <SectionHead title={sec.title} action={<button onClick={()=>navigate("shop")} className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-violet-700 flex items-center gap-1">See More <ChevronRight size={14} /></button>} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {items.map(p => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />)}
            </div>
          </section>
        );
      })}

      <section className="bg-slate-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800">
            {[{ n: "42,800+", l: "Satisfied Clients" },{ n: "78,500+", l: "Orders Completed" },{ n: "24", l: "Team Members" },{ n: "7+", l: "Years in Business" }].map(s => (
              <div key={s.l} className="bg-slate-900 p-8 text-center">
                <div className="text-3xl md:text-5xl font-black tracking-tight text-violet-400">{s.n}</div>
                <div className="text-slate-400 mt-2 text-[11px] uppercase tracking-[0.15em] font-bold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700 mb-3">About Us</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-5">An online marketplace built on trust and authenticity.</h2>
            <p className="text-slate-600 leading-relaxed mb-3 text-sm">Visual Illusion connects customers with verified digital tools, subscriptions, and software keys — delivered quickly, supported properly, priced fairly.</p>
            <p className="text-slate-600 leading-relaxed mb-6 text-sm">Every product is sourced through legitimate channels. Every order is backed by a replacement or refund guarantee. That's the standard.</p>
            <Btn onClick={()=>navigate("about")} variant="outline">Read Our Story <ArrowRight size={14} /></Btn>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-8 relative">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-violet-700" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-violet-700" />
            <div className="grid grid-cols-2 gap-4">
              {[{i:Award,l:"Certified"},{i:Shield,l:"Verified"},{i:ThumbsUp,l:"Trusted"},{i:Lock,l:"Secure"}].map((x,i)=>(
                <div key={i} className="bg-white border border-slate-200 p-5">
                  <x.i size={22} className="text-violet-700 mb-3" strokeWidth={1.5} />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{x.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700 mb-2">Why Choose Us</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Reasons customers stay with us</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-slate-200">
          {[{i:Check,t:"Authentic Products"},{i:Zap,t:"Fast Delivery"},{i:Lock,t:"Secure Payments"},{i:Headphones,t:"Customer Support"},{i:Users,t:"Trusted by Customers"},{i:Package,t:"Easy Ordering"}].map((f, i) => (
            <div key={f.t} className={`bg-white p-6 hover:bg-violet-50 transition-colors ${i % 6 !== 5 ? "border-r border-slate-200" : ""} border-b border-slate-200 lg:border-b-0 ${i < 3 ? "lg:border-b-0" : ""}`}>
              <f.i size={22} className="text-violet-700 mb-3" strokeWidth={1.5} />
              <p className="font-bold text-xs text-slate-900 uppercase tracking-wider">{f.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 mt-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700 mb-2">Testimonials</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-slate-900 bg-white">
            {REVIEWS.slice(0,3).map((r,i) => (
              <div key={i} className={`p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r" : ""} border-slate-200`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-violet-700 text-white flex items-center justify-center font-black text-sm">{r.avatar}</div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{r.source}</p>
                  </div>
                  <StarRow n={r.rating} size={12} />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">"{r.text}"</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Btn variant="outline" onClick={()=>navigate("reviews")}>View All Reviews <ArrowRight size={14} /></Btn>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mt-20">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700 mb-2">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <FaqAccordion />
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-20">
        <SectionHead eyebrow="Latest" title="Latest Blogs" action={<button onClick={()=>navigate("blogs")} className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-violet-700 flex items-center gap-1">All Articles <ChevronRight size={14} /></button>} />
        <div className="grid md:grid-cols-3 gap-5">
          {BLOGS.slice(0,3).map(b => <BlogCard key={b.id} b={b} />)}
        </div>
      </section>
    </div>
  );
};

const FaqAccordion = () => {
  const [open, setOpen] = useState(0);
  return (
    <div className="border border-slate-900">
      {FAQS.map((f,i) => (
        <div key={i} className={`bg-white ${i < FAQS.length-1 ? "border-b border-slate-200" : ""}`}>
          <button onClick={()=>setOpen(open===i?-1:i)} className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
            <span className="font-bold text-slate-900 text-sm">{f.q}</span>
            <ChevronDown size={16} className={`text-violet-700 transition-transform shrink-0 ml-4 ${open===i?"rotate-180":""}`} />
          </button>
          {open===i && <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
};

const BlogCard = ({ b, onClick }) => (
  <article onClick={onClick} className="bg-white border border-slate-200 hover:border-slate-900 transition-all cursor-pointer group">
    <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center relative border-b border-slate-200">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #6d28d9 1px, transparent 0)`, backgroundSize: "16px 16px" }} />
      <ProductMark type={b.mark} colorIdx={0} size={80} />
      <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">{b.date}</span>
    </div>
    <div className="p-5">
      <Chip tone="violet">{b.cat}</Chip>
      <h3 className="font-black text-slate-900 mt-3 leading-snug group-hover:text-violet-700 transition-colors">{b.title}</h3>
      <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{b.excerpt}</p>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <span className="text-[11px] text-slate-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold"><User size={11} /> {b.author}</span>
        <span className="text-violet-700 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">Read More <ArrowRight size={11} /></span>
      </div>
    </div>
  </article>
);

// ==================== SHOP PAGE ====================
const ShopPage = ({ query, setQuery, onOpen, onAdd }) => {
  const [cats, setCats] = useState([]);
  const [priceMax, setPriceMax] = useState(50);
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    let out = PRODUCTS.filter(p => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.cat.toLowerCase().includes(query.toLowerCase())) return false;
      if (cats.length && !cats.includes(p.cat)) return false;
      if (p.base > priceMax) return false;
      if (stockOnly && !p.stock) return false;
      return true;
    });
    if (sort === "low") out = [...out].sort((a,b)=>a.base-b.base);
    if (sort === "high") out = [...out].sort((a,b)=>b.base-a.base);
    if (sort === "name") out = [...out].sort((a,b)=>a.name.localeCompare(b.name));
    return out;
  }, [query, cats, priceMax, stockOnly, sort]);

  const paged = filtered.slice((page-1)*perPage, page*perPage);
  const totalPages = Math.ceil(filtered.length/perPage) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 pb-6 border-b border-slate-900">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Home / Shop</div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Shop All Products</h1>
      </div>
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-5">
          <div className="border border-slate-200 bg-white">
            <h3 className="font-black text-slate-900 px-4 py-3 border-b border-slate-200 text-xs uppercase tracking-wider">Search Products</h3>
            <div className="p-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a product..." className="w-full pl-9 pr-3 py-2 border border-slate-200 text-sm focus:outline-none focus:border-slate-900" /></div></div>
          </div>
          <div className="border border-slate-200 bg-white">
            <h3 className="font-black text-slate-900 px-4 py-3 border-b border-slate-200 text-xs uppercase tracking-wider">Categories</h3>
            <div className="p-4 space-y-2.5">
              {CATEGORIES.map(c => (
                <label key={c} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-violet-700 transition-colors">
                  <input type="checkbox" checked={cats.includes(c)} onChange={()=>setCats(cats.includes(c)?cats.filter(x=>x!==c):[...cats,c])} className="accent-violet-700" /> {c}
                </label>
              ))}
            </div>
          </div>
          <div className="border border-slate-200 bg-white">
            <h3 className="font-black text-slate-900 px-4 py-3 border-b border-slate-200 text-xs uppercase tracking-wider">Price Range</h3>
            <div className="p-4"><input type="range" min="0" max="50" step="0.5" value={priceMax} onChange={e=>setPriceMax(+e.target.value)} className="w-full accent-violet-700" /><div className="flex justify-between text-xs text-slate-500 mt-2"><span>$0</span><span className="font-bold text-violet-700">Up to ${priceMax}</span></div></div>
          </div>
          <div className="border border-slate-200 bg-white">
            <h3 className="font-black text-slate-900 px-4 py-3 border-b border-slate-200 text-xs uppercase tracking-wider">Availability</h3>
            <div className="p-4"><label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked={stockOnly} onChange={e=>setStockOnly(e.target.checked)} className="accent-violet-700" /> In stock only</label></div>
          </div>
          <div className="border border-slate-200 bg-white">
            <h3 className="font-black text-slate-900 px-4 py-3 border-b border-slate-200 text-xs uppercase tracking-wider">Popular Tags</h3>
            <div className="p-4 flex flex-wrap gap-1.5">{["AI","Premium","VPN","Office","Netflix","1yr"].map(t=>(<button key={t} onClick={()=>setQuery(t)} className="text-[11px] bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-600 px-2.5 py-1 font-semibold transition-colors">{t}</button>))}</div>
          </div>
        </aside>

        <main>
          <div className="flex items-center justify-between mb-4 bg-white border border-slate-200 px-4 py-3">
            <p className="text-sm text-slate-600">Showing <span className="font-bold text-slate-900">{paged.length}</span> of <span className="font-bold text-slate-900">{filtered.length}</span></p>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="text-sm border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-slate-900 bg-white">
              <option value="popular">Most Popular</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="name">Name A–Z</option>
            </select>
          </div>
          {paged.length === 0 ? (
            <div className="text-center py-24 bg-white border border-slate-200"><p className="text-slate-500 text-sm">No products match your filters.</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {paged.map(p => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />)}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button disabled={page===1} onClick={()=>setPage(page-1)} className="p-2 border border-slate-200 disabled:opacity-30 hover:border-slate-900 transition-colors"><ChevronLeft size={14} /></button>
              {[...Array(totalPages)].map((_,i)=>(<button key={i} onClick={()=>setPage(i+1)} className={`w-9 h-9 text-sm font-bold transition-colors ${page===i+1?"bg-slate-900 text-white":"border border-slate-200 text-slate-700 hover:border-slate-900"}`}>{i+1}</button>))}
              <button disabled={page===totalPages} onClick={()=>setPage(page+1)} className="p-2 border border-slate-200 disabled:opacity-30 hover:border-slate-900 transition-colors"><ChevronRight size={14} /></button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ==================== PRODUCT DETAIL PAGE ====================
const ProductPage = ({ product, onAdd, navigate, onOpen }) => {
  const [duration, setDuration] = useState("1 Month");
  const [accountType, setAccountType] = useState("Shared Account");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [lang, setLang] = useState("en");
  const [tcOpen, setTcOpen] = useState(true);
  const [sharedOpen, setSharedOpen] = useState(true);
  const [refundOpen, setRefundOpen] = useState(true);

  const isKey = product.keyOnly;
  const mult = DURATION_MULT[duration] || 1;
  const accountAdj = accountType === "Personal Account" ? 1.8 : 1;
  const price = (product.base * mult * accountAdj).toFixed(2);
  const related = PRODUCTS.filter(x => x.cat === product.cat && x.id !== product.id).slice(0,4);

  const details = useMemo(() => {
    const base = [];
    if (!isKey) {
      base.push(
        `${accountType === "Shared Account" ? "Shared" : "Personal"} account access`,
        `Subscription duration: ${duration}`,
        `Device limit: ${accountType === "Shared Account" ? "1 active device" : "up to 5 devices"}`,
      );
    } else {
      base.push("Retail license key, lifetime activation", "One-time purchase, no renewal", "Works on 1 PC (rebind supported)");
    }
    if (product.cat === "Writing Tools") base.push("Grammar + style correction", "Rewrite & paraphrase tools", "Predictive writing", "Research Q&A", "Citation generation", "Chat with PDF", "Plagiarism checks", "Journal submission checks");
    else if (product.cat === "AI Tools") base.push("Full model access", "Extended context window", "Priority response speed", "File uploads supported", "API access where applicable");
    else if (product.cat === "Streaming") base.push("Ultra HD / 4K where supported", "Ad-free playback", "Offline downloads", "Full regional catalogue");
    else if (product.cat === "VPN & Security") base.push("Unlimited bandwidth", "All server locations unlocked", "No-logs policy", "Kill switch enabled", "Multi-device simultaneous connection");
    else if (product.cat === "Cloud Storage") base.push("Full storage quota active", "File sync across devices", "Sharing & collaboration tools", "Version history");
    else if (product.cat === "Education") base.push("Full course catalogue", "Certificate of completion", "Downloadable course materials", "Graded assignments");
    else base.push("Full feature access", "All premium tools unlocked", "Regular updates included");
    base.push("Customer support during working hours");
    if (!isKey) base.push("Not for commercial resale");
    return base;
  }, [product, duration, accountType, isKey]);

  const handleAdd = () => {
    onAdd(product, qty, duration + (isKey ? "" : " · " + accountType), parseFloat(price));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-[11px] text-slate-500 mb-6 uppercase tracking-wider font-semibold">
        <button onClick={()=>navigate("home")} className="hover:text-violet-700">Home</button>
        <span className="mx-2 text-slate-300">/</span>
        <button onClick={()=>navigate("shop")} className="hover:text-violet-700">Shop</button>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-400">{product.cat}</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 mb-12">
        <div className="bg-white border border-slate-200 aspect-square flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #6d28d9 1px, transparent 0)`, backgroundSize: "20px 20px" }} />
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-violet-700" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-violet-700" />
          <ProductMark type={product.mark} colorIdx={product.ci} size={240} />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
            {product.badge && <Chip tone={product.badge.startsWith("-") ? "red" : "violet"}>{product.badge}</Chip>}
            {product.stock ? <Chip tone="green">In Stock</Chip> : <Chip tone="red">Out of Stock</Chip>}
          </div>
        </div>

        <div>
          <Chip tone="violet">{product.cat}</Chip>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 mb-3 tracking-tight leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRow n={5} size={14} />
            <span className="text-xs text-slate-500">128 reviews</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1"><Check size={12} /> Verified Seller</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-4 py-3 mb-5 text-xs space-y-1.5">
            <p className="flex items-center gap-2 text-amber-900 font-semibold">
              <Eye size={13} className="text-amber-700" /> <span className="font-bold">{product.watchers} people</span> watching this product now
            </p>
            <p className="flex items-center gap-2 text-amber-900">
              <Flame size={13} className="text-amber-700" /> <span className="font-bold">{product.sold24} sold</span> in last 24 hours
            </p>
          </div>

          <div className="border-y border-slate-900 py-4 mb-5">
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-1">Current Price</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-slate-900 tracking-tight">${price}</span>
              <span className="text-sm text-slate-500">/ {duration}</span>
            </div>
            {!isKey && <p className="text-[11px] text-slate-500 mt-1">Price range: ${product.base.toFixed(2)} – ${(product.base * 9 * 1.8).toFixed(2)}</p>}
          </div>

          {!isKey && (
            <>
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-slate-700 mb-2">Duration</p>
                <div className="grid grid-cols-4 gap-2">
                  {DURATIONS.map(d => (
                    <button key={d} onClick={()=>setDuration(d)} className={`px-2 py-2.5 text-xs font-bold border transition-colors ${duration===d ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:border-slate-900"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-slate-700 mb-2">Account Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Shared Account","Personal Account"].map(a => (
                    <button key={a} onClick={()=>setAccountType(a)} className={`px-3 py-2.5 text-xs font-bold border transition-colors ${accountType===a ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:border-slate-900"}`}>{a}</button>
                  ))}
                </div>
              </div>
              <div className="bg-violet-50 border-l-2 border-violet-700 px-3 py-2 mb-5 text-[11px] text-violet-900">
                <strong className="font-bold">Variant Details:</strong> {accountType === "Shared Account" ? "Single active device, credentials shared across plan members." : "Up to 5 devices, full account control, personal login only."} Delivery in 5–30 min.
              </div>
            </>
          )}

          <div className="flex items-center gap-4 mb-4">
            <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-slate-700">Quantity</p>
            <div className="flex items-center border border-slate-900">
              <button onClick={()=>setQty(Math.max(1,qty-1))} className="px-3 py-2 hover:bg-slate-100 transition-colors"><Minus size={12} /></button>
              <span className="px-4 font-bold text-sm">{qty}</span>
              <button onClick={()=>setQty(qty+1)} className="px-3 py-2 hover:bg-slate-100 transition-colors"><Plus size={12} /></button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={handleAdd} disabled={!product.stock} className="flex-1 bg-slate-900 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold uppercase tracking-wider text-xs py-3.5 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={14} /> Add To Cart
            </button>
            <button disabled={!product.stock} className="flex-1 bg-violet-700 hover:bg-violet-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold uppercase tracking-wider text-xs py-3.5 transition-colors">Buy Now</button>
            <button className="p-3.5 border border-slate-300 hover:border-slate-900 transition-colors"><Heart size={16} /></button>
            <button className="p-3.5 border border-slate-300 hover:border-slate-900 transition-colors"><Share2 size={16} /></button>
          </div>

          <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200">
            {[{i:Truck,t:"Instant"},{i:Shield,t:"Verified"},{i:Headphones,t:"24/7 Support"}].map((f,i)=>(
              <div key={i} className="bg-white p-3 flex items-center gap-2 text-[11px] text-slate-700">
                <f.i size={14} className="text-violet-700 shrink-0" strokeWidth={1.8} />
                <span className="font-bold uppercase tracking-wider">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-white border border-slate-900 mb-10">
        <div className="bg-slate-900 text-white px-5 py-3">
          <h2 className="font-black text-sm uppercase tracking-[0.15em]">Product Details</h2>
        </div>
        <div className="p-6">
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
            {details.map((d, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                <span className="text-violet-700 font-black mt-0.5 shrink-0">→</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="border-b-2 border-slate-900 mb-6">
        <div className="flex gap-0 overflow-x-auto">
          {[["desc","Description"],["feat","Features"],["deliv","Delivery Info"],["rev","Reviews"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} className={`px-5 py-3 text-xs font-black uppercase tracking-wider whitespace-nowrap border-b-2 -mb-[2px] transition-colors ${tab===k?"border-violet-700 text-violet-700":"border-transparent text-slate-500 hover:text-slate-900"}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-6 mb-12 text-sm text-slate-600 leading-relaxed">
        {tab==="desc" && <p>{product.name} is a premium digital product delivered with full activation support. Designed for professionals and teams who need reliable access without hassle. Fully verified through authorized distribution channels. Every order includes setup instructions, support contact, and a replacement guarantee.</p>}
        {tab==="feat" && <ul className="space-y-2">{["Authentic, verified license","Activation within minutes","Full support for setup","Replacement guarantee","Compatible with latest versions"].map(x=><li key={x} className="flex gap-2"><Check size={15} className="text-violet-700 shrink-0 mt-0.5" /> {x}</li>)}</ul>}
        {tab==="deliv" && <p>Delivery is digital, via email, within 5–30 minutes during business hours (Mon–Sun, 9am–11pm). Some products may require a short verification step. Support is available around the clock through email, WhatsApp, and live chat. Delivery delays outside working hours are possible during high-volume periods.</p>}
        {tab==="rev" && <div className="space-y-4">{REVIEWS.slice(0,2).map((r,i)=>(<div key={i} className="pb-4 border-b border-slate-100 last:border-0"><div className="flex items-center gap-2 mb-1"><span className="font-bold text-slate-900">{r.name}</span><StarRow n={r.rating} size={12} /></div><p>{r.text}</p></div>))}</div>}
      </div>

      <div className="mb-6 flex items-center gap-2 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider">Language:</span>
        <div className="inline-flex border border-slate-900">
          {[["en","English"],["bn","বাংলা"]].map(([k,l])=>(
            <button key={k} onClick={()=>setLang(k)} className={`px-3 py-1.5 font-bold text-[11px] uppercase tracking-wider transition-colors ${lang===k?"bg-slate-900 text-white":"bg-white text-slate-700 hover:bg-slate-100"}`}>{l}</button>
          ))}
        </div>
      </div>

      {!isKey && <PolicyBlock title="Shared Account Terms" titleBn="শেয়ার্ড অ্যাকাউন্ট শর্তাবলী" items={POLICY.shared[lang]} lang={lang} open={sharedOpen} setOpen={setSharedOpen} />}
      <PolicyBlock title="Terms & Conditions" titleBn="শর্তাবলী" items={POLICY.terms[lang]} lang={lang} open={tcOpen} setOpen={setTcOpen} />
      <PolicyBlock title="Replacement & Refund Policy" titleBn="প্রতিস্থাপন ও রিফান্ড নীতি" items={POLICY.refund[lang]} lang={lang} open={refundOpen} setOpen={setRefundOpen} />

      <section className="mt-16">
        <SectionHead title="Related Products" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {related.map(p => <ProductCard key={p.id} p={p} onOpen={onOpen} onAdd={(x)=>onAdd(x,1,"1 Month · Shared Account",x.base)} />)}
        </div>
      </section>
    </div>
  );
};

const PolicyBlock = ({ title, titleBn, items, lang, open, setOpen }) => (
  <section className="border border-slate-900 mb-4 bg-white">
    <button onClick={()=>setOpen(!open)} className="w-full bg-slate-900 text-white px-5 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        <Info size={14} />
        <h3 className="font-black text-sm uppercase tracking-[0.15em]">{lang === "bn" ? titleBn : title}</h3>
      </div>
      <ChevronDown size={16} className={`transition-transform ${open?"rotate-180":""}`} />
    </button>
    {open && (
      <div className="p-6" style={lang === "bn" ? { fontFamily: "'Noto Sans Bengali', 'Siyam Rupali', system-ui, sans-serif" } : {}}>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
              <span className="w-6 h-6 bg-violet-100 text-violet-800 flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">{i+1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

// ==================== ABOUT PAGE ====================
const AboutPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-10">
    <div className="mb-10 pb-6 border-b border-slate-900">
      <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Home / About Us</div>
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">About Visual Illusion</h1>
    </div>
    <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div>
          <Chip tone="violet">Our Story</Chip>
          <h2 className="text-2xl font-black text-slate-900 mt-3 mb-3 tracking-tight">A marketplace built around trust</h2>
          <p className="text-sm">Visual Illusion began in 2019 with one small idea: digital products should be delivered fairly, quickly, and transparently. Over seven years, that idea grew into a marketplace serving tens of thousands of customers across software keys, AI tools, streaming subscriptions, and productivity suites.</p>
        </div>
        <div className="border-l-2 border-violet-700 pl-5">
          <h3 className="text-base font-black text-slate-900 mb-2 uppercase tracking-wider">Our Commitment to Trust and Security</h3>
          <p className="text-sm">Every product we sell is sourced through verified channels. We run activation tests before shipping credentials, maintain encrypted transaction infrastructure, and back every order with a clear replacement and refund policy.</p>
        </div>
        <div className="border-l-2 border-violet-700 pl-5">
          <h3 className="text-base font-black text-slate-900 mb-2 uppercase tracking-wider">Proven Excellence and Customer Satisfaction</h3>
          <p className="text-sm">78,500+ completed orders and a sub-10-minute average delivery time tell the story better than we can. Our WhatsApp support averages a 5-minute first response during working hours.</p>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 p-8 relative">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-violet-700" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-violet-700" />
        <div className="grid grid-cols-2 gap-4">
          {[{i:Award,t:"ISO Certified"},{i:Shield,t:"PCI-DSS Compliant"},{i:Lock,t:"256-bit Encryption"},{i:Users,t:"Verified Team"}].map((x,i)=>(
            <div key={i} className="bg-white border border-slate-200 p-5">
              <x.i size={24} className="text-violet-700 mb-3" strokeWidth={1.5} />
              <p className="font-black text-xs text-slate-900 uppercase tracking-wider">{x.t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="bg-slate-900 p-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[{n:"42,800+",l:"Satisfied Clients"},{n:"78,500+",l:"Orders Completed"},{n:"24",l:"Team Members"},{n:"7+",l:"Years in Business"}].map(s=>(
          <div key={s.l}><div className="text-3xl md:text-5xl font-black tracking-tight text-violet-400">{s.n}</div><div className="text-slate-400 mt-2 text-[11px] uppercase tracking-[0.15em] font-bold">{s.l}</div></div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== REVIEWS PAGE ====================
const ReviewsPage = () => {
  const [source, setSource] = useState("All");
  const sources = ["All","Facebook Group","Trustpilot","Facebook","Facebook Page"];
  const filtered = source==="All" ? REVIEWS : REVIEWS.filter(r => r.source === source);
  return (
    <div>
      <div className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 border-l border-b border-violet-500/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-[11px] text-violet-400 uppercase tracking-wider font-semibold mb-2">Home / Reviews</div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Customer Reviews</h1>
          <p className="text-slate-400 mt-3 text-sm max-w-xl">Real feedback from real customers, pulled from every channel we're on. No filtering, no editing.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {sources.map(s=>(
            <button key={s} onClick={()=>setSource(s)} className={`px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-colors ${source===s?"bg-slate-900 text-white":"bg-white border border-slate-200 text-slate-700 hover:border-slate-900"}`}>{s}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 bg-white border border-slate-900">
          {filtered.map((r,i)=>{
            const col = i % 3, row = Math.floor(i / 3);
            const totalRows = Math.ceil(filtered.length / 3);
            return (
              <div key={i} className={`p-6 ${col < 2 ? "md:border-r" : ""} ${row < totalRows - 1 ? "border-b" : ""} border-slate-200`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-700 text-white flex items-center justify-center font-black text-sm">{r.avatar}</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                      <StarRow n={r.rating} size={11} />
                    </div>
                  </div>
                  <Chip tone="slate">{r.source}</Chip>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">"{r.text}"</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ==================== BLOGS PAGE ====================
const BlogsPage = () => (
  <div>
    <div className="bg-slate-50 py-14 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Home / Blogs</div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Latest Articles</h1>
        <p className="text-slate-600 mt-3 text-sm max-w-xl">Reviews, comparisons, and buying guides for digital products.</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {BLOGS.map(b => <BlogCard key={b.id} b={b} />)}
      </div>
    </div>
  </div>
);

// ==================== CONTACT PAGE ====================
const ContactPage = () => {
  const [form, setForm] = useState({name:"",email:"",subject:"",msg:""});
  const [sent, setSent] = useState(false);
  return (
    <div>
      <div className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 border-l border-b border-violet-500/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-[11px] text-violet-400 uppercase tracking-wider font-semibold mb-2">Home / Contact Us</div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Get in Touch</h1>
          <p className="text-slate-400 mt-3 text-sm">Questions, orders, or support — we're here.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_1.5fr] gap-8">
        <div className="space-y-5">
          <div className="bg-white border border-slate-900">
            <h3 className="font-black text-slate-900 px-5 py-3 border-b border-slate-200 text-xs uppercase tracking-wider">Contact Details</h3>
            <ul className="p-5 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin size={16} className="text-violet-700 shrink-0 mt-0.5" strokeWidth={1.8} /><div><p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Address</p><p className="text-slate-600 mt-0.5">24 Market Street, Level 3, Digital District</p></div></li>
              <li className="flex gap-3"><Mail size={16} className="text-violet-700 shrink-0 mt-0.5" strokeWidth={1.8} /><div><p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Email</p><p className="text-slate-600 mt-0.5">support@visualillusion.shop</p></div></li>
              <li className="flex gap-3"><Phone size={16} className="text-violet-700 shrink-0 mt-0.5" strokeWidth={1.8} /><div><p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Phone</p><p className="text-slate-600 mt-0.5">+1 (555) 018-2210</p></div></li>
              <li className="flex gap-3"><MessageCircle size={16} className="text-violet-700 shrink-0 mt-0.5" strokeWidth={1.8} /><div><p className="font-bold text-slate-900 text-xs uppercase tracking-wider">WhatsApp</p><p className="text-slate-600 mt-0.5">+1 (555) 018-2210</p></div></li>
              <li className="flex gap-3"><Clock size={16} className="text-violet-700 shrink-0 mt-0.5" strokeWidth={1.8} /><div><p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Working Hours</p><p className="text-slate-600 mt-0.5">Mon–Sun: 9am – 11pm</p></div></li>
            </ul>
          </div>
          <div className="bg-violet-50 border-l-2 border-violet-700 p-4">
            <p className="text-sm text-violet-900"><span className="font-black uppercase tracking-wider text-xs">Existing customer?</span><br/>WhatsApp is the fastest route to support — average response under 5 minutes during working hours.</p>
          </div>
        </div>
        <div className="bg-white border border-slate-900">
          <h3 className="font-black text-slate-900 px-6 py-4 border-b border-slate-200 text-sm uppercase tracking-wider">Send Us a Message</h3>
          <div className="p-6">
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 text-center">
                <Check size={28} className="text-emerald-600 mx-auto mb-2" />
                <p className="font-bold text-emerald-900 text-sm">Message sent — we'll be in touch within the working day.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-[11px] font-black text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:outline-none focus:border-slate-900" placeholder="Your name" /></div>
                  <div><label className="block text-[11px] font-black text-slate-700 mb-1.5 uppercase tracking-wider">Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:outline-none focus:border-slate-900" placeholder="you@email.com" /></div>
                </div>
                <div><label className="block text-[11px] font-black text-slate-700 mb-1.5 uppercase tracking-wider">Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:outline-none focus:border-slate-900" placeholder="What's this about?" /></div>
                <div><label className="block text-[11px] font-black text-slate-700 mb-1.5 uppercase tracking-wider">Message</label><textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} rows={5} className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 resize-none" placeholder="Your message..." /></div>
                <Btn onClick={()=>setSent(true)} variant="primary" className="w-full !py-3"><Send size={14} /> Send Message</Btn>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== ROOT ====================
export default function App() {
  const [nav, setNav] = useState("home");
  const [cart, setCart] = useState([]);
  const [wishlist] = useState([]);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => { window.scrollTo(0,0); }, [nav, activeProduct]);

  const navigate = (page) => { if (page !== "product") setActiveProduct(null); setNav(page); };
  const onOpen = (p) => { setActiveProduct(p); setNav("product"); };

  const onAdd = (p, qty = 1, variant = "1 Month · Shared Account", price = p.base) => {
    const key = `${p.id}-${variant}`;
    setCart(prev => {
      const found = prev.find(i => i.key === key);
      if (found) return prev.map(i => i.key === key ? {...i, qty: i.qty + qty} : i);
      return [...prev, {key, id: p.id, name: p.name, mark: p.mark, ci: p.ci, price, qty, variant}];
    });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-white" style={{fontFamily: "'Inter Tight', 'DM Sans', system-ui, -apple-system, sans-serif"}}>
      <Header nav={nav} navigate={navigate} cart={cart} wishlist={wishlist} catOpen={catOpen} setCatOpen={setCatOpen} query={query} setQuery={setQuery} setCartOpen={setCartOpen} />
      <main onClick={()=>setCatOpen(false)}>
        {nav === "home" && <HomePage onOpen={onOpen} onAdd={(p)=>onAdd(p)} navigate={navigate} />}
        {nav === "shop" && <ShopPage query={query} setQuery={setQuery} onOpen={onOpen} onAdd={(p)=>onAdd(p)} />}
        {nav === "product" && activeProduct && <ProductPage product={activeProduct} onAdd={onAdd} navigate={navigate} onOpen={onOpen} />}
        {nav === "about" && <AboutPage />}
        {nav === "reviews" && <ReviewsPage />}
        {nav === "blogs" && <BlogsPage />}
        {nav === "contact" && <ContactPage />}
      </main>
      <Footer navigate={navigate} />
      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} cart={cart} setCart={setCart} />
    </div>
  );
}
