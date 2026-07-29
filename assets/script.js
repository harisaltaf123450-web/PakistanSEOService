// assets/script.js
// Robust loader + interactions: mobile nav, testimonials, year, and reliable three.js hero init with retries and 2D fallback

// Simple script loader that returns a Promise
function loadScriptOnce(url, timeout) {
  timeout = timeout || 8000;
  return new Promise(function(resolve, reject){
    if(!url) return reject(new Error('No URL'));
    // if already loaded by another tag, resolve immediately
    var existing = Array.from(document.getElementsByTagName('script')).find(s => s.src && s.src.indexOf(url) !== -1);
    if(existing){
      // wait a tick for global to appear
      return setTimeout(function(){ resolve(existing); }, 50);
    }
    var s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.onload = function(){ resolve(s); };
    s.onerror = function(){ reject(new Error('Failed to load ' + url)); };
    document.head.appendChild(s);
    // timeout guard
    setTimeout(function(){ reject(new Error('Timeout loading ' + url)); }, timeout);
  });
}

// Try multiple CDN URLs in sequence until one loads and THREE is available
function loadThreeWithRetries(){
  if(typeof THREE !== 'undefined') return Promise.resolve(window.THREE);
  var cdns = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r146/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.min.js',
    'https://unpkg.com/three@0.146.0/build/three.min.js'
  ];
  var p = Promise.reject();
  cdns.forEach(function(url){
    p = p.catch(function(){ return loadScriptOnce(url, 8000); }).then(function(){
      if(typeof THREE !== 'undefined') return THREE;
      return Promise.reject(new Error('three did not initialize after loading ' + url));
    });
  });
  return p.catch(function(){ return Promise.reject(new Error('All three.js CDNs failed')); });
}

// Main DOM ready handler
document.addEventListener('DOMContentLoaded', function(){
  // Year
  var y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');
  if(toggle && nav){
    toggle.addEventListener('click', function(){ nav.classList.toggle('show'); });
  }

  // Testimonials carousel
  var wrap = document.getElementById('testimonialWrap');
  var next = document.getElementById('nextTest');
  var prev = document.getElementById('prevTest');
  if(wrap){
    var total = wrap.children.length || 1; var idx = 0;
    function show(i){ wrap.style.transform = 'translateX(' + (-i * 100) + '%)'; }
    if(next) next.addEventListener('click', function(){ idx = (idx + 1) % total; show(idx); });
    if(prev) prev.addEventListener('click', function(){ idx = (idx - 1 + total) % total; show(idx); });
  }

  // HERO initialization is handled by the robust loader already included in repo

  // Service cards animation: intersection observer + stagger
  try{
    var serviceCards = Array.from(document.querySelectorAll('.service-card'));
    if(serviceCards.length){
      serviceCards.forEach(function(el, i){ el.style.transitionDelay = (i * 70) + 'ms'; });
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.12 });
      serviceCards.forEach(function(el){ obs.observe(el); });
    }
  }catch(e){console.warn('Service animation failed', e)}

});
