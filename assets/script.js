// assets/script.js
// Interactions: mobile nav, testimonials, year, Leaflet map, and lightweight three.js hero animation

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

  // Lightweight three.js hero background (particles)
  try{
    if(typeof THREE !== 'undefined'){
      var canvas = document.getElementById('heroCanvas');
      var width = canvas.clientWidth || window.innerWidth;
      var height = 400;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = '100%';
      canvas.style.height = height + 'px';

      var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true});
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio || 1);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
      camera.position.z = 200;

      // particles
      var geometry = new THREE.BufferGeometry();
      var count = 400;
      var positions = new Float32Array(count * 3);
      for(var i=0;i<count;i++){
        positions[i*3+0] = (Math.random() - 0.5) * 800;
        positions[i*3+1] = (Math.random() - 0.5) * 400;
        positions[i*3+2] = (Math.random() - 0.5) * 800;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var material = new THREE.PointsMaterial({color:0x0a8f7a, size:3 * (window.devicePixelRatio||1), opacity:0.85});
      var points = new THREE.Points(geometry, material);
      scene.add(points);

      function animate(){
        requestAnimationFrame(animate);
        points.rotation.y += 0.0015;
        points.rotation.x += 0.0007;
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', function(){
        var w = canvas.clientWidth || window.innerWidth;
        var h = 400;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      });
    }
  }catch(e){console.warn('three.js init failed',e)}

});
