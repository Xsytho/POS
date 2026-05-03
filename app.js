(() => {
  'use strict';

  const DB_KEY = 'pos_pro_v4_data';
  const AUTH_KEY = 'pos_pro_v4_auth';
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const formatDateLong = value => {
    if (!value) return '';
    const parts = String(value).split('-').map(Number);
    if (parts.length === 3 && parts.every(Number.isFinite)) {
      return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  const peso = n => `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const icons = {
    dashboard:'<svg viewBox="0 0 24 24"><path d="M3 13h8V3H3z"></path><path d="M13 21h8V11h-8z"></path><path d="M13 3h8v6h-8z"></path><path d="M3 21h8v-6H3z"></path></svg>',
    terminal:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8h10"></path><path d="M7 12h4"></path><path d="M7 16h10"></path></svg>',
    box:'<svg viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5 9 5z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path></svg>',
    receipt:'<svg viewBox="0 0 24 24"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"></path><path d="M9 7h6"></path><path d="M9 11h6"></path><path d="M9 15h4"></path></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 16v-5"></path><path d="M12 16V8"></path><path d="M16 16v-7"></path></svg>',
    settings:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L6.6 16.7l.1-.1A1.7 1.7 0 0 0 7 14.7a1.7 1.7 0 0 0-1.5-1H5v-3h.1a1.7 1.7 0 0 0 1.5-1A1.7 1.7 0 0 0 6.3 8l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.5v3h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>',
    menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>',
    moon:'<svg viewBox="0 0 24 24"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8z"></path></svg>',
    sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.9 4.9l1.4 1.4"></path><path d="M17.7 17.7l1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M4.9 19.1l1.4-1.4"></path><path d="M17.7 6.3l1.4-1.4"></path></svg>',
    download:'<svg viewBox="0 0 24 24"><path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path><path d="M5 21h14"></path></svg>',
    lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>',
    bell:'<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path></svg>',
    sales:'<svg viewBox="0 0 24 24"><path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"></path></svg>',
    expense:'<svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h10"></path></svg>',
    alert:'<svg viewBox="0 0 24 24"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>',
    'x-circle':'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M15 9l-6 6"></path><path d="M9 9l6 6"></path></svg>',
    info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>'
  };

  const defaultData = () => ({
    products: [], sales: [], expenses: [], cart: [],
    settings: { businessName:'Point Of Sale', accent:'#1d4ed8', theme:'light', logo:'', headerStyle:'soft', surfaceStyle:'elevated', cardSize:'comfortable', productImageSize:'standard', navStyle:'full', buttonStyle:'rounded', fontStyle:'system', dashboardStyle:'executive', productCardStyle:'standard', tableStyle:'standard', loginStyle:'split', backgroundStyle:'plain' }
  });
  let data = loadData();

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(DB_KEY)) || {};
      const base = defaultData();
      const merged = { ...base, ...stored, settings: { ...base.settings, ...(stored.settings || {}) } };
      if (!merged.settings.businessName || merged.settings.businessName === 'Point of Sale Pro') merged.settings.businessName = 'Point Of Sale';
      return merged;
    } catch { return defaultData(); }
  }
  function saveData() { localStorage.setItem(DB_KEY, JSON.stringify(data)); }
  async function hashText(text) { const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''); }
  function hasPassword() { return Boolean(localStorage.getItem(AUTH_KEY)); }
  function configureLockScreen() {
    const setup = !hasPassword();
    const s = data.settings || defaultData().settings;
    $('#loginModeLabel').textContent = setup ? 'Initial Setup' : 'Account Access';
    $('#loginSubtitle').textContent = setup ? 'Create a secure password before opening the workspace.' : 'Enter your password to continue.';
    $('#passwordLabel').textContent = setup ? 'Create password' : 'Password';
    $('#passwordInput').placeholder = setup ? 'Minimum 8 characters' : 'Enter password';
    $('#confirmPasswordGroup').classList.toggle('hidden', !setup);
    $('#setupConfirmPassword').required = setup;
    $('#loginSubmitBtn').textContent = setup ? 'Create Password & Continue' : 'Unlock Workspace';
    $('#loginHelp').textContent = setup ? 'No default password is included. The first password is created by the owner and saved only on this device.' : 'Use the password created for this device.';
    $('#loginBrandName').textContent = s.businessName || 'Point Of Sale';
  }

  function clearLoginError() {
    const msg = $('#loginError');
    const form = $('#loginForm');
    if (!msg || !form) return;
    msg.textContent = '';
    msg.classList.remove('show');
    form.classList.remove('login-invalid');
    $$('.password-shell').forEach(el => el.classList.remove('field-invalid'));
  }
  function setLoginError(message, fieldSelector = '#passwordInput') {
    const msg = $('#loginError');
    const form = $('#loginForm');
    if (!msg || !form) return;
    msg.textContent = message;
    msg.classList.add('show');
    form.classList.remove('login-invalid');
    void form.offsetWidth;
    form.classList.add('login-invalid');
    const field = $(fieldSelector);
    if (field) {
      const shell = field.closest('.password-shell');
      if (shell) shell.classList.add('field-invalid');
      field.focus();
      field.select?.();
    }
  }

  function setIcons(root = document) { root.querySelectorAll('[data-icon]').forEach(el => { const key = el.dataset.icon; if (icons[key]) el.innerHTML = icons[key]; }); }
  function el(tag, attrs = {}, children = []) { const node = document.createElement(tag); Object.entries(attrs).forEach(([k,v]) => { if (k === 'class') node.className = v; else if (k === 'text') node.textContent = v; else if (k.startsWith('data-')) node.setAttribute(k, v); else if (k === 'html') node.innerHTML = v; else if (v !== undefined && v !== null) node.setAttribute(k, v); }); (Array.isArray(children) ? children : [children]).forEach(c => { if (c === null || c === undefined) return; node.append(c.nodeType ? c : document.createTextNode(String(c))); }); return node; }
  function field(label, input) { return el('div', {}, [el('label', { for: input.id, text: label }), input]); }
  function input(id, type, attrs = {}) { return el('input', { id, type, ...attrs }); }
  function empty(text) { return el('div', { class:'empty-state', text }); }

  let modalResolver = null;
  function modal({ title='Notice', message='', details='', confirm=false, okText='Continue', cancelText='Cancel', danger=false } = {}) {
    $('#modalTitle').textContent = title; $('#modalMessage').textContent = message;
    const detailsEl = $('#modalDetails'); detailsEl.textContent = details || ''; detailsEl.classList.toggle('hidden', !details);
    $('#modalCancel').classList.toggle('hidden', !confirm); $('#modalCancel').textContent = cancelText; $('#modalOk').textContent = okText;
    $('#modalOk').className = `btn ${danger ? 'danger' : 'primary'}`;
    $('#modalOverlay').classList.remove('hidden');
    return new Promise(resolve => { modalResolver = resolve; });
  }
  function closeModal(result) { $('#modalOverlay').classList.add('hidden'); if (modalResolver) modalResolver(result); modalResolver = null; }

  function applySettings() {
    const s = { ...defaultData().settings, ...(data.settings || {}) };
    data.settings = s;
    const root = document.documentElement;
    root.dataset.theme = s.theme || 'light';
    root.dataset.header = s.headerStyle || 'soft';
    root.dataset.surface = s.surfaceStyle || 'elevated';
    root.dataset.cardSize = s.cardSize || 'comfortable';
    root.dataset.productImage = s.productImageSize || 'standard';
    root.dataset.navStyle = s.navStyle || 'full';
    root.dataset.buttonStyle = s.buttonStyle || 'rounded';
    root.dataset.fontStyle = s.fontStyle || 'system';
    root.dataset.dashboardStyle = s.dashboardStyle || 'executive';
    root.dataset.productCardStyle = s.productCardStyle || 'standard';
    root.dataset.tableStyle = s.tableStyle || 'standard';
    root.dataset.loginStyle = s.loginStyle || 'split';
    root.dataset.backgroundStyle = s.backgroundStyle || 'plain';
    root.style.setProperty('--accent', s.accent || '#1d4ed8');
    root.style.setProperty('--accent-2', s.accent || '#2563eb');
    root.style.setProperty('--density', s.cardSize === 'compact' ? '14px' : s.cardSize === 'spacious' ? '24px' : '18px');
    root.style.setProperty('--radius', s.buttonStyle === 'sharp' ? '10px' : s.buttonStyle === 'soft' ? '24px' : '18px');
    $('#brandName').textContent = s.businessName || 'Point Of Sale';
    $('#loginTitle').textContent = s.businessName || 'Point Of Sale';
    const loginBrand = $('#loginBrandName'); if (loginBrand) loginBrand.textContent = s.businessName || 'Point Of Sale';
    $$('.brand-mark').forEach(mark => {
      if (s.logo) mark.innerHTML = `<img src="${s.logo}" alt="${s.businessName || 'POS'} logo">`;
      else mark.textContent = 'POS';
    });
    const logoPreview = $('#logoPreview');
    if (logoPreview) {
      if (s.logo) { logoPreview.src = s.logo; logoPreview.classList.remove('hidden'); }
      else { logoPreview.removeAttribute('src'); logoPreview.classList.add('hidden'); }
    }
    const logoBoxText = document.querySelector('.logo-preview-box span');
    if (logoBoxText) logoBoxText.classList.toggle('hidden', Boolean(s.logo));
    const setVal = (id, value) => { const el = $(id); if (el) el.value = value; };
    setVal('#businessNameInput', s.businessName || 'Point Of Sale');
    setVal('#accentInput', s.accent || '#1d4ed8');
    setVal('#headerStyleInput', s.headerStyle || 'soft');
    setVal('#surfaceStyleInput', s.surfaceStyle || 'elevated');
    setVal('#cardSizeInput', s.cardSize || 'comfortable');
    setVal('#productImageSizeInput', s.productImageSize || 'standard');
    setVal('#navStyleInput', s.navStyle || 'full');
    setVal('#buttonStyleInput', s.buttonStyle || 'rounded');
    setVal('#fontStyleInput', s.fontStyle || 'system');
    setVal('#dashboardStyleInput', s.dashboardStyle || 'executive');
    setVal('#productCardStyleInput', s.productCardStyle || 'standard');
    setVal('#tableStyleInput', s.tableStyle || 'standard');
    setVal('#loginStyleInput', s.loginStyle || 'split');
    setVal('#backgroundStyleInput', s.backgroundStyle || 'plain');
    const toggle = $('#themeToggle');
    toggle.innerHTML = `<span data-icon="${s.theme === 'dark' ? 'sun' : 'moon'}"></span><span>${s.theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>`; setIcons(toggle);
  }

  function showApp() { $('#lockScreen').classList.add('hidden'); $('#app').classList.remove('hidden'); renderAll(); }
  function lockApp() { $('#app').classList.add('hidden'); $('#lockScreen').classList.remove('hidden'); $('#passwordInput').value=''; $('#setupConfirmPassword').value=''; clearLoginError(); configureLockScreen(); }
  function setView(view) { $$('.view').forEach(v => v.classList.remove('active-view')); $(`#${view}`).classList.add('active-view'); $$('.nav button').forEach(b => b.classList.toggle('active', b.dataset.view === view)); $('#pageTitle').textContent = view === 'pos' ? 'Point of Sale' : view.charAt(0).toUpperCase() + view.slice(1); $('#sidebar').classList.remove('open'); renderAll(); }

  function applyDesignForm() {
    const get = id => $(id)?.value;
    data.settings = {
      ...defaultData().settings,
      ...(data.settings || {}),
      businessName: ($('#businessNameInput')?.value || '').trim() || 'Point Of Sale',
      accent: get('#accentInput') || '#1d4ed8',
      headerStyle: get('#headerStyleInput') || 'soft',
      surfaceStyle: get('#surfaceStyleInput') || 'elevated',
      cardSize: get('#cardSizeInput') || 'comfortable',
      productImageSize: get('#productImageSizeInput') || 'standard',
      navStyle: get('#navStyleInput') || 'full',
      buttonStyle: get('#buttonStyleInput') || 'rounded',
      fontStyle: get('#fontStyleInput') || 'system',
      dashboardStyle: get('#dashboardStyleInput') || 'executive',
      productCardStyle: get('#productCardStyleInput') || 'standard',
      tableStyle: get('#tableStyleInput') || 'standard',
      loginStyle: get('#loginStyleInput') || 'split',
      backgroundStyle: get('#backgroundStyleInput') || 'plain'
    };
  }

  function productStatus(p) { if (Number(p.stock) <= 0) return ['Out of stock','danger']; if (Number(p.stock) <= Number(p.lowStock || 5)) return ['Low stock','warning']; return ['In stock','good']; }
  function inventoryIssues() {
    const out = data.products.filter(p => Number(p.stock) <= 0).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
    const low = data.products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.lowStock || 5)).sort((a,b)=>Number(a.stock)-Number(b.stock));
    return { out, low, total: out.length + low.length };
  }
  function renderInventoryNotification() {
    const badge = $('#stockBadge');
    const btn = $('#stockNotifyBtn');
    if (!badge || !btn) return;
    const issues = inventoryIssues();
    badge.textContent = issues.total > 99 ? '99+' : String(issues.total);
    badge.classList.toggle('hidden', issues.total === 0);
    btn.classList.toggle('has-alerts', issues.total > 0);
    btn.setAttribute('title', issues.total ? `${issues.low.length} low stock, ${issues.out.length} out of stock` : 'Inventory levels are healthy');
    const dropdown = $('#inventoryDropdown');
    if (dropdown && !dropdown.classList.contains('hidden')) renderInventoryDropdown();
  }
  function calcToday() { const t=todayISO(); const sales = data.sales.filter(s=>s.date===t).reduce((a,s)=>a+s.total,0); const expenses = data.expenses.filter(e=>e.date===t).reduce((a,e)=>a+e.price,0); return {sales, expenses, net:sales-expenses}; }
  function filteredSales() { const q=($('#salesSearch')?.value||'').toLowerCase(); return data.sales.filter(s => `${s.item} ${s.category}`.toLowerCase().includes(q)); }
  function filteredExpenses() { const q=($('#expensesSearch')?.value||'').toLowerCase(); return data.expenses.filter(e => `${e.description}`.toLowerCase().includes(q)); }
  function reportRangeRows() { const from=$('#reportFrom')?.value; const to=$('#reportTo')?.value; return data.sales.filter(s=>(!from||s.date>=from)&&(!to||s.date<=to)); }
  function reportRangeExpenses() { const from=$('#reportFrom')?.value; const to=$('#reportTo')?.value; return data.expenses.filter(e=>(!from||e.date>=from)&&(!to||e.date<=to)); }

  function renderAll() { applySettings(); $('#todayText').textContent = new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' }); renderForms(); renderDashboard(); renderProducts(); renderPOS(); renderSales(); renderExpenses(); renderReports(); renderInventoryNotification(); setIcons(); saveData(); }

  function renderForms() {
    if (!$('#productForm').children.length) {
      $('#productForm').append(
        field('Product image', el('div', { class:'image-drop' }, [el('img', { id:'productPreview', alt:'Product preview' }), input('productImage','file',{accept:'image/*'}), el('div',{class:'file-help', text:'Image is saved locally for offline use.'})])),
        field('Item description', input('productName','text',{required:true,maxlength:80,placeholder:'Example: Iced Coffee'})),
        field('Category', input('productCategory','text',{required:true,maxlength:50,placeholder:'Example: Drinks'})),
        field('Price', input('productPrice','number',{required:true,min:'0',step:'0.01',placeholder:'0.00'})),
        field('Stock quantity', input('productStock','number',{required:true,min:'0',step:'1',placeholder:'0'})),
        field('Low stock alert', input('productLow','number',{min:'0',step:'1',value:'5'})),
        el('button',{class:'btn primary full',type:'submit',text:'Add Product'})
      );
    }
    if (!$('#expenseForm').children.length) {
      $('#expenseForm').append(
        field('Date', input('expenseDate','date',{required:true,value:todayISO()})),
        field('Description', input('expenseDescription','text',{required:true,maxlength:90,placeholder:'Example: Supplier payment'})),
        field('Price', input('expensePrice','number',{required:true,min:'0',step:'0.01',placeholder:'0.00'})),
        el('button',{class:'btn primary full',type:'submit',text:'Add Expense'})
      );
    }
  }

  function productCard(p, mode='catalog') {
    const [label, cls] = productStatus(p);
    const card = el('article', { class: mode === 'pos' ? 'pos-card' : 'product-card' });
    const imgBox = el('div', { class:'product-image' }, p.image ? el('img',{src:p.image,alt:p.name}) : el('div',{class:'placeholder',text:(p.name||'P').slice(0,2).toUpperCase()}));
    const body = el('div', { class:'product-body' }, [
      el('h4',{text:p.name}), el('p',{text:p.category}),
      el('div',{class:'price-row'},[el('strong',{text:peso(p.price)}), el('span',{class:`badge ${cls}`,text:label})]),
      el('div',{class:'stock-row'},[el('small',{text:`Stock: ${p.stock}`}), el('small',{text:`Low: ${p.lowStock || 5}`})])
    ]);
    card.append(imgBox, body);
    if (mode === 'pos') { card.addEventListener('click', () => addToCart(p.id)); }
    else {
      const actions = el('div',{class:'card-actions'},[
        el('button',{class:'btn soft small',type:'button',text:'Restock'}), el('button',{class:'btn danger small',type:'button',text:'Delete'})
      ]); actions.children[0].addEventListener('click',()=>restockProduct(p.id)); actions.children[1].addEventListener('click',()=>deleteProduct(p.id)); body.append(actions);
    }
    return card;
  }

  function renderDashboard() {
    const t = calcToday(); $('#todaySales').textContent=peso(t.sales); $('#todayExpenses').textContent=peso(t.expenses); $('#heroNet').textContent=peso(t.net); $('#heroNet').className = t.net >= 0 ? 'positive' : 'negative'; const hs=$('#heroSalesBreakdown'); const he=$('#heroExpensesBreakdown'); if(hs) hs.textContent=peso(t.sales); if(he) he.textContent=peso(t.expenses);
    $('#productCount').textContent=data.products.length; const lows=data.products.filter(p=>p.stock>0&&p.stock<=Number(p.lowStock||5)); const outs=data.products.filter(p=>p.stock<=0); $('#lowStockCount').textContent=lows.length; $('#outStockCount').textContent=outs.length;
    const alerts = $('#stockAlerts'); alerts.replaceChildren(); [...outs, ...lows].slice(0,7).forEach(p => { const [label,cls]=productStatus(p); alerts.append(el('div',{class:'stock-item'},[el('div',{},[el('strong',{text:p.name}), el('small',{text:`${p.category} · ${label}`})]), el('span',{class:`badge ${cls}`,text:`Qty ${p.stock}`})])); }); if(!alerts.children.length) alerts.append(empty('No low stock or out of stock items.'));
    const recent = $('#recentSales'); recent.replaceChildren(); data.sales.slice().sort((a,b)=>b.createdAt-a.createdAt).slice(0,7).forEach(s => recent.append(el('div',{class:'activity-item'},[el('div',{},[el('strong',{text:s.item}), el('small',{text:`${formatDateLong(s.date)} · ${s.qty} item(s)`})]), el('strong',{text:peso(s.total)})]))); if(!recent.children.length) recent.append(empty('No completed sales yet.'));
  }

  function renderProducts() { const q=($('#productsSearch')?.value||'').toLowerCase(); const wrap=$('#productCards'); wrap.replaceChildren(); data.products.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(q)).forEach(p=>wrap.append(productCard(p))); if(!wrap.children.length) wrap.append(empty('No products found. Add products to start selling.')); }
  function renderPOS() { const q=($('#posSearch')?.value||'').toLowerCase(); const wrap=$('#posProducts'); wrap.replaceChildren(); data.products.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(q)).forEach(p=>wrap.append(productCard(p,'pos'))); if(!wrap.children.length) wrap.append(empty('No products available. Add products first.')); renderCart(); }
  function renderCart() { const wrap=$('#cartItems'); wrap.replaceChildren(); let qty=0,total=0; data.cart.forEach(line=>{ const p=data.products.find(x=>x.id===line.productId); if(!p) return; qty+=line.qty; total+=line.qty*p.price; const row=el('div',{class:'cart-line'}); row.append(p.image?el('img',{src:p.image,alt:p.name}):el('div',{class:'mini-placeholder',text:p.name.slice(0,2).toUpperCase()})); const info=el('div',{},[el('h4',{text:p.name}),el('small',{text:`${p.category} · ${peso(p.price)}`})]); const controls=el('div',{class:'qty-controls'},[el('button',{type:'button',text:'-'}),el('span',{text:line.qty}),el('button',{type:'button',text:'+'}),el('strong',{class:'line-total',text:peso(line.qty*p.price)})]); controls.children[0].addEventListener('click',()=>changeCart(p.id,-1)); controls.children[2].addEventListener('click',()=>changeCart(p.id,1)); info.append(controls); row.append(info); wrap.append(row); }); if(!wrap.children.length) wrap.append(el('div',{class:'cart-empty',text:'Select products from the left to build an order.'})); $('#cartQty').textContent=qty; $('#cartLines').textContent=data.cart.length; $('#cartTotal').textContent=peso(total); $('#cartCountText').textContent=data.cart.length?`${data.cart.length} product line(s) selected.`:'No items selected.'; $('#checkoutBtn').disabled=!data.cart.length; }
  function renderSales() { const tbody=$('#salesTable'); tbody.replaceChildren(); filteredSales().slice().sort((a,b)=>b.createdAt-a.createdAt).forEach(s=>{ const tr=el('tr'); [formatDateLong(s.date),s.item,s.category,peso(s.price),s.qty,peso(s.total)].forEach(v=>tr.append(el('td',{text:v}))); const del=el('button',{class:'btn danger small',type:'button',text:'Delete'}); del.addEventListener('click',()=>deleteSale(s.id)); tr.append(el('td',{class:'row-actions'},del)); tbody.append(tr); }); if(!tbody.children.length) tbody.append(el('tr',{},el('td',{colspan:'7',text:'No sales found.'}))); }
  function renderExpenses() { const tbody=$('#expensesTable'); tbody.replaceChildren(); filteredExpenses().slice().sort((a,b)=>b.createdAt-a.createdAt).forEach(e=>{ const tr=el('tr'); [formatDateLong(e.date),e.description,peso(e.price)].forEach(v=>tr.append(el('td',{text:v}))); const del=el('button',{class:'btn danger small',type:'button',text:'Delete'}); del.addEventListener('click',()=>deleteExpense(e.id)); tr.append(el('td',{class:'row-actions'},del)); tbody.append(tr); }); if(!tbody.children.length) tbody.append(el('tr',{},el('td',{colspan:'4',text:'No expenses found.'}))); }

  function dailyRows(salesRows = data.sales, expenseRows = data.expenses) {
    const map = new Map();
    [...salesRows.map(s=>s.date), ...expenseRows.map(e=>e.date)].sort().forEach(d=>{
      if(!map.has(d)) map.set(d,{date:d,sales:0,expenses:0});
    });
    salesRows.forEach(s=>{ if(map.has(s.date)) map.get(s.date).sales += s.total; });
    expenseRows.forEach(e=>{ if(map.has(e.date)) map.get(e.date).expenses += e.price; });
    let rs=0,re=0;
    return [...map.values()].sort((a,b)=>a.date.localeCompare(b.date)).map(r=>{
      rs+=r.sales; re+=r.expenses;
      return {...r,runningSales:rs,runningExpenses:re};
    });
  }
  function renderReports() {
    const rs=reportRangeRows(), re=reportRangeExpenses();
    const salesTotal=rs.reduce((a,s)=>a+s.total,0), expenseTotal=re.reduce((a,e)=>a+e.price,0);
    $('#reportSalesTotal').textContent=peso(salesTotal);
    $('#reportExpensesTotal').textContent=peso(expenseTotal);
    $('#reportNetTotal').textContent=peso(salesTotal - expenseTotal);
    const tbody=$('#reportTable'); tbody.replaceChildren();
    dailyRows(rs, re).forEach(r=>{
      const tr=el('tr');
      [formatDateLong(r.date),peso(r.sales),peso(r.expenses),peso(r.sales-r.expenses),peso(r.runningSales),peso(r.runningExpenses)].forEach(v=>tr.append(el('td',{text:v})));
      tbody.append(tr);
    });
    if(!tbody.children.length) tbody.append(el('tr',{},el('td',{colspan:'6',text:'No report data yet.'})));
  }
  function renderRank(sel, rows) { const wrap=$(sel); wrap.replaceChildren(); rows.forEach((r,i)=>wrap.append(el('div',{class:'rank-item'},[el('div',{},[el('strong',{text:`${i+1}. ${r[0]}`}), el('small',{text:r[1]})])]))); if(!wrap.children.length) wrap.append(empty('No data available.')); }
  function drawCharts() { const rows=dailyRows().slice(-14); drawBar($('#trendChart'), rows.map(r=>r.date.slice(5)), rows.map(r=>r.sales), 'Daily Sales'); const cats={}; reportRangeRows().forEach(s=>cats[s.category]=(cats[s.category]||0)+s.total); drawBar($('#categoryChart'), Object.keys(cats).slice(0,8), Object.values(cats).slice(0,8), 'Categories'); }
  function drawBar(canvas, labels, values, title) { if(!canvas) return; const ctx=canvas.getContext('2d'), w=canvas.width, h=canvas.height; ctx.clearRect(0,0,w,h); const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(); const text=getComputedStyle(document.documentElement).getPropertyValue('--text').trim(); const muted=getComputedStyle(document.documentElement).getPropertyValue('--muted').trim(); ctx.fillStyle=text; ctx.font='bold 22px system-ui'; ctx.fillText(title,24,34); if(!values.length){ ctx.fillStyle=muted; ctx.font='16px system-ui'; ctx.fillText('No data available',24,90); return; } const max=Math.max(...values,1); const gap=12, left=30, bottom=48, top=58; const barW=(w-left-20-(labels.length-1)*gap)/labels.length; values.forEach((v,i)=>{ const bh=(h-bottom-top)*(v/max); const x=left+i*(barW+gap), y=h-bottom-bh; ctx.fillStyle=accent; roundRect(ctx,x,y,Math.max(12,barW),bh,10); ctx.fill(); ctx.fillStyle=muted; ctx.font='12px system-ui'; ctx.fillText(labels[i]||'',x,h-20); }); }
  function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  async function restockProduct(id) { const amount = promptModalNumber('Restock Product', 'Enter quantity to add:', 1); const n = await amount; if(!n) return; const p=data.products.find(x=>x.id===id); p.stock += n; renderAll(); modal({title:'Stock updated',message:`${p.name} stock is now ${p.stock}.`}); }
  function promptModalNumber(title, message, initial) {
    $('#modalTitle').textContent=title; $('#modalMessage').textContent=message; const d=$('#modalDetails'); d.classList.remove('hidden'); d.replaceChildren(input('modalNumber','number',{min:'1',step:'1',value:String(initial)})); $('#modalCancel').classList.remove('hidden'); $('#modalOk').textContent='Confirm'; $('#modalOk').className='btn primary'; $('#modalOverlay').classList.remove('hidden'); return new Promise(resolve=>{ modalResolver=(ok)=>{ const n=ok?Math.floor(Number($('#modalNumber')?.value||0)):0; d.replaceChildren(); d.classList.add('hidden'); resolve(n>0?n:0); }; });
  }

  function ensureInventoryDropdown() {
    let dropdown = $('#inventoryDropdown');
    if (dropdown) return dropdown;
    dropdown = el('div', { id:'inventoryDropdown', class:'inventory-dropdown hidden', role:'menu', 'aria-label':'Inventory alerts' });
    $('#stockNotifyBtn').insertAdjacentElement('afterend', dropdown);
    return dropdown;
  }

  function renderInventoryDropdown() {
    const dropdown = ensureInventoryDropdown();
    const { out, low, total } = inventoryIssues();
    dropdown.replaceChildren();
    dropdown.append(
      el('div', { class:'inventory-dropdown-head' }, [
        el('div', {}, [
          el('strong', { text:'Inventory Status' }),
          el('small', { text: total ? `${total} item(s) require stock review` : 'Inventory levels are healthy' })
        ]),
        el('span', { class: total ? 'badge danger' : 'badge good', text: total ? String(total) : 'Stock Healthy' })
      ])
    );
    if (!total) {
      dropdown.append(el('div', { class:'inventory-empty' }, [
        el('span', { 'data-icon':'info' }),
        el('div', {}, [el('strong', { text:'Stock Healthy' }), el('small', { text:'Low stock and out-of-stock products will appear here automatically.' })])
      ]));
      setIcons(dropdown);
      return;
    }
    if (out.length) {
      dropdown.append(el('div', { class:'inventory-section danger' }, [
        el('div', { class:'inventory-section-title' }, [el('span', { class:'status-pill danger', text:'Out of Stock' }), el('small', { text:`${out.length} product(s)` })]),
        ...out.map(p => inventoryDropdownItem(p, 'danger'))
      ]));
    }
    if (low.length) {
      dropdown.append(el('div', { class:'inventory-section warning' }, [
        el('div', { class:'inventory-section-title' }, [el('span', { class:'status-pill warning', text:'Low Stock' }), el('small', { text:`${low.length} product(s)` })]),
        ...low.map(p => inventoryDropdownItem(p, 'warning'))
      ]));
    }
  }

  function inventoryDropdownItem(p, type) {
    const limit = Number(p.lowStock || 5);
    const statusText = type === 'danger' ? 'Restock now' : `Alert at ${limit}`;
    return el('div', { class:`inventory-drop-item ${type}` }, [
      el('div', { class:'inventory-drop-media' }, p.image ? el('img', { src:p.image, alt:p.name }) : el('span', { text:(p.name || 'P').slice(0,2).toUpperCase() })),
      el('div', { class:'inventory-drop-copy' }, [
        el('strong', { text:p.name }),
        el('small', { text:`${p.category || 'Uncategorized'} · ${statusText}` })
      ]),
      el('span', { class:`stock-chip ${type}`, text:`Qty ${p.stock}` })
    ]);
  }

  function showInventoryNotifications(event) {
    if (event) event.stopPropagation();
    const dropdown = ensureInventoryDropdown();
    renderInventoryDropdown();
    dropdown.classList.toggle('hidden');
  }

  function closeInventoryDropdown() {
    const dropdown = $('#inventoryDropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }

  function addToCart(id) { const p=data.products.find(x=>x.id===id); if(!p) return; if(p.stock<=0) return modal({title:'Out of stock',message:`${p.name} cannot be sold because stock is zero.`}); const line=data.cart.find(c=>c.productId===id); const current=line?line.qty:0; if(current+1>p.stock) return modal({title:'Insufficient stock',message:`Only ${p.stock} unit(s) available for ${p.name}.`}); if(line) line.qty++; else data.cart.push({productId:id,qty:1}); renderCart(); saveData(); }
  function changeCart(id, delta) { const line=data.cart.find(c=>c.productId===id); const p=data.products.find(x=>x.id===id); if(!line||!p) return; const next=line.qty+delta; if(next<=0) data.cart=data.cart.filter(c=>c.productId!==id); else if(next<=p.stock) line.qty=next; else return modal({title:'Stock limit reached',message:`Only ${p.stock} unit(s) available.`}); renderCart(); saveData(); }
  async function checkout() { if(!data.cart.length) return; const total=data.cart.reduce((a,l)=>{const p=data.products.find(x=>x.id===l.productId); return a+(p?p.price*l.qty:0);},0); const ok=await modal({title:'Complete Sale',message:`Confirm checkout total ${peso(total)}?`,details:'Stock will be deducted automatically after checkout.',confirm:true,okText:'Complete Sale'}); if(!ok) return; const orderId=uid(), date=todayISO(); data.cart.forEach(l=>{ const p=data.products.find(x=>x.id===l.productId); if(!p) return; p.stock -= l.qty; data.sales.push({id:uid(),orderId,date,item:p.name,category:p.category,price:Number(p.price),qty:Number(l.qty),total:Number(p.price)*Number(l.qty),productId:p.id,createdAt:Date.now()}); }); data.cart=[]; renderAll(); modal({title:'Sale completed',message:`Transaction recorded successfully. Total: ${peso(total)}.`}); }

  async function deleteSale(id) { const s=data.sales.find(x=>x.id===id); if(!s) return; const ok=await modal({title:'Delete sale record',message:'This will remove the sale and restore product stock.',confirm:true,okText:'Delete',danger:true}); if(!ok) return; const p=data.products.find(x=>x.id===s.productId); if(p) p.stock += s.qty; data.sales=data.sales.filter(x=>x.id!==id); renderAll(); }
  async function deleteExpense(id) { const ok=await modal({title:'Delete expense',message:'Remove this expense record?',confirm:true,okText:'Delete',danger:true}); if(!ok) return; data.expenses=data.expenses.filter(x=>x.id!==id); renderAll(); }
  async function deleteProduct(id) { const p=data.products.find(x=>x.id===id); const hasSales=data.sales.some(s=>s.productId===id); if(hasSales) return modal({title:'Product has sales history',message:'This product cannot be deleted because it has sales records. Keep it for accurate reports.'}); const ok=await modal({title:'Delete product',message:`Delete ${p.name}?`,confirm:true,okText:'Delete',danger:true}); if(!ok) return; data.products=data.products.filter(x=>x.id!==id); data.cart=data.cart.filter(x=>x.productId!==id); renderAll(); }

  function imageToDataUrl(file) { return new Promise((resolve,reject)=>{ if(!file) return resolve(''); if(file.size > 1024*1024*2) return reject(new Error('Image must be under 2MB.')); const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=reject; reader.readAsDataURL(file); }); }
  function escapeXls(v) { return String(v ?? '').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }
  function downloadFile(name, content, type) { const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),500); }
  function exportExcel() {
    const from=$('#reportFrom')?.value, to=$('#reportTo')?.value;
    const inRange=d=>(!from||d>=from)&&(!to||d<=to);
    const sales=data.sales.filter(s=>inRange(s.date));
    const expenses=data.expenses.filter(e=>inRange(e.date));
    const dates=[...new Set([...sales.map(s=>s.date),...expenses.map(e=>e.date)])].sort();
    let runningSales=0, runningExpenses=0;
    const rows=dates.map(date=>{ const ds=sales.filter(s=>s.date===date).reduce((a,s)=>a+s.total,0); const de=expenses.filter(e=>e.date===date).reduce((a,e)=>a+e.price,0); runningSales+=ds; runningExpenses+=de; return {date,sales:ds,expenses:de,net:ds-de,runningSales,runningExpenses}; });
    const period = from || to ? `${from ? formatDateLong(from) : 'Start'} to ${to ? formatDateLong(to) : 'Today'}` : 'All dates';
    const html=`<html><head><meta charset="utf-8"></head><body><h2>${escapeXls(data.settings.businessName)} Report</h2><p>Period: ${escapeXls(period)}</p><h3>Daily Report</h3><table border="1"><tr><th>Date</th><th>Daily Sales</th><th>Daily Expenses</th><th>Net</th><th>Running Sales</th><th>Running Expenses</th></tr>${rows.map(r=>`<tr><td>${formatDateLong(r.date)}</td><td>${r.sales}</td><td>${r.expenses}</td><td>${r.sales-r.expenses}</td><td>${r.runningSales}</td><td>${r.runningExpenses}</td></tr>`).join('')}</table><h3>Sales Records</h3><table border="1"><tr><th>Date</th><th>Item Description</th><th>Category</th><th>Price</th><th>Qty</th><th>Total Amount</th></tr>${sales.map(s=>`<tr><td>${formatDateLong(s.date)}</td><td>${escapeXls(s.item)}</td><td>${escapeXls(s.category)}</td><td>${s.price}</td><td>${s.qty}</td><td>${s.total}</td></tr>`).join('')}</table><h3>Expenses</h3><table border="1"><tr><th>Date</th><th>Description</th><th>Price</th></tr>${expenses.map(e=>`<tr><td>${formatDateLong(e.date)}</td><td>${escapeXls(e.description)}</td><td>${e.price}</td></tr>`).join('')}</table><h3>Inventory</h3><table border="1"><tr><th>Item</th><th>Category</th><th>Price</th><th>Stock</th><th>Low Stock Alert</th></tr>${data.products.map(p=>`<tr><td>${escapeXls(p.name)}</td><td>${escapeXls(p.category)}</td><td>${p.price}</td><td>${p.stock}</td><td>${p.lowStock}</td></tr>`).join('')}</table></body></html>`;
    downloadFile(`pos-report-${todayISO()}.xls`, html, 'application/vnd.ms-excel');
    modal({title:'Excel exported',message:'The filtered report has been downloaded from the Reports module.'});
  }

  function bindEvents() {
    $('#passwordInput')?.addEventListener('input', clearLoginError);
    $('#setupConfirmPassword')?.addEventListener('input', clearLoginError);
    $('#loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      clearLoginError();
      const password = $('#passwordInput').value;
      if (!hasPassword()) {
        const confirmPassword = $('#setupConfirmPassword').value;
        if (password.length < 8) { setLoginError('Password must be at least 8 characters.'); return; }
        if (password !== confirmPassword) { setLoginError('Passwords do not match. Please confirm and try again.', '#setupConfirmPassword'); return; }
        localStorage.setItem(AUTH_KEY, await hashText(password));
        $('#passwordInput').value=''; $('#setupConfirmPassword').value='';
        showApp();
        modal({title:'Workspace secured',message:'Your password has been created successfully.'});
        return;
      }
      const hash=await hashText(password);
      if(hash === localStorage.getItem(AUTH_KEY)) showApp();
      else setLoginError('Invalid password. Please check your password and try again.');
    });
    $$('.nav button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view))); $('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open')); $('#lockBtn').addEventListener('click',lockApp); $('#stockNotifyBtn').addEventListener('click',showInventoryNotifications);
    document.addEventListener('click', e => { const dd=$('#inventoryDropdown'); if(dd && !dd.classList.contains('hidden') && !e.target.closest('#stockNotifyBtn') && !e.target.closest('#inventoryDropdown')) closeInventoryDropdown(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeInventoryDropdown(); });
    $('#themeToggle').addEventListener('click',()=>{ data.settings.theme = data.settings.theme === 'dark' ? 'light' : 'dark'; renderAll(); }); $('#modalOk').addEventListener('click',()=>closeModal(true)); $('#modalCancel').addEventListener('click',()=>closeModal(false)); $('#modalOverlay').addEventListener('click',e=>{ if(e.target.id==='modalOverlay') closeModal(false); });
    $('#productImage').addEventListener('change', async e => { try { const src=await imageToDataUrl(e.target.files[0]); $('#productPreview').src=src; } catch(err) { e.target.value=''; modal({title:'Image not accepted',message:err.message}); } });
    $('#productForm').addEventListener('submit', async e => { e.preventDefault(); try { const img=await imageToDataUrl($('#productImage').files[0]); data.products.unshift({ id:uid(), name:$('#productName').value.trim(), category:$('#productCategory').value.trim(), price:Number($('#productPrice').value), stock:Math.floor(Number($('#productStock').value)), lowStock:Math.floor(Number($('#productLow').value || 5)), image:img, createdAt:Date.now() }); e.target.reset(); $('#productPreview').removeAttribute('src'); $('#productLow').value='5'; renderAll(); modal({title:'Product added',message:'The product is now available in Point of Sale.'}); } catch(err){ modal({title:'Product not saved',message:err.message}); } });
    $('#expenseForm').addEventListener('submit', e => { e.preventDefault(); data.expenses.unshift({id:uid(),date:$('#expenseDate').value,description:$('#expenseDescription').value.trim(),price:Number($('#expensePrice').value),createdAt:Date.now()}); e.target.reset(); $('#expenseDate').value=todayISO(); renderAll(); modal({title:'Expense added',message:'Expense record saved successfully.'}); });
    $('#checkoutBtn').addEventListener('click',checkout); $('#clearCartBtn').addEventListener('click',async()=>{ if(!data.cart.length) return; if(await modal({title:'Clear cart',message:'Remove all items from the current order?',confirm:true,okText:'Clear'})){ data.cart=[]; renderCart(); saveData(); }});
    ['productsSearch','posSearch','salesSearch','expensesSearch','reportFrom','reportTo'].forEach(id=>{ const n=$(`#${id}`); if(n) n.addEventListener('input',renderAll); }); $('#resetReportFilter').addEventListener('click',()=>{ $('#reportFrom').value=''; $('#reportTo').value=''; renderAll(); });
    $('#reportExcelBtn').addEventListener('click',exportExcel);
    $('#passwordForm').addEventListener('submit', async e => { e.preventDefault(); const newPassword=$('#newPassword').value; const confirmPassword=$('#confirmPassword').value; if(newPassword !== confirmPassword) return modal({title:'Password not updated',message:'New password and confirm password must match.'}); localStorage.setItem(AUTH_KEY, await hashText(newPassword)); e.target.reset(); modal({title:'Password updated',message:'The POS password has been changed successfully.'}); });
    $('#logoInput').addEventListener('change', async e => {
      try {
        const src = await imageToDataUrl(e.target.files[0]);
        if (src) { data.settings.logo = src; renderAll(); }
      } catch(err) { e.target.value=''; modal({title:'Logo not accepted',message:err.message}); }
    });
    $('#removeLogoBtn').addEventListener('click', () => { data.settings.logo=''; $('#logoInput').value=''; renderAll(); modal({title:'Logo removed',message:'The default POS mark is now active.'}); });
    $$('.preset-dot').forEach(btn => btn.addEventListener('click', () => { const color = btn.dataset.color; $('#accentInput').value = color; data.settings.accent = color; renderAll(); }));
    $('#designForm').addEventListener('submit', e => { e.preventDefault(); applyDesignForm(); renderAll(); modal({title:'Design updated',message:'Branding and layout controls have been applied.'}); });
    $('#previewDesignBtn')?.addEventListener('click', () => { applyDesignForm(); renderAll(); modal({title:'Preview applied',message:'The current design controls are now visible on this device.'}); });
    $('#resetDesignBtn')?.addEventListener('click', async () => { const ok = await modal({title:'Reset design?',message:'This restores the default appearance only. Products, sales, expenses, and password will remain unchanged.',confirm:true,okText:'Reset Design',cancelText:'Cancel'}); if(!ok) return; const current = data.settings || {}; data.settings = { ...defaultData().settings, theme: current.theme || 'light' }; $('#logoInput').value=''; renderAll(); modal({title:'Design reset',message:'The default workspace appearance has been restored.'}); });
  }

  async function init() { setIcons(); applySettings(); configureLockScreen(); renderForms(); bindEvents(); applySettings(); if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
  init();
})();
