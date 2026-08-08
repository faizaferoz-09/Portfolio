// ============================================================
//  SIMPLON BEAUTY — script.js
//  Global UI: Swiper | Popup | Dark Mode | Cart | Search | AOS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Inject Login Modal HTML Dynamically ──
  if (!document.getElementById('loginModal')) {
    var loginModalHTML = `
    <div id="loginModal">
      <div class="login-modal-card">
        <span class="login-modal-close" id="loginModalClose">×</span>
        <div class="login-modal-banner">
          <div class="login-modal-icon">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h3>Secure Checkout</h3>
          <p>Please sign in to your SIMPLON account to proceed with your order secure checkout.</p>
        </div>
        <div class="login-modal-body">
          <div id="loginError"></div>
          <form id="loginForm">
            <div class="login-form-group">
              <label for="loginName"><i class="fa-solid fa-user"></i> Full Name</label>
              <input type="text" id="loginName" placeholder="Enter your full name" required>
            </div>
            <div class="login-form-group">
              <label for="loginEmail"><i class="fa-solid fa-envelope"></i> Email Address</label>
              <input type="email" id="loginEmail" placeholder="Enter your email address" required>
            </div>
            <button type="submit" class="login-submit-btn">
              <i class="fa-solid fa-shield-halved"></i> Sign In &amp; Checkout
            </button>
            <span class="login-skip-link" id="loginModalCancel">Cancel</span>
          </form>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', loginModalHTML);
  }

  // ── Loading Screen ──
  var loader = document.getElementById('loadingScreen');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    setTimeout(() => loader.classList.add('hidden'), 2800);
  }

  // ── AOS Init ──
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  // ── Swiper Hero ──
  if (document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 900,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
    });
  }

  // ── Testimonial Swiper ──
  if (document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      loop: true,
      autoplay: { delay: 5000 },
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 }
      }
    });
  }

  // ── Sticky Header ──
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── Dark Mode ──
  var darkToggle = document.getElementById('darkToggle');
  var savedTheme = localStorage.getItem('simplonTheme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateDarkIcon(savedTheme);
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('simplonTheme', next);
      updateDarkIcon(next);
    });
  }
  function updateDarkIcon(theme) {
    if (!darkToggle) return;
    darkToggle.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  // ── Hamburger / Mobile Nav ──
  var hamburger = document.querySelector('.hamburger') || document.getElementById('hamburger');
  var mobileNav = document.querySelector('.mobile-nav') || document.getElementById('mobileNav');
  var mobileOverlay = document.querySelector('.mobile-nav-overlay') || document.getElementById('mobileOverlay');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      var isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        hamburger.classList.add('open');
        mobileNav.classList.add('open');
        if (mobileOverlay) mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  function closeMobileNav() {
    var hamburger = document.querySelector('.hamburger') || document.getElementById('hamburger');
    var mobileNav = document.querySelector('.mobile-nav') || document.getElementById('mobileNav');
    var mobileOverlay = document.querySelector('.mobile-nav-overlay') || document.getElementById('mobileOverlay');
    if (hamburger) hamburger.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeMobileNav = closeMobileNav;


  // ── Scroll-to-top ──
  var scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Search Modal ──
  var searchModal = document.getElementById('searchModal');
  var searchIcon = document.getElementById('searchIcon');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchModalInput');
  var searchResults = document.getElementById('searchResults');

  if (searchIcon && searchModal) {
    searchIcon.addEventListener('click', e => {
      e.preventDefault();
      searchModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      searchInput && searchInput.focus();
    });
  }
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchModal) searchModal.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });
  function closeSearch() {
    searchModal && searchModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      var q = searchInput.value.toLowerCase().trim();
      if (!q || typeof productsData === 'undefined') { searchResults.innerHTML = ''; return; }
      var matches = productsData.filter(p =>
        p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 6);
      searchResults.innerHTML = matches.length
        ? matches.map(p => `
            <a class="search-result-item" href="product-detail.html?id=${p.id}">
              <img src="${p.image}" alt="${p.title}">
              <div class="search-result-item-info">
                <h4>${p.title}</h4>
                <span>$${p.price.toFixed(2)}</span>
              </div>
            </a>`).join('')
        : '<p style="padding:16px;color:var(--paragraph);font-size:14px;">No products found.</p>';
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closeCartSidebar(); closeWishlistSidebar(); closeQuickView && closeQuickView(); } });

  // ── Cart Sidebar ──
  var cartIcon = document.getElementById('cartIcon');
  var cartSidebar = document.getElementById('cartSidebar');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartClose = document.getElementById('cartClose');
  var cartItemsEl = document.getElementById('cartItems');
  var cartTotalEl = document.getElementById('cartTotal');

  if (cartIcon) cartIcon.addEventListener('click', e => { e.preventDefault(); openCartSidebar(); });
  if (cartClose) cartClose.addEventListener('click', closeCartSidebar);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);

  function openCartSidebar() {
    renderCartSidebar();
    cartSidebar && cartSidebar.classList.add('open');
    cartOverlay && cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCartSidebar() {
    cartSidebar && cartSidebar.classList.remove('open');
    cartOverlay && cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeCartSidebar = closeCartSidebar;

  // ── Auth: Login State ──
  function isLoggedIn() {
    return !!localStorage.getItem('simplonUser');
  }
  function getUser() {
    try { return JSON.parse(localStorage.getItem('simplonUser')); } catch { return null; }
  }

  // ── Login Modal ──
  let loginRedirectUrl = 'order.html';
  var loginModal = document.getElementById('loginModal');
  var loginModalClose = document.getElementById('loginModalClose');
  var loginModalCancel = document.getElementById('loginModalCancel');
  var loginForm = document.getElementById('loginForm');
  var loginError = document.getElementById('loginError');

  function openLoginModal(redirectUrl) {
    loginRedirectUrl = redirectUrl || 'order.html';
    if (loginModal) {
      loginModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      var nameInput = document.getElementById('loginName');
      if (nameInput) nameInput.focus();
    }
  }
  function closeLoginModal() {
    if (loginModal) {
      loginModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (loginError) { loginError.classList.remove('show'); loginError.textContent = ''; }
  }
  window.openLoginModal = openLoginModal;
  window.closeLoginModal = closeLoginModal;

  if (loginModalClose) loginModalClose.addEventListener('click', closeLoginModal);
  if (loginModalCancel) loginModalCancel.addEventListener('click', closeLoginModal);
  if (loginModal) loginModal.addEventListener('click', e => { if (e.target === loginModal) closeLoginModal(); });

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      var nameInput = document.getElementById('loginName');
      var emailInput = document.getElementById('loginEmail');
      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Clear errors
      if (nameInput) nameInput.classList.remove('error');
      if (emailInput) emailInput.classList.remove('error');
      if (loginError) { loginError.classList.remove('show'); }

      let valid = true;
      if (!name) { if (nameInput) nameInput.classList.add('error'); valid = false; }
      if (!emailReg.test(email)) { if (emailInput) emailInput.classList.add('error'); valid = false; }
      if (!valid) {
        if (loginError) {
          loginError.textContent = 'Please fill in your name and a valid email address.';
          loginError.classList.add('show');
        }
        return;
      }

      // Save user
      var user = { name, email, loginTime: Date.now() };
      localStorage.setItem('simplonUser', JSON.stringify(user));
      closeLoginModal();
      // Redirect to checkout
      window.location.href = loginRedirectUrl;
    });
  }

  // ── Checkout Auth Guard & Direct Navigation Restriction ──
  if (window.location.pathname.includes('order.html')) {
    if (!isLoggedIn()) {
      window.location.href = 'cart.html?login_required=1';
    }
  }

  if (window.location.search.includes('login_required=1')) {
    setTimeout(() => {
      openLoginModal('order.html');
    }, 500);
  }

  // Global Checkout click interception
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a[href="order.html"], .cart-checkout-btn, .checkout-btn');
    if (target) {
      if (!isLoggedIn()) {
        e.preventDefault();
        openLoginModal('order.html');
      }
    }
  });

  function renderCartSidebar() {
    if (!cartItemsEl) return;
    var cartData = JSON.parse(localStorage.getItem('beautyCart')) || [];
    
    // User status header in sidebar
    let userHeaderHtml = '';
    var user = getUser();
    if (user) {
      userHeaderHtml = `
        <div class="cart-sidebar-user-welcome" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg-section); border-radius:10px; margin-bottom:14px; font-size:12px; font-weight:600; color:var(--heading);">
          <span><i class="fa-solid fa-circle-user" style="color:var(--primary); margin-right:6px;"></i>Hi, ${user.name.split(' ')[0]}!</span>
          <a href="#" id="cartSidebarLogout" style="color:#e05c5c; text-decoration:underline;">Sign Out</a>
        </div>
      `;
    }

    if (cartData.length === 0) {
      cartItemsEl.innerHTML = userHeaderHtml + `<div class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty</p></div>`;
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      
      // Hook logout button even if cart is empty
      var logoutBtn = document.getElementById('cartSidebarLogout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if (confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('simplonUser');
            renderCartSidebar();
          }
        });
      }
      return;
    }
    let total = 0;
    var itemsHtml = cartData.map(item => {
      total += item.price * item.qty;
      return `<div class="cart-item">
        <img src="${item.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop'}" alt="${item.title}">
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <span class="price">$${item.price.toFixed(2)}</span>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="sidebarQtyChange(${item.id},-1)"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="sidebarQtyChange(${item.id},1)"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
        <span class="cart-item-remove" onclick="sidebarRemove(${item.id})"><i class="fa-solid fa-trash-can"></i></span>
      </div>`;
    }).join('');
    
    cartItemsEl.innerHTML = userHeaderHtml + itemsHtml;
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;

    // Hook logout button
    var logoutBtn = document.getElementById('cartSidebarLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to sign out?')) {
          localStorage.removeItem('simplonUser');
          renderCartSidebar();
        }
      });
    }
  }

  window.sidebarQtyChange = function (id, delta) {
    var cartData = JSON.parse(localStorage.getItem('beautyCart')) || [];
    var item = cartData.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cartData.splice(cartData.indexOf(item), 1);
    localStorage.setItem('beautyCart', JSON.stringify(cartData));
    if (typeof updateCartCount === 'function') updateCartCount();
    renderCartSidebar();
  };
  window.sidebarRemove = function (id) {
    var cartData = JSON.parse(localStorage.getItem('beautyCart')) || [];
    var idx = cartData.findIndex(i => i.id === id);
    if (idx > -1) cartData.splice(idx, 1);
    localStorage.setItem('beautyCart', JSON.stringify(cartData));
    if (typeof updateCartCount === 'function') updateCartCount();
    renderCartSidebar();
  };

  // ── Wishlist Sidebar ──
  var wishlistIcon = document.getElementById('wishlistIcon');
  var wishlistSidebar = document.getElementById('wishlistSidebar');
  var wishlistOverlay = document.getElementById('wishlistOverlay');
  var wishlistClose = document.getElementById('wishlistClose');
  var wishlistItemsEl = document.getElementById('wishlistItems');

  if (wishlistIcon) wishlistIcon.addEventListener('click', e => { e.preventDefault(); openWishlistSidebar(); });
  if (wishlistClose) wishlistClose.addEventListener('click', closeWishlistSidebar);
  if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlistSidebar);

  function openWishlistSidebar() {
    renderWishlistSidebar();
    wishlistSidebar && wishlistSidebar.classList.add('open');
    wishlistOverlay && wishlistOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeWishlistSidebar() {
    wishlistSidebar && wishlistSidebar.classList.remove('open');
    wishlistOverlay && wishlistOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeWishlistSidebar = closeWishlistSidebar;

  function renderWishlistSidebar() {
    if (!wishlistItemsEl) return;
    var wl = JSON.parse(localStorage.getItem('beautyWishlist')) || [];
    if (wl.length === 0) {
      wishlistItemsEl.innerHTML = `<div class="cart-empty"><i class="fa-regular fa-heart"></i><p>Your wishlist is empty</p></div>`;
      return;
    }
    wishlistItemsEl.innerHTML = wl.map(item => `
      <div class="wishlist-item">
        <img src="${item.image || ''}" alt="${item.title}">
        <div class="wishlist-item-info">
          <h4>${item.title}</h4>
          <span>$${item.price.toFixed(2)}</span>
        </div>
        <span class="wishlist-item-remove" onclick="removeWishlist(${item.id})"><i class="fa-solid fa-times"></i></span>
      </div>`).join('');
  }

  window.removeWishlist = function (id) {
    var wl = JSON.parse(localStorage.getItem('beautyWishlist')) || [];
    var idx = wl.findIndex(i => i.id === id);
    if (idx > -1) wl.splice(idx, 1);
    localStorage.setItem('beautyWishlist', JSON.stringify(wl));
    if (typeof updateWishlistCount === 'function') updateWishlistCount();
    renderWishlistSidebar();
  };

  // ── Newsletter Popup ──
  var popup = document.getElementById('newsletterPopup');
  if (popup && !localStorage.getItem('simplonPopupShown')) {
    setTimeout(() => { popup.classList.add('show'); }, 1000);
  }
  var popupClose = document.getElementById('popupClose');
  var popupSkip = document.getElementById('popupSkip');
  var popupForm = document.getElementById('popupForm');

  function closePopup() {
    popup && popup.classList.remove('show');
    localStorage.setItem('simplonPopupShown', 'true');
    document.body.style.overflow = '';
  }
  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (popupSkip) popupSkip.addEventListener('click', closePopup);
  if (popup) popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });

  if (popupForm) {
    popupForm.addEventListener('submit', e => {
      e.preventDefault();
      var emailInput = popupForm.querySelector('input[type="email"]');
      var email = emailInput ? emailInput.value.trim() : '';
      var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailReg.test(email)) {
        emailInput && (emailInput.style.borderColor = '#e05c5c');
        return;
      }
      localStorage.setItem('simplonSubscribed', email);
      popup.querySelector('.popup-body').innerHTML = `
        <div style="text-align:center;padding:40px 20px;">
          <i class="fa-solid fa-circle-check" style="font-size:52px;color:#4caf87;display:block;margin-bottom:18px;"></i>
          <h2 style="font-family:var(--font-heading);font-size:1.8rem;color:var(--heading);margin-bottom:10px;">Thank You!</h2>
          <p style="color:var(--paragraph);">You've been subscribed. Watch your inbox for exclusive offers!</p>
        </div>`;
      setTimeout(closePopup, 3000);
    });
  }

  // ── Newsletter Section Form ──
  var nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      var input = nlForm.querySelector('input');
      var msg = document.getElementById('nlMsg');
      var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!input || !emailReg.test(input.value.trim())) {
        if (msg) { msg.textContent = '⚠ Please enter a valid email address.'; msg.style.color = '#ffd6d6'; }
        return;
      }
      if (msg) { msg.textContent = '✓ Thank you for subscribing!'; msg.style.color = '#d4edda'; }
      input.value = '';
      setTimeout(() => { if (msg) msg.textContent = ''; }, 4000);
    });
  }

  // ── Contact Form ──
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        var group = field.closest('.form-group');
        if (!field.value.trim()) { if (group) group.classList.add('invalid'); valid = false; }
        else { if (group) { group.classList.remove('invalid'); group.classList.add('valid'); } }
      });
      var emailField = contactForm.querySelector('input[type="email"]');
      if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.closest('.form-group')?.classList.add('invalid'); valid = false;
      }
      if (!valid) return;
      var success = document.getElementById('contactSuccess');
      if (success) { contactForm.style.display = 'none'; success.style.display = 'block'; }
    });
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        var group = field.closest('.form-group');
        if (field.value.trim()) { group?.classList.remove('invalid'); group?.classList.add('valid'); }
      });
    });
  }

  // ── Feedback Form ──
  var feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', e => {
      e.preventDefault();
      var ratingChecked = feedbackForm.querySelector('input[name="rating"]:checked');
      if (!ratingChecked) { alert('Please select a star rating.'); return; }
      let valid = true;
      feedbackForm.querySelectorAll('[required]').forEach(field => {
        if (field.type === 'radio') return;
        var group = field.closest('.form-group');
        if (!field.value.trim()) { if (group) group.classList.add('invalid'); valid = false; }
        else { if (group) { group.classList.remove('invalid'); group.classList.add('valid'); } }
      });
      if (!valid) return;
      var success = document.getElementById('feedbackSuccess');
      if (success) { feedbackForm.style.display = 'none'; success.style.display = 'block'; }
    });
  }

  // ── Checkout Form ──
  var checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      checkoutForm.querySelectorAll('[required]').forEach(field => {
        var group = field.closest('.form-group');
        if (!field.value.trim()) { if (group) group.classList.add('invalid'); valid = false; }
        else { if (group) { group.classList.remove('invalid'); group.classList.add('valid'); } }
      });
      if (!valid) return;
      localStorage.removeItem('beautyCart');
      if (typeof updateCartCount === 'function') updateCartCount();
      checkoutForm.parentElement.style.display = 'none';
      var success = document.getElementById('orderSuccess');
      if (success) {
        success.style.display = 'block';
        var orderNum = 'SB-' + Date.now().toString().slice(-6);
        var el = success.querySelector('#orderNum');
        if (el) el.textContent = orderNum;
      }
    });
    checkoutForm.querySelectorAll('input, select').forEach(field => {
      field.addEventListener('input', () => {
        var group = field.closest('.form-group');
        if (field.value.trim()) { group?.classList.remove('invalid'); group?.classList.add('valid'); }
      });
    });
  }

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      var answer = q.nextElementSibling;
      var isOpen = q.classList.contains('open');
      document.querySelectorAll('.faq-question.open').forEach(oq => {
        oq.classList.remove('open');
        oq.nextElementSibling?.classList.remove('open');
      });
      if (!isOpen) { q.classList.add('open'); answer?.classList.add('open'); }
    });
  });

  // ── FAQ Search ──
  var faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', () => {
      var q = faqSearch.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        var text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  // ── Product Detail Accordion ──
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.addEventListener('click', () => {
      var body = h.nextElementSibling;
      var isOpen = h.classList.contains('open');
      document.querySelectorAll('.accordion-header.open').forEach(oh => {
        oh.classList.remove('open');
        oh.nextElementSibling?.classList.remove('open');
      });
      if (!isOpen) { h.classList.add('open'); body?.classList.add('open'); }
    });
  });

  // ── Leaflet Map (contact page) ──
  if (document.getElementById('contactMap') && typeof L !== 'undefined') {

    var map = L.map('contactMap').setView([3.1390, 101.6869], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Green Icon
    var greenIcon = L.divIcon({
      html: `<div style="background:#66714C;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(102,113,76,.5);">
              <i class="fa-solid fa-spa" style="color:#fff;font-size:14px;transform:rotate(45deg);"></i>
           </div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38]
    });

    // Pink Icon
    var pinkIcon = L.divIcon({
      html: `<div style="background:#C7898B;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(199,137,139,.5);">
              <i class="fa-solid fa-spa" style="color:#fff;font-size:14px;transform:rotate(45deg);"></i>
           </div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38]
    });

    // Gold Icon
    var goldIcon = L.divIcon({
      html: `<div style="background:#D4AF37;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px rgba(212,175,55,.5);">
              <i class="fa-solid fa-spa" style="color:#fff;font-size:14px;transform:rotate(45deg);"></i>
           </div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38]
    });

    // 1st Location
    L.marker([3.1390, 101.6869], { icon: greenIcon })
      .addTo(map)
      .bindPopup(`<b style="color:#66714C;font-family:'Cormorant Garamond',serif;font-size:16px;">SIMPLON Beauty</b><br>Headquarters - Kuala Lumpur<br><small>+60 123 456 789</small>`)
      .openPopup();

    // 2nd Location
    L.marker([3.1489, 101.7133], { icon: pinkIcon })
      .addTo(map)
      .bindPopup(`<b style="color:#C7898B;font-family:'Cormorant Garamond',serif;font-size:16px;">SIMPLON Beauty</b><br>Pavilion Kuala Lumpur<br><small>+60 123 456 789</small>`);

    // 3rd Location
    L.marker([3.1186, 101.6769], { icon: goldIcon })
      .addTo(map)
      .bindPopup(`<b style="color:#D4AF37;font-family:'Cormorant Garamond',serif;font-size:16px;">SIMPLON Beauty</b><br>Mid Valley Megamall<br><small>+60 123 456 789</small>`);

  }


  // ── Gallery Lightbox ──
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var lbClose = document.querySelector('.lb-close');
  var lbNext = document.querySelector('.lb-next');
  var lbPrev = document.querySelector('.lb-prev');
  let galleryImgs = [];
  let currentLbIdx = 0;

  document.querySelectorAll('.gallery-item[data-src]').forEach((item, i) => {
    galleryImgs.push(item.getAttribute('data-src'));
    item.addEventListener('click', () => openLightbox(i));
  });

  function openLightbox(idx) {
    currentLbIdx = idx;
    if (lbImg) lbImg.src = galleryImgs[idx];
    lightbox && lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() { lightbox && lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  if (lbNext) lbNext.addEventListener('click', () => { currentLbIdx = (currentLbIdx + 1) % galleryImgs.length; if (lbImg) lbImg.src = galleryImgs[currentLbIdx]; });
  if (lbPrev) lbPrev.addEventListener('click', () => { currentLbIdx = (currentLbIdx - 1 + galleryImgs.length) % galleryImgs.length; if (lbImg) lbImg.src = galleryImgs[currentLbIdx]; });

  // ── Gallery Tab Filter ──
  document.querySelectorAll('.gallery-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      var filter = tab.getAttribute('data-filter');
      document.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ── Home: Render Categories ──
  var catContainer = document.querySelector('.category-grid');
  if (catContainer) {
    var categories = [
      { title: "Hair Care", icon: "fa-solid fa-wand-magic-sparkles", desc: "Salon-grade haircare for strength & shine.", cat: "Hair Care", img: "./assets/img/keratin-shampoo.png" },
      { title: "Skin Care", icon: "fa-solid fa-droplet", desc: "Premium skincare for a radiant glow.", cat: "Skin Care", img: "./assets/img/care-set.png" },
      { title: "Make-Up Kits", icon: "fa-solid fa-palette", desc: "Professional makeup for every occasion.", cat: "Make-Up", img: "./assets/img/lipstick-kit.png" },
      { title: "Nail Care", icon: "fa-solid fa-hand-sparkles", desc: "Luxury nail colours with lasting shine.", cat: "Nail Care", img: "./assets/img/nail-kit.png" },
      { title: "Jewellery", icon: "fa-solid fa-gem", desc: "Elegant jewellery for every woman.", cat: "Jewellery", img: "./assets/img/elegant-set.png" },
      { title: "Wedding Kits", icon: "fa-solid fa-ring", desc: "Complete bridal beauty collection.", cat: "Wedding Kit", img: "./assets/img/bridal kit.png" },
      { title: "Upcoming", icon: "fa-solid fa-rocket", desc: "Exciting new launches coming soon.", cat: "Upcoming", img: "./assets/img/skin-cream.png" },
    ];
    catContainer.innerHTML = categories.map((c, i) => `
      <div class="category-card" data-aos="fade-up" data-aos-delay="${i * 80}">
        <div class="category-card-img">
          <img src="${c.img}" alt="${c.title}" loading="lazy">
        </div>
        <div class="category-card-body">
          <div class="category-icon-wrap"><i class="${c.icon}"></i></div>
          <h3>${c.title}</h3>
          <p>${c.desc}</p>
          <a href="products.html?cat=${encodeURIComponent(c.cat)}" class="category-link">
            Explore <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>`).join('');
  }

  // ── Home: Trending Products (from productsData) ──
  var trendingContainer = document.getElementById('trendingContainer');
  if (trendingContainer && typeof productsData !== 'undefined') {
    var trending = productsData.filter(p => !p.upcoming && p.rating >= 4.7).slice(0, 4);
    renderProducts(trending, 'trendingContainer');
  }

  // ── Home: Best Sellers ──
  var bestSellerContainer = document.getElementById('bestsellerContainer');
  if (bestSellerContainer && typeof productsData !== 'undefined') {
    var bestsellers = productsData.filter(p => p.badge === 'Best Seller').slice(0, 4);
    renderProducts(bestsellers, 'bestsellerContainer');
  }

  // ── Home: Testimonials (Swiper) ──
  var testimonials = [
    { name: "Emily Johnson", role: "Verified Customer", stars: 5, img: "./assets/img/facewash.png", text: "The skincare collection is absolutely amazing! My skin feels healthier and more radiant after using SIMPLON Beauty products for just 2 weeks." },
    { name: "Jessica Smith", role: "Beauty Enthusiast", stars: 5, img: "./assets/img/keratin-shampoo.png", text: "Excellent quality, beautiful packaging and fast delivery. The Keratin Shampoo transformed my hair. Highly recommended to everyone!" },
    { name: "Sophia Williams", role: "Makeup Artist", stars: 5, img: "./assets/img/rose-gold-serum.png", text: "Premium products with affordable prices. My favourite beauty store. The 24K Rose Gold Serum is worth every single penny!" },
    { name: "Amira Hassan", role: "Loyal Customer", stars: 5, img: "./assets/img/skin-care.png", text: "SIMPLON Beauty changed my skincare routine completely. I receive compliments every day. 10/10 would recommend!" },
    { name: "Priya Sharma", role: "Influencer", stars: 5, img: "./assets/img/hero5.png", text: "I've tried hundreds of beauty brands and SIMPLON is truly one of the best. Consistent quality and outstanding packaging." }
  ];
  var testimonialsWrapper = document.querySelector('.testimonial-swiper .swiper-wrapper');
  if (testimonialsWrapper) {
    testimonialsWrapper.innerHTML = testimonials.map(t => `
      <div class="swiper-slide">
        <div class="testimonial-card">
          <div class="testimonial-stars">${'<i class="fa-solid fa-star"></i>'.repeat(t.stars)}</div>
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author">
            <img src="${t.img}" alt="${t.name}">
            <div class="testimonial-author-info">
              <h4>${t.name}</h4>
              <span>${t.role}</span>
            </div>
          </div>
        </div>
      </div>`).join('');
    // Re-init Swiper after DOM insert
    if (typeof Swiper !== 'undefined') {
      new Swiper('.testimonial-swiper', {
        loop: true, autoplay: { delay: 5000 }, slidesPerView: 1, spaceBetween: 24,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }
      });
    }
  }

  // ── Home: Blog Cards ──
  var blogGrid = document.querySelector('.blog-grid');
  if (blogGrid) {
    var blogs = [
      { tag: "Skin Tips", img: "./assets/img/skin-care.png", title: "5-Step Morning Skincare Routine", desc: "Discover the perfect morning skincare routine for naturally healthy and glowing skin every day." },
      { tag: "Makeup", img: "./assets/img/bridal kit.png", title: "Top Makeup Trends for 2026", desc: "Stay ahead with the latest makeup styles loved by beauty experts and influencers worldwide." },
      { tag: "Hair Care", img: "./assets/img/hair care.png", title: "Professional Hair Care Tips", desc: "Expert tips to keep your hair healthy, silky smooth and strong all year round." }
    ];
    blogGrid.innerHTML = blogs.map((b, i) => `
      <div class="blog-card" data-aos="fade-up" data-aos-delay="${i * 100}">
        <div class="blog-img"><img src="${b.img}" alt="${b.title}" loading="lazy"></div>
        <div class="blog-body">
          <span class="blog-tag">${b.tag}</span>
          <h3>${b.title}</h3>
          <p>${b.desc}</p>
          <a href="#" class="blog-link">Read More <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>`).join('');
  }

  // ── Stats Counter Animation ──
  var statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    var stats = [
      { icon: "fa-solid fa-users", num: "50K+", title: "Happy Customers" },
      { icon: "fa-solid fa-box-open", num: "500+", title: "Beauty Products" },
      { icon: "fa-solid fa-earth-asia", num: "15+", title: "Countries Served" },
      { icon: "fa-solid fa-star", num: "99%", title: "Satisfaction Rate" }
    ];
    statsGrid.innerHTML = stats.map(s => `
      <div class="stat-card">
        <i class="${s.icon}"></i>
        <h2>${s.num}</h2>
        <h4>${s.title}</h4>
      </div>`).join('');
  }

  // ── Countdown Timer (Offer Section) ──
  function updateCountdown() {
    var target = new Date('2026-08-15T00:00:00');
    var now = new Date();
    var diff = target - now;
    if (diff <= 0) return;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var set = (id, val) => { var el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
    set('cntDays', d); set('cntHours', h); set('cntMins', m); set('cntSecs', s);
  }
  if (document.getElementById('cntDays')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ── Quick View modal close ──
  var qvModal = document.getElementById('quickViewModal');
  if (qvModal) {
    document.getElementById('qvClose')?.addEventListener('click', () => { qvModal.classList.remove('open'); document.body.style.overflow = ''; });
    qvModal.addEventListener('click', e => { if (e.target === qvModal) { qvModal.classList.remove('open'); document.body.style.overflow = ''; } });
  }

  // ── Update counts on load ──
  var cartData = JSON.parse(localStorage.getItem('beautyCart')) || [];
  var total = cartData.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);
  var wl = JSON.parse(localStorage.getItem('beautyWishlist')) || [];
  document.querySelectorAll('#wishlistCount').forEach(el => el.textContent = wl.length);

}); // end DOMContentLoaded
