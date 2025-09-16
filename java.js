      /*********************** Data ************************/
      const CATEGORIES = ['Fruits & Veggies','Grains & Pulses','Home & Reuse'];
      const PRODUCTS = [
        {id:'apple',name:'Organic Apples',price:50,img:'photos/fruit/apple.jpg',cat:'Fruits & Veggies',unit:'/kg',desc:'Crisp, sweet apples sourced from local farms. 100% chemical-free.'},
        {id:'banana',name:'Fresh Bananas',price:1.99,img:'photos/fruit/bananas.jpg',cat:'Fruits & Veggies',unit:'/dozen',desc:'Naturally sweet bananas, great for smoothies & snacks.'},
        {id:'carrot',name:'Organic Carrots',price:2.49,img:'photos/fruit/carrots.jpg',cat:'Fruits & Veggies',unit:'/kg',desc:'Crunchy and fresh orange carrots packed with beta-carotene.'},
        {id:'tomato',name:'Cherry Tomatoes',price:3.29,img:'photos/fruit/tomatoes.jpg',cat:'Fruits & Veggies',unit:'/500g',desc:'Juicy cherry tomatoes perfect for salads and cooking.'},
        {id:'potato',name:'Baby Potatoes',price:1.79,img:'photos/fruit/potato.jpg',cat:'Fruits & Veggies',unit:'/kg',desc:'Fresh baby potatoes, great for roasting and curries.'},
        {id:'spinach',name:'Fresh Spinach',price:1.29,img:'photos/fruit/spinach.jpg',cat:'Fruits & Veggies',unit:'/250g',desc:'Iron-rich spinach leaves, washed and ready to cook.'},

        {id:'rice',name:'Bulk Rice',price:3.49,img:'photos/Pulses/rice.jpg',cat:'Grains & Pulses',unit:'/kg',desc:'High-quality bulk white rice. Bring your own container to refill!'},
        {id:'lentils',name:'Organic Lentils',price:2.19,img:'photos/Pulses/lentils.jpg',cat:'Grains & Pulses',unit:'/100g',desc:'Protein-rich red lentils. Cook fast, taste amazing.'},
        {id:'oats',name:'Rolled Oats',price:1.49,img:'photos/Pulses/oats.jpg',cat:'Grains & Pulses',unit:'/100g',desc:'Hearty wholegrain oats—perfect for breakfast bowls.'},
        {id:'quinoa',name:'Organic Quinoa',price:4.49,img:'photos/Pulses/j.jpg',cat:'Grains & Pulses',unit:'/250g',desc:'Gluten-free quinoa packed with protein and fiber.'},
        {id:'barley',name:'Pearl Barley',price:2.99,img:'photos/Pulses/k.jpg',cat:'Grains & Pulses',unit:'/500g',desc:'Wholesome pearl barley for soups and salads.'},
        {id:'beans',name:'Kidney Beans',price:3.29,img:'photos/Pulses/t.jpg',cat:'Grains & Pulses',unit:'/500g',desc:'Protein-rich kidney beans, great for stews and chili.'},

        {id:'bag',name:'Reusable Cotton Bag',price:2.99,img:'photos/Home/bag.jpg',cat:'Home & Reuse',unit:'',desc:'Durable cotton tote for everyday, zero-plastic shopping.'},
        {id:'soap',name:'Eco Dish Soap Bar',price:3.99,img:'photos/Home/soap.jpg',cat:'Home & Reuse',unit:'',desc:'Zero-plastic solid dish soap bar. Gentle on skin, tough on grease.'},
        {id:'shampoo',name:'Herbal Shampoo Refill',price:6.49,img:'photos/Home/sam.jpg',cat:'Home & Reuse',unit:'/500ml',desc:'Plant-based shampoo with natural fragrance, refill and save plastic.'},
        {id:'toothpaste',name:'Zero Waste Toothpaste',price:4.49,img:'photos/Home/pest.jpg',cat:'Home & Reuse',unit:'',desc:'Plastic-free toothpaste tablets with fluoride. 120 tablets per jar.'},
        {id:'bamboo-brush',name:'Bamboo Toothbrush',price:1.99,img:'photos/Home/tooth.jpg',cat:'Home & Reuse',unit:'',desc:'Eco-friendly bamboo toothbrush with soft bristles. 100% biodegradable handle.'},
        {id:'straws',name:'Metal Straws (Set of 4)',price:3.49,img:'photos/Home/strow.jpg',cat:'Home & Reuse',unit:'',desc:'Reusable stainless steel straws with cleaning brush. Say no to single-use plastic.'}
      ];

      /********************* Utilities *********************/
      const $ = (sel, root=document)=>root.querySelector(sel);
      const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
      const money = n => `$${n.toFixed(2)}`;
      const go = hash => { location.hash = hash };
      const setQuery = v => { state.query = (v||'').trim(); go('#/shop') };

      /*********************** State ***********************/
      const state = {
        cart: JSON.parse(localStorage.getItem('zwm_cart')||'[]'),
        query:'', cat:'All'
      };

      function saveCart(){ localStorage.setItem('zwm_cart', JSON.stringify(state.cart)); updateCartCount(); }
      function updateCartCount(){ const el=$('#cart-count'); if(el) el.textContent = state.cart.reduce((a,i)=>a+i.qty,0); }

      /********************* Cart Logic ********************/
      function addToCart(id, qty=1){ const p=PRODUCTS.find(x=>x.id===id); if(!p) return; const existing=state.cart.find(x=>x.id===id); if(existing){ existing.qty+=qty } else { state.cart.push({id,qty}) } saveCart(); flash(`Added ${p.name}`) }
      function setQty(id, qty){ const item=state.cart.find(x=>x.id===id); if(!item) return; item.qty = Math.max(1, qty); saveCart(); if(location.hash==='#/cart') renderCart(); }
      function removeFromCart(id){ state.cart = state.cart.filter(x=>x.id!==id); saveCart(); if(location.hash==='#/cart') renderCart(); }
      function cartTotal(){ return state.cart.reduce((sum,item)=>{ const p=PRODUCTS.find(x=>x.id===item.id); return sum + (p?.price||0) * item.qty },0) }

      /********************** Router **********************/
      window.addEventListener('hashchange', route); window.addEventListener('load', ()=>{ updateCartCount(); startHeroRotation(); route(); loadContactLog(); });
      function route(){ const hash = location.hash||'#/home'; if(hash.startsWith('#/shop')) return renderShop(); if(hash.startsWith('#/cart')) return renderCart(); if(hash.startsWith('#/checkout')) return renderCheckout(); if(hash.startsWith('#/contact')) return renderContact(); if(hash.startsWith('#/sustainability')) return renderSustainability(); return renderHome(); }

      /********************** Hero images (rotate) **********************/
      const HERO_IMAGES = ['back.jpg','back(1).jpg','back(3).jpg','back(4).jpg','back(5).jpg','back(6).jpg'];
      let heroIndex = 0; let heroTimer = null;
      function startHeroRotation(){ const el = document.querySelector('.hero'); if(!el) return; if(heroTimer) clearInterval(heroTimer); heroTimer = setInterval(()=>{ heroIndex = (heroIndex+1) % HERO_IMAGES.length; el.style.backgroundImage = `url(${HERO_IMAGES[heroIndex]})`; }, 3500); }

      /********************** Views ************************/
      function renderHome(){ document.getElementById('app').innerHTML = `
        <section class="hero card" style="background-image:url('${HERO_IMAGES[0]}'); background-size:cover; background-position:center">
          <div class="overlay"></div>
          <div class="container">
            <h1>Join the Zero‑Waste Revolution</h1>
            <p>Shop sustainable, plastic‑free essentials. Local. Organic. Refillable.</p>
            <div class="flex center" style="justify-content:center;margin-top:10px">
              <button class="cta" onclick="go('#/shop')">Shop Now</button>
              <button class="btn ghost" onclick="openCreatorVision()">Learn More</button>
            </div>
          </div>
        </section>

        <section class="container grid grid-3" style="margin-top:22px">
          ${[
            { img: 'E.jpg', title: 'Sustainable Products', text: 'Locally sourced & organic to reduce waste.' },
            { img: 'R.jpg', title: 'Eco‑Friendly Packaging', text: 'Biodegradable or reusable materials only.' },
            { img: 'S.jpg', title: 'Community Impact', text: 'We support local farmers & makers.' }
          ].map(v=>`
            <div class="card p16">
              <img src="${v.img}" alt="${v.title}" onerror="this.style.display='none'" />
              <div class="p16">
                <h3>${v.title}</h3>
                <p class="muted">${v.text}</p>
              </div>
            </div>
          `).join('')}
        </section>
      `; startHeroRotation(); }

      function renderShop(){
        const list = PRODUCTS.filter(p => (state.cat==='All' || p.cat===state.cat)).filter(p => state.query==='' || p.name.toLowerCase().includes(state.query.toLowerCase()));
        document.getElementById('app').innerHTML = `
          <section class="container">
            <div class="card p16" style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between">
              <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                <span class="tag">${list.length} products</span>
                <select onchange="state.cat=this.value; route()">
                  <option ${state.cat==='All'?'selected':''}>All</option>
                  ${CATEGORIES.map(c=>`<option ${state.cat===c?'selected':''}>${c}</option>`).join('')}
                </select>
              </div>
              <div style="display:flex;gap:8px">
                <input id="q2" type="search" placeholder="Search…" value="${state.query}" onkeydown="if(event.key==='Enter'){setQuery(this.value)}" />
                <button class="btn ghost" onclick="setQuery(document.getElementById('q2').value)">Search</button>
              </div>
            </div>

            <div class="grid grid-3">
              ${list.map(p=>productCard(p)).join('')}
            </div>
          </section>
        `;
      }

      function productCard(p){
        return `
          <div class="card product">
            <div class="imgwrap">
              <img src="${p.img||'https://via.placeholder.com/400x300?text='+encodeURIComponent(p.name)}" alt="${p.name}" onerror="this.parentElement.style.background='#e5e7eb'" />
            </div>
            <div class="p16">
              <h3>${p.name}</h3>
              <p class="muted">${p.cat} ${p.unit}</p>
              <div class="row" style="margin-top:8px">
                <span class="price">${money(p.price)}</span>
                <div style="display:flex;gap:8px;align-items:center">
                  <button class="btn" onclick="addToCart('${p.id}',1)">Add to Cart</button>
                  <button class="btn secondary" onclick="openProduct('${p.id}')">View</button>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      function openProduct(id){ const p = PRODUCTS.find(x=>x.id===id); if(!p) return; const html = `
        <div class="grid" style="grid-template-columns:1.2fr 1fr;gap:0">
          <div class="p20" style="background:#f9fafb">
            <img src="${p.img||'https://via.placeholder.com/800x600?text='+encodeURIComponent(p.name)}" alt="${p.name}" />
          </div>
          <div class="p20">
            <h2 style="margin:0 0 6px">${p.name}</h2>
            <div class="muted" style="margin-bottom:10px">${p.cat} ${p.unit}</div>
            <div class="price" style="font-size:24px;margin-bottom:12px">${money(p.price)}</div>
            <p style="margin-bottom:16px">${p.desc}</p>
            <div class="row">
              <div class="qty">
                <button onclick="stepQty(-1)">–</button>
                <span id="modal-qty">1</span>
                <button onclick="stepQty(1)">+</button>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn" onclick="addToCart('${p.id}', getModalQty()); closeModal()">Add to Cart</button>
                <button class="btn ghost" onclick="closeModal()">Close</button>
              </div>
            </div>
          </div>
        </div>
      `; $('#product-modal-body').innerHTML = html; $('#product-modal').classList.add('open'); }
      function getModalQty(){ return parseInt($('#modal-qty')?.textContent)||1 }
      function stepQty(n){ const v = Math.max(1, getModalQty()+n); $('#modal-qty').textContent = v }
      function closeModal(){ $('#product-modal').classList.remove('open') }

      function renderCart(){ if(state.cart.length===0){ document.getElementById('app').innerHTML = `
        <section class="container card p20 center">
          <h2>Your cart is empty</h2>
          <p class="muted">Find sustainable goodies in our shop.</p>
          <button class="btn" onclick="go('#/shop')">Browse Products</button>
        </section>
      `; return }

        const rows = state.cart.map(item=>{ const p = PRODUCTS.find(x=>x.id===item.id); return `
          <tr>
            <td style="display:flex;gap:12px;align-items:center">
              <img src="${p.img||'https://via.placeholder.com/120x90?text='+encodeURIComponent(p.name)}" alt="${p.name}" style="width:64px;height:48px;object-fit:cover;border-radius:8px" />
              <div>
                <div>${p.name}</div>
                <div class="muted small">${p.cat}</div>
              </div>
            </td>
            <td>${money(p.price)}</td>
            <td>
              <div class="qty">
                <button onclick="setQty('${item.id}', ${item.qty - 1})">–</button>
                <span>${item.qty}</span>
                <button onclick="setQty('${item.id}', ${item.qty + 1})">+</button>
              </div>
            </td>
            <td>${money(p.price * item.qty)}</td>
            <td><button class="btn ghost" onclick="removeFromCart('${item.id}')">Remove</button></td>
          </tr>
        ` }).join('');

        const subtotal = cartTotal(); const shipping = subtotal>25?0:2.99; const total = subtotal + shipping;
        document.getElementById('app').innerHTML = `
          <section class="container grid grid-2">
            <div class="card p20">
              <h2 style="margin-top:0">Cart</h2>
              <div style="overflow:auto">
                <table>
                  <thead>
                    <tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>
            </div>
            <div class="card p20">
              <h3>Order Summary</h3>
              <div style="display:flex;justify-content:space-between"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
              <div style="display:flex;justify-content:space-between"><span>Shipping</span><strong>${shipping?money(shipping):'Free'}</strong></div>
              <hr style="margin:12px 0;border:0;border-top:1px solid #e5e7eb" />
              <div style="display:flex;justify-content:space-between;font-size:18px"><span>Total</span><strong>${money(total)}</strong></div>
              <button class="btn" style="width:100%;margin-top:12px" onclick="go('#/checkout')">Proceed to Checkout</button>
              <button class="btn ghost" style="width:100%;margin-top:8px" onclick="go('#/shop')">Continue Shopping</button>
            </div>
          </section>
        `;
      }

      function renderCheckout(){ const subtotal = cartTotal(); const shipping = subtotal>25?0:2.99; const total = subtotal + shipping; document.getElementById('app').innerHTML = `
        <section class="container grid grid-2">
          <form class="card p20" onsubmit="placeOrder(event)">
            <h2 style="margin-top:0">Delivery Details</h2>
            <label>Full Name<input required name="name" placeholder="Your full name" /></label>
            <label>Phone<input required name="phone" placeholder="10-digit phone" pattern="\\d{10}" /></label>
            <label>Email<input type="email" required name="email" placeholder="you@example.com" /></label>
            <label>Address<textarea required name="addr" placeholder="House, Street, Area, City, PIN" rows="4"></textarea></label>
            <label>Notes (optional)<textarea name="notes" rows="3" placeholder="Any delivery notes"></textarea></label>

            <h3 style="margin:8px 0 12px">Payment</h3>
            <label><input type="radio" name="pay" value="cod" checked /> Cash on Delivery</label>
            <label><input type="radio" name="pay" value="card" /> Credit/Debit Card (Demo)</label>
            <button class="btn" style="margin-top:12px">Place Order</button>
          </form>

          <div class="card p20">
            <h3>Summary</h3>
            <p class="muted">${state.cart.length} items in cart</p>
            <div style="display:flex;justify-content:space-between"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
            <div style="display:flex;justify-content:space-between"><span>Shipping</span><strong>${shipping?money(shipping):'Free'}</strong></div>
            <hr style="margin:12px 0;border:0;border-top:1px solid #e5e7eb" />
            <div style="display:flex;justify-content:space-between;font-size:18px"><span>Total</span><strong>${money(total)}</strong></div>
            <div style="margin-top:12px">
              ${state.cart.map(ci=>{ const p=PRODUCTS.find(x=>x.id===ci.id); return `<div class="row" style="margin:6px 0"><span>${p.name} × ${ci.qty}</span><span>${money(p.price * ci.qty)}</span></div>` }).join('')}
            </div>
          </div>
        </section>
      ` }

      /* ---------------- Sustainability (add a local log + BYOC discount toggle) ---------------- */
      function renderSustainability(){ const byoc = localStorage.getItem('zwm_byoc')==='1'; document.getElementById('app').innerHTML = `
        <section class="container card p20">
          <h2 style="margin-top:0">Our Sustainability Commitment</h2>
          <p>We are committed to zero-plastic operations, refill culture, and local sourcing. <strong>Bring-your-own-container (BYOC)</strong> gets a 5% discount at checkout!</p>
          <div style="display:flex;gap:12px;align-items:center;margin-top:12px">
            <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="byoc-toggle" ${byoc?'checked':''} onchange="toggleBYOC(this.checked)" /> Apply BYOC discount</label>
            <button class="btn ghost" onclick="viewSustainabilityLog()">View Sustainability Log</button>
          </div>
          <div style="margin-top:16px">
            <ul>
              <li>Compostable or reusable packaging only</li>
              <li>Local farmer partnerships to reduce transport emissions</li>
              <li>Bulk refill for grains, pulses, and cleaning supplies</li>
            </ul>
          </div>
        </section>
      ` }

      function toggleBYOC(val){ localStorage.setItem('zwm_byoc', val? '1':'0'); flash(val? 'BYOC discount enabled' : 'BYOC discount disabled') }

      /* ---------------- Contact + log ---------------- */
      function renderContact(){ document.getElementById('app').innerHTML = `
        <section class="container grid grid-2">
          <div class="card p20">
            <h2 style="margin-top:0">Contact Us</h2>
            <form onsubmit="submitContact(event)">
              <label>Your Name<input required name="name" /></label>
              <label>Your Email<input type="email" required name="email" /></label>
              <label>Message<textarea required name="msg" rows="4"></textarea></label>
              <div style="display:flex;gap:8px;margin-top:8px">
                <button class="btn">Send</button>
                <button type="button" class="btn ghost" onclick="openContactLog()">Open Messages</button>
              </div>
            </form>
          </div>
          <div class="card p20">
            <h3>Store Address</h3>
            <p class="muted">123 Green Street, Eco Nagar, Ahmedabad 380001</p>
            <div class="tag" style="margin-top:6px">Open: 9:00 AM – 8:00 PM</div>
            <div style="height:14px"></div>
            <img src="logo.png" alt="Map" onerror="this.style.display='none'" />
          </div>
        </section>
      ` }

      function submitContact(e){ e.preventDefault(); const fd = new FormData(e.target); const payload = Object.fromEntries(fd.entries()); saveContactMessage(payload); flash('Thanks! We will get back to you.'); go('#/home') }

      function saveContactMessage(msg){ const key = 'zwm_contacts'; const arr = JSON.parse(localStorage.getItem(key)||'[]'); arr.unshift({...msg, when:new Date().toISOString()}); localStorage.setItem(key, JSON.stringify(arr)); }

      function openContactLog(){ const arr = JSON.parse(localStorage.getItem('zwm_contacts')||'[]'); if(arr.length===0){ alert('No messages yet'); return } let html = 'Messages:\n\n'; arr.forEach(m=> html += `${new Date(m.when).toLocaleString()} - ${m.name} <${m.email}>\n${m.msg}\n\n`); alert(html) }

      function loadContactLog(){ /* noop for now, just ensures localStorage exists */ if(!localStorage.getItem('zwm_contacts')) localStorage.setItem('zwm_contacts','[]') }

      function viewSustainabilityLog(){ const key='zwm_sustain_log'; const arr = JSON.parse(localStorage.getItem(key)||'[]'); if(arr.length===0) return alert('No sustainability events logged yet'); let text='Sustainability Log:\n\n'; arr.forEach(i=> text+= `${new Date(i.when).toLocaleString()} - ${i.msg}\n`); alert(text) }

      /* ---------------- Order & confirmation ---------------- */
      function placeOrder(e){ e.preventDefault(); const fd = new FormData(e.target); const order = { when:new Date().toISOString(), customer:Object.fromEntries(fd.entries()), items: state.cart.map(ci=>({id:ci.id,qty:ci.qty})), total: cartTotal() }; localStorage.setItem('zwm_last_order', JSON.stringify(order)); state.cart = []; saveCart(); document.getElementById('app').innerHTML = `
        <section class="container card p20 center">
          <h2>Thank you! 🎉</h2>
          <p>Your order has been placed. A confirmation mail will be sent to <strong>${order.customer.email || 'your email'}</strong>.</p>
          <button class="btn" onclick="go('#/shop')">Continue Shopping</button>
        </section>
      ` }

      /* ---------------- Flash ---------------- */
      function flash(text){ const n = document.createElement('div'); n.textContent = text; n.style.position='fixed'; n.style.bottom='20px'; n.style.right='20px'; n.style.background='#111827'; n.style.color='#fff'; n.style.padding='10px 14px'; n.style.borderRadius='10px'; n.style.boxShadow='0 10px 30px rgba(0,0,0,.25)'; document.body.appendChild(n); setTimeout(()=>n.remove(),1600) }

      /* ---------------- Creator vision modal (improved) ---------------- */
      function openCreatorVision(){ const html = `
        <div style="padding:22px">
          <h2>Creator Vision</h2>
          <p class="muted">Our mission is to make sustainable shopping mainstream — refill, reuse and support local makers.</p>
          <ul>
            <li>Zero-plastic policy in packaging</li>
            <li>Local-first sourcing to cut emissions</li>
            <li>Education and community programs</li>
          </ul>
          <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
            <button class="btn" onclick="logSustainabilityEvent()">Log a sustainability event</button>
            <button class="btn ghost" onclick="closeModal()">Close</button>
          </div>
        </div>
      `; $('#product-modal-body').innerHTML = html; $('#product-modal').classList.add('open') }

      function logSustainabilityEvent(){ const key='zwm_sustain_log'; const arr = JSON.parse(localStorage.getItem(key)||'[]'); arr.unshift({when:new Date().toISOString(), msg:'Creator vision acknowledged'}); localStorage.setItem(key, JSON.stringify(arr)); flash('Logged sustainability event'); }

      /* ---------------- Misc helpers ---------------- */
      function updateCartCount(){ const el = document.getElementById('cart-count'); if(el) el.textContent = state.cart.reduce((a,i)=>a+i.qty,0) }
