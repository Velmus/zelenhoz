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

// Catalog slider (infinite loop, step=1) + swipe/drag
function initCatalogSlider(){
  var slider = document.querySelector('.catalog-slider');
  if(!slider) return;
  var track = slider.querySelector('.slider-track'); if(!track) return;
  var originals = Array.prototype.slice.call(track.querySelectorAll('.slider-item')); if(originals.length===0) return;

  // touch-action, чтобы вертикальный скролл страницы не ломался
  track.style.touchAction = 'pan-y';

  // Клонируем для бесконечного цикла
  if(!track.dataset.looped){
    originals.forEach(function(it){ track.appendChild(it.cloneNode(true)); });
    originals.forEach(function(it){ track.insertBefore(it.cloneNode(true), track.firstChild); });
    track.dataset.looped='1';
  }

  var allItems = Array.prototype.slice.call(track.querySelectorAll('.slider-item'));
  var index = originals.length; // старт из середины
  var step = 0;

  function compute(){
    var first = allItems[0];
    var style = window.getComputedStyle(track);
    var gap = parseFloat(style.gap || 16);
    var rect = first.getBoundingClientRect();
    step = rect.width + gap;

    track.style.transition='none';
    track.style.transform='translateX(' + (-index*step) + 'px)';
    void track.offsetWidth; // reflow
    track.style.transition='transform 400ms ease';
  }

  function setTranslate(px, withTransition){
    if(withTransition === false){
      var prev = track.style.transition;
      track.style.transition='none';
      track.style.transform='translateX(' + px + 'px)';
      // не возвращаем transition тут — вызовущий сам решит
      return prev;
    } else {
      track.style.transform='translateX(' + px + 'px)';
    }
  }

  function go(d){
    index += d;
    setTranslate(-index*step, true);
  }

  // Бесконечный цикл через прыжок на "середину"
  track.addEventListener('transitionend', function(){
    var lastOriginalIndex = originals.length*2 - 1;
    if(index > lastOriginalIndex){
      index = originals.length;
      track.style.transition='none';
      track.style.transform='translateX(' + (-index*step) + 'px)';
      void track.offsetWidth;
      track.style.transition='transform 400ms ease';
    } else if(index < originals.length){
      index = lastOriginalIndex;
      track.style.transition='none';
      track.style.transform='translateX(' + (-index*step) + 'px)';
      void track.offsetWidth;
      track.style.transition='transform 400ms ease';
    }
  });

  // Кнопки
  var prevBtn=document.querySelector('[data-slider-prev]'),
      nextBtn=document.querySelector('[data-slider-next]');
  if(prevBtn) prevBtn.addEventListener('click', function(){ go(-1); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ go(1); });

  // === SWIPE / DRAG ===
  var dragging = false;
  var startX = 0, startY = 0, deltaX = 0;
  var startTx = 0; // стартовая translateX (в пикселях)
  var moved = false;
  var axisLocked = null; // 'x' | 'y' | null
  var THRESHOLD = 0.2; // доля шага для перелистывания

  function currentTranslateX(){
    var m = /translateX\(([-0-9.]+)px\)/.exec(track.style.transform);
    if(m) return parseFloat(m[1]);
    // если transform пустой — посчитаем от индекса
    return -index*step;
  }

  function onPointerDown(e){
    // только ЛКМ/первый палец
    if(e.pointerType === 'mouse' && e.button !== 0) return;

    dragging = true; moved = false; axisLocked = null;
    startX = e.clientX; startY = e.clientY;
    startTx = currentTranslateX();

    slider.classList.add('is-dragging');
    track.style.transition='none';

    try { track.setPointerCapture(e.pointerId); } catch(_){}
  }

  function onPointerMove(e){
    if(!dragging) return;

    var dx = e.clientX - startX;
    var dy = e.clientY - startY;

    if(axisLocked === null){
      if(Math.abs(dx) > 6 || Math.abs(dy) > 6){
        axisLocked = (Math.abs(dx) > Math.abs(dy)) ? 'x' : 'y';
      }
    }

    if(axisLocked === 'y'){
      // отдаем вертикальный скролл странице
      return;
    }

    // горизонтальный drag
    deltaX = dx;
    if(Math.abs(dx) > 3) moved = true;

    // во время горизонтального перетаскивания блокируем нативный горизонтальный скролл
    if(e.cancelable) e.preventDefault();

    setTranslate(startTx + dx, false);
  }

  function onPointerUp(e){
    if(!dragging) return;
    dragging = false;
    slider.classList.remove('is-dragging');

    // решаем — листать или откатить
    var traveled = deltaX;
    var needFlip = Math.abs(traveled) > (step * THRESHOLD);
    // возвращаем transition
    void track.offsetWidth;
    track.style.transition='transform 400ms ease';

    if(axisLocked === 'x' && needFlip){
      go(traveled < 0 ? 1 : -1);
    } else {
      // откат к текущему индексу
      setTranslate(-index*step, true);
    }

    // сброс
    deltaX = 0; axisLocked = null;

    try { track.releasePointerCapture(e.pointerId); } catch(_){}
  }

  // отмена клика, если это был drag
  track.addEventListener('click', function(e){
    if(moved){
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);

  // Подписки
  track.addEventListener('pointerdown', onPointerDown, { passive: true });
  track.addEventListener('pointermove', onPointerMove, { passive: false });
  track.addEventListener('pointerup', onPointerUp, { passive: true });
  track.addEventListener('pointercancel', onPointerUp, { passive: true });
  track.addEventListener('pointerleave', function(e){ if(dragging) onPointerUp(e); }, { passive: true });

  window.addEventListener('resize', compute);
  compute();
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