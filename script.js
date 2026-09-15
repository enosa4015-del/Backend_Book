/* ============================================================
   Backend//Book — renderer + engine
   Reads window.BOOK (part1.js → part2.js → part3.js) into a
   single-page book, roadmap, XP system and practice arena.
   ============================================================ */
(() => {
  'use strict';

  const BOOK = window.BOOK || {};
  const chapters = BOOK.chapters || [];

  /* ---------------- helpers ---------------- */
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (v = '') => String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  const plain = (v = '') => String(v).replace(/[\u00a0\u202f]/g, ' ');

  function el(tag, cls, children) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (children) {
      if (typeof children === 'string') n.textContent = children;
      else if (Array.isArray(children)) children.forEach((c) => n.appendChild(c));
      else n.appendChild(children);
    }
    return n;
  }

  /* ---------------- stats + quiz pool ---------------- */
  let lessonCount = 0, quizCount = 0, codeCount = 0, challengeCount = 0, totalMin = 0;
  const quizPool = [];

  chapters.forEach((ch, ci) => {
    ch._i = ci;
    ch.lessons.forEach((les, li) => {
      les._ci = ci; les._li = li;
      lessonCount += 1;
      totalMin += (Number(les.estimated_time) || 0);
      les.blocks.forEach((b, bi) => {
        b._key = ci + '-' + li + '-' + bi;
        if (b.t === 'quiz') {
          quizCount += 1;
          quizPool.push({
            key: b._key, q: plain(b.q), o: (b.o || []).map(plain), a: b.a,
            e: plain(b.e), src: ch.title + ' · ' + les.title
          });
        } else if (b.t === 'code') codeCount += 1;
        else if (b.t === 'challenge') challengeCount += 1;
      });
    });
  });

  const projectCount = (chapters[11] && chapters[11].lessons.length) || 6;

  const math = {
    levels: chapters.length,
    lessons: lessonCount,
    quizzes: quizCount,
    projects: projectCount,
    minutes: totalMin,
    codes: codeCount
  };
  if (BOOK.meta) BOOK.meta.stats = math;

  $$('[data-stat]').forEach((s) => {
    const k = s.getAttribute('data-stat');
    if (k in math) s.textContent = math[k];
  });

  /* ---------------- code highlighting ---------------- */
  const KEYWORDS = {
    php: ['echo', 'print', 'var_dump', 'print_r', 'if', 'else', 'elseif', 'foreach', 'for', 'while',
      'function', 'return', 'public', 'private', 'protected', 'class', 'new', 'use', 'require',
      'require_once', 'include', 'include_once', 'static', 'false', 'true', 'null', 'array',
      'isset', 'empty', 'unset', 'continue', 'break', 'switch', 'case', 'default', 'die', 'exit',
      'global', 'extends', 'implements', 'as', 'instanceof', 'list', 'match'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'JOIN',
      'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'PRIMARY', 'KEY',
      'NOT', 'NULL', 'AND', 'OR', 'CREATE', 'TABLE', 'INDEX', 'DATABASE', 'DISTINCT', 'HAVING',
      'OFFSET', 'COUNT', 'AS', 'UNION', 'REFERENCES', 'FOREIGN', 'AUTO_INCREMENT', 'IF', 'ASC', 'DESC'],
    bash: ['echo', 'cd', 'ls', 'mkdir', 'touch', 'rm', 'mv', 'cp', 'cat', 'grep', 'sudo', 'apt',
      'npm', 'composer', 'git', 'php', 'curl', 'docker', 'exit', 'which', 'chmod', 'tar', 'ssh',
      'export', 'source', 'then', 'fi', 'do', 'done', 'install', 'yes'],
    blade: ['@extends', '@section', '@yield', '@if', '@else', '@endif', '@foreach', '@endforeach',
      '@for', '@forelse', '@empty', '@auth', '@guest', '@csrf', '@method', '@include', 'true', 'false'],
    dockerfile: ['FROM', 'RUN', 'COPY', 'ADD', 'CMD', 'ENTRYPOINT', 'ENV', 'WORKDIR', 'EXPOSE',
      'LABEL', 'VOLUME', 'USER', 'ARG'],
    nginx: ['server', 'listen', 'server_name', 'root', 'index', 'location', 'try_files', 'include',
      'fastcgi_pass', 'proxy_pass', 'upstream', 'return', 'deny', 'access_log', 'error_log',
      'client_max_body_size', 'over'],
    yaml: ['version', 'services', 'image', 'ports', 'environment', 'volumes', 'dependencies',
      'app', 'db', 'network', 'depends_on'],
    env: ['APP_NAME', 'APP_ENV', 'APP_KEY', 'APP_DEBUG', 'APP_URL', 'DB_CONNECTION', 'DB_HOST',
      'DB_PORT', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 'CACHE_STORE', 'SESSION_DRIVER',
      'QUEUE_CONNECTION', 'MAIL_MAILER', 'MAIL_HOST', 'MAIL_PORT'],
    js: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'new', 'true',
      'false', 'null', 'undefined', 'async', 'await', 'import', 'export', 'default', 'of', 'in'],
    html: ['div', 'h1', 'h2', 'h3', 'p', 'a', 'img', 'ul', 'li', 'form', 'input', 'button',
      'label', 'span', 'section', 'table', 'thead', 'tbody', 'tr', 'td', 'meta', 'head', 'body', 'title']
  };

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function langConf(lang) {
    const name = (lang || 'text').toLowerCase();
    if (!KEYWORDS[name]) return null;
    const COM = {
      php: ['//'], sql: ['--', '#'], bash: ['#'], blade: ['{{--'],
      dockerfile: ['#'], nginx: ['#'], yaml: ['#'], env: ['#'], js: ['//']
    };
    const cm = (COM[name] || []).map((p) => escRe(p) + '.*?$').join('|');
    const com = cm ? new RegExp('(?:' + cm + ')') : null;
    return {
      com: com,
      str: new RegExp("(?:'[^']*'|&quot;.*?&quot;)"),
      var: (name === 'php' || name === 'bash') ? /\$\w+/ : null,
      kw: new RegExp('\\b(?:' + KEYWORDS[name].map(escapeRe).join('|') + ')\\b')
    };
  }

  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function highlightLine(line, lang) {
    const cfg = langConf(lang);
    if (!cfg || !cfg.com) return esc(line);
    let build = cfg.com.source + '|' + cfg.str.source + '|' +
      (cfg.var ? cfg.var.source + '|' : '') +
      cfg.kw.source + '|\\b\\d+(?:\\.\\d+)?\\b';
    const re = new RegExp('(' + build + ')', 'g');
    return esc(line).replace(re, (m) => {
      let cls = 'c-num';
      if (cfg.com.test(m)) cls = 'c-com';
      else if (cfg.str.test(m)) cls = 'c-str';
      else if (cfg.var && cfg.var.test(m)) cls = 'c-var';
      else if (cfg.kw.test(m)) cls = 'c-kw';
      return '<span class="' + cls + '">' + m + '</span>';
    });
  }

  function renderCode(block) {
    const lang = block.lang || 'text';
    const src = String(block.s);
    const lines = src.split('\n').map((ln, i) =>
      '<span class="code-line-num">' + (i + 1) + '</span>' + highlightLine(ln, lang)
    ).join('\n');
    const pre = el('pre', 'blk blk-code');
    pre.dataset.lang = lang;
    pre.innerHTML = '<span class="code-lang">' + esc(lang) + '</span>' + lines;

    const copy = el('button', 'code-copy', 'copy');
    copy.type = 'button';
    copy.setAttribute('aria-label', 'Copy code');
    copy.addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(src);
      copy.textContent = 'copied!';
      setTimeout(() => { copy.textContent = 'copy'; }, 1200);
    });
    pre.appendChild(copy);
    return pre;
  }

  /* ---------------- inline (reader) quiz ---------------- */
  function renderInlineQuiz(b, scope) {
    const wrap = el('div', 'blk blk-quiz');
    wrap.appendChild(el('p', 'quiz-label', 'Self-check'));
    wrap.appendChild(el('p', 'quiz-q-inline', plain(b.q)));
    const opts = el('div', 'quiz-opts');
    (b.o || []).forEach((opt, idx) => {
      const btn = el('button', 'quiz-opt', plain(opt));
      btn.type = 'button';
      btn.addEventListener('click', () => resolveInlineQuiz(b, idx, btn, opts));
      opts.appendChild(btn);
    });
    wrap.appendChild(opts);
    return wrap;
  }

  function resolveInlineQuiz(b, chosen, btn, opts) {
    if (state.answered.has(b._key)) return;
    state.answered.add(b._key);
    $$('.quiz-opt', opts).forEach((o) => { o.disabled = true; });
    const right = b.a === chosen;
    if (right) {
      btn.classList.add('correct');
      awardXp(10, 'Self-check correct! +10 XP');
    } else {
      btn.classList.add('wrong');
      $$('.quiz-opt', opts)[b.a].classList.add('correct');
      showToast('Not quite — read the explanation and try again later. 💡');
    }
    persist();
    if (b.e) {
      const ex = el('div', 'quiz-expl');
      ex.innerHTML = '<b>' + (right ? 'Correct. ' : 'Not quite. ') + '</b>' +
        esc(plain(b.e)).replace(/\n/g, '<br>');
      opts.parentNode.appendChild(ex);
    }
  }

  /* ---------------- block renderers ---------------- */
  function renderBlocks(blocks, container) {
    const frag = document.createDocumentFragment();
    blocks.forEach((b) => {
      let node = null;
      switch (b.t) {
        case 'p': node = el('p', 'blk blk-p', plain(b.s)); break;
        case 'h': node = el('h3', 'blk blk-h', plain(b.s)); break;
        case 'h3': node = el('h4', 'blk blk-h3', plain(b.s)); break;
        case 'code': node = renderCode(b); break;
        case 'list':
          node = el('ul', 'blk blk-list');
          (b.items || []).forEach((it) => node.appendChild(el('li', null, plain(it))));
          break;
        case 'msg': {
          const kind = clean(b.kind);
          node = el('div', 'blk blk-msg blk-' + kind, plain(b.s));
          break;
        }
        case 'quote': node = el('blockquote', 'blk blk-quote', plain(b.s)); break;
        case 'challenge': node = el('div', 'blk blk-challenge', plain(b.s)); break;
        case 'quiz': node = renderInlineQuiz(b); break;
        case 'next': node = el('p', 'blk blk-p blk-p-subtle', b.s); break;
        default: node = null;
      }
      if (node) frag.appendChild(node);
    });
    container.appendChild(frag);
  }

  function clean(v) {
    const s = String(v || '').toLowerCase().trim();
    return ['tip', 'warning', 'info', 'danger', 'fun'].includes(s) ? s : 'info';
  }

  function diffCls(v) {
    const s = String(v || '').toLowerCase().trim();
    return s === 'intermediate' ? 'intermediate' : (s === 'advanced' ? 'advanced' : 'beginner');
  }

  /* ---------------- state / XP ---------------- */
  const KEY = 'bb_state_v1';
  function readState() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        xp: Number(raw.xp) || 0,
        done: new Set(raw.done || []),
        bestStreak: Number(raw.bestStreak) || 0
      };
    } catch (e) { return { xp: 0, done: new Set(), bestStreak: 0 }; }
  }
  const state = Object.assign(readState(), { answered: new Set() });

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        xp: state.xp,
        done: Array.from(state.done),
        bestStreak: state.bestStreak
      }));
    } catch (e) { /* private mode */ }
  }

  const levelInfo = (xp) => ({
    level: Math.floor(xp / 100) + 1,
    into: xp % 100
  });

  const xpLevel = $('#xpLevel'), xpCount = $('#xpCount'), xpFill = $('#xpBarFill');

  function paintXp() {
    const lv = levelInfo(state.xp);
    if (xpLevel) xpLevel.textContent = 'Lv ' + lv.level;
    if (xpCount) xpCount.textContent = state.xp + ' XP';
    if (xpFill) xpFill.style.width = lv.into + '%';
    paintMeters();
  }

  function paintMeters() {
    const pct = Math.round((state.done.size / chapters.length) * 100);
    const fill = $('#roadmapBar'); if (fill) fill.style.width = pct + '%';
    const note = $('#roadmapNote'); if (note) note.textContent = state.done.size + ' / ' + chapters.length + ' levels';
    const m2 = $('#journeyMiniFill'); if (m2) m2.style.width = pct + '%';
    const n2 = $('#journeyMiniNote'); if (n2) n2.textContent = state.done.size + ' / ' + chapters.length + ' levels';
    $$('.toc-link').forEach((a) => a.classList.toggle('done', state.done.has(Number(a.dataset.ch))));
    $$('.level-card').forEach((c) => c.classList.toggle('done', state.done.has(Number(c.dataset.ch))));
  }

  let toastTimer = null;
  function showToast(msg, strong) {
    const t = $('#toast');
    if (!t) return;
    $('#toastText').textContent = msg;
    t.classList.toggle('strong', !!strong);
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  function awardXp(n, msg) {
    const before = levelInfo(state.xp).level;
    state.xp += n;
    const after = levelInfo(state.xp).level;
    paintXp();
    persist();
    if (after > before) {
      showToast('Level up! You reached Lv ' + after + ' 🎊', true);
      fireConfetti();
    } else if (msg) {
      showToast(msg, true);
    }
  }

  /* ---------------- chapter complete ---------------- */
  function chapterCtrl(ch) {
    const btn = el('button', 'chapter-done-btn');
    btn.type = 'button';
    const refresh = () => {
      const done = state.done.has(ch.number);
      btn.textContent = done ? '✓ Level ' + ch.number + ' complete' : 'Complete level ' + ch.number + ' (+50 XP)';
      btn.classList.toggle('is-done', done);
    };
    btn.addEventListener('click', () => {
      if (state.done.has(ch.number)) {
        state.done.delete(ch.number);
        state.xp = Math.max(0, state.xp - 50);
        showToast('Level ' + ch.number + ' re-opened.');
      } else {
        state.done.add(ch.number);
        awardXp(50);
        fireConfetti();
        showToast(ch.title + ' complete! +50 XP 🏆', true);
        const next = $('#chap-' + (ch.number + 1));
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      paintXp(); persist();
      refresh();
    });
    refresh();
    return btn;
  }

  /* ---------------- roadmap ---------------- */
  function renderMap() {
    const map = $('#journeyMap');
    const frag = document.createDocumentFragment();
    chapters.forEach((ch) => {
      const card = el('button', 'level-card');
      card.type = 'button';
      card.dataset.ch = ch.number;
      card.innerHTML =
        '<span class="lv-num">LEVEL ' + ch.number + '</span>' +
        '<span class="lv-name">' + esc(ch.title) + '</span>' +
        '<span class="lv-lessons">' + ch.lessons.length + ' lessons</span>' +
        '<span class="lv-check" aria-hidden="true">○</span>';
      card.addEventListener('click', () => {
        const t = $('#chap-' + ch.number);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else $('#book').scrollIntoView({ behavior: 'smooth' });
      });
      frag.appendChild(card);
    });
    map.appendChild(frag);
  }

  /* ---------------- TOC ---------------- */
  function renderToc() {
    const list = $('#tocList');
    const frag = document.createDocumentFragment();
    chapters.forEach((ch) => {
      const a = el('a', 'toc-link');
      a.href = '#chap-' + ch.number;
      a.dataset.ch = ch.number;
      a.innerHTML = '<span class="tl-num">' + ch.number + '</span><span>' + esc(ch.title) + '</span>';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const t = $('#chap-' + ch.number);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      frag.appendChild(a);
    });
    list.appendChild(frag);
  }

  /* ---------------- the book ---------------- */
  function renderBook() {
    const holder = $('#bookHolder');
    const frag = document.createDocumentFragment();
    chapters.forEach((ch) => {
      const section = el('section', 'chapter container-reveal');
      section.id = 'chap-' + ch.number;
      section.dataset.ci = ch._i;

      const head = el('header', 'chapter-head');
      const meta = el('div', 'chapter-meta');
      meta.appendChild(el('span', 'chapter-badge', 'Level ' + ch.number));
      meta.appendChild(el('span', 'chapter-badge chapter-section', esc(ch.section || '')));
      head.appendChild(meta);
      head.appendChild(el('h2', 'chapter-name', plain(ch.title)));
      if (ch.summary) head.appendChild(el('p', 'chapter-summary', plain(ch.summary)));
      head.appendChild(chapterCtrl(ch));
      section.appendChild(head);

      ch.lessons.forEach((les) => {
        const card = el('article', 'lesson item-reveal');
        const lhead = el('header', 'lesson-head');
        const lmeta = el('div', 'lesson-meta');
        lmeta.appendChild(el('span', 'lesson-dif dif-' + diffCls(les.difficulty), plain(les.difficulty)));
        lmeta.appendChild(el('span', 'lesson-time', '~' + (Number(les.estimated_time) || 5) + ' min'));
        const tags = el('div', 'lesson-tags');
        (les.tags || []).forEach((t) => tags.appendChild(el('span', null, plain(t))));
        lmeta.appendChild(tags);
        lhead.appendChild(lmeta);
        lhead.appendChild(el('h3', 'lesson-title', plain(les.title)));
        if (les.summary) lhead.appendChild(el('p', 'lesson-summary', plain(les.summary)));
        card.appendChild(lhead);
        renderBlocks(les.blocks, card);
        section.appendChild(card);
      });
      frag.appendChild(section);
    });
    holder.appendChild(frag);
  }

  /* ---------------- scroll reveal ---------------- */
  function initReveal() {
    const targets = $$('.container-reveal,.item-reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((n) => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });
    targets.forEach((n) => io.observe(n));
  }

  /* ---------------- ticker ---------------- */
  function renderTicker() {
    const track = $('#tickerTrack');
    const items = chapters.map((ch) =>
      '<span class="ticker-item"><b>LEVEL ' + ch.number + '</b>' + esc(ch.title) + '</span>'
    ).join('<span class="ticker-sep">•</span>');
    track.innerHTML = items + '<span class="ticker-sep">✳</span>' + items;
  }

  /* ---------------- hero terminal ---------------- */
  const TERM = [
    ['// chapter 02 · variables.php', 't-com'],
    ['<?php', ''],
    ['', ''],
    ['$watched = 40;   ', 't-var'],
    ['// hours of tutorials', 't-com'],
    ['$built   = 1;    ', 't-var'],
    ['// things you shipped', 't-com'],
    ['', ''],
    ['if ($built > $watched) {', 't-key'],
    ['echo ', ''],
    ['"backend developer";', 't-str'],
    ['}', 't-key']
  ];

  function startTerm() {
    const node = $('#heroTerm');
    if (!node) return;
    let li = 0, ci = 0;
    const paint = () => {
      let html = '';
      for (let i = 0; i < TERM.length; i++) {
        if (i > li) break;
        if (i === li) break;
        const [s, c] = TERM[i];
        html += (c ? '<span class="' + c + '">' + esc(s) + '</span>' : esc(s)) + '\n';
      }
      const [cur, curC] = TERM[li];
      const part = esc(cur.slice(0, ci));
      html += (curC && ci === cur.length ? '<span class="' + curC + '">' + part + '</span>' : part);
      node.innerHTML = html + '<span class="t-cur"></span>';
    };
    const step = () => {
      const [cur] = TERM[li];
      ci += 1;
      if (ci > cur.length) {
        li += 1; ci = 0;
        if (li >= TERM.length) {
          setTimeout(() => { li = 0; ci = 0; paint(); setTimeout(step, 700); }, 2700);
          return;
        }
      }
      paint();
      setTimeout(step, 30 + Math.floor(Math.random() * 26));
    };
    paint();
    step();
  }

  /* ---------------- practice arena ---------------- */
  const quizStart = $('#quizStart'), quizCard = $('#quizCard'), quizDone = $('#quizDone');
  const quizQ = $('#quizQ'), quizOptions = $('#quizOptions'), quizReveal = $('#quizReveal');
  const quizVerdict = $('#quizVerdict'), quizSrc = $('#quizSrc');
  let game = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function show(id) {
    [quizStart, quizCard, quizDone].forEach((n) => { if (n) n.hidden = true; });
    if (id) id.hidden = false;
  }

  function beginGame() {
    if (!quizPool.length) return;
    game = { qs: shuffle(quizPool), i: 0, correct: 0, streak: 0, maxStreak: state.bestStreak };
    show(quizCard);
    nextQuestion();
  }

  function nextQuestion() {
    const item = game.qs[game.i];
    quizQ.textContent = item.q;
    quizSrc.textContent = item.src;
    $('#quizStreak').textContent = '🔥 ' + game.streak;
    quizReveal.hidden = true;
    quizReveal.textContent = '';
    quizVerdict.innerHTML = '';
    quizOptions.innerHTML = '';
    item.o.forEach((opt, idx) => {
      const b = el('button', 'quiz-opt', opt);
      b.type = 'button';
      b.addEventListener('click', () => answerGame(item, idx, b));
      quizOptions.appendChild(b);
    });
  }

  function answerGame(item, chosen, btn) {
    $$('.quiz-opt', quizOptions).forEach((o) => { o.disabled = true; });
    const right = chosen === item.a;
    if (right) {
      btn.classList.add('correct');
      game.correct += 1;
      game.streak += 1;
      game.maxStreak = Math.max(game.maxStreak, game.streak);
      awardXp(10, 'Correct! +10 XP');
    } else {
      btn.classList.add('wrong');
      $$('.quiz-opt', quizOptions)[item.a].classList.add('correct');
      game.streak = 0;
    }
    $('#quizStreak').textContent = '🔥 ' + game.streak;
    quizReveal.hidden = false;
    quizReveal.textContent = item.e || '';
    quizVerdict.innerHTML = '';
    const nextBtn = el('button', 'quiz-yes', right ? 'Next →' : 'Got it, next!');
    nextBtn.type = 'button';
    nextBtn.addEventListener('click', () => {
      state.bestStreak = Math.max(state.bestStreak, game.maxStreak);
      persist();
      if (game.i + 1 < game.qs.length) { game.i += 1; nextQuestion(); }
      else endGame();
    });
    quizVerdict.appendChild(nextBtn);
  }

  function endGame() {
    state.bestStreak = Math.max(state.bestStreak, game.maxStreak);
    persist();
    $('#quizDoneText').textContent =
      'You nailed ' + game.correct + ' of ' + game.qs.length +
      ' — best streak ' + game.maxStreak + '. XP is already in your pocket.';
    show(quizDone);
    $('#bestStreak').textContent = state.bestStreak;
    $('#quizXpTotal').textContent = state.xp;
    paintPracticeMeta();
    if (game.correct >= Math.ceil(game.qs.length / 2)) fireConfetti();
  }

  function paintPracticeMeta() {
    const bs = $('#bestStreak'); if (bs) bs.textContent = state.bestStreak;
    const qx = $('#quizXpTotal'); if (qx) qx.textContent = state.xp;
  }

  function initPractice() {
    const begin = $('#quizBegin');
    if (begin) begin.addEventListener('click', beginGame);
    const again = $('#quizAgain');
    if (again) again.addEventListener('click', beginGame);
    const quit = $('#quizQuit');
    if (quit) quit.addEventListener('click', () => {
      if (game) {
        state.bestStreak = Math.max(state.bestStreak, game.maxStreak);
        persist();
      }
      game = null;
      show(quizStart);
      paintPracticeMeta();
    });
  }

  /* ---------------- scroll / nav / progress ---------------- */
  const progressBar = $('#scrollBar');
  const navbar = $('#navbar');
  const navSections = ['hero', 'roadmap', 'book', 'practice'];
  const navLinks = $$('.nav-link');

  function onScroll() {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (max > 0 ? Math.min(100, (top / max) * 100) : 0) + '%';
    if (navbar) navbar.classList.toggle('scrolled', top > 12);

    let active = navSections[0];
    for (const id of navSections) {
      const sec = document.getElementById(id);
      if (sec && sec.getBoundingClientRect().top <= 130) active = id;
    }
    navLinks.forEach((a) => a.classList.toggle('active', a.dataset.go === active));
  }

  function initNav() {
    $$('[data-go]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.go);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const links = $('#navLinks');
        if (links) links.classList.remove('open');
      });
    });
    const burger = $('#navBurger');
    const links = $('#navLinks');
    if (burger && links) {
      burger.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- confetti ---------------- */
  let confettiRaf = null;
  function fireConfetti() {
    const canvas = $('#confetti');
    if (!canvas) return;
    if (confettiRaf) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#c8f31d', '#ff8c42', '#39d9c0', '#f7c948', '#7ee081', '#ffb057'];
    const parts = [];
    for (let i = 0; i < 160; i++) {
      parts.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.3,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        c: colors[Math.floor(Math.random() * colors.length)],
        vy: 2.5 + Math.random() * 3.6,
        vx: -1.8 + Math.random() * 3.6,
        rot: Math.random() * Math.PI,
        vr: -0.12 + Math.random() * 0.24
      });
    }
    const t0 = performance.now();
    const tick = (t) => {
      const dt = Math.min((t - t0) / 16, 60);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      parts.forEach((p) => {
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.vy += 0.03 * dt;
        if (p.y < canvas.height + 40) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) confettiRaf = requestAnimationFrame(tick);
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); confettiRaf = null; }
    };
    confettiRaf = requestAnimationFrame(tick);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    if (!chapters.length) {
      $('#bookHolder').innerHTML = '<p>Book content failed to load — check part1.js / part2.js / part3.js.</p>';
      return;
    }
    renderBook();
    renderMap();
    renderToc();
    renderTicker();
    startTerm();
    initNav();
    initPractice();
    paintXp();
    paintMeters();
    paintPracticeMeta();
    initReveal();
    requestAnimationFrame(onScroll);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();