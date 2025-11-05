(function(){
  console.log('Зеленхоз: main.js loaded');

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var targetId = this.getAttribute('href').slice(1);
      var el = document.getElementById(targetId);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
    });
  });

  // Catalog slider (infinite loop, step=1)
  function initCatalogSlider(){
    var slider = document.querySelector('.catalog-slider');
    if(!slider) return;
    var track = slider.querySelector('.slider-track'); if(!track) return;
    var originals = Array.prototype.slice.call(track.querySelectorAll('.slider-item')); if(originals.length===0) return;

    if(!track.dataset.looped){
      originals.forEach(function(it){ track.appendChild(it.cloneNode(true)); });
      originals.forEach(function(it){ track.insertBefore(it.cloneNode(true), track.firstChild); });
      track.dataset.looped='1';
    }
    var allItems = Array.prototype.slice.call(track.querySelectorAll('.slider-item'));
    var index = originals.length; var step = 0;

    function compute(){
      var first = allItems[0];
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.gap || 16);
      var rect = first.getBoundingClientRect();
      step = rect.width + gap;
      track.style.transition='none';
      track.style.transform='translateX(' + (-index*step) + 'px)';
      void track.offsetWidth;
      track.style.transition='transform 400ms ease';
    }
    function go(d){ index += d; track.style.transform='translateX(' + (-index*step) + 'px)'; }
    track.addEventListener('transitionend', function(){
      var lastOriginalIndex = originals.length*2 - 1;
      if(index > lastOriginalIndex){ index = originals.length; track.style.transition='none'; track.style.transform='translateX(' + (-index*step) + 'px)'; void track.offsetWidth; track.style.transition='transform 400ms ease'; }
      else if(index < originals.length){ index = lastOriginalIndex; track.style.transition='none'; track.style.transform='translateX(' + (-index*step) + 'px)'; void track.offsetWidth; track.style.transition='transform 400ms ease'; }
    });
    var prevBtn=document.querySelector('[data-slider-prev]'), nextBtn=document.querySelector('[data-slider-next]');
    if(prevBtn) prevBtn.addEventListener('click', function(){ go(-1); });
    if(nextBtn) nextBtn.addEventListener('click', function(){ go(1); });
    window.addEventListener('resize', compute); compute();
  }
  document.addEventListener('DOMContentLoaded', initCatalogSlider);

  // Google Map init
  window.initMap = function(){
    try{
      var mapEl=document.getElementById('gmap'); if(!mapEl || !window.google || !google.maps) return;
      var pskovCenter={lat:57.819,lng:28.331};
      var map=new google.maps.Map(mapEl,{zoom:13,center:pskovCenter,mapTypeControl:false,streetViewControl:false});
      var addresses=[
        { title:'Магазин «Пристань»', address:'Россия, Псков, улица Яна Райниса, 64' },
        { title:'Садовый центр', address:'Россия, Псков, улица Льва Толстого, 32' }
      ];
      var geocoder=(google.maps&&google.maps.Geocoder)?new google.maps.Geocoder():null;
      var bounds=new google.maps.LatLngBounds();
      addresses.forEach(function(item){
        if(!geocoder){ console.error('Geocoder unavailable'); return; }
        geocoder.geocode({address:item.address,componentRestrictions:{country:'RU'}}, function(results,status){
          if(status==='OK' && results[0]){
            var loc=results[0].geometry.location;
            var marker=new google.maps.Marker({map:map,position:loc,title:item.title});
            var info=new google.maps.InfoWindow({content:'<strong>'+item.title+'</strong><br>'+item.address});
            marker.addListener('click', function(){ info.open(map,marker); });
            bounds.extend(loc); map.fitBounds(bounds);
          }else{
            var fallback=new google.maps.Marker({map:map,position:pskovCenter,title:item.title+' (примерно)'});
            bounds.extend(pskovCenter); map.fitBounds(bounds);
          }
        });
      });
    }catch(e){ console.error('initMap error', e); }
  };
})();