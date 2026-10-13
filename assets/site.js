(function(){
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if(burgerBtn && mobileNav){
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burgerBtn.classList.toggle('active', isOpen);
      burgerBtn.setAttribute('aria-expanded', isOpen);
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

document.querySelectorAll('.faq-q').forEach(q => {
  if(!q.parentElement.classList.contains('faq-item')) return;
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

function submitApplyForm(){
  const nameEl = document.getElementById('fName');
  const phoneEl = document.getElementById('fPhone');
  if(!nameEl || !phoneEl) return;
  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  if(!name || !phone){
    alert('학생 이름과 연락처를 입력해주세요.');
    return;
  }
  const ageEl = document.getElementById('fAge');
  const subjectEl = document.getElementById('fSubject');
  const messageEl = document.getElementById('fMessage');
  const age = ageEl ? ageEl.value : '';
  const subject = subjectEl ? subjectEl.value : '';
  const message = messageEl ? messageEl.value.trim() : '';
  const summary =
    '[한글완전정복 무료 진단 신청]\n' +
    '아이 이름: ' + name + '\n' +
    '연락처: ' + phone + '\n' +
    '연령/학년: ' + age + '\n' +
    '희망 과목: ' + subject + '\n' +
    '남기신 말씀: ' + (message || '(없음)');

  fetch('https://script.google.com/macros/s/AKfycbwOqTTLkqZ_frFyT6N0QcjYZT3jsG0puhq9wRmrQSPxhFgn0fXET3AoGVj4PiHMNHcg/exec', {
    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ site: '한글완전정복', name: name, phone: phone, grade: age, subject: subject, message: message || '(없음)' })
  }).catch(function(err){ console.error('구글시트 전송 실패:', err); });

  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(summary).then(function(){
      alert('신청 내용이 복사되었습니다.\n카카오톡 오픈채팅에 붙여넣기(꾹 눌러서 붙여넣기) 해주세요!');
    }).catch(function(){
      alert('아래 오픈채팅에서 다음 내용으로 신청해주세요:\n\n' + summary);
    });
  } else {
    alert('아래 오픈채팅에서 다음 내용으로 신청해주세요:\n\n' + summary);
  }
}

/* ---------- Subject-pick popup ---------- */
let helpSelectedSubject = '';
let helpSelectedGrade = '';

function openHelpModal(){
  const overlay = document.getElementById('helpModalOverlay');
  if(!overlay) return;
  overlay.classList.add('open');
  backToHelpStep1();
}

if(document.getElementById('helpModalOverlay')){
  openHelpModal();
}

function closeHelpModal(){
  const overlay = document.getElementById('helpModalOverlay');
  if(overlay) overlay.classList.remove('open');
}

function backToHelpStep1(){
  const step1 = document.getElementById('helpStep1');
  const step2 = document.getElementById('helpStep2');
  const step3 = document.getElementById('helpStep3');
  if(step1) step1.style.display = '';
  if(step2) step2.style.display = 'none';
  if(step3) step3.style.display = 'none';
  helpSelectedGrade = '';
  document.querySelectorAll('.help-pill').forEach(function(p){ p.classList.remove('selected'); });
}

function pickHelpSubject(subjectVal, subjectLabel, tagline){
  helpSelectedSubject = subjectVal;
  const step1 = document.getElementById('helpStep1');
  const step2 = document.getElementById('helpStep2');
  const step3 = document.getElementById('helpStep3');
  if(step1) step1.style.display = 'none';
  if(step2) step2.style.display = '';
  if(step3) step3.style.display = 'none';
  const title = document.getElementById('helpStep2Title');
  const taglineEl = document.getElementById('helpStep2Tagline');
  if(title) title.textContent = subjectLabel;
  if(taglineEl) taglineEl.textContent = tagline;
}

document.querySelectorAll('.help-pill').forEach(function(pill){
  pill.addEventListener('click', function(){
    document.querySelectorAll('.help-pill').forEach(function(p){ p.classList.remove('selected'); });
    pill.classList.add('selected');
    helpSelectedGrade = pill.getAttribute('data-grade');
  });
});

function submitHelpForm(){
  const name = document.getElementById('hName');
  const phone = document.getElementById('hPhone');
  const message = document.getElementById('hMessage');
  if(!name.value.trim() || !phone.value.trim()){
    alert('아이 이름과 연락처를 입력해주세요.');
    return;
  }
  if(!helpSelectedGrade){
    alert('연령/학년을 선택해주세요.');
    return;
  }
  const messageVal = message && message.value.trim() ? message.value.trim() : '(없음)';

  fetch('https://script.google.com/macros/s/AKfycbwOqTTLkqZ_frFyT6N0QcjYZT3jsG0puhq9wRmrQSPxhFgn0fXET3AoGVj4PiHMNHcg/exec', {
    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ site: '한글완전정복', name: name.value.trim(), phone: phone.value.trim(), grade: helpSelectedGrade, subject: helpSelectedSubject, message: messageVal })
  }).catch(function(err){ console.error('구글시트 전송 실패:', err); });

  const step2 = document.getElementById('helpStep2');
  const step3 = document.getElementById('helpStep3');
  if(step2) step2.style.display = 'none';
  if(step3) step3.style.display = '';
}
