/* ============================================================
   SEARCH.JS — Rogue Trader Wiki Search Engine
   ============================================================ */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════
  // CONFIGURATION
  // Edit this list to add/remove wiki files from the search index.
  // ══════════════════════════════════════════════════════════
  const WIKI_FILES = [
    'wikis/rogue-traders.md',
    'wikis/adeptus-astartes.md',
    'wikis/adeptus-mechanicus.md',
    'wikis/astra-militarum.md',
    'wikis/inquisition.md',
    'wikis/imperial-creed.md',
    'wikis/hive-worlds.md',
    'wikis/eldar.md',
    'wikis/orks.md',
    'wikis/tau.md',
    'wikis/tyranids.md',
    'wikis/necrons.md',
    'wikis/chaos.md',
    'wikis/chaos-gods.md',
    'wikis/heretic-astartes.md',
    'wikis/anatomy-of-a-starship.md',
    'wikis/cruisers.md',
    'wikis/frigates.md',
    'wikis/capital-ships.md',
    'wikis/warp-travel.md',
    'wikis/ship-combat.md',
    'wikis/crew-and-morale.md',
    'wikis/warp.md',
    'wikis/webway.md',
    'wikis/eye-of-terror.md',
    'wikis/koronus-expanse.md',
    'wikis/calixis-sector.md',
    'wikis/segmentum.md',
    'wikis/characteristics.md',
    'wikis/skills.md',
    'wikis/talents.md',
    'wikis/combat.md',
    'wikis/archetypes.md',
    'wikis/profit-factor.md',
    'wikis/acquisitions.md',
  ];

  // ── Utilities ─────────────────────────────────────────────

  function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function stripMarkdown(md) {
    return md
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/^\s*>\s+/gm, '')
      .trim();
  }

  /** Extract the filename stem (no path, no extension, no #anchor) for redirect matching */
  function fileStem(filePath) {
    return filePath.split('/').pop().replace(/\.md$/, '').toLowerCase();
  }

  // ── Index structure ───────────────────────────────────────
  // We build an array of "documents": each heading + its following text becomes one entry.

  /**
   * Parse a markdown file into sections:
   * [{ file, heading, headingSlug, level, text, plainText }]
   */
  function parseSections(filePath, mdText) {
    const lines    = mdText.split('\n');
    const sections = [];

    let currentHeading     = '';
    let currentHeadingSlug = '';
    let currentLevel       = 0;
    let bodyLines          = [];

    // Extract first H1/H2 as file title
    let fileTitle = fileStem(filePath).replace(/-/g, ' ');
    const titleMatch = mdText.match(/^#{1,2}\s+(.+)/m);
    if (titleMatch) fileTitle = titleMatch[1];

    function flush() {
      const text = bodyLines.join('\n').trim();
      sections.push({
        file:         filePath,
        fileTitle:    fileTitle,
        heading:      currentHeading,
        headingSlug:  currentHeadingSlug,
        level:        currentLevel,
        text:         text,
        plainText:    stripMarkdown(text),
      });
      bodyLines = [];
    }

    lines.forEach(function (line) {
      const hMatch = line.match(/^(#{1,6})\s+(.+)/);
      if (hMatch) {
        flush();
        currentLevel       = hMatch[1].length;
        currentHeading     = hMatch[2].replace(/\*+/g, '').trim();
        currentHeadingSlug = slugify(currentHeading);
      } else {
        bodyLines.push(line);
      }
    });
    flush();

    return sections;
  }

  // ── Fuzzy match ───────────────────────────────────────────

  /**
   * Very lightweight fuzzy scorer.
   * Returns a score [0..1] where 1 = perfect match.
   */
  function fuzzyScore(query, text) {
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    if (t.includes(q)) return 1; // exact substring
    let score = 0;
    let qi = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) { score++; qi++; }
    }
    if (qi < q.length) return 0; // not all chars found in order
    return score / Math.max(t.length, q.length);
  }

  /**
   * Score a section against a query.
   * Returns a combined score weighted by title match vs body match.
   */
  function scoreSection(section, query) {
    const q = query.toLowerCase();

    // Heading / title match gets heavy weight
    const headingScore  = fuzzyScore(q, section.heading || section.fileTitle) * 4;
    const fileTitleScore = fuzzyScore(q, section.fileTitle) * 2;

    // Plain-text body match: check each sentence
    const sentences = section.plainText.split(/[.!?]\s+/);
    let bodyScore = 0;
    sentences.forEach(function (s) {
      const sc = fuzzyScore(q, s);
      if (sc > bodyScore) bodyScore = sc;
    });

    return headingScore + fileTitleScore + bodyScore;
  }

  // ── Exact search ──────────────────────────────────────────

  function exactScore(section, query) {
    const q = query.toLowerCase();
    const inHeading = (section.heading || '').toLowerCase().includes(q) ? 3 : 0;
    const inTitle   = section.fileTitle.toLowerCase().includes(q) ? 2 : 0;
    const inBody    = section.plainText.toLowerCase().includes(q) ? 1 : 0;
    return inHeading + inTitle + inBody;
  }

  // ── Snippet extraction ────────────────────────────────────

  function extractSnippet(text, query, maxLen) {
    maxLen = maxLen || 300;
    const lower = text.toLowerCase();
    const q     = query.toLowerCase();
    const idx   = lower.indexOf(q);
    let start   = 0;
    if (idx > 60) start = idx - 60;
    const snip = text.slice(start, start + maxLen);
    // Highlight matches
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escapeHtml(snip).replace(re, '<mark>$1</mark>') + (snip.length >= maxLen ? '…' : '');
  }

  // ── Render results ────────────────────────────────────────

  function renderResults(results, query, isExact) {
    const container = document.getElementById('search-results');
    const status    = document.getElementById('search-status');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML =
        '<div class="search-no-results">' +
          '<p>No results found for <strong>"' + escapeHtml(query) + '"</strong></p>' +
          '<p style="margin-top:8px;font-size:0.8rem;">Try different keywords or check spelling.</p>' +
        '</div>';
      status.textContent = 'No results';
      return;
    }

    status.textContent = results.length + ' result' + (results.length !== 1 ? 's' : '') +
      ' for "' + query + '"' + (isExact ? ' (exact match)' : ' (fuzzy match)');

    container.innerHTML = results.map(function (r) {
      const section  = r.section;
      const href     = 'wiki.html?file=' + encodeURIComponent(section.file) +
                       (section.headingSlug && section.level > 0 ? '#' + section.headingSlug : '');
      const titleStr = section.heading && section.level > 0
        ? section.fileTitle + ' <span style="color:var(--text-muted)">›</span> ' + section.heading
        : section.fileTitle;
      const snippet  = extractSnippet(section.plainText, query, 300);
      const sectionBadge = section.heading && section.level > 0
        ? '<span class="search-result-section">' + escapeHtml(section.heading) + '</span><br>'
        : '';

      return '<div class="search-result" onclick="window.location.href=\'' + href + '\'">' +
               '<div class="search-result-title">' + escapeHtml(titleStr) + '</div>' +
               '<div class="search-result-path">' + escapeHtml(section.file) + '</div>' +
               sectionBadge +
               '<div class="search-result-snippet">' + snippet + '</div>' +
             '</div>';
    }).join('');
  }

  // ── Auto-redirect ─────────────────────────────────────────
  // If query matches a heading ID or file stem exactly, redirect immediately.

  function tryAutoRedirect(query, index) {
    const q     = query.toLowerCase().trim();
    const qSlug = slugify(q);

    // 1. Exact file stem match
    for (let i = 0; i < WIKI_FILES.length; i++) {
      if (fileStem(WIKI_FILES[i]) === q || fileStem(WIKI_FILES[i]) === qSlug) {
        window.location.href = 'wiki.html?file=' + encodeURIComponent(WIKI_FILES[i]);
        return true;
      }
    }

    // 2. Exact heading match across all sections
    for (let i = 0; i < index.length; i++) {
      const s = index[i];
      if (s.heading && (s.heading.toLowerCase() === q || slugify(s.heading) === qSlug)) {
        const anchor = s.headingSlug ? '#' + s.headingSlug : '';
        window.location.href = 'wiki.html?file=' + encodeURIComponent(s.file) + anchor;
        return true;
      }
    }

    // 3. Exact file title match
    for (let i = 0; i < index.length; i++) {
      const s = index[i];
      if (s.fileTitle.toLowerCase() === q) {
        window.location.href = 'wiki.html?file=' + encodeURIComponent(s.file);
        return true;
      }
    }

    return false;
  }

  // ── Index loading ─────────────────────────────────────────

  let searchIndex = [];
  let loadedFiles = 0;
  let totalFiles  = 0;

  function loadIndex(onComplete) {
    totalFiles = WIKI_FILES.length;
    if (totalFiles === 0) { onComplete([]); return; }

    const status = document.getElementById('search-status');

    WIKI_FILES.forEach(function (filePath) {
      fetch(filePath)
        .then(function (r) {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        })
        .then(function (mdText) {
          const sections = parseSections(filePath, mdText);
          searchIndex = searchIndex.concat(sections);
        })
        .catch(function () {
          // File not found — add a placeholder so the file is known to exist
          searchIndex.push({
            file:         filePath,
            fileTitle:    fileStem(filePath).replace(/-/g, ' '),
            heading:      '',
            headingSlug:  '',
            level:        0,
            text:         '',
            plainText:    '',
          });
        })
        .finally(function () {
          loadedFiles++;
          if (status) {
            status.textContent = 'Indexing manuscripts… ' + loadedFiles + '/' + totalFiles;
          }
          if (loadedFiles >= totalFiles) {
            onComplete(searchIndex);
          }
        });
    });
  }

  // ── Run search ────────────────────────────────────────────

  function runSearch(query) {
    if (!query.trim()) return;

    // Detect exact mode: "quoted string"
    let isExact = false;
    let q = query.trim();
    if ((q.startsWith('"') && q.endsWith('"')) || (q.startsWith("'") && q.endsWith("'"))) {
      isExact = true;
      q = q.slice(1, -1);
    }

    const status = document.getElementById('search-status');
    if (status) status.textContent = 'Searching…';

    loadIndex(function (index) {
      // Auto-redirect check (case-insensitive, no quotes required)
      if (tryAutoRedirect(q, index)) return;

      // Score all sections
      const scored = index.map(function (section) {
        const score = isExact ? exactScore(section, q) : scoreSection(section, q);
        return { section: section, score: score };
      });

      // Filter and sort
      const results = scored
        .filter(function (r) { return r.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 40); // cap results

      renderResults(results, q, isExact);
    });
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    const input  = document.getElementById('search-input');
    const btn    = document.getElementById('search-btn');
    if (!input || !btn) return;

    // Check for ?q= in URL
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    if (qParam) {
      input.value = qParam;
      runSearch(qParam);
    }

    // Search on button click
    btn.addEventListener('click', function () {
      runSearch(input.value);
    });

    // Search on Enter
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') runSearch(input.value);
    });

    // Update URL on search
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const newUrl = 'search.html?q=' + encodeURIComponent(input.value.trim());
        history.replaceState(null, '', newUrl);
      }
    });

    btn.addEventListener('click', function () {
      const newUrl = 'search.html?q=' + encodeURIComponent(input.value.trim());
      history.replaceState(null, '', newUrl);
    });

    // Focus search input
    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
