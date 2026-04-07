// ==================== DATA ====================
// Products are loaded from Firebase in real-time. This is the fallback/seed data.
let PRODUCTS = [];

const REVIEWS = [
  { name: "Sarah Johnson", avatar: "SJ", source: "Trustpilot", rating: 5, text: "Ordered Netflix Premium — delivered in under 10 minutes. Worked perfectly on day one. Visual Illusion has become my go-to marketplace." },
  { name: "Marcus Chen", avatar: "MC", source: "Facebook", rating: 5, text: "Bought Office 2024 Pro Plus. Legitimate key, activated instantly. Support answered my pre-sale question on WhatsApp within 2 minutes." },
  { name: "Priya Patel", avatar: "PP", source: "Trustpilot", rating: 5, text: "Skeptical at first about the NordVPN price. Turned out completely genuine, works across 5 devices. Saved me about $230." },
  { name: "James O'Connor", avatar: "JO", source: "Facebook Group", rating: 5, text: "Grammarly Premium for 83% off felt too good to be true. It wasn't — legit account, no issues after 4 months." },
  { name: "Amelia Wright", avatar: "AW", source: "Trustpilot", rating: 4, text: "Canva Pro annual subscription activated on my existing account without any hassle. Clean process start to finish." },
  { name: "David Kim", avatar: "DK", source: "Facebook Page", rating: 5, text: "The Coursera Plus bundle is the real deal. Full access to the catalogue, certificates included. Very impressed." },
  { name: "Fatima Al-Sayed", avatar: "FA", source: "Trustpilot", rating: 5, text: "Fast delivery of Spotify Premium, works on my family plan. Support helped me with account switching instantly." },
  { name: "Liam Brown", avatar: "LB", source: "Facebook", rating: 5, text: "Windows 11 Pro key activated on first try. Instructions were clear and setup was painless. Would definitely order again." },
  { name: "Sofia Martinez", avatar: "SM", source: "Trustpilot", rating: 5, text: "Disney+ account delivered quickly, whole family uses it. No issues for 6 months and counting. Highly recommend." },
];

const BLOGS = [
  {
    id: 1, cat: "AI Tools", date: "Mar 28, 2026", author: "Editorial Team",
    title: "Claude vs ChatGPT in 2026: Which Writing Assistant Actually Ships Better Work?",
    excerpt: "A side-by-side comparison across long-form drafting, code review, and structured data tasks — with numbers, not vibes."
  },
  {
    id: 2, cat: "Productivity", date: "Mar 21, 2026", author: "Marcus L.",
    title: "The Productivity Stack That Replaced 11 Apps With 3",
    excerpt: "How one small team cut their SaaS spend by 60% without losing a single workflow. The tools, the migration, the regrets."
  },
  {
    id: 3, cat: "Streaming", date: "Mar 14, 2026", author: "Priya R.",
    title: "Netflix, Disney+, Prime: The Streaming Math for 2026",
    excerpt: "Price hikes, ad tiers, shared plans. What's actually worth paying for this year — and what to drop."
  },
  {
    id: 4, cat: "Writing", date: "Mar 07, 2026", author: "Editorial Team",
    title: "QuillBot, Grammarly, Jenni: Writing Tool Shootout",
    excerpt: "Tested on 40 real documents. Which tool catches what, and where each one quietly fails."
  },
  {
    id: 5, cat: "VPN", date: "Feb 28, 2026", author: "Security Desk",
    title: "VPN Buying Guide: Beyond the Marketing",
    excerpt: "Jurisdiction, logging policy, actual speed tests. The five questions that matter before you pay."
  },
  {
    id: 6, cat: "Education", date: "Feb 21, 2026", author: "Editorial Team",
    title: "Is Coursera Plus Worth $399? The Honest Math",
    excerpt: "We enrolled in 14 courses. Completed 9. Here's what the certificates actually did for careers."
  },
];

const FAQS = [
  { q: "How do I place an order?", a: "Browse our products and click Buy Now or Add to Cart. To complete your purchase, contact us directly via WhatsApp (+880 15 374 63765), Telegram (+880 15 374 63765), or phone (+880 1537-463765). We will confirm your order and arrange delivery." },
  { q: "Are the products authentic?", a: "Yes. Every product is sourced through legitimate channels and verified before delivery. If a product fails to activate, we replace it or issue a full refund — no questions asked." },
  { q: "How long does delivery take?", a: "Most digital products are delivered within 5–30 minutes during working hours (Mon–Sun, 9am–11pm). Software keys are typically instant. Delivery delays outside working hours are possible." },
  { q: "What payment methods are accepted?", a: "We accept bKash, Nagad, Rocket, and bank transfer. Contact us via WhatsApp or Telegram to arrange payment before delivery." },
  { q: "How do I get support after purchase?", a: "WhatsApp (+880 15 374 63765) and Telegram are the fastest routes — average first response under 5 minutes during working hours. You can also email us at visualillusion0@gmail.com." },
];

const HOME_SECTIONS = [
  { title: "AI, Grammar & Writing Tools", ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { title: "Streaming Collection", ids: [11, 12, 13, 14, 33, 34, 35] },
  { title: "Google Products", ids: [15, 16, 17] },
  { title: "Microsoft Products", ids: [18, 19, 20] },
  { title: "Edu-Tech Tools", ids: [21, 22, 26] },
  { title: "Utilities & Productivity", ids: [23, 24, 25, 36] },
  { title: "Security & VPN Tools", ids: [27, 28, 29, 37, 38] },
  { title: "Apple Products", ids: [30, 31, 32] },
];

const DURATIONS = { "1 Month": 1, "3 Months": 2.7, "6 Months": 5, "12 Months": 9 };
const CATEGORIES = ["All", "AI Tools", "Writing Tools", "Productivity", "Streaming", "Education", "VPN & Security", "Cloud Storage", "Software Keys", "Utilities", "Design Tools"];

// ==================== STATE ====================

// Load cart from localStorage
let savedCart = [];
try { savedCart = JSON.parse(localStorage.getItem('cart')) || []; } catch (e) { }

let state = {
  page: 'home',
  cart: savedCart,
  wishlist: [],
  activeProduct: null,
  query: '',
  shopFilters: { cats: [], maxPrice: 50, stockOnly: false, sort: 'popular', page: 1 },
  catOpen: false,
};

// ==================== HELPERS ====================
function stars(n) {
  return [1, 2, 3, 4, 5].map(i => `<span class="star ${i <= n ? 'filled' : 'empty'}">★</span>`).join('');
}

function badge(text, tone = 'purple') {
  if (!text) return '';
  return `<span class="badge badge-${tone}">${text}</span>`;
}

function getProductImg(cat) {
  if (cat === 'AI Tools') return 'assets/images/thumb_ai_tools.png';
  if (cat === 'Streaming') return 'assets/images/thumb_streaming.png';
  if (cat === 'Software Keys') return 'assets/images/thumb_software_keys.png';
  if (cat === 'Education') return 'assets/images/thumb_education.png';
  if (cat === 'VPN & Security') return 'assets/images/thumb_vpn_security.png';
  return 'assets/images/thumb_productivity.png';
}

function productCard(p, showQuick = true) {
  let badgeHtml = '';
  if (p.badge) badgeHtml += badge(p.badge, p.badge.startsWith('-') ? 'red' : 'purple');
  if (!p.stock) badgeHtml += badge('Out of Stock', 'red');
  return `
  <article class="product-card" onclick="openProduct(${p.id})" style="cursor:pointer">
    <div class="product-thumb">
      <img class="thumb-img" src="${getProductImg(p.cat)}" alt="${p.name}" style="width:120px;height:120px;object-fit:contain;position:relative;z-index:1;" />
      <div class="product-badges">${badgeHtml}</div>
      ${showQuick ? `<div class="product-quick" onclick="event.stopPropagation();openProduct(${p.id})"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>` : ''}
    </div>
    <div class="product-info">
      <div class="product-cat">${p.cat}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price-row">
        <div class="product-price">
          <span class="price-from">from</span>
          <span class="price-amount">$${p.base.toFixed(2)}</span>
        </div>
        <span class="product-sold">${p.sold24} sold</span>
      </div>
      <button class="product-add" ${!p.stock ? 'disabled' : ''} onclick="event.stopPropagation();${p.stock ? `addToCart(${p.id},'1 Month',${p.base})` : ''}">
        ${p.stock ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  </article>`;
}

function blogCard(b) {
  return `
  <article class="blog-card">
    <div class="blog-thumb">
      <img src="${getProductImg(b.cat)}" style="width:100%;height:100%;object-fit:cover;opacity:0.4;" />
      <span class="blog-date">${b.date}</span>
    </div>
    <div class="blog-info">
      ${badge(b.cat, 'purple')}
      <h3>${b.title}</h3>
      <p>${b.excerpt}</p>
      <div class="blog-footer">
        <span class="blog-author">${b.author}</span>
        <span class="blog-read">Read More →</span>
      </div>
    </div>
  </article>`;
}

function reviewCard(r) {
  return `
  <div class="review-card">
    <div class="review-header">
      <div class="avatar">${r.avatar}</div>
      <div class="review-meta">
        <h5>${r.name}</h5>
        <div class="stars">${stars(r.rating)}</div>
        <div class="review-source">${r.source}</div>
      </div>
    </div>
    <p class="review-text">"${r.text}"</p>
  </div>`;
}

// ==================== CART ====================
function addToCart(id, variant = '1 Month · Shared Account', price = null) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || !p.stock) return;
  const finalPrice = price || p.base;
  const key = `${id}-${variant}`;
  const existing = state.cart.find(i => i.key === key);
  if (existing) existing.qty++;
  else state.cart.push({ key, id, name: p.name, cat: p.cat, price: finalPrice, qty: 1, variant });
  renderCart();
  localStorage.setItem('cart', JSON.stringify(state.cart));
  openCart();
  updateCartCount();
}

function removeFromCart(key) {
  state.cart = state.cart.filter(i => i.key !== key);
  localStorage.setItem('cart', JSON.stringify(state.cart));
  renderCart();
  updateCartCount();
}

function updateQty(key, delta) {
  const item = state.cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  localStorage.setItem('cart', JSON.stringify(state.cart));
  renderCart();
}

function updateCartCount() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-count').style.display = count > 0 ? 'flex' : 'none';
  document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
}

function renderCart() {
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;
  if (state.cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><div style="font-size:28px;margin-bottom:16px;color:#7c3aed;font-weight:900">Empty Cart</div><p style="font-weight:700;margin-bottom:6px">Your cart is empty</p><p style="font-size:13px;color:#94a3b8">Add some products to get started</p></div>`;
    if (foot) foot.style.display = 'none';
    return;
  }
  const total = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  body.innerHTML = state.cart.map(i => `
    <div class="cart-item">
      <div class="cart-item-thumb"><img src="${getProductImg(i.cat || 'AI Tools')}" style="width:40px;height:40px;object-fit:contain" /></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-variant">${i.variant}</div>
        <div class="cart-item-price">$${(i.price * i.qty).toFixed(2)}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty('${i.key}',-1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="updateQty('${i.key}',1)">+</button>
          <button class="cart-remove" onclick="removeFromCart('${i.key}')">Remove</button>
        </div>
      </div>
    </div>`).join('');
  if (foot) {
    foot.style.display = 'block';
    foot.innerHTML = `
      <div class="cart-total-row">
        <span class="cart-total-label">Subtotal (${state.cart.reduce((s, i) => s + i.qty, 0)} items)</span>
        <span class="cart-total-amount">$${total.toFixed(2)}</span>
      </div>
      <button class="btn btn-primary" onclick="showContactPopup()" style="width:100%;justify-content:center;border-radius:12px;padding:14px">Place Order →</button>
      <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:12px">Contact admin to complete your purchase</p>`;
  }
}

function openCart() { document.getElementById('cart-overlay').classList.add('open'); document.getElementById('cart-drawer').classList.add('open'); }
function closeCart() { document.getElementById('cart-overlay').classList.remove('open'); document.getElementById('cart-drawer').classList.remove('open'); }

// ==================== NAVIGATION ====================
function navigate(page) {
  if (page === 'home') window.location.href = 'index.html';
  else window.location.href = page + '.html';
}

function openProduct(id) {
  window.location.href = 'product.html?id=' + id;
}

// ==================== HOME PAGE ====================
function renderHome() {
  const bestSellers = PRODUCTS.filter(p => p.badge === 'Bestseller' || p.badge === 'Hot').slice(0, 5);
  const bestGrid = document.getElementById('best-sellers-grid');
  if (bestGrid) bestGrid.innerHTML = bestSellers.map(p => productCard(p)).join('');

  HOME_SECTIONS.forEach((sec, i) => {
    const el = document.getElementById('home-sec-' + i);
    if (el) {
      const items = PRODUCTS.filter(p => sec.ids.includes(p.id)).slice(0, 5);
      el.innerHTML = items.map(p => productCard(p)).join('');
    }
  });

  const reviewsEl = document.getElementById('home-reviews');
  if (reviewsEl) reviewsEl.innerHTML = REVIEWS.slice(0, 3).map(reviewCard).join('');

  const blogsEl = document.getElementById('home-blogs');
  if (blogsEl) blogsEl.innerHTML = BLOGS.slice(0, 3).map(blogCard).join('');

  const faqEl = document.getElementById('home-faq');
  if (faqEl) faqEl.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(this)">
        ${f.q}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a">${f.a}</div>
    </div>`).join('');
}

function toggleFaq(btn) {
  const a = btn.nextElementSibling;
  const icon = btn.querySelector('.faq-icon');
  btn.classList.toggle('open');
  a.classList.toggle('open');
  icon.textContent = a.classList.contains('open') ? '×' : '+';
}

// ==================== SHOP PAGE ====================
function renderShop() {
  const f = state.shopFilters;
  let products = PRODUCTS.filter(p => {
    if (f.cats.length && !f.cats.includes(p.cat)) return false;
    if (p.base > f.maxPrice) return false;
    if (f.stockOnly && !p.stock) return false;
    if (state.query && !p.name.toLowerCase().includes(state.query.toLowerCase()) && !p.cat.toLowerCase().includes(state.query.toLowerCase())) return false;
    return true;
  });
  if (f.sort === 'low') products.sort((a, b) => a.base - b.base);
  else if (f.sort === 'high') products.sort((a, b) => b.base - a.base);
  else if (f.sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
  const perPage = 12, total = products.length, pages = Math.ceil(total / perPage) || 1;
  f.page = Math.min(f.page, pages);
  const paged = products.slice((f.page - 1) * perPage, f.page * perPage);

  const grid = document.getElementById('shop-grid');
  if (grid) {
    if (paged.length === 0) grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#64748b;background:#fff;border-radius:14px;border:1px solid #e2e8f0;"><p style="font-weight:600;font-size:15px;color:#64748b">No products match your filters.</p></div>`;
    else grid.innerHTML = paged.map(p => productCard(p)).join('');
  }
  const count = document.getElementById('shop-count');
  if (count) count.innerHTML = `Showing <strong>${paged.length}</strong> of <strong>${total}</strong> products`;
  const pag = document.getElementById('pagination');
  if (pag) {
    let html = `<button class="page-btn" onclick="shopPage(${f.page - 1})" ${f.page === 1 ? 'disabled' : ''}>‹</button>`;
    for (let i = 1; i <= pages; i++) html += `<button class="page-btn ${f.page === i ? 'active' : ''}" onclick="shopPage(${i})">${i}</button>`;
    html += `<button class="page-btn" onclick="shopPage(${f.page + 1})" ${f.page === pages ? 'disabled' : ''}>›</button>`;
    pag.innerHTML = html;
  }
}

function shopPage(n) { state.shopFilters.page = n; renderShop(); }
function toggleCat(cat) {
  const cats = state.shopFilters.cats;
  const idx = cats.indexOf(cat);
  if (idx >= 0) cats.splice(idx, 1); else cats.push(cat);
  state.shopFilters.page = 1; renderShop();
}
function setMaxPrice(v) { state.shopFilters.maxPrice = parseFloat(v); document.getElementById('price-display').textContent = '$' + v; state.shopFilters.page = 1; renderShop(); }
function setStockOnly(v) { state.shopFilters.stockOnly = v; state.shopFilters.page = 1; renderShop(); }
function setSort(v) { state.shopFilters.sort = v; state.shopFilters.page = 1; renderShop(); }
function setQuery(v) { state.query = v; state.shopFilters.page = 1; renderShop(); }
function quickTag(t) {
  window.location.href = 'shop.html?search=' + encodeURIComponent(t);
}

// ==================== PRODUCT DETAIL ====================
function renderProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const idStr = urlParams.get('id');
  if (!idStr) return;
  const id = parseInt(idStr) || 1;
  const p = PRODUCTS.find(x => x.id === id);
  state.activeProduct = p;
  if (!p) return;

  state.prodDuration = state.prodDuration || '1 Month';
  state.prodType = state.prodType || 'Shared Account';
  state.prodQty = state.prodQty || 1;

  const mult = DURATIONS[state.prodDuration] || 1;
  const typeAdj = state.prodType === 'Personal Account' ? 1.8 : 1;
  const price = (p.base * mult * typeAdj).toFixed(2);
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  const el = document.getElementById('page-product');
  if (!el) return;

  let badgeHtml = '';
  if (p.badge) badgeHtml += badge(p.badge, p.badge.startsWith('-') ? 'red' : 'purple');
  badgeHtml += badge(p.stock ? 'In Stock' : 'Out of Stock', p.stock ? 'green' : 'red');

  const tabbedContent = `
    <div style="font-size:14px;color:#64748b;line-height:1.8">
      ${p.name} is a premium digital subscription delivered with full support. Verified through authorized distribution channels. Every order includes setup instructions and a replacement guarantee.
    </div>`;

  el.innerHTML = `
    <div class="page-banner">
      <div class="container">
        <div class="breadcrumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / ${p.cat} / <span style="color:#e2e8f0">${p.name}</span></div>
      </div>
    </div>
    <div class="container" style="padding-top:40px;padding-bottom:60px">
      <div class="product-detail-grid">
        <div class="product-image-box">
          <img src="${getProductImg(p.cat)}" style="width:200px;height:200px;object-fit:contain;position:relative;z-index:1;" alt="${p.name}"/>
          <div class="detail-badges">${badgeHtml}</div>
        </div>
        <div class="product-detail-info">
          ${badge(p.cat, 'purple')}
          <h1>${p.name}</h1>
          <div class="rating-row">
            <div class="stars">${stars(5)}</div>
            <span style="font-size:13px;color:#64748b">128 reviews</span>
            <span style="color:#e2e8f0;margin:0 8px">|</span>
            <span style="font-size:13px;color:#059669;font-weight:700">✓ Verified Seller</span>
          </div>
          <div class="hot-notice">
            <p><strong>${p.watchers} people</strong> watching this right now</p>
            <p><strong>${p.sold24} sold</strong> in the last 24 hours</p>
          </div>
          <div class="price-box">
            <div class="price-label">Current Price</div>
            <div style="display:flex;align-items:baseline;gap:8px">
              <span class="price-main">$${price}</span>
              <span class="price-period">/ ${state.prodDuration}</span>
            </div>
            ${!p.keyOnly ? `<p style="font-size:12px;color:#94a3b8;margin-top:6px">Range: $${p.base.toFixed(2)} – $${(p.base * 9 * 1.8).toFixed(2)}</p>` : ''}
          </div>
          ${!p.keyOnly ? `
          <div class="var-label">Duration</div>
          <div class="duration-grid">
            ${Object.keys(DURATIONS).map(d => `<button class="var-btn ${state.prodDuration === d ? 'active' : ''}" onclick="setProdDuration('${d}')">${d}</button>`).join('')}
          </div>
          <div class="var-label">Account Type</div>
          <div class="actype-grid">
            ${['Shared Account', 'Personal Account'].map(a => `<button class="var-btn ${state.prodType === a ? 'active' : ''}" onclick="setProdType('${a}')">${a}</button>`).join('')}
          </div>
          <div style="background:#f5f3ff;border-left:3px solid #7c3aed;padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:20px;font-size:12px;color:#4c1d95">
            <strong>${state.prodType === 'Shared Account' ? 'Shared: 1 active device. Credentials shared across plan members.' : 'Personal: Up to 5 devices. Full account control.'}</strong> Delivery 5–30 min.
          </div>`: ''}
          <div class="qty-row">
            <div class="var-label" style="margin:0">Quantity</div>
            <div class="qty-control">
              <button onclick="setProdQty(${state.prodQty - 1})">−</button>
              <span>${state.prodQty}</span>
              <button onclick="setProdQty(${state.prodQty + 1})">+</button>
            </div>
          </div>
          <div class="action-row">
            <button class="cart-btn" ${!p.stock ? 'disabled' : ''} onclick="addToCart(${p.id},'${state.prodDuration}${p.keyOnly ? '' : ' · ' + state.prodType}',${price})">Add To Cart</button>
            <button class="buy-btn" ${!p.stock ? 'disabled' : ''} onclick="showContactPopup()">Buy Now</button>
            <button class="icon-btn">↗</button>
          </div>
          <div class="trust-strip">
            <div class="trust-item">Instant Delivery</div>
            <div class="trust-item">Verified Product</div>
            <div class="trust-item">24/7 Support</div>
          </div>
        </div>
      </div>

      <div class="product-tabs">
        <button class="tab-btn active" onclick="switchTab(this,'tab-desc')">Description</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-feat')">Features</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-deliv')">Delivery Info</button>
        <button class="tab-btn" onclick="switchTab(this,'tab-rev')">Reviews</button>
      </div>
      <div class="tab-content">
        <div id="tab-desc" class="tab-pane active">${tabbedContent}</div>
        <div id="tab-feat" class="tab-pane">
          <ul style="list-style:none;display:flex;flex-direction:column;gap:10px">
            ${['Authentic, verified license', 'Activation within minutes of delivery', 'Full technical setup support included', 'Replacement or refund guarantee', 'Compatible with all current versions', 'All premium features unlocked'].map(x => `<li style="display:flex;align-items:center;gap:10px;font-size:14px;color:#475569"><span style="color:#7c3aed">✓</span>${x}</li>`).join('')}
          </ul>
        </div>
        <div id="tab-deliv" class="tab-pane" style="font-size:14px;color:#64748b;line-height:1.8">Delivery is digital, via email, within 5–30 minutes during business hours (Mon–Sun, 9am–11pm). Support is available via email, WhatsApp, and live chat around the clock.</div>
        <div id="tab-rev" class="tab-pane">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            ${REVIEWS.slice(0, 4).map(r => `<div style="padding:16px;border:1px solid #e2e8f0;border-radius:10px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><div class="avatar">${r.avatar}</div><div><strong style="font-size:14px">${r.name}</strong><div class="stars">${stars(r.rating)}</div></div></div><p style="font-size:13px;color:#64748b">"${r.text}"</p></div>`).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top:56px">
        <div class="section-head"><div><div class="eyebrow">More Like This</div><h2 class="h2">Related Products</h2></div></div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
          ${related.map(p => productCard(p)).join('')}
        </div>
      </div>
    </div>`;
}

function setProdDuration(d) { state.prodDuration = d; renderProductDetail(); }
function setProdType(t) { state.prodType = t; renderProductDetail(); }
function setProdQty(q) { state.prodQty = Math.max(1, q); renderProductDetail(); }
function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
}

// ==================== REVIEWS PAGE ====================
function renderReviews(source = 'All') {
  const filtered = source === 'All' ? REVIEWS : REVIEWS.filter(r => r.source === source);
  const grid = document.getElementById('reviews-grid');
  if (grid) grid.innerHTML = filtered.map(reviewCard).join('');
}

// ==================== BLOGS PAGE ====================
function renderBlogs() {
  const grid = document.getElementById('blogs-grid');
  if (grid) grid.innerHTML = BLOGS.map(blogCard).join('');
}

// ==================== CONTACT FORM ====================
function handleContact(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
}

// ==================== SEARCH ====================
function handleSearch(e) {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) {
      // If already on shop page, filter in place
      if (window.location.pathname.includes('shop.html')) {
        state.query = q;
        state.shopFilters.page = 1;
        renderShop();
      } else {
        window.location.href = 'shop.html?search=' + encodeURIComponent(q);
      }
    }
  }
}

// ==================== CATEGORY DROPDOWN ====================
function toggleCatMenu() {
  state.catOpen = !state.catOpen;
  document.getElementById('cat-menu')?.classList.toggle('open', state.catOpen);
}

// ==================== CONTACT POPUP ====================
function showContactPopup() {
  let popup = document.getElementById('contact-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'contact-popup';
    popup.innerHTML = `
      <div class="contact-popup-overlay" onclick="closeContactPopup()"></div>
      <div class="contact-popup-box">
        <button class="contact-popup-close" onclick="closeContactPopup()">&times;</button>
        <h3>Complete Your Order</h3>
        <p>To place your order, please contact us directly through any of the channels below. Share the product name and your preferred plan — we'll handle the rest.</p>
        <div class="contact-popup-channels">
          <a href="https://wa.me/8801537463765" target="_blank" class="contact-channel whatsapp">
            <span class="channel-name">WhatsApp</span>
            <span class="channel-number">+880 15 374 63765</span>
          </a>
          <a href="https://t.me/+8801537463765" target="_blank" class="contact-channel telegram">
            <span class="channel-name">Telegram</span>
            <span class="channel-number">+880 15 374 63765</span>
          </a>
          <a href="tel:+8801537463765" class="contact-channel phone">
            <span class="channel-name">Phone / SMS</span>
            <span class="channel-number">+880 1537-463765</span>
          </a>
          <a href="mailto:visualillusion0@gmail.com" class="contact-channel email">
            <span class="channel-name">Email</span>
            <span class="channel-number">visualillusion0@gmail.com</span>
          </a>
        </div>
        <p class="contact-popup-note">We respond within 5 minutes during working hours (9am – 11pm).</p>
      </div>`;
    document.body.appendChild(popup);
  }
  popup.classList.add('open');
}

function closeContactPopup() {
  const popup = document.getElementById('contact-popup');
  if (popup) popup.classList.remove('open');
}

// ==================== FIREBASE SYNC ====================
let _firebaseReady = false;
let _db = null;
let _firebaseReadyResolve;
var firebaseReadyPromise = new Promise(function (resolve) { _firebaseReadyResolve = resolve; });

function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('[Firebase] SDK not loaded! Check script tags.');
    _firebaseReadyResolve(false);
    return;
  }
  if (typeof FIREBASE_CONFIG === 'undefined') {
    console.error('[Firebase] Config not loaded! Check firebase-config.js.');
    _firebaseReadyResolve(false);
    return;
  }
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    _db = firebase.database();
    _firebaseReady = true;
    console.log('[Firebase] Connected to', FIREBASE_CONFIG.projectId);
    _firebaseReadyResolve(true);
    listenForProducts();
  } catch (e) {
    console.error('[Firebase] Init failed:', e.message);
    _firebaseReadyResolve(false);
  }
}

function listenForProducts() {
  if (!_db) return;
  _db.ref('products').on('value', (snap) => {
    const data = snap.val();
    if (data) {
      // Firebase stores as object with keys, convert to array
      const arr = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
      PRODUCTS = arr;
      console.log('[Firebase] Loaded', PRODUCTS.length, 'products');
    } else {
      PRODUCTS = [];
      console.log('[Firebase] No products found.');
    }
    rerenderCurrentPage();
  });
}

function rerenderCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('shop.html')) renderShop();
  else if (path.includes('product.html')) renderProductDetail();
  else if (path.includes('reviews.html')) renderReviews();
  else if (path.includes('blogs.html')) renderBlogs();
  else if (!path.includes('about.html') && !path.includes('contact.html') && !path.includes('admin')) renderHome();
}

// Push local seed data to Firebase (only if DB is empty)
function seedFirebase() {
  // Seeding disabled
}

// Save a single product to Firebase
function saveProductToFirebase(product) {
  if (!_db) return Promise.reject('No database connection. Firebase may not be initialized — check console for errors.');
  return _db.ref('products/' + product.id).set(product);
}

// Delete a product from Firebase
function deleteProductFromFirebase(id) {
  if (!_db) return Promise.reject('No database connection');
  return _db.ref('products/' + id).remove();
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {

  const path = window.location.pathname;
  if (path.includes('shop.html')) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('search')) {
      state.query = searchParams.get('search');
      const searchBox = document.getElementById('shop-search');
      if (searchBox) searchBox.value = state.query;
    }
    renderShop();
  } else if (path.includes('product.html')) {
    renderProductDetail();
  } else if (path.includes('reviews.html')) {
    renderReviews();
  } else if (path.includes('blogs.html')) {
    renderBlogs();
  } else if (path.includes('about.html') || path.includes('contact.html') || path.includes('admin') || path.includes('dashboard')) {
    // Static
  } else {
    // Default to home
    renderHome();
  }

  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  // Close cat menu on outside click
  document.addEventListener('click', (e) => {
    if (state.catOpen && !e.target.closest('.cat-dropdown')) {
      state.catOpen = false;
      document.getElementById('cat-menu')?.classList.remove('open');
    }
  });

  updateCartCount();

  // Animate stats counter
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(el => {
          const target = el.textContent;
          el.style.opacity = '0';
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'none'; }, 100);
        });
      }
    });
  }, { threshold: 0.3 });
  const statsEl = document.querySelector('.stats-strip');
  if (statsEl) observer.observe(statsEl);

  // Initialize Firebase and start real-time sync
  initFirebase();
  seedFirebase();
});
