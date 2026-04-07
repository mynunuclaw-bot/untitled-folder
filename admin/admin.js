// =====================================================================
// Visual Illusion — Admin Dashboard JS
// Full product management with Firebase Realtime DB + Storage
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== Login System =====
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');
    
    // Check session storage
    if (sessionStorage.getItem('vi_admin_logged_in') === 'true') {
        if (loginOverlay) loginOverlay.classList.add('hidden');
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('login-username').value;
            const pass = document.getElementById('login-password').value;
            
            if (user === 'bokaamibokatoi' && pass === 'shakalakabombomvai') {
                sessionStorage.setItem('vi_admin_logged_in', 'true');
                loginOverlay.classList.add('hidden');
                loginError.style.display = 'none';
                showToast('Logged in successfully!');
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    // ===== Logout Logic =====
    // Add logout function globally
    window.adminLogout = function() {
        sessionStorage.removeItem('vi_admin_logged_in');
        window.location.reload();
    };

    // ===== Firebase refs =====
    let _storage = null;
    try {
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            _storage = firebase.storage();
        }
    } catch(e) { console.warn('Storage init:', e.message); }

    // ===== View Switcher =====
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const sections = document.querySelectorAll('.view-section');
    const pageTitle = document.querySelector('.page-title');

    const viewTitles = {
        'dashboard': 'Dashboard',
        'products': 'Products',
        'add-product': 'Add Product',
        'categories': 'Categories',
        'orders': 'Orders',
        'customers': 'Customers',
        'reviews': 'Reviews',
        'settings': 'Settings',
    };

    function switchView(viewId) {
        navItems.forEach(nav => nav.classList.toggle('active', nav.dataset.view === viewId));
        sections.forEach(sec => sec.classList.toggle('active', sec.id === 'view-' + viewId));
        if (pageTitle && viewTitles[viewId]) pageTitle.textContent = viewTitles[viewId];
        if (viewId === 'products') renderProductsTable();
        if (viewId === 'categories') renderCategoriesTable();
        // Scroll to top
        document.querySelector('.content-area')?.scrollTo(0, 0);
    }

    navItems.forEach(nav => {
        nav.addEventListener('click', () => {
            if (nav.dataset.view) switchView(nav.dataset.view);
        });
    });

    switchView('dashboard');
    setTimeout(() => { renderProductsTable(); renderCategoriesTable(); }, 1500);

    // ===== Section Collapse/Expand =====
    window.toggleSection = function(header) {
        header.classList.toggle('collapsed');
        const body = header.nextElementSibling;
        body.classList.toggle('collapsed');
    };

    // ===== Auto-Slug =====
    const nameInput = document.getElementById('pf-name');
    const slugInput = document.getElementById('pf-slug');
    if (nameInput && slugInput) {
        nameInput.addEventListener('input', () => {
            if (!slugInput.dataset.manual) {
                slugInput.value = nameInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
        });
        slugInput.addEventListener('input', () => { slugInput.dataset.manual = '1'; });
    }

    // ===== Character Counters =====
    function bindCounter(inputId, counterId) {
        const el = document.getElementById(inputId);
        const counter = document.getElementById(counterId);
        if (!el || !counter) return;
        const max = parseInt(el.getAttribute('maxlength')) || 999;
        el.addEventListener('input', () => {
            const len = el.value.length;
            counter.textContent = `${len} / ${max}`;
            counter.className = 'char-counter' + (len > max ? ' over' : len > max * 0.85 ? ' warn' : '');
        });
    }
    bindCounter('pf-short-desc', 'short-desc-counter');
    bindCounter('pf-seo-title', 'seo-title-counter');
    bindCounter('pf-seo-desc', 'seo-desc-counter');

    // ===== SEO Live Preview =====
    const seoTitle = document.getElementById('pf-seo-title');
    const seoDesc = document.getElementById('pf-seo-desc');
    if (seoTitle) seoTitle.addEventListener('input', () => {
        document.getElementById('seo-live-title').textContent = seoTitle.value || 'Product Name — Visual Illusion';
    });
    if (seoDesc) seoDesc.addEventListener('input', () => {
        document.getElementById('seo-live-desc').textContent = seoDesc.value || 'Product description will appear here...';
    });
    if (slugInput) slugInput.addEventListener('input', () => {
        document.getElementById('seo-live-slug').textContent = slugInput.value || 'product-name';
    });
    if (nameInput) nameInput.addEventListener('input', () => {
        document.getElementById('seo-live-slug').textContent = slugInput.value || 'product-name';
    });

    // ===== Price Range Toggle =====
    const priceRangeToggle = document.getElementById('pf-price-range-toggle');
    if (priceRangeToggle) {
        priceRangeToggle.addEventListener('change', () => {
            document.getElementById('price-range-fields').style.display = priceRangeToggle.checked ? 'block' : 'none';
        });
    }

    // ===== Tag Input =====
    const tagsWrap = document.getElementById('pf-tags-wrap');
    const tagsInput = document.getElementById('pf-tags-input');
    let _tags = [];

    if (tagsInput) {
        tagsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = tagsInput.value.trim();
                if (val && !_tags.includes(val)) {
                    _tags.push(val);
                    renderTags();
                }
                tagsInput.value = '';
            }
        });
        tagsWrap?.addEventListener('click', () => tagsInput.focus());
    }

    function renderTags() {
        tagsWrap.querySelectorAll('.tag-pill').forEach(p => p.remove());
        _tags.forEach((tag, i) => {
            const pill = document.createElement('span');
            pill.className = 'tag-pill';
            pill.innerHTML = `${tag}<span class="tag-remove" data-idx="${i}">&times;</span>`;
            tagsWrap.insertBefore(pill, tagsInput);
        });
        tagsWrap.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                _tags.splice(parseInt(e.target.dataset.idx), 1);
                renderTags();
            });
        });
    }

    // ===== Badge Selector =====
    let _selectedBadges = [];
    document.querySelectorAll('#pf-badges .badge-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const badge = opt.dataset.badge;
            opt.classList.toggle('selected');
            if (opt.classList.contains('selected')) {
                if (!_selectedBadges.includes(badge)) _selectedBadges.push(badge);
            } else {
                _selectedBadges = _selectedBadges.filter(b => b !== badge);
            }
        });
    });

    // ===== Product Details Builder =====
    let _detailIdCounter = 0;
    window.addDetailRow = function(label = '', value = '') {
        const id = _detailIdCounter++;
        const container = document.getElementById('details-builder');
        const row = document.createElement('div');
        row.className = 'builder-row';
        row.dataset.detailId = id;
        row.innerHTML = `
            <span class="drag-handle">⠿</span>
            <input type="text" class="form-control" placeholder="Label (e.g. Account Type)" value="${escHtml(label)}" style="max-width:200px">
            <input type="text" class="form-control" placeholder="Value (e.g. Shared / Personal)" value="${escHtml(value)}">
            <button type="button" class="remove-row-btn" onclick="this.closest('.builder-row').remove()">&times;</button>
        `;
        container.appendChild(row);
    };

    // ===== Variant Builder =====
    let _variantIdCounter = 0;
    window.addVariantCard = function(data = {}) {
        const id = _variantIdCounter++;
        const container = document.getElementById('variants-builder');
        const card = document.createElement('div');
        card.className = 'variant-card';
        card.dataset.variantId = id;
        card.innerHTML = `
            <div class="variant-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
                <div class="variant-title">
                    <span class="drag-handle">⠿</span>
                    <span class="vt-name">${data.name || 'New Variant'}</span>
                </div>
                <div class="variant-actions">
                    <button type="button" class="btn btn-sm btn-outline" onclick="event.stopPropagation();this.closest('.variant-card').remove()">Remove</button>
                </div>
            </div>
            <div class="variant-body">
                <div class="grid-3">
                    <div class="form-group">
                        <label class="form-label">Variant Name</label>
                        <input type="text" class="form-control v-name" placeholder="e.g. 1 Month" value="${escHtml(data.name || '')}" oninput="this.closest('.variant-card').querySelector('.vt-name').textContent=this.value||'New Variant'">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Price (৳)</label>
                        <input type="number" step="0.01" class="form-control v-price" placeholder="299" value="${data.price || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Sale Price (৳)</label>
                        <input type="number" step="0.01" class="form-control v-sale" placeholder="Optional" value="${data.salePrice || ''}">
                    </div>
                </div>
                <div class="grid-3">
                    <div class="form-group">
                        <label class="form-label">Stock Status</label>
                        <select class="form-control v-stock">
                            <option value="in-stock" ${data.stock === 'out-of-stock' ? '' : 'selected'}>In Stock</option>
                            <option value="out-of-stock" ${data.stock === 'out-of-stock' ? 'selected' : ''}>Out of Stock</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Visibility</label>
                        <select class="form-control v-visible">
                            <option value="visible" ${data.visibility === 'hidden' ? '' : 'selected'}>Visible</option>
                            <option value="hidden" ${data.visibility === 'hidden' ? 'selected' : ''}>Hidden</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Default Selection</label>
                        <select class="form-control v-default">
                            <option value="no" ${data.isDefault ? '' : 'selected'}>No</option>
                            <option value="yes" ${data.isDefault ? 'selected' : ''}>Yes</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Extra Details</label>
                    <input type="text" class="form-control v-extra" placeholder="e.g. Best value, includes renewal..." value="${escHtml(data.extra || '')}">
                </div>
            </div>
        `;
        container.appendChild(card);
    };

    // ===== Image Upload Handling =====
    let _thumbnailFile = null;
    let _galleryFiles = [];
    let _bannerFile = null;
    let _thumbnailUrl = '';
    let _galleryUrls = [];
    let _bannerUrl = '';

    function setupUploadZone(zoneId, inputId, previewId, multiple, onFiles) {
        const zone = document.getElementById(zoneId);
        const input = document.getElementById(inputId);
        if (!zone || !input) return;

        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', (e) => {
            e.preventDefault(); zone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            if (files.length) onFiles(files, previewId);
        });
        input.addEventListener('change', () => {
            const files = Array.from(input.files);
            if (files.length) onFiles(files, previewId);
            input.value = '';
        });
    }

    function showImagePreviews(files, previewId, existingUrls) {
        const container = document.getElementById(previewId);
        if (!container) return;
        container.innerHTML = '';
        const all = [...(existingUrls || []).map(u => ({type:'url', src:u})), ...files.map(f => ({type:'file', src:URL.createObjectURL(f), name:f.name}))];
        all.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'upload-preview-item';
            div.innerHTML = `<img src="${item.src}"><button class="preview-remove" data-idx="${i}" type="button">&times;</button>${item.name ? `<span class="preview-label">${item.name}</span>` : ''}`;
            container.appendChild(div);
        });
    }

    setupUploadZone('upload-thumbnail', 'pf-thumbnail-input', 'thumbnail-preview', false, (files) => {
        _thumbnailFile = files[0];
        showImagePreviews([_thumbnailFile], 'thumbnail-preview');
    });
    setupUploadZone('upload-gallery', 'pf-gallery-input', 'gallery-preview', true, (files) => {
        _galleryFiles = [..._galleryFiles, ...files];
        showImagePreviews(_galleryFiles, 'gallery-preview');
    });
    setupUploadZone('upload-banner', 'pf-banner-input', 'banner-preview', false, (files) => {
        _bannerFile = files[0];
        showImagePreviews([_bannerFile], 'banner-preview');
    });

    // ===== Upload to Firebase Storage =====
    async function uploadImage(file, path) {
        if (!_storage || !file) return '';
        try {
            const ref = _storage.ref(path);
            const snap = await ref.put(file);
            return await snap.ref.getDownloadURL();
        } catch(e) {
            console.error('Upload failed:', e);
            return '';
        }
    }

    async function uploadAllImages(productId) {
        const urls = { thumbnail: _thumbnailUrl, gallery: [..._galleryUrls], banner: _bannerUrl };

        if (_thumbnailFile) {
            urls.thumbnail = await uploadImage(_thumbnailFile, `products/${productId}/thumbnail_${Date.now()}`);
        }
        if (_bannerFile) {
            urls.banner = await uploadImage(_bannerFile, `products/${productId}/banner_${Date.now()}`);
        }
        for (let i = 0; i < _galleryFiles.length; i++) {
            const url = await uploadImage(_galleryFiles[i], `products/${productId}/gallery_${Date.now()}_${i}`);
            if (url) urls.gallery.push(url);
        }
        return urls;
    }

    // ===== Collect Form Data =====
    function collectFormData() {
        const data = {};

        // Section 1: Basic
        data.name = val('pf-name');
        data.slug = val('pf-slug');
        data.shortDesc = val('pf-short-desc');
        data.fullDesc = val('pf-full-desc');
        data.productType = val('pf-type');
        data.brand = val('pf-brand');
        data.sku = val('pf-sku');
        data.status = val('pf-status');

        // Section 2: Pricing
        data.base = parseFloat(val('pf-price')) || 0;
        data.salePrice = parseFloat(val('pf-sale-price')) || null;
        data.currency = val('pf-currency');
        data.priceRange = checked('pf-price-range-toggle');
        data.priceMin = parseFloat(val('pf-price-min')) || null;
        data.priceMax = parseFloat(val('pf-price-max')) || null;
        data.showDiscountBadge = checked('pf-discount-badge');

        // Section 3: Category & Tags
        data.cat = val('pf-cat');
        data.subcat = val('pf-subcat');
        data.tags = [..._tags];
        data.collection = val('pf-collection');
        data.homeSections = [];
        document.querySelectorAll('#pf-home-sections input[type="checkbox"]:checked').forEach(cb => {
            data.homeSections.push(cb.value);
        });

        // Section 5: Details
        data.details = [];
        document.querySelectorAll('#details-builder .builder-row').forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs[0]?.value || inputs[1]?.value) {
                data.details.push({ label: inputs[0].value, value: inputs[1].value });
            }
        });

        // Section 6: Variants
        data.variants = [];
        document.querySelectorAll('#variants-builder .variant-card').forEach(card => {
            data.variants.push({
                name: card.querySelector('.v-name')?.value || '',
                price: parseFloat(card.querySelector('.v-price')?.value) || 0,
                salePrice: parseFloat(card.querySelector('.v-sale')?.value) || null,
                stock: card.querySelector('.v-stock')?.value || 'in-stock',
                visibility: card.querySelector('.v-visible')?.value || 'visible',
                isDefault: card.querySelector('.v-default')?.value === 'yes',
                extra: card.querySelector('.v-extra')?.value || '',
            });
        });

        // Section 7: Stock
        data.stock = val('pf-stock') !== 'out-of-stock';
        data.stockStatus = val('pf-stock');
        data.qty = parseInt(val('pf-qty')) || null;
        data.watchers = parseInt(val('pf-watchers')) || 0;
        data.sold24 = parseInt(val('pf-sold')) || 0;
        data.urgencyText = val('pf-urgency');
        data.showStockBadge = checked('pf-show-stock-badge');
        data.showUrgency = checked('pf-show-urgency');

        // Section 8: Badges
        data.badges = [..._selectedBadges];
        data.badge = _selectedBadges[0] || null; // backward compat

        // Section 9: Purchase settings
        data.enableCart = checked('pf-enable-cart');
        data.enableBuy = checked('pf-enable-buy');
        data.enableWishlist = checked('pf-enable-wishlist');
        data.enableQty = checked('pf-enable-qty');
        data.enableShare = checked('pf-enable-share');

        // Section 10: Shared account terms
        data.sharedTerms = {
            heading: val('pf-shared-heading'),
            contentEn: val('pf-shared-content-en'),
            contentBn: val('pf-shared-content-bn'),
            warning: val('pf-shared-warning'),
        };

        // Section 11: Terms
        data.terms = val('pf-terms');

        // Section 12: Refund
        data.refundPolicy = val('pf-refund');

        // Section 13: SEO
        data.seo = {
            title: val('pf-seo-title'),
            description: val('pf-seo-desc'),
            previewText: val('pf-seo-preview'),
        };

        return data;
    }

    function val(id) { return document.getElementById(id)?.value || ''; }
    function checked(id) { return document.getElementById(id)?.checked || false; }
    function escHtml(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    // ===== Populate Form for Edit =====
    let editingProductId = null;

    function populateForm(p) {
        // Section 1
        setVal('pf-name', p.name);
        setVal('pf-slug', p.slug); if (p.slug) document.getElementById('pf-slug').dataset.manual = '1';
        setVal('pf-short-desc', p.shortDesc);
        setVal('pf-full-desc', p.fullDesc);
        setVal('pf-type', p.productType);
        setVal('pf-brand', p.brand);
        setVal('pf-sku', p.sku);
        setVal('pf-status', p.status || 'published');

        // Section 2
        setVal('pf-price', p.base);
        setVal('pf-sale-price', p.salePrice);
        setVal('pf-currency', p.currency || 'BDT');
        setChecked('pf-price-range-toggle', p.priceRange);
        if (p.priceRange) document.getElementById('price-range-fields').style.display = 'block';
        setVal('pf-price-min', p.priceMin);
        setVal('pf-price-max', p.priceMax);
        setChecked('pf-discount-badge', p.showDiscountBadge !== false);

        // Section 3
        setVal('pf-cat', p.cat);
        setVal('pf-subcat', p.subcat);
        _tags = p.tags || []; renderTags();
        setVal('pf-collection', p.collection);
        document.querySelectorAll('#pf-home-sections input[type="checkbox"]').forEach(cb => {
            cb.checked = (p.homeSections || []).includes(cb.value);
        });

        // Section 4: Media URLs
        _thumbnailUrl = p.media?.thumbnail || '';
        _galleryUrls = p.media?.gallery || [];
        _bannerUrl = p.media?.banner || '';
        _thumbnailFile = null; _galleryFiles = []; _bannerFile = null;
        if (_thumbnailUrl) showImagePreviews([], 'thumbnail-preview', [_thumbnailUrl]);
        if (_galleryUrls.length) showImagePreviews([], 'gallery-preview', _galleryUrls);
        if (_bannerUrl) showImagePreviews([], 'banner-preview', [_bannerUrl]);

        // Section 5: Details
        document.getElementById('details-builder').innerHTML = '';
        (p.details || []).forEach(d => addDetailRow(d.label, d.value));

        // Section 6: Variants
        document.getElementById('variants-builder').innerHTML = '';
        (p.variants || []).forEach(v => addVariantCard(v));

        // Section 7
        setVal('pf-stock', p.stockStatus || (p.stock ? 'in-stock' : 'out-of-stock'));
        setVal('pf-qty', p.qty);
        setVal('pf-watchers', p.watchers);
        setVal('pf-sold', p.sold24);
        setVal('pf-urgency', p.urgencyText);
        setChecked('pf-show-stock-badge', p.showStockBadge !== false);
        setChecked('pf-show-urgency', !!p.showUrgency);

        // Section 8: Badges
        _selectedBadges = p.badges || (p.badge ? [p.badge] : []);
        document.querySelectorAll('#pf-badges .badge-option').forEach(opt => {
            opt.classList.toggle('selected', _selectedBadges.includes(opt.dataset.badge));
        });

        // Section 9
        setChecked('pf-enable-cart', p.enableCart !== false);
        setChecked('pf-enable-buy', p.enableBuy !== false);
        setChecked('pf-enable-wishlist', !!p.enableWishlist);
        setChecked('pf-enable-qty', !!p.enableQty);
        setChecked('pf-enable-share', p.enableShare !== false);

        // Section 10
        setVal('pf-shared-heading', p.sharedTerms?.heading);
        setVal('pf-shared-content-en', p.sharedTerms?.contentEn);
        setVal('pf-shared-content-bn', p.sharedTerms?.contentBn);
        setVal('pf-shared-warning', p.sharedTerms?.warning);

        // Section 11
        setVal('pf-terms', p.terms);

        // Section 12
        setVal('pf-refund', p.refundPolicy);

        // Section 13
        setVal('pf-seo-title', p.seo?.title);
        setVal('pf-seo-desc', p.seo?.description);
        setVal('pf-seo-preview', p.seo?.previewText);

        // Update SEO preview
        document.getElementById('seo-live-title').textContent = p.seo?.title || p.name || 'Product Name — Visual Illusion';
        document.getElementById('seo-live-slug').textContent = p.slug || 'product-name';
        document.getElementById('seo-live-desc').textContent = p.seo?.description || p.shortDesc || '';

        // UI state
        document.getElementById('form-title').textContent = 'Edit Product';
        document.getElementById('btn-publish').textContent = 'Update Product';
        document.getElementById('btn-delete-product').style.display = 'inline-flex';
    }

    function resetForm() {
        document.getElementById('add-product-form')?.reset();
        editingProductId = null;
        _tags = []; renderTags();
        _selectedBadges = [];
        document.querySelectorAll('#pf-badges .badge-option').forEach(o => o.classList.remove('selected'));
        document.getElementById('details-builder').innerHTML = '';
        document.getElementById('variants-builder').innerHTML = '';
        document.getElementById('thumbnail-preview').innerHTML = '';
        document.getElementById('gallery-preview').innerHTML = '';
        document.getElementById('banner-preview').innerHTML = '';
        _thumbnailFile = null; _galleryFiles = []; _bannerFile = null;
        _thumbnailUrl = ''; _galleryUrls = []; _bannerUrl = '';
        document.getElementById('form-title').textContent = 'Add New Product';
        document.getElementById('btn-publish').textContent = 'Publish Product';
        document.getElementById('btn-delete-product').style.display = 'none';
        document.getElementById('price-range-fields').style.display = 'none';
        document.querySelectorAll('#pf-home-sections input[type="checkbox"]').forEach(cb => cb.checked = false);
        if (slugInput) delete slugInput.dataset.manual;
    }

    function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v || ''; }
    function setChecked(id, v) { const el = document.getElementById(id); if (el) el.checked = !!v; }

    // ===== Save Product =====
    const form = document.getElementById('add-product-form');

    async function saveProduct(statusOverride) {
        if (typeof PRODUCTS === 'undefined') return;

        const data = collectFormData();
        if (statusOverride) data.status = statusOverride;

        const id = editingProductId || (PRODUCTS.length > 0 ? Math.max(...PRODUCTS.map(p => p.id)) + 1 : 1);
        data.id = id;

        // Upload images
        const publishBtn = document.getElementById('btn-publish');
        const origText = publishBtn.textContent;
        publishBtn.textContent = 'Uploading...';
        publishBtn.disabled = true;

        try {
            const mediaUrls = await uploadAllImages(id);
            data.media = mediaUrls;
        } catch (e) {
            console.error('Image upload failed:', e);
            data.media = { thumbnail: _thumbnailUrl, gallery: _galleryUrls, banner: _bannerUrl };
        }

        publishBtn.textContent = 'Saving...';

        if (editingProductId) {
            const idx = PRODUCTS.findIndex(x => x.id === editingProductId);
            if (idx >= 0) PRODUCTS[idx] = data;
        } else {
            PRODUCTS.push(data);
        }

        if (typeof saveProductToFirebase === 'function') {
            saveProductToFirebase(data);
        }

        publishBtn.textContent = origText;
        publishBtn.disabled = false;

        showToast(editingProductId ? 'Product updated successfully!' : 'Product published!');
        resetForm();
        switchView('products');
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProduct('published');
        });
    }

    window.saveDraft = function() { saveProduct('draft'); };
    window.previewProduct = function() {
        showToast('Preview: Opening product page...');
        // In a real setup, this would open a preview URL
    };

    // ===== Delete Current Product =====
    window.deleteCurrentProduct = function() {
        if (!editingProductId) return;
        if (!confirm('Are you sure you want to permanently delete this product?')) return;
        const idx = PRODUCTS.findIndex(x => x.id === editingProductId);
        if (idx >= 0) {
            const name = PRODUCTS[idx].name;
            PRODUCTS.splice(idx, 1);
            if (typeof deleteProductFromFirebase === 'function') {
                deleteProductFromFirebase(editingProductId);
            }
            showToast('Deleted: ' + name);
            resetForm();
            switchView('products');
        }
    };

    // ===== Render Products Table =====
    window.renderProductsTable = function() {
        if (typeof PRODUCTS === 'undefined') return;
        const tbody = document.getElementById('admin-products-tbody');
        const totalEl = document.getElementById('product-total');
        const countEl = document.getElementById('admin-product-count');

        if (totalEl) totalEl.textContent = PRODUCTS.length;
        if (countEl) countEl.textContent = PRODUCTS.filter(p => p.stock !== false && p.status !== 'out-of-stock').length;
        if (!tbody) return;

        tbody.innerHTML = PRODUCTS.map(p => {
            const statusBadge = p.status === 'draft' ? '<span class="badge badge-gray">Draft</span>'
                : p.status === 'hidden' ? '<span class="badge badge-yellow">Hidden</span>'
                : (!p.stock || p.status === 'out-of-stock') ? '<span class="badge badge-red">Out of Stock</span>'
                : '<span class="badge badge-green">Published</span>';

            return `<tr>
                <td style="color:var(--muted)">#${p.id}</td>
                <td><div class="product-cell"><div class="product-cell-icon">${(p.name || '?').charAt(0)}</div>${p.name || 'Untitled'}</div></td>
                <td><span class="badge badge-purple">${p.cat || '—'}</span></td>
                <td>৳${Number(p.base || 0).toFixed(0)}</td>
                <td>${statusBadge}</td>
                <td>${p.sold24 || 0}</td>
                <td>
                    <button class="action-btn" onclick="editProduct(${p.id})" title="Edit">Edit</button>
                    <button class="action-btn" style="color:#dc2626" onclick="deleteProduct(${p.id})" title="Delete">Delete</button>
                </td>
            </tr>`;
        }).join('');
    };

    // ===== Edit Product =====
    window.editProduct = function(id) {
        if (typeof PRODUCTS === 'undefined') return;
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return;
        editingProductId = id;
        resetForm();
        editingProductId = id; // resetForm clears it
        populateForm(p);
        switchView('add-product');
    };

    // ===== Delete Product =====
    window.deleteProduct = function(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        if (typeof PRODUCTS === 'undefined') return;
        const idx = PRODUCTS.findIndex(x => x.id === id);
        if (idx >= 0) {
            const name = PRODUCTS[idx].name;
            PRODUCTS.splice(idx, 1);
            if (typeof deleteProductFromFirebase === 'function') deleteProductFromFirebase(id);
            renderProductsTable();
            showToast('Deleted: ' + name);
        }
    };

    // ===== Toast =====
    window.showToast = function(message, type = 'success') {
        let toast = document.getElementById('admin-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'admin-toast';
            document.body.appendChild(toast);
        }
        const colors = { success: '#16a34a', error: '#dc2626', info: '#2563eb' };
        toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:${colors[type] || colors.success};color:#fff;padding:14px 24px;border-radius:10px;font-size:13px;font-weight:700;z-index:9999;opacity:0;transition:opacity 0.3s;font-family:Inter,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.15);`;
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; }, 3500);
    };

    // ===== Categories Management =====
    let _categories = [];
    let _editingCatId = null;
    let _catImageFile = null;

    // Load categories from Firebase
    function loadCategories() {
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            // Seed defaults
            _categories = [
                { id: 1, name: 'AI Tools', slug: 'ai-tools', desc: 'Artificial Intelligence tools and subscriptions', status: 'active', homepage: true, productCount: 0 },
                { id: 2, name: 'Writing Tools', slug: 'writing-tools', desc: 'Grammar, writing assistants', status: 'active', homepage: true, productCount: 0 },
                { id: 3, name: 'Productivity', slug: 'productivity', desc: 'Office and productivity software', status: 'active', homepage: true, productCount: 0 },
                { id: 4, name: 'Streaming', slug: 'streaming', desc: 'Video and music streaming services', status: 'active', homepage: true, productCount: 0 },
                { id: 5, name: 'Education', slug: 'education', desc: 'Learning platforms and courses', status: 'active', homepage: true, productCount: 0 },
                { id: 6, name: 'VPN & Security', slug: 'vpn-security', desc: 'VPN, antivirus, and password managers', status: 'active', homepage: true, productCount: 0 },
                { id: 7, name: 'Cloud Storage', slug: 'cloud-storage', desc: 'Cloud storage and backup solutions', status: 'active', homepage: true, productCount: 0 },
                { id: 8, name: 'Software Keys', slug: 'software-keys', desc: 'License keys for software', status: 'active', homepage: true, productCount: 0 },
                { id: 9, name: 'Design Tools', slug: 'design-tools', desc: 'Design and creative software', status: 'active', homepage: true, productCount: 0 },
                { id: 10, name: 'Utilities', slug: 'utilities', desc: 'General purpose digital tools', status: 'active', homepage: true, productCount: 0 },
            ];
            renderCategoriesTable();
            return;
        }
        const db = firebase.database();
        db.ref('categories').on('value', (snap) => {
            const data = snap.val();
            if (data) {
                _categories = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
            }
            renderCategoriesTable();
        });
    }

    function renderCategoriesTable() {
        const tbody = document.getElementById('admin-categories-tbody');
        const totalEl = document.getElementById('cat-total');
        if (totalEl) totalEl.textContent = _categories.length;
        if (!tbody) return;

        // Count products per category
        const counts = {};
        if (typeof PRODUCTS !== 'undefined') {
            PRODUCTS.forEach(p => {
                const c = p.cat || '';
                counts[c] = (counts[c] || 0) + 1;
            });
        }

        tbody.innerHTML = _categories.map(c => `
            <tr>
                <td><div class="cat-icon-cell">${c.image ? `<img src="${c.image}">` : c.name.charAt(0)}</div></td>
                <td style="font-weight:600">${c.name}</td>
                <td style="color:var(--muted)">${c.slug || '—'}</td>
                <td>${counts[c.name] || 0}</td>
                <td><span class="badge ${c.status === 'active' ? 'badge-green' : 'badge-yellow'}">${c.status === 'active' ? 'Active' : 'Hidden'}</span></td>
                <td>${c.homepage ? '<span class="badge badge-blue">Yes</span>' : '<span class="badge badge-gray">No</span>'}</td>
                <td>
                    <button class="action-btn" onclick="editCategory(${c.id})">Edit</button>
                    <button class="action-btn" style="color:#dc2626" onclick="deleteCategory(${c.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.openCategoryModal = function(cat) {
        _editingCatId = cat ? cat.id : null;
        document.getElementById('cat-modal-title').textContent = cat ? 'Edit Category' : 'Add Category';
        setVal('cat-name', cat?.name);
        setVal('cat-slug', cat?.slug);
        setVal('cat-desc', cat?.desc);
        setVal('cat-parent', cat?.parent || '');
        setVal('cat-status', cat?.status || 'active');
        setChecked('cat-homepage', cat?.homepage !== false);
        _catImageFile = null;
        document.getElementById('cat-image-preview').innerHTML = cat?.image ? `<div class="upload-preview-item"><img src="${cat.image}"></div>` : '';
        document.getElementById('category-modal').classList.add('open');

        // Populate parent dropdown
        const parentSelect = document.getElementById('cat-parent');
        parentSelect.innerHTML = '<option value="">None (Top Level)</option>';
        _categories.forEach(c => {
            if (!cat || c.id !== cat.id) {
                parentSelect.innerHTML += `<option value="${c.id}" ${cat && cat.parent == c.id ? 'selected' : ''}>${c.name}</option>`;
            }
        });
    };

    window.closeCategoryModal = function() {
        document.getElementById('category-modal').classList.remove('open');
    };

    // Category image upload
    setupUploadZone('upload-cat-image', 'cat-image-input', 'cat-image-preview', false, (files) => {
        _catImageFile = files[0];
        showImagePreviews([_catImageFile], 'cat-image-preview');
    });

    window.saveCategory = async function() {
        const name = val('cat-name');
        if (!name) return showToast('Category name is required', 'error');

        const cat = {
            id: _editingCatId || (_categories.length > 0 ? Math.max(..._categories.map(c => c.id)) + 1 : 1),
            name: name,
            slug: val('cat-slug') || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            desc: val('cat-desc'),
            parent: val('cat-parent') || null,
            status: val('cat-status'),
            homepage: checked('cat-homepage'),
            image: '',
        };

        // Upload image if exists
        if (_catImageFile && _storage) {
            try {
                cat.image = await uploadImage(_catImageFile, `categories/${cat.id}_${Date.now()}`);
            } catch(e) { console.error(e); }
        } else if (_editingCatId) {
            const existing = _categories.find(c => c.id === _editingCatId);
            if (existing) cat.image = existing.image || '';
        }

        if (_editingCatId) {
            const idx = _categories.findIndex(c => c.id === _editingCatId);
            if (idx >= 0) _categories[idx] = cat;
        } else {
            _categories.push(cat);
        }

        // Save to Firebase
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            firebase.database().ref('categories/' + cat.id).set(cat);
        }

        renderCategoriesTable();
        closeCategoryModal();
        showToast(_editingCatId ? 'Category updated!' : 'Category added!');
    };

    window.editCategory = function(id) {
        const cat = _categories.find(c => c.id === id);
        if (cat) openCategoryModal(cat);
    };

    window.deleteCategory = function(id) {
        if (!confirm('Delete this category?')) return;
        const idx = _categories.findIndex(c => c.id === id);
        if (idx >= 0) {
            _categories.splice(idx, 1);
            if (typeof firebase !== 'undefined' && firebase.apps.length) {
                firebase.database().ref('categories/' + id).remove();
            }
            renderCategoriesTable();
            showToast('Category deleted');
        }
    };

    // Auto-slug for category modal
    const catName = document.getElementById('cat-name');
    const catSlug = document.getElementById('cat-slug');
    if (catName && catSlug) {
        catName.addEventListener('input', () => {
            catSlug.value = catName.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        });
    }

    // ===== When add-product nav clicked, reset form =====
    const addProductNav = document.querySelector('[data-view="add-product"]');
    if (addProductNav) {
        addProductNav.addEventListener('click', () => {
            if (editingProductId) resetForm();
        });
    }

    // ===== Init =====
    loadCategories();
    renderProductsTable();

}); // end DOMContentLoaded
