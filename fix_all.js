const fs = require('fs');
const path = require('path');

const baseDir = '.';
const htmlFiles = ['index.html', 'shop.html', 'product.html', 'about.html', 'reviews.html', 'blogs.html', 'contact.html'];

// ===== GLOBAL HTML REPLACEMENTS =====
const htmlReplacements = [
  // --- PROMO TICKER: remove emojis ---
  ['🎉 New arrivals: Claude Pro, Grok Premium, Perplexity Pro', '★ New arrivals: Claude Pro, Grok Premium, Perplexity Pro'],
  ['⚡ Instant digital delivery — Mon to Sun, 9am–11pm', '→ Instant digital delivery — Mon to Sun, 9am–11pm'],
  ['🛡️ Authentic products with replacement guarantee', '✓ Authentic products with replacement guarantee'],

  // --- TOPBAR: real contact + remove emojis ---
  ['🕐 Mon–Sun: 9am – 11pm', 'Mon–Sun: 9am – 11pm'],
  ['✉️ support@visualillusion.shop', 'visualillusion0@gmail.com'],

  // --- SOCIALS: replace emoji/unicode with text ---
  ['<a href="#" title="Facebook">𝕗</a>', '<a href="#" title="Telegram">Telegram</a>'],
  ['<a href="#" title="LinkedIn">in</a>', '<a href="#" title="WhatsApp">WhatsApp</a>'],
  ['<a href="#" title="Instagram">📷</a>', ''],

  // --- HEADER: remove notifications emoji, cart emoji, Sign In button ---
  ["<button class=\"header-icon-btn\" title=\"Wishlist\">♡</button>", ''],
  ["<button class=\"header-icon-btn\" title=\"Notifications\">🔔</button>", ''],
  ['🛒\n        <span id="cart-count"', '<span style="font-size:18px;">&#128722;</span>\n        <span id="cart-count"'],
  ["<button class=\"btn btn-primary btn-sm\" onclick=\"alert('Sign In feature coming soon!')\">Sign In</button>", ''],

  // --- CART DRAWER: remove emoji from heading ---
  ['🛒 Your Cart', 'Your Cart'],
  ['<div class="cart-empty"><div style="font-size:56px;margin-bottom:16px">🛒</div>', '<div class="cart-empty"><div style="font-size:40px;margin-bottom:16px;color:#7c3aed;font-weight:900;">Cart</div>'],

  // --- CATEGORY MENU: replace emojis with text bullets ---
  ['🤖 AI Tools', 'AI Tools'],
  ['✍️ Writing Tools', 'Writing Tools'],
  ['📊 Productivity', 'Productivity'],
  ['🎬 Streaming', 'Streaming'],
  ['🎓 Education', 'Education'],
  ['🛡️ VPN &amp; Security', 'VPN &amp; Security'],
  ['☁️ Cloud Storage', 'Cloud Storage'],
  ['🔑 Software Keys', 'Software Keys'],
  ['🎨 Design Tools', 'Design Tools'],
  ['⚙️ Utilities', 'Utilities'],

  // --- HERO: replace emojis ---
  ['✦ Trusted Since 2019', 'Trusted Since 2019'],
  ['<span style="font-size:32px">🤖</span>', ''],
  ['<span style="font-size:32px">🎬</span>', ''],

  // --- ABOUT/CERT SECTION: replace emojis ---
  ['<div class="cert-icon">🏆</div>', '<div class="cert-icon">★</div>'],
  ['<div class="cert-icon">🛡️</div>', '<div class="cert-icon">✓</div>'],
  ['<div class="cert-icon">👍</div>', '<div class="cert-icon">♦</div>'],
  ['<div class="cert-icon">🔒</div>', '<div class="cert-icon">⬡</div>'],
  ['<div class="cert-icon">👥</div>', '<div class="cert-icon">◈</div>'],

  // --- WHY CHOOSE US: replace emojis ---
  ['<div class="feature-icon">✅</div>', '<div class="feature-icon">01</div>'],
  ['<div class="feature-icon">⚡</div>', '<div class="feature-icon">02</div>'],
  ['<div class="feature-icon">🔒</div>', '<div class="feature-icon">03</div>'],
  ['<div class="feature-icon">💬</div>', '<div class="feature-icon">04</div>'],
  ['<div class="feature-icon">👥</div>', '<div class="feature-icon">05</div>'],
  ['<div class="feature-icon">📦</div>', '<div class="feature-icon">06</div>'],
  ['<div class="feature-icon">🔄</div>', '<div class="feature-icon">07</div>'],

  // --- ABOUT PAGE: misc emojis ---
  ['⭐ 4.9/5.0', '4.9 / 5.0'],

  // --- FOOTER CONTACT: real details ---
  ['<i>📍</i><span>24 Market Street, Level 3, Digital District</span>', '<i></i><span>Chattogram, Bangladesh</span>'],
  ['<i>📞</i><span>+1 (555) 018-2210</span>', '<i></i><span>+880 1537-463765</span>'],
  ['<i>💬</i><span>WhatsApp: +1 (555) 018-2210</span>', '<i></i><span>WhatsApp: +880 15 374 63765</span>'],
  ['<i>✉️</i><span>support@visualillusion.shop</span>', '<i></i><span>visualillusion0@gmail.com</span>'],
  ['<i>🕐</i><span>Mon–Sun: 9am – 11pm</span>', '<i></i><span>Mon–Sun: 9am – 11pm</span>'],

  // --- FOOTER SOCIALS: replace ---
  ['<a href="#" class="footer-social">𝕗</a>', '<a href="#" class="footer-social">Telegram</a>'],
  ['<a href="#" class="footer-social">in</a>', '<a href="#" class="footer-social">WhatsApp</a>'],
  ['<a href="#" class="footer-social">📷</a>', ''],

  // --- FOOTER: remove payment chips ---
  ['<div class="payment-chips">\n        <span class="payment-chip">VISA</span>\n        <span class="payment-chip">MC</span>\n        <span class="payment-chip">PAYPAL</span>\n        <span class="payment-chip">AMEX</span>\n        <span class="payment-chip">BTC</span>\n        <span class="payment-chip">BKASH</span>\n      </div>', '<div class="payment-chips"><span class="payment-chip">BKASH</span><span class="payment-chip">NAGAD</span><span class="payment-chip">ROCKET</span><span class="payment-chip">BANK TRANSFER</span></div>'],

  // --- CONTACT PAGE: real details ---
  ['📍 Contact Details', 'Contact Details'],
  ['<div class="cd-icon">📍</div>\n              <div class="cd-text"><strong>Address</strong><span>24 Market Street, Level 3, Digital District</span></div>',
    '<div class="cd-icon">◉</div>\n              <div class="cd-text"><strong>Address</strong><span>Chattogram, Bangladesh</span></div>'],
  ['<div class="cd-icon">✉️</div>\n              <div class="cd-text"><strong>Email</strong><span>support@visualillusion.shop</span></div>',
    '<div class="cd-icon">◉</div>\n              <div class="cd-text"><strong>Email</strong><span>visualillusion0@gmail.com</span></div>'],
  ['<div class="cd-icon">📞</div>\n              <div class="cd-text"><strong>Phone</strong><span>+1 (555) 018-2210</span></div>',
    '<div class="cd-icon">◉</div>\n              <div class="cd-text"><strong>Phone</strong><span>+880 1537-463765</span></div>'],
  ['<div class="cd-icon">💬</div>\n              <div class="cd-text"><strong>WhatsApp</strong><span>+1 (555) 018-2210</span></div>',
    '<div class="cd-icon">◉</div>\n              <div class="cd-text"><strong>WhatsApp</strong><span>+880 15 374 63765</span></div>'],
  ['<div class="cd-icon">🕐</div>', '<div class="cd-icon">◉</div>'],
  ["average response under <strong>5 minutes</strong> during working hours. 💬", "average response under <strong>5 minutes</strong> during working hours."],
  ['📩 Send Us a Message', 'Send Us a Message'],
  ['📩 Send Message', 'Send Message'],
  ['<div style="font-size:40px;margin-bottom:12px">✅</div>', '<div style="font-size:24px;margin-bottom:12px;color:#059669;font-weight:900;">Message Sent</div>'],
];

// Apply to all HTML files
for (const file of htmlFiles) {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [find, replace] of htmlReplacements) {
    content = content.split(find).join(replace);
  }
  fs.writeFileSync(filePath, content);
  console.log('Fixed: ' + file);
}

console.log('All HTML files updated!');
