(() => {
  'use strict';

  const SUPABASE_CONFIG = {
    url: 'https://jqvyzdsaheeekoxxbleb.supabase.co',
    anonKey: 'sb_publishable_siBhY5bDq-3i4agHiCOpIA_9O5uzC1C',
    recordKey: 'point-of-sale-main-data'
  };

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
    info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>',
    'chevron-left':'<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg>',
    'chevron-right':'<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>',
    cloud:'<svg viewBox="0 0 24 24"><path d="M17.5 19H7a5 5 0 0 1-.7-10A6 6 0 0 1 18 7.5 4.5 4.5 0 0 1 17.5 19z"></path><path d="M8 15h8"></path><path d="M12 11v8"></path></svg>',
    reset:'<svg viewBox="0 0 24 24"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 15H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>'
  };

  const defaultData = () => ({
    products: [], sales: [], expenses: [], cart: [],
    settings: { businessName:'Point Of Sale', accent:'#1d4ed8', theme:'light', logo:'', headerStyle:'soft', surfaceStyle:'elevated', cardSize:'comfortable', productImageSize:'standard', navStyle:'full', buttonStyle:'rounded', fontStyle:'system', dashboardStyle:'executive', productCardStyle:'standard', tableStyle:'standard', loginStyle:'split', backgroundStyle:'plain', sidebarCollapsed:false, sync:{enabled:true,url:SUPABASE_CONFIG.url,anonKey:SUPABASE_CONFIG.anonKey,recordKey:SUPABASE_CONFIG.recordKey,auto:true,lastSyncAt:'',lastPushAt:'',lastPullAt:''} }
  });
  let data = loadData();
  let cloudSyncTimer = null;
  let cloudSyncBusy = false;
  let suppressCloudSync = false;

  function loadData() {
    try {
      const stored = JSON.parse(localStorage.getItem(DB_KEY)) || {};
      const base = defaultData();
      const merged = { ...base, ...stored, settings: { ...base.settings, ...(stored.settings || {}) } };
      if (!merged.settings.businessName || merged.settings.businessName === 'Point of Sale Pro') merged.settings.businessName = 'Point Of Sale';
      return merged;
    } catch { return defaultData(); }
  }
  function saveData() { localStorage.setItem(DB_KEY, JSON.stringify(data)); scheduleCloudSync(); }


  function getSyncSettings() {
    const sync = { ...(defaultData().settings.sync || {}), ...((data.settings || {}).sync || {}) };
    sync.url = String(SUPABASE_CONFIG.url).trim().replace(/\/+$/, '');
    sync.anonKey = String(SUPABASE_CONFIG.anonKey).trim();
    sync.recordKey = SUPABASE_CONFIG.recordKey;
    sync.auto = true;
    sync.enabled = Boolean(sync.url && sync.anonKey && sync.recordKey);
    return sync;
  }
  function setSyncSettings(next) {
    data.settings.sync = { ...getSyncSettings(), ...next };
  }
  function cloudPayload() {
    return {
      version: 32,
      products: data.products || [],
      sales: data.sales || [],
      expenses: data.expenses || [],
      settings: { ...(data.settings || {}), sync: undefined },
      authHash: localStorage.getItem(AUTH_KEY) || '',
      savedAt: new Date().toISOString()
    };
  }
  function applyCloudPayload(payload) {
    if (!payload || typeof payload !== 'object') throw new Error('Online database data is empty or invalid.');
    const currentSync = getSyncSettings();
    data.products = Array.isArray(payload.products) ? payload.products : [];
    data.sales = Array.isArray(payload.sales) ? payload.sales : [];
    data.expenses = Array.isArray(payload.expenses) ? payload.expenses : [];
    data.cart = [];
    data.settings = { ...defaultData().settings, ...(payload.settings || {}), sync: currentSync };
    if (payload.authHash) localStorage.setItem(AUTH_KEY, payload.authHash);
    saveData();
  }
  function syncHeaders(sync) {
    return {
      apikey: sync.anonKey,
      Authorization: `Bearer ${sync.anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation'
    };
  }
  async function fetchCloudRecord() {
    const sync = getSyncSettings();
    if (!sync.enabled) throw new Error('Online database is not available yet. Please check the Supabase setup.');
    const url = `${sync.url}/rest/v1/pos_database?record_key=eq.${encodeURIComponent(sync.recordKey)}&select=*`;
    const res = await fetch(url, { headers: syncHeaders(sync) });
    if (!res.ok) throw new Error(`Database read failed. Check the Supabase setup and table policy. (${res.status})`);
    const rows = await res.json();
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  }
  async function pushCloudData(showNotice = true) {
    const sync = getSyncSettings();
    if (!sync.enabled) throw new Error('Online database is not available yet. Please check the Supabase setup.');
    cloudSyncBusy = true;
    try {
      const now = new Date().toISOString();
      const body = [{ record_key: sync.recordKey, payload: cloudPayload(), updated_at: now }];
      const res = await fetch(`${sync.url}/rest/v1/pos_database`, { method:'POST', headers: syncHeaders(sync), body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`Database save failed. Make sure the Supabase table and policies are installed. (${res.status})`);
      setSyncSettings({ enabled:true, lastSyncAt: now, lastPushAt: now });
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      renderSyncSettings();
      if (showNotice) modal({ title:'Database updated', message:'Latest POS data has been saved to the online database.' });
    } finally { cloudSyncBusy = false; }
  }
  async function pullCloudData(showNotice = true) {
    const record = await fetchCloudRecord();
    if (!record) {
      await pushCloudData(false);
      if (showNotice) modal({ title:'Database initialized', message:'The online database is ready and now contains this POS data.' });
      return;
    }
    suppressCloudSync = true;
    try {
      applyCloudPayload(record.payload);
      setSyncSettings({ lastSyncAt: record.updated_at || new Date().toISOString(), lastPullAt: new Date().toISOString() });
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      renderAll();
      if (showNotice) modal({ title:'Database data loaded', message:'Products, sales, expenses, reports, and settings were loaded from the online database.' });
    } finally {
      suppressCloudSync = false;
    }
  }
  async function syncNow(showNotice = true) {
    const sync = getSyncSettings();
    if (!sync.enabled) throw new Error('Online database is not available yet. Please check the Supabase setup.');
    const record = await fetchCloudRecord();
    if (!record) return pushCloudData(showNotice);
    const cloudTime = new Date(record.updated_at || 0).getTime();
    const lastSync = new Date(sync.lastSyncAt || 0).getTime();
    if (cloudTime > lastSync) return pullCloudData(showNotice);
    return pushCloudData(showNotice);
  }
  function scheduleCloudSync() {
    if (suppressCloudSync || cloudSyncBusy) return;
    const sync = getSyncSettings();
    if (!sync.enabled || !sync.auto || !navigator.onLine) return;
    clearTimeout(cloudSyncTimer);
    cloudSyncTimer = setTimeout(() => pushCloudData(false).catch(() => renderSyncSettings('Database paused')), 1400);
  }
  function renderSyncSettings(statusOverride = '') {
    // Online database runs automatically in the background.
    // This function stays lightweight so older UI hooks remain safe.
    const status = $('#syncStatusText');
    const last = $('#syncLastText');
    if (status) status.textContent = statusOverride || 'Database connected';
    if (last) {
      const sync = getSyncSettings();
      const stamp = sync.lastSyncAt ? formatDateTimeLong(sync.lastSyncAt) : 'Preparing database';
      last.textContent = stamp;
    }
  }

  async function initialCloudPull() {
    if (!navigator.onLine) return;
    try {
      const sync = getSyncSettings();
      if (!sync.enabled) return;
      const record = await fetchCloudRecord();
      if (!record || !record.payload) return;
      const cloudTime = new Date(record.updated_at || 0).getTime();
      const localTime = new Date(sync.lastSyncAt || 0).getTime();
      if (!sync.lastSyncAt || cloudTime > localTime) {
        suppressCloudSync = true;
        applyCloudPayload(record.payload);
        setSyncSettings({ lastSyncAt: record.updated_at || new Date().toISOString(), lastPullAt: new Date().toISOString(), auto: true, enabled: true });
        localStorage.setItem(DB_KEY, JSON.stringify(data));
        suppressCloudSync = false;
      }
    } catch (err) {
      suppressCloudSync = false;
      console.warn('Initial database pull skipped:', err.message);
    }
  }

  function startAutoDatabaseSync() {
    if (window.__posAutoDatabaseSyncStarted) return;
    window.__posAutoDatabaseSyncStarted = true;
    window.setInterval(() => {
      if (navigator.onLine) syncNow(false).catch(() => {});
    }, 20000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && navigator.onLine) syncNow(false).catch(() => {});
    });
    window.addEventListener('focus', () => {
      if (navigator.onLine) syncNow(false).catch(() => {});
    });
  }

  async function hashText(text) { const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)); return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''); }
  function hasPassword() { return Boolean(localStorage.getItem(AUTH_KEY)); }
  function configureLockScreen() {
    const setup = !hasPassword();
    const s = data.settings || defaultData().settings;
    $('#loginModeLabel').textContent = setup ? 'Initial Setup' : 'Account Access';
    $('#loginSubtitle').textContent = setup ? 'Create a secure password before opening the POS.' : 'Enter your password to continue.';
    $('#passwordLabel').textContent = setup ? 'Create password' : 'Password';
    $('#passwordInput').placeholder = setup ? 'Minimum 8 characters' : 'Enter password';
    $('#confirmPasswordGroup').classList.toggle('hidden', !setup);
    $('#setupConfirmPassword').required = setup;
    $('#loginSubmitBtn').textContent = setup ? 'Create Password & Continue' : 'Unlock POS';
    $('#loginHelp').textContent = '';
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
  function applySidebarState() {
    const collapsed = Boolean(data.settings && data.settings.sidebarCollapsed);
    document.documentElement.classList.toggle('sidebar-collapsed', collapsed);
    const btn = $('#sidebarCollapseBtn');
    if (btn) {
      btn.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
      btn.setAttribute('title', collapsed ? 'Expand navigation' : 'Collapse navigation');
      btn.innerHTML = `<span data-icon="${collapsed ? 'chevron-right' : 'chevron-left'}"></span>`;
      setIcons(btn);
    }
  }
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

  function passwordModal({ title='Confirm password', message='Enter your current password to continue.', okText='Continue', danger=false } = {}) {
    $('#modalTitle').textContent = title;
    $('#modalMessage').textContent = message;
    const detailsEl = $('#modalDetails');
    detailsEl.classList.remove('hidden');
    detailsEl.innerHTML = '<div class="modal-input-wrap"><label for="modalPasswordInput">Current password</label><input id="modalPasswordInput" type="password" autocomplete="current-password" placeholder="Enter current password"></div><div class="modal-warning-note">This action clears POS records from this device and the online database.</div>';
    $('#modalCancel').classList.remove('hidden');
    $('#modalCancel').textContent = 'Cancel';
    $('#modalOk').textContent = okText;
    $('#modalOk').className = `btn ${danger ? 'danger' : 'primary'}`;
    $('#modalOverlay').classList.remove('hidden');
    const input = $('#modalPasswordInput');
    setTimeout(() => input?.focus(), 60);
    return new Promise(resolve => {
      modalResolver = result => {
        const value = input?.value || '';
        detailsEl.innerHTML = '';
        resolve(result ? value : null);
      };
    });
  }

  async function resetAllData() {
    const authHash = localStorage.getItem(AUTH_KEY);
    if (!authHash) {
      return modal({ title:'Password required', message:'Create a login password first before using reset data.' });
    }
    if (!navigator.onLine) {
      return modal({ title:'Internet required', message:'Connect to the internet before resetting all data so the online database can be cleared safely.' });
    }
    const confirm = await modal({
      title:'Reset all POS data?',
      message:'This will clear products, sales, expenses, cart, reports, and design settings from this device and the online database.',
      details:'This cannot be undone. Export an Excel report first if records are still needed.',
      confirm:true,
      okText:'Continue',
      cancelText:'Cancel',
      danger:true
    });
    if (!confirm) return;
    const password = await passwordModal({ title:'Confirm reset', message:'Enter the current password to authorize the reset.', okText:'Reset Data', danger:true });
    if (password === null) return;
    const enteredHash = await hashText(password);
    if (enteredHash !== authHash) {
      return modal({ title:'Reset blocked', message:'The password entered is incorrect. Data was not changed.', danger:true });
    }
    const backupData = JSON.parse(JSON.stringify(data));
    const backupLocal = localStorage.getItem(DB_KEY);
    suppressCloudSync = true;
    data = defaultData();
    data.settings.sync = getSyncSettings();
    localStorage.setItem(AUTH_KEY, authHash);
    suppressCloudSync = false;
    try {
      await pushCloudData(false);
      data.cart = [];
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      renderAll();
      setView('dashboard');
      modal({ title:'Data reset completed', message:'Local POS records and online database records have been cleared successfully.' });
    } catch (err) {
      suppressCloudSync = true;
      data = backupData;
      if (backupLocal) localStorage.setItem(DB_KEY, backupLocal);
      suppressCloudSync = false;
      renderAll();
      modal({ title:'Reset not completed', message:'The online database could not be cleared. No POS data was removed. Please check the Supabase setup and try again.', details:err.message, danger:true });
    }
  }

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
    applySidebarState();
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

  function showApp() { $('#lockScreen').classList.add('hidden'); $('#app').classList.remove('hidden'); renderAll(); startAutoDatabaseSync(); if (navigator.onLine) syncNow(false).catch(() => {}); }
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

  function renderAll() { applySettings(); $('#todayText').textContent = new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' }); renderForms(); renderDashboard(); renderProducts(); renderPOS(); renderSales(); renderExpenses(); renderReports(); renderInventoryNotification(); renderSyncSettings(); setIcons(); saveData(); }

  function renderForms() {
    if (!$('#productForm').children.length) {
      $('#productForm').append(
        field('Product image', el('div', { class:'image-drop' }, [el('img', { id:'productPreview', alt:'Product preview' }), input('productImage','file',{accept:'image/*'}), el('div',{class:'file-help', text:''})])),
        field('Item description', input('productName','text',{required:true,maxlength:80,placeholder:'Example: Product item'})),
        field('Category', input('productCategory','text',{required:true,maxlength:50,placeholder:'Example: Product category'})),
        field('Price', input('productPrice','number',{required:true,min:'0',step:'0.01',placeholder:'0.00'})),
        field('Stock quantity', input('productStock','number',{required:true,min:'0',step:'1',placeholder:'0'})),
        field('Low stock alert', input('productLow','number',{min:'0',step:'1',value:'5'})),
        el('button',{class:'btn primary full',type:'submit',text:'Add Product'})
      );
    }
    if (!$('#expenseForm').children.length) {
      $('#expenseForm').append(
        field('Date', input('expenseDate','date',{required:true,value:todayISO()})),
        field('Description', input('expenseDescription','text',{required:true,maxlength:90,placeholder:'Example: Business expense'})),
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
  function renderCart() { const wrap=$('#cartItems'); wrap.replaceChildren(); let qty=0,total=0; data.cart.forEach(line=>{ const p=data.products.find(x=>x.id===line.productId); if(!p) return; qty+=line.qty; total+=line.qty*p.price; const row=el('div',{class:'cart-line'}); row.append(p.image?el('img',{src:p.image,alt:p.name}):el('div',{class:'mini-placeholder',text:p.name.slice(0,2).toUpperCase()})); const info=el('div',{},[el('h4',{text:p.name}),el('small',{text:`${p.category} · ${peso(p.price)}`})]); const controls=el('div',{class:'qty-controls'},[el('button',{type:'button',text:'-'}),el('span',{text:line.qty}),el('button',{type:'button',text:'+'}),el('strong',{class:'line-total',text:peso(line.qty*p.price)})]); controls.children[0].addEventListener('click',()=>changeCart(p.id,-1)); controls.children[2].addEventListener('click',()=>changeCart(p.id,1)); info.append(controls); row.append(info); wrap.append(row); }); if(!wrap.children.length) wrap.append(el('div',{class:'cart-empty',text:'Cart is empty.'})); $('#cartQty').textContent=qty; $('#cartLines').textContent=data.cart.length; $('#cartTotal').textContent=peso(total); $('#cartCountText').textContent=data.cart.length?`${data.cart.length} item group${data.cart.length>1?'s':''}`:'No items selected'; $('#checkoutBtn').disabled=!data.cart.length; }
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

  function imageToDataUrl(file, options = {}) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const maxInputMb = options.maxInputMb || 12;
      const maxSize = options.maxSize || 1200;
      const quality = options.quality || 0.82;
      if (!file.type || !file.type.startsWith('image/')) return reject(new Error('Please upload a valid image file.'));
      if (file.size > 1024 * 1024 * maxInputMb) return reject(new Error(`Image is too large. Please use an image under ${maxInputMb}MB.`));

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Image could not be read. Please try another photo.'));
      reader.onload = () => {
        const source = String(reader.result || '');
        const img = new Image();
        img.onerror = () => reject(new Error('Image format is not supported by this browser. Please use JPG, PNG, or WebP.'));
        img.onload = () => {
          const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * ratio));
          const height = Math.max(1, Math.round(img.height * ratio));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { alpha: true });
          ctx.drawImage(img, 0, 0, width, height);
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          resolve(canvas.toDataURL(outputType, outputType === 'image/png' ? undefined : quality));
        };
        img.src = source;
      };
      reader.readAsDataURL(file);
    });
  }
  function escapeXls(v) { return String(v ?? '').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])); }
  function escapeXml(v) { return String(v ?? '').replace(/[<>&\"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c])); }
  function downloadFile(name, content, type) { const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),500); }
  function formatDateTimeLong(value) {
    if (!value) return '';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString('en-US', { month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' });
  }
  function stockStatus(product) {
    const stock = Number(product.stock || 0);
    const low = Number(product.lowStock || 0);
    if (stock <= 0) return 'Out of Stock';
    if (low > 0 && stock <= low) return 'Low Stock';
    return 'In Stock';
  }
  function xmlCell(value, style = 'text', type = 'String', mergeAcross = 0) {
    const merge = mergeAcross ? ` ss:MergeAcross="${mergeAcross}"` : '';
    return `<Cell ss:StyleID="${style}"${merge}><Data ss:Type="${type}">${escapeXml(value)}</Data></Cell>`;
  }
  function worksheetReport(name, title, subtitle, columns, rows, totalRow = null) {
    const colCount = Math.max(columns.length, 1);
    const widths = columns.map(c => `<Column ss:AutoFitWidth="0" ss:Width="${c.width || 120}"/>`).join('');
    const header = columns.map(c => xmlCell(c.label, 'header')).join('');
    const body = rows.map(row => `<Row>${columns.map(c => {
      const value = typeof c.value === 'function' ? c.value(row) : row[c.key];
      const type = c.type || 'String';
      const defaultStyle = type === 'Number' ? 'number' : 'text';
      const style = typeof c.style === 'function' ? c.style(row) : (c.style || defaultStyle);
      return xmlCell(value ?? '', style, type);
    }).join('')}</Row>`).join('');
    const totals = totalRow ? `<Row>${columns.map((c, i) => {
      const value = typeof c.value === 'function' ? c.value(totalRow) : totalRow[c.key];
      const type = c.type || 'String';
      const style = i === 0 ? 'totalLabel' : (type === 'Number' ? 'totalCurrency' : 'totalLabel');
      return xmlCell(value ?? '', style, type);
    }).join('')}</Row>` : '';
    return `<Worksheet ss:Name="${escapeXml(name)}"><Table>${widths}
      <Row ss:Height="28">${xmlCell(title, 'sheetTitle', 'String', colCount - 1)}</Row>
      <Row>${xmlCell(subtitle, 'sheetSubtitle', 'String', colCount - 1)}</Row>
      <Row></Row>
      <Row>${header}</Row>
      ${body || `<Row>${xmlCell('No records available for the selected period.', 'muted', 'String', colCount - 1)}</Row>`}
      ${totals}
    </Table></Worksheet>`;
  }

  function worksheetSummary(period, generatedAt, metrics) {
    const netStyle = metrics.net < 0 ? 'danger' : 'currency';
    return `<Worksheet ss:Name="Summary"><Table>
      <Column ss:AutoFitWidth="0" ss:Width="170"/>
      <Column ss:AutoFitWidth="0" ss:Width="140"/>
      <Column ss:AutoFitWidth="0" ss:Width="150"/>
      <Column ss:AutoFitWidth="0" ss:Width="125"/>
      <Column ss:AutoFitWidth="0" ss:Width="115"/>
      <Column ss:AutoFitWidth="0" ss:Width="105"/>
      <Column ss:AutoFitWidth="0" ss:Width="125"/>
      <Column ss:AutoFitWidth="0" ss:Width="105"/>
      <Column ss:AutoFitWidth="0" ss:Width="115"/>
      <Row ss:Height="44">${xmlCell('Report Summary', 'sheetTitle', 'String', 8)}</Row>
      <Row ss:Height="26">${xmlCell(`${period} • Generated ${generatedAt}`, 'sheetSubtitle', 'String', 8)}</Row>
      <Row></Row>
      <Row>
        ${xmlCell('Report Period', 'header')}
        ${xmlCell('Total Sales', 'header')}
        ${xmlCell('Total Expenses', 'header')}
        ${xmlCell('Net', 'header')}
        ${xmlCell('Transactions', 'header')}
        ${xmlCell('Items Sold', 'header')}
        ${xmlCell('Inventory Items', 'header')}
        ${xmlCell('Low Stock', 'header')}
        ${xmlCell('Out of Stock', 'header')}
      </Row>
      <Row>
        ${xmlCell(period, 'text')}
        ${xmlCell(metrics.totalSales, 'currency', 'Number')}
        ${xmlCell(metrics.totalExpenses, 'currency', 'Number')}
        ${xmlCell(metrics.net, netStyle, 'Number')}
        ${xmlCell(metrics.totalOrders, 'integer', 'Number')}
        ${xmlCell(metrics.totalQty, 'integer', 'Number')}
        ${xmlCell(metrics.productCount, 'integer', 'Number')}
        ${xmlCell(metrics.lowStock, metrics.lowStock > 0 ? 'warning' : 'good', 'Number')}
        ${xmlCell(metrics.outStock, metrics.outStock > 0 ? 'danger' : 'good', 'Number')}
      </Row>

    </Table></Worksheet>`;
  }

  function exportExcel() {
    const from=$('#reportFrom')?.value, to=$('#reportTo')?.value;
    const inRange=d=>(!from||d>=from)&&(!to||d<=to);
    const sales=data.sales.filter(s=>inRange(s.date)).sort((a,b)=>String(a.date).localeCompare(String(b.date)) || Number(a.createdAt||0)-Number(b.createdAt||0) || String(a.item).localeCompare(String(b.item)));
    const expenses=data.expenses.filter(e=>inRange(e.date)).sort((a,b)=>String(a.date).localeCompare(String(b.date)) || String(a.description).localeCompare(String(b.description)));
    const dates=[...new Set([...sales.map(s=>s.date),...expenses.map(e=>e.date)])].sort();
    let runningSales=0, runningExpenses=0;
    const dailyRows=dates.map(date=>{
      const daySales=sales.filter(s=>s.date===date);
      const dayExpenses=expenses.filter(e=>e.date===date);
      const ds=daySales.reduce((a,s)=>a+Number(s.total||0),0);
      const de=dayExpenses.reduce((a,e)=>a+Number(e.price||0),0);
      runningSales+=ds; runningExpenses+=de;
      return {
        date:formatDateLong(date),
        transactionCount:new Set(daySales.map(s=>s.orderId || s.id)).size,
        itemsSold:daySales.reduce((a,s)=>a+Number(s.qty||0),0),
        dailySales:ds,
        dailyExpenses:de,
        net:ds-de,
        runningSales,
        runningExpenses,
        runningNet:runningSales-runningExpenses
      };
    });
    const totalSales=sales.reduce((a,s)=>a+Number(s.total||0),0);
    const totalExpenses=expenses.reduce((a,e)=>a+Number(e.price||0),0);
    const totalQty=sales.reduce((a,s)=>a+Number(s.qty||0),0);
    const totalOrders=new Set(sales.map(s=>s.orderId || s.id)).size;
    const lowStock=data.products.filter(p=>Number(p.stock||0)>0 && Number(p.lowStock||0)>0 && Number(p.stock||0)<=Number(p.lowStock||0)).length;
    const outStock=data.products.filter(p=>Number(p.stock||0)<=0).length;
    const period = from && to && from === to ? formatDateLong(from) : (from || to ? `${from ? formatDateLong(from) : 'Start'} to ${to ? formatDateLong(to) : formatDateLong(todayISO())}` : 'All dates');
    const generatedAt = new Date().toLocaleString('en-US', { month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' });

    const productMap = new Map();
    data.products.forEach(p => productMap.set(p.id, { product:p.name || 'Product item', category:p.category || 'Uncategorized', qty:0, sales:0, price:Number(p.price||0), stock:Number(p.stock||0), lowStock:Number(p.lowStock||0) }));
    sales.forEach(s => {
      const key = s.productId || `sale-${s.item}`;
      if (!productMap.has(key)) productMap.set(key, { product:s.item || 'Product item', category:s.category || 'Uncategorized', qty:0, sales:0, price:Number(s.price||0), stock:'', lowStock:'' });
      const row = productMap.get(key);
      row.qty += Number(s.qty||0);
      row.sales += Number(s.total||0);
    });
    const productPerformance = [...productMap.values()].sort((a,b)=>Number(b.sales||0)-Number(a.sales||0) || String(a.product).localeCompare(String(b.product))).map(r => ({...r, averagePrice: r.qty ? r.sales / r.qty : r.price, status: r.stock === '' ? 'Not in current inventory' : stockStatus(r)}));
    const bestProduct = productPerformance.find(r=>r.qty>0)?.product || 'No sales recorded';

    const categoryMap = new Map();
    sales.forEach(s => {
      const key = s.category || 'Uncategorized';
      if (!categoryMap.has(key)) categoryMap.set(key, {category:key, qty:0, sales:0});
      const row=categoryMap.get(key); row.qty += Number(s.qty||0); row.sales += Number(s.total||0);
    });
    const categoryRows=[...categoryMap.values()].sort((a,b)=>b.sales-a.sales);
    const topCategory = categoryRows[0]?.category || 'No sales recorded';

    const expenseMap = new Map();
    expenses.forEach(e => {
      const key = e.description || 'Business expense';
      if (!expenseMap.has(key)) expenseMap.set(key, {description:key, count:0, amount:0});
      const row=expenseMap.get(key); row.count += 1; row.amount += Number(e.price||0);
    });
    const expenseBreakdown=[...expenseMap.values()].sort((a,b)=>b.amount-a.amount || String(a.description).localeCompare(String(b.description)));

    const inventoryRows = data.products.map(p => ({
      name:p.name || 'Product item',
      category:p.category || 'Uncategorized',
      price:Number(p.price||0),
      stock:Number(p.stock||0),
      lowStock:Number(p.lowStock||0),
      status:stockStatus(p),
      inventoryValue:Number(p.price||0)*Number(p.stock||0)
    })).sort((a,b)=>String(a.status).localeCompare(String(b.status)) || String(a.name).localeCompare(String(b.name)));

    const salesRows = sales.map(s => ({
      date:formatDateLong(s.date),
      time:formatDateTimeLong(s.createdAt),
      orderId:s.orderId || s.id,
      item:s.item || 'Product item',
      category:s.category || 'Uncategorized',
      price:Number(s.price||0),
      qty:Number(s.qty||0),
      total:Number(s.total||0)
    }));
    const expenseRows = expenses.map(e => ({date:formatDateLong(e.date), description:e.description || 'Business expense', amount:Number(e.price||0)}));

    const workbook = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Point Of Sale</Author><Title>${escapeXml(data.settings.businessName || 'Point Of Sale')} Detailed Report</Title></DocumentProperties>
  <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook>
  <Styles>
    <Style ss:ID="sheetTitle"><Font ss:Bold="1" ss:Size="24" ss:Color="#111827"/><Interior ss:Color="#EAF2FF" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>
    <Style ss:ID="sheetSubtitle"><Font ss:Bold="1" ss:Size="13" ss:Color="#475569"/><Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center" ss:Vertical="Center"/></Style>
    <Style ss:ID="header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#1D4ED8" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1E3A8A"/></Borders></Style>
    <Style ss:ID="text"><Alignment ss:Vertical="Center" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/></Borders></Style>
    <Style ss:ID="muted"><Font ss:Color="#64748B"/><Alignment ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/></Borders></Style>
    <Style ss:ID="number"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><NumberFormat ss:Format="#,##0.00"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/></Borders></Style>
    <Style ss:ID="integer"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><NumberFormat ss:Format="0"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/></Borders></Style>
    <Style ss:ID="currency"><Alignment ss:Horizontal="Right" ss:Vertical="Center"/><NumberFormat ss:Format="&quot;₱&quot;#,##0.00"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/></Borders></Style>
    <Style ss:ID="good"><Font ss:Bold="1" ss:Color="#166534"/><Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BBF7D0"/></Borders></Style>
    <Style ss:ID="warning"><Font ss:Bold="1" ss:Color="#854D0E"/><Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDE68A"/></Borders></Style>
    <Style ss:ID="danger"><Font ss:Bold="1" ss:Color="#991B1B"/><Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/></Borders></Style>
    <Style ss:ID="totalLabel"><Font ss:Bold="1"/><Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/><Borders><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/></Borders></Style>
    <Style ss:ID="totalCurrency"><Font ss:Bold="1"/><Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/><Alignment ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;₱&quot;#,##0.00"/><Borders><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/></Borders></Style>
  </Styles>
  ${worksheetSummary(period, generatedAt, {
    businessName: data.settings.businessName || 'Point Of Sale',
    totalSales,
    totalExpenses,
    net: totalSales - totalExpenses,
    totalOrders,
    totalQty,
    productCount: data.products.length,
    lowStock,
    outStock,
    bestProduct,
    topCategory
  })}
  ${worksheetReport('Daily Report', 'Daily Report', 'Sales, expenses, net, and running totals by date', [
    {label:'Date', key:'date', width:155},
    {label:'Transactions', key:'transactionCount', type:'Number', style:'integer', width:100},
    {label:'Items Sold', key:'itemsSold', type:'Number', style:'integer', width:90},
    {label:'Daily Sales', key:'dailySales', type:'Number', style:'currency', width:120},
    {label:'Daily Expenses', key:'dailyExpenses', type:'Number', style:'currency', width:130},
    {label:'Net', key:'net', type:'Number', style:'currency', width:115},
    {label:'Running Sales', key:'runningSales', type:'Number', style:'currency', width:135},
    {label:'Running Expenses', key:'runningExpenses', type:'Number', style:'currency', width:150},
    {label:'Running Net', key:'runningNet', type:'Number', style:'currency', width:130}
  ], dailyRows, {date:'TOTAL', transactionCount:totalOrders, itemsSold:totalQty, dailySales:totalSales, dailyExpenses:totalExpenses, net:totalSales-totalExpenses, runningSales:runningSales, runningExpenses:runningExpenses, runningNet:runningSales-runningExpenses})}
  ${worksheetReport('Sales Details', 'Sales Details', 'Complete item-level sales records', [
    {label:'Date', key:'date', width:155},
    {label:'Recorded Time', key:'time', width:190},
    {label:'Order ID', key:'orderId', width:190},
    {label:'Item Description', key:'item', width:230},
    {label:'Category', key:'category', width:150},
    {label:'Price', key:'price', type:'Number', style:'currency', width:105},
    {label:'Qty', key:'qty', type:'Number', style:'integer', width:70},
    {label:'Total Amount', key:'total', type:'Number', style:'currency', width:130}
  ], salesRows, {date:'TOTAL', time:'', orderId:'', item:'', category:'', price:'', qty:totalQty, total:totalSales})}
  ${worksheetReport('Expenses', 'Expense Details', 'Complete expense records for the selected period', [
    {label:'Date', key:'date', width:155},
    {label:'Description', key:'description', width:300},
    {label:'Amount', key:'amount', type:'Number', style:'currency', width:125}
  ], expenseRows, {date:'TOTAL', description:'', amount:totalExpenses})}
  ${worksheetReport('Product Performance', 'Product Performance', 'Quantity sold, gross sales, and current stock by product', [
    {label:'Product', key:'product', width:230},
    {label:'Category', key:'category', width:150},
    {label:'Qty Sold', key:'qty', type:'Number', style:'integer', width:90},
    {label:'Gross Sales', key:'sales', type:'Number', style:'currency', width:125},
    {label:'Average Price', key:'averagePrice', type:'Number', style:'currency', width:120},
    {label:'Current Stock', key:'stock', type:'Number', style:'integer', width:105},
    {label:'Status', key:'status', style:r => r.status === 'Out of Stock' ? 'danger' : (r.status === 'Low Stock' ? 'warning' : 'good'), width:125}
  ], productPerformance)}
  ${worksheetReport('Category Summary', 'Category Summary', 'Sales grouped by category', [
    {label:'Category', key:'category', width:200},
    {label:'Qty Sold', key:'qty', type:'Number', style:'integer', width:90},
    {label:'Gross Sales', key:'sales', type:'Number', style:'currency', width:130}
  ], categoryRows, {category:'TOTAL', qty:totalQty, sales:totalSales})}
  ${worksheetReport('Expense Breakdown', 'Expense Breakdown', 'Expenses grouped by description', [
    {label:'Description', key:'description', width:300},
    {label:'Count', key:'count', type:'Number', style:'integer', width:80},
    {label:'Total Amount', key:'amount', type:'Number', style:'currency', width:130}
  ], expenseBreakdown, {description:'TOTAL', count:expenses.length, amount:totalExpenses})}
  ${worksheetReport('Inventory', 'Inventory', 'Current product stock and inventory value', [
    {label:'Item', key:'name', width:230},
    {label:'Category', key:'category', width:150},
    {label:'Price', key:'price', type:'Number', style:'currency', width:105},
    {label:'Stock', key:'stock', type:'Number', style:'integer', width:80},
    {label:'Low Stock Level', key:'lowStock', type:'Number', style:'integer', width:125},
    {label:'Status', key:'status', style:r => r.status === 'Out of Stock' ? 'danger' : (r.status === 'Low Stock' ? 'warning' : 'good'), width:125},
    {label:'Inventory Value', key:'inventoryValue', type:'Number', style:'currency', width:135}
  ], inventoryRows, {name:'TOTAL', category:'', price:'', stock:data.products.reduce((a,p)=>a+Number(p.stock||0),0), lowStock:'', status:'', inventoryValue:inventoryRows.reduce((a,p)=>a+Number(p.inventoryValue||0),0)})}
</Workbook>`;
    const filePeriod = from && to && from === to ? from : todayISO();
    downloadFile(`point-of-sale-detailed-report-${filePeriod}.xls`, workbook, 'application/vnd.ms-excel');
    modal({title:'Excel report exported',message:'Excel report exported with a clearer summary, daily report, sales details, expenses, product performance, category summary, expense breakdown, and inventory.'});
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
        modal({title:'POS secured',message:'Your password has been created successfully.'});
        return;
      }
      const hash=await hashText(password);
      if(hash === localStorage.getItem(AUTH_KEY)) showApp();
      else setLoginError('Invalid password. Please check your password and try again.');
    });
    $$('.nav button').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view))); $('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open')); $('#sidebarCollapseBtn')?.addEventListener('click',()=>{ data.settings.sidebarCollapsed = !data.settings.sidebarCollapsed; saveData(); applySidebarState(); }); $('#lockBtn').addEventListener('click',lockApp); $('#stockNotifyBtn').addEventListener('click',showInventoryNotifications);
    document.addEventListener('click', e => { const dd=$('#inventoryDropdown'); if(dd && !dd.classList.contains('hidden') && !e.target.closest('#stockNotifyBtn') && !e.target.closest('#inventoryDropdown')) closeInventoryDropdown(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeInventoryDropdown(); });
    $('#themeToggle').addEventListener('click',()=>{ data.settings.theme = data.settings.theme === 'dark' ? 'light' : 'dark'; renderAll(); }); $('#modalOk').addEventListener('click',()=>closeModal(true)); $('#modalCancel').addEventListener('click',()=>closeModal(false)); $('#modalOverlay').addEventListener('click',e=>{ if(e.target.id==='modalOverlay') closeModal(false); });
    $('#productImage').addEventListener('change', async e => { try { const src=await imageToDataUrl(e.target.files[0], { maxInputMb: 12, maxSize: 1280, quality: 0.8 }); $('#productPreview').src=src; } catch(err) { e.target.value=''; modal({title:'Image not accepted',message:err.message}); } });
    $('#productForm').addEventListener('submit', async e => { e.preventDefault(); try { const img=await imageToDataUrl($('#productImage').files[0], { maxInputMb: 12, maxSize: 1280, quality: 0.8 }); data.products.unshift({ id:uid(), name:$('#productName').value.trim(), category:$('#productCategory').value.trim(), price:Number($('#productPrice').value), stock:Math.floor(Number($('#productStock').value)), lowStock:Math.floor(Number($('#productLow').value || 5)), image:img, createdAt:Date.now() }); e.target.reset(); $('#productPreview').removeAttribute('src'); $('#productLow').value='5'; renderAll(); modal({title:'Product added',message:'The product is now available in Point of Sale.'}); } catch(err){ modal({title:'Product not saved',message:err.message}); } });
    $('#expenseForm').addEventListener('submit', e => { e.preventDefault(); data.expenses.unshift({id:uid(),date:$('#expenseDate').value,description:$('#expenseDescription').value.trim(),price:Number($('#expensePrice').value),createdAt:Date.now()}); e.target.reset(); $('#expenseDate').value=todayISO(); renderAll(); modal({title:'Expense added',message:'Expense record saved successfully.'}); });
    $('#checkoutBtn').addEventListener('click',checkout); $('#clearCartBtn').addEventListener('click',async()=>{ if(!data.cart.length) return; if(await modal({title:'Clear cart',message:'Remove all items from the current order?',confirm:true,okText:'Clear'})){ data.cart=[]; renderCart(); saveData(); }});
    ['productsSearch','posSearch','salesSearch','expensesSearch','reportFrom','reportTo'].forEach(id=>{ const n=$(`#${id}`); if(n) n.addEventListener('input',renderAll); }); $('#resetReportFilter').addEventListener('click',()=>{ $('#reportFrom').value=''; $('#reportTo').value=''; renderAll(); });
    $('#reportExcelBtn').addEventListener('click',exportExcel);
    $('#passwordForm').addEventListener('submit', async e => { e.preventDefault(); const newPassword=$('#newPassword').value; const confirmPassword=$('#confirmPassword').value; if(newPassword !== confirmPassword) return modal({title:'Password not updated',message:'New password and confirm password must match.'}); localStorage.setItem(AUTH_KEY, await hashText(newPassword)); e.target.reset(); modal({title:'Password updated',message:'The POS password has been changed successfully.'}); });
    window.addEventListener('online', () => { renderSyncSettings('Online'); scheduleCloudSync(); syncNow(false).catch(() => {}); });
    window.addEventListener('offline', () => renderSyncSettings('Offline'));
    $('#logoInput').addEventListener('change', async e => {
      try {
        const src = await imageToDataUrl(e.target.files[0], { maxInputMb: 12, maxSize: 1000, quality: 0.85 });
        if (src) { data.settings.logo = src; renderAll(); }
      } catch(err) { e.target.value=''; modal({title:'Logo not accepted',message:err.message}); }
    });
    $('#removeLogoBtn').addEventListener('click', () => { data.settings.logo=''; $('#logoInput').value=''; renderAll(); modal({title:'Logo removed',message:'The default POS mark is now active.'}); });
    $$('.preset-dot').forEach(btn => btn.addEventListener('click', () => { const color = btn.dataset.color; $('#accentInput').value = color; data.settings.accent = color; renderAll(); }));
    $('#designForm').addEventListener('submit', e => { e.preventDefault(); applyDesignForm(); renderAll(); modal({title:'Design updated',message:'Branding and layout controls have been applied.'}); });
    $('#previewDesignBtn')?.addEventListener('click', () => { applyDesignForm(); renderAll(); modal({title:'Preview applied',message:'The current design controls are now visible on this device.'}); });
    $('#resetDesignBtn')?.addEventListener('click', async () => { const ok = await modal({title:'Reset design?',message:'This restores the default appearance only. Products, sales, expenses, and password will remain unchanged.',confirm:true,okText:'Reset Design',cancelText:'Cancel'}); if(!ok) return; const current = data.settings || {}; data.settings = { ...defaultData().settings, theme: current.theme || 'light' }; $('#logoInput').value=''; renderAll(); modal({title:'Design reset',message:'The default POS appearance has been restored.'}); });
    $('#resetAllDataBtn')?.addEventListener('click', resetAllData);
  }

  async function init() { setIcons(); applySettings(); await initialCloudPull(); configureLockScreen(); renderForms(); bindEvents(); applySettings(); if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
  init();
})();
