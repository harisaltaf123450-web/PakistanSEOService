/**
 * Replace assets/script.js with a robust loader version
 * SHA for existing file: 3bdc18b3aa17435dca751dec45a85a120c1e9d02
 */

// Robust loader + interactions: mobile nav, testimonials, year, Leaflet map, and reliable three.js hero init with retries and 2D fallback

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

// Try to ensure Leaflet is available (only if needed)
function ensureLeaflet(){
  return new Promise(function(resolve){
    if(typeof L !== 'undefined') return resolve(L);
    // Leaflet script may already be in page via CDN; try to load common CDN as fallback
    loadScriptOnce('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 8000).then(function(){ resolve(window.L); }).catch(function(){ console.warn('Leaflet load failed'); resolve(null); });
  });
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

  // Initialize Leaflet map (if container exists)
  (function initMap(){
    var mapEl = document.getElementById('leafletMap');
    if(!mapEl) return;
    ensureLeaflet().then(function(Llib){
      if(!Llib){ console.warn('Leaflet unavailable'); return; }
      try{
        var map = Llib.map('leafletMap').setView([30.3629572,68.9966984], 15);
        Llib.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
        var marker = Llib.marker([30.3629572,68.9966984]).addTo(map);
        marker.bindPopup('<b>Pakistan SEO Service</b><br><a target="_blank" href="https://www.google.com/maps/place/Pakistan+SEO+Service/@29.9325502,58.3706063,5z/data=!3m1!4b1!4m6!3m5!1s0x6d7d29deda83d9a3:0x9722da5bf4b4a771!8m2!3d30.3629572!4d68.9966984!16s%2Fg%2F11zd8bsdzl?entry=ttu&g_ep=EgoyMDI2MDcyNi4wIKXMDSoASAFQAw%3D%3D">Open in Google Maps</a>');
      }catch(e){console.warn('Leaflet init failed', e);}
    });
  })();

  // HERO: attempt to load three.js reliably then init 3D; fallback to 2D if not available
  (function initHeroRobust(){
    var wrap = document.getElementById('heroCanvasWrap');
    var canvas = document.getElementById('heroCanvas');
    if(!wrap || !canvas){ console.warn('Hero canvas or wrapper missing'); return; }

    // ensure wrapper has visible height
    if(!wrap.style.height) wrap.style.height = '400px';

    function run2Dfallback(color){
      // simple 2D particles animation
      try{
        var ctx = canvas.getContext('2d'); if(!ctx) throw new Error('2d ctx unavailable');
        var dpr = window.devicePixelRatio || 1;
        function resize(){
          var w = Math.max(300, wrap.clientWidth || window.innerWidth);
          var h = Math.max(240, parseInt(window.getComputedStyle(wrap).height,10) || 400);
          canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
          canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; ctx.setTransform(dpr,0,0,dpr,0,0);
        }
        resize();
        var particles = [], pCount = 140;
        for(var i=0;i<pCount;i++) particles.push({ x: Math.random()*canvas.width/dpr, y: Math.random()*canvas.height/dpr, vx:(Math.random()-0.5)*0.6, vy:(Math.random()-0.5)*0.6, r:1+Math.random()*3 });
        function tick(){
          var w = canvas.width/dpr, h = canvas.height/dpr; ctx.clearRect(0,0,w,h); ctx.fillStyle = color||'rgba(10,143,122,0.9)';
          for(var i=0;i<pCount;i++){ var p=particles[i]; p.x+=p.vx; p.y+=p.vy; if(p.x<-10)p.x=w+10; if(p.x>w+10)p.x=-10; if(p.y<-10)p.y=h+10; if(p.y>h+10)p.y=-10; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
          requestAnimationFrame(tick);
        }
        window.addEventListener('resize', resize);
        tick();
        // bring content above
        canvas.style.zIndex = 0; var nodes = wrap.querySelectorAll('.hero-copy, .hero-media'); nodes.forEach(function(n){ n.style.position='relative'; n.style.zIndex=2; });
      }catch(e){ console.warn('2D fallback failed', e); wrap.classList.add('hero-fallback'); }
    }

    // Try to load three.js with retries, then init 3D
    loadThreeWithRetries().then(function(Three){
      // double-check WebGL
      var glOk = (function(){ try{ return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl')); }catch(e){ return false; } })();
      if(!glOk){ console.warn('WebGL not available — using 2D fallback'); run2Dfallback(); return; }

      try{
        var dpr = window.devicePixelRatio || 1;
        var w = Math.max(300, wrap.clientWidth || window.innerWidth);
        var h = Math.max(240, parseInt(window.getComputedStyle(wrap).height,10) || 400);
        var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true, antialias:true});
        renderer.setPixelRatio(dpr); renderer.setSize(w,h);
        var scene = new THREE.Scene(); var camera = new THREE.PerspectiveCamera(60, w/h, 1, 2000); camera.position.z = 200;

        var geometry = new THREE.BufferGeometry(); var count = 700; var positions = new Float32Array(count*3);
        for(var i=0;i<count;i++){ positions[i*3+0]=(Math.random()-0.5)*1000; positions[i*3+1]=(Math.random()-0.5)*450; positions[i*3+2]=(Math.random()-0.5)*1000; }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
        var material = new THREE.PointsMaterial({color:0x0a8f7a, size:3 * dpr, opacity:0.95});
        var points = new THREE.Points(geometry, material); scene.add(points);

        var light = new THREE.DirectionalLight(0xffffff, 0.35); light.position.set(0,1,1); scene.add(light);

        function animate(){ requestAnimationFrame(animate); points.rotation.y += 0.0015; points.rotation.x += 0.0007; renderer.render(scene, camera); }
        function onResize(){ var W = Math.max(300, wrap.clientWidth || window.innerWidth); var H = Math.max(240, parseInt(window.getComputedStyle(wrap).height,10) || 400); renderer.setSize(W,H,false); camera.aspect = W/H; camera.updateProjectionMatrix(); }
        onResize(); animate(); window.addEventListener('resize', onResize);

        // content above canvas
        canvas.style.zIndex = 0; var nodes = wrap.querySelectorAll('.hero-copy, .hero-media'); nodes.forEach(function(n){ n.style.position='relative'; n.style.zIndex=2; });
      }catch(err){ console.warn('three.js hero init failed, falling back to 2D', err); run2Dfallback(); }
    }).catch(function(err){ console.warn('three.js failed to load or initialize:', err); run2Dfallback(); });

  })();

});
