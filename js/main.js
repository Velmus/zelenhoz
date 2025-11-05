

// --- Plant Finder logic ---
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('finderSubmit');
  var result = document.getElementById('finderResult');
  if(btn){
    btn.addEventListener('click', function(){
      var place = (document.querySelector('input[name="place"]:checked')||{}).value || '';
      var care = (document.querySelector('input[name="care"]:checked')||{}).value || '';
      var goal = (document.querySelector('input[name="goal"]:checked')||{}).value || '';
      if(!place || !care || !goal){
        result.classList.remove('d-none','alert-success');
        result.classList.add('alert-warning');
        result.textContent = 'Пожалуйста, выберите варианты во всех трёх шагах.';
        return;
      }
      var tips = [];
      if(place==='shade') tips.push('теневыносливые');
      if(place==='sun') tips.push('солнцелюбивые');
      if(care==='low') tips.push('неприхотливые');
      if(goal==='hedge') tips.push('хвойные и плотные кустарники');
      if(goal==='flower') tips.push('многолетние цветы и гортензии');
      if(goal==='ground') tips.push('почвопокровные');
      if(goal==='accent') tips.push('солитёры и декоративные кустарники');
      result.classList.remove('d-none','alert-warning');
      result.classList.add('alert-success');
      result.innerHTML = 'Подойдут: <strong>' + tips.join(', ') + '</strong>. ' +
        '<a class="ms-1" href="catalog.html">Открыть каталог</a>';
    });
  }
});

// Убедись, что bootstrap.bundle.js подключён (в нём есть Popper + события модалок)
(function () {
  const modalEl   = document.getElementById('productModal');
  const titleEl   = document.getElementById('productModalLabel');
  const imgEl     = document.getElementById('productModalImg');
  const descEl    = document.getElementById('productModalDesc');
  const priceEl   = document.getElementById('productModalPrice');
  // const actionEl  = document.getElementById('productModalAction'); // если нужен

  modalEl.addEventListener('show.bs.modal', function (event) {
    // кнопка/ссылка, что открыла модалку
    const trigger = event.relatedTarget;
    // ищем карточку товара рядом
    const card = trigger?.closest('.plant-card') || trigger?.parentElement;

    // приоритет: data-* на карточке → текст из DOM
    const title = card?.dataset.title
      || card?.querySelector('.card-title')?.textContent?.trim()
      || 'Товар';
    const desc  = card?.dataset.desc
      || card?.querySelector('.product-short, .product-desc')?.textContent?.trim()
      || '';
    const img   = card?.dataset.img
      || card?.querySelector('img')?.getAttribute('src')
      || '';
    const price = card?.dataset.price
      || card?.querySelector('.product-price')?.textContent?.trim()
      || '';

    // наполняем модалку
    titleEl.textContent = title;
    descEl.textContent  = desc;
    priceEl.textContent = price;

    // картинка
    if (img) {
      imgEl.src = img;
      imgEl.alt = title;
      imgEl.classList.remove('d-none');
    } else {
      imgEl.removeAttribute('src');
      imgEl.alt = '';
      imgEl.classList.add('d-none');
    }

    // если нужен action (например, ссылка на заказ)
    // const link = card?.dataset.link || '#';
    // actionEl.href = link;
  });

  // Чистим картинку при закрытии, чтобы не мигала при следующем открытии
  modalEl.addEventListener('hidden.bs.modal', function () {
    imgEl.removeAttribute('src');
    imgEl.alt = '';
  });
})();

