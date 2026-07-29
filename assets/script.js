// assets/script.js
// Small interactions: mobile nav toggle, testimonial carousel, and year insertion

document.addEventListener('DOMContentLoaded', function(){
  // Year in footer
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
});
