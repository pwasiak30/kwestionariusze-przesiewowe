// app.js — logika aplikacji (routing hash-owy, render widoków, scoring)
(function () {
  "use strict";

  const content = document.getElementById("content");
  const sidebarList = document.getElementById("sidebarList");
  const bottombar = document.getElementById("bottombar");

  const PERSONAL_LINKS = [
    { label: "Linktree", url: "https://pwasiak30.github.io/pwasiak-linktree/", icon: "🔗" },
    { label: "Portfolio", url: "https://pwasiak30.github.io/pawel-wasiak-portfolio/", icon: "💼" }
  ];

  const QUEST_ORDER = Object.keys(QUESTIONNAIRES);

  function questionsInCategory(catKey) {
    return QUEST_ORDER.filter((id) => QUESTIONNAIRES[id].category === catKey);
  }

  // ---------------------------------------------------------- nav building
  function buildNav() {
    sidebarList.innerHTML = "";
    bottombar.innerHTML = "";

    const homeLink = document.createElement("div");
    homeLink.className = "sidebar-link";
    homeLink.dataset.route = "";
    homeLink.innerHTML = `<span class="sl-abbr">🏠</span><span>Strona główna</span>`;
    homeLink.addEventListener("click", () => (location.hash = "#/"));
    sidebarList.appendChild(homeLink);

    CATEGORIES.forEach((cat) => {
      const items = questionsInCategory(cat.key);
      if (!items.length) return;
      const link = document.createElement("div");
      link.className = "sidebar-link";
      link.dataset.route = "cat-" + cat.key;
      link.innerHTML = `<span class="sl-abbr">${cat.icon}</span><span>${cat.label}</span>`;
      link.addEventListener("click", () => goToCategory(cat.key));
      sidebarList.appendChild(link);
    });

    // personal links in sidebar footer area (above connection status)
    const linksWrap = document.createElement("div");
    linksWrap.className = "sidebar-personal-links";
    linksWrap.innerHTML = PERSONAL_LINKS.map(
      (l) => `<a href="${l.url}" target="_blank" rel="noopener">${l.icon} ${l.label}</a>`
    ).join("");
    sidebarList.parentElement.insertBefore(linksWrap, document.getElementById("offlineTextSidebar").closest(".sidebar-footer"));

    // bottom bar (mobile): Home + Search
    const homeBB = document.createElement("button");
    homeBB.className = "bb-item";
    homeBB.dataset.route = "";
    homeBB.innerHTML = `<span class="bb-dot"></span><span>Start</span>`;
    homeBB.addEventListener("click", () => (location.hash = "#/"));
    bottombar.appendChild(homeBB);

    const searchBB = document.createElement("button");
    searchBB.className = "bb-item";
    searchBB.dataset.route = "search";
    searchBB.innerHTML = `<span class="bb-dot"></span><span>Szukaj</span>`;
    searchBB.addEventListener("click", () => {
      location.hash = "#/";
      setTimeout(() => {
        const s = document.getElementById("searchInput");
        if (s) s.focus();
      }, 60);
    });
    bottombar.appendChild(searchBB);

    const linksBB = document.createElement("button");
    linksBB.className = "bb-item";
    linksBB.dataset.route = "links";
    linksBB.innerHTML = `<span class="bb-dot"></span><span>Moje linki</span>`;
    linksBB.addEventListener("click", () => {
      location.hash = "#/";
      setTimeout(() => {
        const s = document.getElementById("personalLinksBanner");
        if (s) s.scrollIntoView({ behavior: "smooth" });
      }, 60);
    });
    bottombar.appendChild(linksBB);
  }

  function goToCategory(key) {
    if (location.hash !== "#/" && location.hash !== "") {
      location.hash = "#/";
      setTimeout(() => scrollToCategory(key), 80);
    } else {
      scrollToCategory(key);
    }
  }

  function scrollToCategory(key) {
    const el = document.getElementById("cat-" + key);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setActiveNav(route) {
    document.querySelectorAll(".sidebar-link, .bb-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.route === route);
    });
  }

  document.querySelectorAll('[data-action="go-home"]').forEach((el) =>
    el.addEventListener("click", () => (location.hash = "#/"))
  );

  // ---------------------------------------------------------- routing
  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", () => {
    buildNav();
    route();
    registerSW();
    watchOnline();
  });

  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    if (hash.startsWith("q/")) {
      const id = hash.slice(2);
      if (QUESTIONNAIRES[id]) {
        renderQuest(id);
        setActiveNav(id);
        return;
      }
    }
    renderHome();
    setActiveNav("");
  }

  // ---------------------------------------------------------- home view
  function renderHome() {
    const tpl = document.getElementById("tpl-home");
    content.innerHTML = "";
    content.appendChild(tpl.content.cloneNode(true));

    // personal links banner (visible on both mobile & desktop, right under hero)
    const hero = content.querySelector(".hero");
    const banner = document.createElement("div");
    banner.className = "personal-links-banner";
    banner.id = "personalLinksBanner";
    banner.innerHTML = `
      <span class="plb-label">Poznaj mnie bliżej:</span>
      ${PERSONAL_LINKS.map(
        (l) => `<a class="plb-link" href="${l.url}" target="_blank" rel="noopener">${l.icon} ${l.label}</a>`
      ).join("")}
    `;
    hero.after(banner);

    // search + category filter chips
    const searchWrap = document.createElement("div");
    searchWrap.className = "search-wrap";
    searchWrap.innerHTML = `
      <input type="search" id="searchInput" placeholder="Szukaj narzędzia (np. depresja, sen, alkohol)…" autocomplete="off">
      <div class="chip-row" id="chipRow">
        <button class="chip active" data-cat="all">Wszystkie</button>
        ${CATEGORIES.map((c) => `<button class="chip" data-cat="${c.key}">${c.icon} ${c.label}</button>`).join("")}
      </div>
    `;
    banner.after(searchWrap);

    // sections per category
    const sectionsWrap = document.createElement("div");
    sectionsWrap.className = "sections-wrap";
    sectionsWrap.id = "sectionsWrap";
    searchWrap.after(sectionsWrap);

    // remove the old flat grid template placeholder
    const oldGrid = document.getElementById("questCards");
    if (oldGrid) oldGrid.remove();

    CATEGORIES.forEach((cat) => {
      const ids = questionsInCategory(cat.key);
      if (!ids.length) return;
      const section = document.createElement("section");
      section.className = "cat-section";
      section.id = "cat-" + cat.key;
      section.dataset.cat = cat.key;
      section.innerHTML = `<h2 class="cat-heading"><span>${cat.icon}</span> ${cat.label}</h2>
        <div class="card-grid" data-grid="${cat.key}"></div>`;
      sectionsWrap.appendChild(section);
      const grid = section.querySelector(".card-grid");
      ids.forEach((id) => grid.appendChild(buildCard(id)));
    });

    // search + chip filtering
    const searchInput = document.getElementById("searchInput");
    const chipRow = document.getElementById("chipRow");
    let activeCat = "all";

    function applyFilter() {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll(".cat-section").forEach((section) => {
        const catMatches = activeCat === "all" || section.dataset.cat === activeCat;
        let anyVisible = false;
        section.querySelectorAll(".quest-card").forEach((card) => {
          const hay = card.dataset.search;
          const textMatches = !q || hay.includes(q);
          const visible = catMatches && textMatches;
          card.style.display = visible ? "" : "none";
          if (visible) anyVisible = true;
        });
        section.style.display = anyVisible ? "" : "none";
      });
    }

    searchInput.addEventListener("input", applyFilter);
    chipRow.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      chipRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.cat;
      applyFilter();
    });

    window.scrollTo(0, 0);
  }

  function buildCard(id) {
    const q = QUESTIONNAIRES[id];
    const card = document.createElement("div");
    card.className = "quest-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    const itemCount = q.kind === "manual" ? q.itemCount : q.kind === "domain-manual" ? q.domains.length + " domen" : q.items.length;
    const searchBlob = [q.name, q.fullName, q.description, (q.keywords || []).join(" ")].join(" ").toLowerCase();
    card.dataset.search = searchBlob;
    card.innerHTML = `
      <div class="qc-top">
        <span class="qc-abbr">${q.name}</span>
        <span class="qc-badge">${typeof itemCount === "number" ? itemCount + " pozycji" : itemCount}</span>
      </div>
      <div class="qc-full">${q.fullName}</div>
      <p class="qc-desc">${q.description}</p>
      <span class="qc-meta">Rozpocznij →</span>
    `;
    const go = () => (location.hash = "#/q/" + id);
    card.addEventListener("click", go);
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") go();
    });
    return card;
  }

  // ---------------------------------------------------------- quest view dispatch
  function renderQuest(id) {
    const q = QUESTIONNAIRES[id];
    const tpl = document.getElementById("tpl-quest");
    content.innerHTML = "";
    content.appendChild(tpl.content.cloneNode(true));

    document.getElementById("questTitle").textContent = q.fullName;
    document.getElementById("questDesc").textContent = q.description;
    const instrEl = document.getElementById("questInstructions");
    if (q.instructions) {
      instrEl.textContent = q.instructions;
    } else {
      instrEl.style.display = "none";
    }

    const form = document.getElementById("questForm");
    const submitBtn = document.getElementById("submitBtn");
    const progressFill = document.getElementById("progressFill");
    const progressLabel = document.getElementById("progressLabel");

    switch (q.kind) {
      case "manual":
        renderManualEntry(q, form, submitBtn, progressFill, progressLabel);
        break;
      case "domain-manual":
        renderDomainManualForm(q, form, submitBtn, progressFill, progressLabel);
        break;
      case "peritem":
        renderPerItemForm(q, form, submitBtn, progressFill, progressLabel);
        break;
      case "dual":
        renderDualForm(q, form, submitBtn, progressFill, progressLabel);
        break;
      default:
        renderLikertForm(q, form, submitBtn, progressFill, progressLabel);
    }

    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------- uniform likert (also used for binary tak/nie)
  function renderLikertForm(q, form, submitBtn, progressFill, progressLabel) {
    const answers = new Array(q.items.length).fill(null);

    q.items.forEach((text, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "q-item";
      wrap.dataset.idx = idx;
      wrap.innerHTML = `
        <div class="q-text"><span class="q-num">${idx + 1}</span><span>${text}</span></div>
        <div class="q-options">
          ${q.options
            .map((o) => `
            <label class="q-option">
              <input type="radio" name="item${idx}" value="${o.value}">
              <span>${o.label}</span>
            </label>`)
            .join("")}
        </div>
      `;
      form.appendChild(wrap);
    });

    wireForm(form, submitBtn, progressFill, progressLabel, answers, () => showResult(q, answers));
  }

  // ---------------------------------------------------------- per-item options (AUDIT, AIS, IIEF-5, EPDS, Fagerström...)
  function renderPerItemForm(q, form, submitBtn, progressFill, progressLabel) {
    const answers = new Array(q.items.length).fill(null);
    q.items.forEach((item, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "q-item";
      wrap.dataset.idx = idx;
      wrap.innerHTML = `
        <div class="q-text"><span class="q-num">${idx + 1}</span><span>${item.text}</span></div>
        <div class="q-options">
          ${item.options
            .map((o) => `
            <label class="q-option">
              <input type="radio" name="item${idx}" value="${o.value}">
              <span>${o.label}</span>
            </label>`)
            .join("")}
        </div>
      `;
      form.appendChild(wrap);
    });

    wireForm(form, submitBtn, progressFill, progressLabel, answers, () => showResult(q, answers));
  }

  // ---------------------------------------------------------- dual axis (LSAS)
  function renderDualForm(q, form, submitBtn, progressFill, progressLabel) {
    const answersA = new Array(q.items.length).fill(null);
    const answersB = new Array(q.items.length).fill(null);

    q.items.forEach((text, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "q-item";
      wrap.dataset.idx = idx;
      wrap.innerHTML = `
        <div class="q-text"><span class="q-num">${idx + 1}</span><span>${text}</span></div>
        <div class="dual-block">
          <div class="dual-col">
            <div class="dual-col-label">${q.labelA}</div>
            <div class="q-options">
              ${q.optionsA.map((o) => `
                <label class="q-option">
                  <input type="radio" name="itemA${idx}" value="${o.value}">
                  <span>${o.label}</span>
                </label>`).join("")}
            </div>
          </div>
          <div class="dual-col">
            <div class="dual-col-label">${q.labelB}</div>
            <div class="q-options">
              ${q.optionsB.map((o) => `
                <label class="q-option">
                  <input type="radio" name="itemB${idx}" value="${o.value}">
                  <span>${o.label}</span>
                </label>`).join("")}
            </div>
          </div>
        </div>
      `;
      form.appendChild(wrap);
    });

    function updateProgress() {
      const doneA = answersA.filter((a) => a !== null).length;
      const doneB = answersB.filter((a) => a !== null).length;
      const done = doneA + doneB;
      const total = answersA.length + answersB.length;
      progressFill.style.width = (done / total) * 100 + "%";
      progressLabel.textContent = `${done} / ${total}`;
      submitBtn.disabled = done < total;
    }
    updateProgress();

    form.addEventListener("change", (e) => {
      const name = e.target.name || "";
      let idx, target;
      if (name.startsWith("itemA")) { idx = parseInt(name.replace("itemA", ""), 10); target = answersA; }
      else if (name.startsWith("itemB")) { idx = parseInt(name.replace("itemB", ""), 10); target = answersB; }
      else return;
      target[idx] = parseInt(e.target.value, 10);
      const itemEl = form.querySelector(`.q-item[data-idx="${idx}"]`);
      if (answersA[idx] !== null && answersB[idx] !== null) itemEl.classList.add("answered");
      itemEl.querySelectorAll(".q-option").forEach((lab) => {
        lab.classList.toggle("selected", lab.querySelector("input").checked);
      });
      updateProgress();
    });

    submitBtn.addEventListener("click", () => {
      if (answersA.some((a) => a === null) || answersB.some((a) => a === null)) return;
      const total = answersA.reduce((s, v) => s + v, 0) + answersB.reduce((s, v) => s + v, 0);
      showResult(q, [], total, { answersA, answersB });
    });
  }

  // ---------------------------------------------------------- manual entry (BDI-II style — flat item count)
  function renderManualEntry(q, form, submitBtn, progressFill, progressLabel) {
    const answers = new Array(q.itemCount).fill(null);
    const info = document.createElement("div");
    info.className = "instructions";
    info.style.marginBottom = "16px";
    info.textContent = q.manualNote || "Wprowadź punktację dla każdej pozycji na podstawie oryginalnego arkusza testowego.";
    form.appendChild(info);

    const grid = document.createElement("div");
    grid.className = "manual-grid";
    const max = q.perItemMax || 3;
    for (let i = 0; i < q.itemCount; i++) {
      const cell = document.createElement("label");
      cell.className = "manual-item";
      cell.innerHTML = `Poz. ${i + 1}
        <input type="number" min="0" max="${max}" step="1" inputmode="numeric" data-idx="${i}">`;
      grid.appendChild(cell);
    }
    form.appendChild(grid);

    updateManualProgress();
    grid.addEventListener("input", (e) => {
      const idx = parseInt(e.target.dataset.idx, 10);
      let v = e.target.value;
      if (v === "") {
        answers[idx] = null;
      } else {
        v = Math.max(0, Math.min(max, parseInt(v, 10) || 0));
        e.target.value = v;
        answers[idx] = v;
      }
      updateManualProgress();
    });

    function updateManualProgress() {
      const done = answers.filter((a) => a !== null).length;
      const total = answers.length;
      progressFill.style.width = (done / total) * 100 + "%";
      progressLabel.textContent = `${done} / ${total}`;
      submitBtn.disabled = done < total;
    }

    submitBtn.addEventListener("click", () => {
      if (answers.some((a) => a === null)) return;
      showResult(q, answers);
    });
  }

  // ---------------------------------------------------------- domain manual entry (FSFI)
  function renderDomainManualForm(q, form, submitBtn, progressFill, progressLabel) {
    const domainValues = new Array(q.domains.length).fill(null);

    const info = document.createElement("div");
    info.className = "instructions";
    info.style.marginBottom = "16px";
    info.textContent = q.manualNote;
    form.appendChild(info);

    const grid = document.createElement("div");
    grid.className = "domain-grid";
    q.domains.forEach((d, idx) => {
      const cell = document.createElement("div");
      cell.className = "domain-item";
      cell.innerHTML = `
        <label>${d.label}</label>
        <div class="domain-input-row">
          <input type="number" min="0" max="${d.itemMax * 4}" step="1" inputmode="numeric" data-idx="${idx}" placeholder="suma surowa">
          <span class="domain-coef">× ${d.coefficient}</span>
        </div>
      `;
      grid.appendChild(cell);
    });
    form.appendChild(grid);

    updateProgress();
    grid.addEventListener("input", (e) => {
      const idx = parseInt(e.target.dataset.idx, 10);
      const v = e.target.value;
      domainValues[idx] = v === "" ? null : Math.max(0, parseFloat(v));
      updateProgress();
    });

    function updateProgress() {
      const done = domainValues.filter((a) => a !== null).length;
      const total = domainValues.length;
      progressFill.style.width = (done / total) * 100 + "%";
      progressLabel.textContent = `${done} / ${total}`;
      submitBtn.disabled = done < total;
    }

    submitBtn.addEventListener("click", () => {
      if (domainValues.some((a) => a === null)) return;
      const domainScores = q.domains.map((d, idx) => ({
        label: d.label,
        score: Math.min(6, domainValues[idx] * d.coefficient)
      }));
      const total = Math.round(domainScores.reduce((s, d) => s + d.score, 0) * 100) / 100;
      showResult(q, [], total, { domainScores });
    });
  }

  // ---------------------------------------------------------- shared wiring for simple radio forms
  function wireForm(form, submitBtn, progressFill, progressLabel, answers, onSubmit) {
    updateProgress();

    form.addEventListener("change", (e) => {
      if (e.target.name && e.target.name.startsWith("item")) {
        const idx = parseInt(e.target.name.replace("item", ""), 10);
        answers[idx] = parseInt(e.target.value, 10);
        const itemEl = form.querySelector(`.q-item[data-idx="${idx}"]`);
        itemEl.classList.add("answered");
        itemEl.querySelectorAll(".q-option").forEach((lab) => {
          lab.classList.toggle("selected", lab.querySelector("input").checked);
        });
        updateProgress();
      }
    });

    function updateProgress() {
      const done = answers.filter((a) => a !== null).length;
      const total = answers.length;
      progressFill.style.width = (done / total) * 100 + "%";
      progressLabel.textContent = `${done} / ${total}`;
      submitBtn.disabled = done < total;
    }

    submitBtn.addEventListener("click", () => {
      if (answers.some((a) => a === null)) return;
      onSubmit();
    });
  }

  // ---------------------------------------------------------- result view
  function showResult(q, answers, overrideTotal, extra) {
    const total = overrideTotal !== undefined ? overrideTotal : answers.reduce((s, a) => s + a, 0);
    let result;
    if (q.kind === "dual") {
      result = q.interpret(total, extra.answersA, extra.answersB);
    } else {
      result = q.interpret(total, answers);
    }
    const displayTotal = result.recalculatedScore !== undefined ? result.recalculatedScore : total;

    const tpl = document.getElementById("tpl-result");
    content.innerHTML = "";
    content.appendChild(tpl.content.cloneNode(true));

    const card = document.getElementById("resultCard");

    let subscalesHtml = "";
    if (q.subscales) {
      subscalesHtml = `<div class="result-subscales">` +
        q.subscales
          .map((s) => {
            const sub = s.indices.reduce((sum, i) => sum + answers[i], 0);
            return `<div class="result-subscale"><span class="rs-label">${s.label}</span><span class="rs-val">${sub} pkt</span></div>`;
          })
          .join("") +
        `</div>`;
    } else if (extra && extra.dualSums) {
      subscalesHtml = `<div class="result-subscales">
        <div class="result-subscale"><span class="rs-label">${extra.dualSums ? "" : ""}</span></div>
      </div>`;
    } else if (result.dualSums) {
      subscalesHtml = `<div class="result-subscales">
        <div class="result-subscale"><span class="rs-label">${result.dualSums.labelA}</span><span class="rs-val">${result.dualSums.sumA} pkt</span></div>
        <div class="result-subscale"><span class="rs-label">${result.dualSums.labelB}</span><span class="rs-val">${result.dualSums.sumB} pkt</span></div>
      </div>`;
    } else if (result.categoryFlags) {
      subscalesHtml = `<div class="result-subscales">` +
        result.categoryFlags
          .map(
            (c) => `<div class="result-subscale"><span class="rs-label">${c.label}</span><span class="rs-val" style="color:${c.flagged ? "#c0392b" : "#2fbf71"}">${c.flagged ? "Wskazania" : "Brak wskazań"}</span></div>`
          )
          .join("") +
        `</div>`;
    } else if (extra && extra.domainScores) {
      subscalesHtml = `<div class="result-subscales">` +
        extra.domainScores
          .map((d) => `<div class="result-subscale"><span class="rs-label">${d.label}</span><span class="rs-val">${Math.round(d.score * 100) / 100} / 6</span></div>`)
          .join("") +
        `</div>`;
    }

    let flagHtml = "";
    if (result.flag) {
      flagHtml = `<div class="result-flag">⚠️ ${result.flag}</div>`;
    }

    let crisisHtml = "";
    if (q.suicideItemIndex !== undefined && answers[q.suicideItemIndex] > 0) {
      crisisHtml = `
        <div class="crisis-box">
          <h4>Zaznaczono pozycję dotyczącą myśli samobójczych / autodestrukcyjnych</h4>
          <p style="margin:0">Wynik tej pozycji powyżej 0 wymaga bezpośredniej rozmowy z osobą badaną o bezpieczeństwie oraz rozważenia dalszych kroków klinicznych (ocena ryzyka, kontakt z linią wsparcia, konsultacja psychiatryczna). W sytuacji bezpośredniego zagrożenia życia należy skontaktować się z numerem alarmowym 112 lub Centrum Wsparcia dla osób w kryzysie psychicznym: 800 70 2222.</p>
        </div>`;
    }

    const maxLabel = typeof q.maxScore === "number" && Number.isInteger(displayTotal) ? `/ ${q.maxScore} pkt` : q.maxScore ? `/ ${q.maxScore} pkt` : "";

    card.innerHTML = `
      <h2>${q.fullName}</h2>
      <div class="result-score"><span class="num">${displayTotal}</span><span class="den">${maxLabel}</span></div>
      <div class="result-band">${result.band}</div>
      <p class="result-note">${result.note}</p>
      ${flagHtml}
      ${subscalesHtml}
      ${crisisHtml}
      <p style="margin-top:18px; font-size:.75rem; color:var(--plum-soft)">
        Wynik obliczony ${new Date().toLocaleString("pl-PL")}. Narzędzie ma charakter przesiewowy — ostateczną diagnozę stawia uprawniony specjalista.
      </p>
    `;

    document.getElementById("printBtn").addEventListener("click", () => window.print());
    document.getElementById("retryBtn").addEventListener("click", () => {
      location.hash = "#/q/" + q.id;
      renderQuest(q.id);
    });

    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------- offline status
  function watchOnline() {
    const update = () => {
      const online = navigator.onLine;
      document.querySelectorAll("#offlineDot, #offlineDotSidebar").forEach((el) => {
        el.classList.toggle("dot-online", online);
        el.classList.toggle("dot-offline", !online);
      });
      const t = document.getElementById("offlineTextSidebar");
      if (t) t.textContent = online ? "Połączono" : "Tryb offline";
    };
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
  }

  // ---------------------------------------------------------- service worker
  function registerSW() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }
})();
