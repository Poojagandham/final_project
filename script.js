
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  
  $('#year').textContent = new Date().getFullYear();

  
  const menuBtn = $('#menu-toggle');
  const navList = $('#nav-list');
  menuBtn.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  
  const links = $$('.nav-links a');
  const sections = $$('.section');

  function showSection(id, push=true){
    sections.forEach(s => s.classList.add('hidden'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');

    links.forEach(a => a.classList.toggle('active', a.dataset.target === id));

    
    navList.classList.remove('show');
    menuBtn.setAttribute('aria-expanded','false');

    
    const heading = el?.querySelector('h1, h2');
    if (heading) { heading.tabIndex = -1; heading.focus(); }

    
    if (push) history.pushState({section:id}, '', '#' + id);
  }

  
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.dataset.target;
      showSection(target, true);
    });
  });

  
  const initial = location.hash?.replace('#','') || 'home';
  
  history.replaceState({section: initial}, '', '#' + initial);
  showSection(initial, false);

  
  window.addEventListener('popstate', (e) => {
    const id = (e.state && e.state.section) || location.hash.replace('#','') || 'home';
    showSection(id, false);
  });

  $('#contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent. Thank you!');
    e.target.reset();
  });

  
  const TASK_KEY = 'portfolio.todo.v1';
  let tasks = JSON.parse(localStorage.getItem(TASK_KEY) || '[]');
  const taskInput = $('#taskInput');
  const taskList = $('#taskList');
  const addBtn = $('#addTaskBtn');

  function renderTasks(){
    if(!taskList) return;
    taskList.innerHTML = '';
    tasks.forEach((t, idx) => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.innerHTML = `<span>${escapeHtml(t)}</span>`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Delete';
      btn.addEventListener('click', () => {
        tasks.splice(idx,1);
        localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
        renderTasks();
      });
      li.appendChild(btn);
      taskList.appendChild(li);
    });
  }

  function addTask(){
    const v = (taskInput.value || '').trim();
    if(!v) { taskInput.focus(); return; }
    tasks.push(v);
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    taskInput.value = '';
    renderTasks();
  }

  addBtn?.addEventListener('click', addTask);
  taskInput?.addEventListener('keydown', (e) => { if(e.key === 'Enter') addTask(); });
  renderTasks();


  const PRODUCTS = [
    { name:'Smartphone', category:'electronics', price:19999, rating:4.5 },
    { name:'Headphones', category:'electronics', price:2499,  rating:4.1 },
    { name:'Smartwatch', category:'electronics', price:4999,  rating:4.3 },
    { name:'T-Shirt',    category:'fashion',     price:599,   rating:4.0 },
    { name:'Jeans',      category:'fashion',     price:1299,  rating:4.2 }
  ];

  const productList = $('#productList');
  function drawProducts(list){
    if(!productList) return;
    productList.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `<h3>${escapeHtml(p.name)}</h3>
        <p>Category: <strong>${escapeHtml(p.category)}</strong></p>
        <p>Price: ₹${p.price.toLocaleString('en-IN')}</p>
        <p>Rating: ${p.rating}</p>`;
      productList.appendChild(card);
    });
  }
  drawProducts(PRODUCTS);

  $('#applyFilter')?.addEventListener('click', () => {
    const cat  = $('#categoryFilter').value;
    const sort = $('#sortOption').value;
    let list = PRODUCTS.filter(p => cat === 'all' ? true : p.category === cat);
    if(sort === 'priceLow') list.sort((a,b)=>a.price-b.price);
    if(sort === 'priceHigh') list.sort((a,b)=>b.price-a.price);
    if(sort === 'rating') list.sort((a,b)=>b.rating-a.rating);
    drawProducts(list);
  });

  
  const lazyImgs = $$('.lazy');
  if ('IntersectionObserver' in window && lazyImgs.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) { img.src = src; img.classList.remove('lazy'); }
          io.unobserve(img);
        }
      });
    }, { rootMargin:'200px 0px' });
    lazyImgs.forEach(img => io.observe(img));
  } else {
    lazyImgs.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy'); });
  }

  
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
});
