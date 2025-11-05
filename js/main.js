

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
        '<a class="ms-1" href="#catalog">Открыть каталог</a>';
    });
  }
});
