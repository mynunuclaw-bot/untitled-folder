const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add localStorage to cart logic
code = code.replace("let state = {", `
// Load cart from localStorage
let savedCart = [];
try { savedCart = JSON.parse(localStorage.getItem('cart')) || []; } catch(e){}

let state = {`);

code = code.replace("cart: [],", "cart: savedCart,");

const saveCartStr = "\n  localStorage.setItem('cart', JSON.stringify(state.cart));";
code = code.replace("renderCart();\n  openCart();", "renderCart();" + saveCartStr + "\n  openCart();");
code = code.replace(/ removeFromCart\(key\) \{[\s\S]*?updateCartCount\(\);\n\}/, ` removeFromCart(key) {
  state.cart = state.cart.filter(i=>i.key!==key);
  localStorage.setItem('cart', JSON.stringify(state.cart));
  renderCart();
  updateCartCount();
}`);
code = code.replace(/function updateQty\(key, delta\) \{[\s\S]*?renderCart\(\);\n\}/, `function updateQty(key, delta) {
  const item = state.cart.find(i=>i.key===key);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  localStorage.setItem('cart', JSON.stringify(state.cart));
  renderCart();
}`);

// 2. Rewrite routing to use actual URLs
code = code.replace(/function navigate\(page, scrollTop=true\) \{[\s\S]*?closeCart\(\);\n\}/, `function navigate(page) {
  if (page === 'home') window.location.href = 'index.html';
  else window.location.href = page + '.html';
}`);
code = code.replace(/function openProduct\(id\) \{[\s\S]*?\n\}/, `function openProduct(id) {
  window.location.href = 'product.html?id=' + id;
}`);
code = code.replace(/function quickTag\(t\) \{[\s\S]*?\n\}/, `function quickTag(t) {
  window.location.href = 'shop.html?search=' + encodeURIComponent(t);
}`);

// 3. Update activeProduct logic in renderProductDetail to parse URL query param
code = code.replace("const p = state.activeProduct;", `
  const urlParams = new URLSearchParams(window.location.search);
  const idStr = urlParams.get('id');
  if(!idStr) return;
  const id = parseInt(idStr) || 1;
  const p = PRODUCTS.find(x=>x.id===id);
  state.activeProduct = p;
`);

// 4. Update Initialization logic to render the correct page automatically
code = code.replace("navigate('home', false);", `
  const path = window.location.pathname;
  if(path.includes('shop.html')) {
    const searchParams = new URLSearchParams(window.location.search);
    if(searchParams.has('search')) {
      state.query = searchParams.get('search');
      const searchBox = document.getElementById('shop-search');
      if (searchBox) searchBox.value = state.query;
    }
    renderShop();
  } else if(path.includes('product.html')) {
    renderProductDetail();
  } else if(path.includes('reviews.html')) {
    renderReviews();
  } else if(path.includes('blogs.html')) {
    renderBlogs();
  } else if(path.includes('about.html') || path.includes('contact.html') || path.includes('admin') || path.includes('dashboard')) {
     // Static
  } else {
    // Default to home
    renderHome();
  }
`);

// Write the modified code back
fs.writeFileSync('app.js', code);
console.log('app.js routing and cart updated');
