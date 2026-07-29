// assets/script.js (updated)
// Improved hero initialization: robust three.js setup with sizing fixes and a 2D/canvas fallback when WebGL is unavailable.

document.addEventListener('DOMContentLoaded', function(){
  // Year
  var y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      nav.classList.toggle('show');
    });
  }

  // Simple testimonial carousel
  var wrap = document.getElementById('testimonialWrap');
  var next = document.getElementById('nextTest');
  var prev = document.getElementById('prevTest');
  if(wrap){
    var total = wrap.children.length; var idx = 0;
    function show(i){
      wrap.style.transform = 'translateX(' + (-i * 100) + '%)';
    }
    if(next) next.addEventListener('click', function(){ idx = (idx + 1) % total; show(idx); });
    if(prev) prev.addEventListener('click', function(){ idx = (idx - 1 + total) % total; show(idx); });
  }

  // Initialize Leaflet map (fallback to OpenStreetMap so no API key needed)
  try{
    var mapEl = document.getElementById('leafletMap');
    if(mapEl && typeof L !== 'undefined'){
      var map = L.map('leafletMap').setView([30.3629572,68.9966984], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      var marker = L.marker([30.3629572,68.9966984]).addTo(map);
      marker.bindPopup('<b>Pakistan SEO Service</b><br><a target="_blank" href="https://www.google.com/maps/place/Pakistan+SEO+Service/@29.9325502,58.3706063,5z/data=!3m1!4b1!4m6!3m5!1s0x6d7d29deda83d9a3:0x9722da5bf4b4a771!8m2!3d30.3629572!4d68.9966984!16s%2Fg%2F11zd8bsdzl?entry=ttu&g_ep=EgoyMDI2MDcyNi4wIKXMDSoASAFQAw%3D%3D">Open in Google Maps</a>');
    }
  }catch(e){console.warn('Leaflet init failed',e)}

  // HERO: three.js particles with robust sizing and fallback
  (function initHero(){
    var wrap = document.getElementById('heroCanvasWrap');
    var canvas = document.getElementById('heroCanvas');
    if(!wrap || !canvas) return;

    // Ensure visible height on load
    if(!wrap.style.height) wrap.style.height = '400px';

    var dpr = window.devicePixelRatio || 1;

    // Helper to size canvas and renderer
    function sizeCanvas(renderer){
      var w = Math.max(300, wrap.clientWidth || window.innerWidth);
      var h = Math.max(240, parseInt(window.getComputedStyle(wrap).height,10) || 400);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      if(renderer && renderer.setSize) renderer.setSize(w, h, false);
    }

    // Check for three.js and WebGL support
    var hasThree = (typeof THREE !== 'undefined');
    var webglAvailable = (function(){
      try{
        var test = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!test;
      }catch(e){ return false; }
    })();

    if(hasThree && webglAvailable){
      try{
        var width = Math.max(300, wrap.clientWidth || window.innerWidth);
        var height = Math.max(240, parseInt(window.getComputedStyle(wrap).height,10) || 400);

        var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true, antialias:true});
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, width/height, 1, 2000);
        camera.position.z = 200;

        // create particle cloud
        var geometry = new THREE.BufferGeometry();
        var count = 600;
        var positions = new Float32Array(count * 3);
        for(var i=0;i<count;i++){
          positions[i*3+0] = (Math.random() - 0.5) * 900;
          positions[i*3+1] = (Math.random() - 0.5) * 400;
          positions[i*3+2] = (Math.random() - 0.5) * 900;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        var material = new THREE.PointsMaterial({color:0x0a8f7a, size:3 * dpr, opacity:0.9});
        var points = new THREE.Points(geometry, material);
        scene.add(points);

        // lighting subtle
        var light = new THREE.DirectionalLight(0xffffff, 0.4);
        light.position.set(0,1,1);
        scene.add(light);

        function animate(){
          requestAnimationFrame(animate);
          points.rotation.y += 0.0018;
          points.rotation.x += 0.0009;
          renderer.render(scene, camera);
        }
        sizeCanvas(renderer);
        animate();

        window.addEventListener('resize', function(){ sizeCanvas(renderer); camera.aspect = wrap.clientWidth / parseInt(window.getComputedStyle(wrap).height,10); camera.updateProjectionMatrix(); });

        // bring content above canvas
        canvas.style.zIndex = 0;
        var contentNodes = wrap.querySelectorAll('.hero-copy, .hero-media');
        contentNodes.forEach(function(n){ n.style.position = 'relative'; n.style.zIndex = 2; });

        return;
      }catch(err){
        console.warn('three.js init failed', err);
        // fall through to fallback
      }
    }

    // Fallback: simple animated 2D canvas particles (works without WebGL)
    try{
      // Clear any existing canvas drawing
      var ctx = canvas.getContext('2d');
      if(!ctx){
        wrap.classList.add('hero-fallback');
        return;
      }

      var w = Math.max(300, wrap.clientWidth || window.innerWidth);
      var h = Math.max(240, parseInt(window.getComputedStyle(wrap).height,10) || 400);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);

      var particles = [];
      var pCount = 120;
      for(var i=0;i<pCount;i++){
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: 1 + Math.random() * 3
        });
      }

      function draw(){
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = 'rgba(10,143,122,0.9)';
        for(var i=0;i<pCount;i++){
          var p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if(p.x < -10) p.x = w+10; if(p.x > w+10) p.x = -10;
          if(p.y < -10) p.y = h+10; if(p.y > h+10) p.y = -10;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        }
        requestAnimationFrame(draw);
      }
      draw();

      canvas.style.zIndex = 0;
      var contentNodes = wrap.querySelectorAll('.hero-copy, .hero-media');
      contentNodes.forEach(function(n){ n.style.position = 'relative'; n.style.zIndex = 2; });

      window.addEventListener('resize', function(){
        w = Math.max(300, wrap.clientWidth || window.innerWidth);
        h = Math.max(240, parseInt(window.getComputedStyle(wrap).height,10) || 400);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr,0,0,dpr,0,0);
      });

    }catch(e){
      // Last fallback: CSS animated gradient
      wrap.classList.add('hero-fallback');
      console.warn('hero fallback used', e);
    }

  })();

});
