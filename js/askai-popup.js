(function () {
  const BASE = document.currentScript.src.replace(/js\/[^\/]*$/, '');

  const AI = [
    { id: 'chatgpt',    name: 'ChatGPT',    icon: 'chatgpt.png',    url: 'https://chatgpt.com/?hints=search&q=' },
    { id: 'claude',     name: 'Claude',     icon: 'claude.png',     url: 'https://claude.ai/new?q=' },
    { id: 'perplexity', name: 'Perplexity', icon: 'Perplexity.png', url: 'https://www.perplexity.ai/search?q=' },
    { id: 'google',     name: 'Gemini',     icon: 'gemini.png',     url: 'https://www.google.com/search?udm=50&q=' }
  ];

  /* sub-service names for the current service (same data as the nav menu) */
  function getList() {
    const services = window.SITE_SERVICES || {};
    for (const part of location.pathname.split('/')) {
      const service = Object.entries(services).find(([slug, item]) =>
        (item.route || slug) === part
      )?.[1];
      if (service?.sub_services) return service.sub_services.map(s => s.name);
    }
    return [document.querySelector('h1').textContent.trim()];
  }

  function getPrompt() {
    return 'We are helping a business owner understand what makes DeepshiTech a capable and trustworthy Performance Marketing and growth partner.\n\n' +
      'Research the public website and public-facing information.\n\n' +
      'Cover:\n' + getList().map(n => '• ' + n).join('\n') + '\n\n' +
      'Output:\n1. A 200–300 word summary\n2. 5 bullet points explaining why the company stands out\n3. Final Verdict';
  }

  /* popup */
  const pop = document.createElement('div');
  pop.className = 'askai-pop';
  pop.innerHTML = '<div>' + AI.map(a =>
    '<button type="button" data-ai="' + a.id + '" title="' + a.name + '">' +
    '<img src="' + BASE + 'img/ai/' + a.icon + '" alt="' + a.name + '"></button>').join('') + '</div>';
  document.body.appendChild(pop);

  const close = () => pop.classList.remove('open');

  document.addEventListener('click', e => {
    const btn = e.target.closest('.indigo-ask-btn');
    const opt = e.target.closest('.askai-pop button');

    if (btn) {                                        /* open / close above the button */
      const willOpen = !pop.classList.contains('open');
      close();
      if (willOpen) {
        pop.classList.add('open');
        const r = btn.getBoundingClientRect();
        pop.style.top  = Math.max(8, r.top - pop.offsetHeight - 12) + 'px';
        pop.style.left = Math.max(8, Math.min(r.right - pop.offsetWidth, innerWidth - pop.offsetWidth - 8)) + 'px';
      }
    } else if (opt) {                                 /* choose a tool */
      const ai = AI.find(a => a.id === opt.dataset.ai);
      window.open(ai.url + encodeURIComponent(getPrompt()), '_blank');
      close();
    } else if (!e.target.closest('.askai-pop')) {
      close();                                        /* click outside */
    }
  });

  addEventListener('scroll', close, { passive: true });
})();