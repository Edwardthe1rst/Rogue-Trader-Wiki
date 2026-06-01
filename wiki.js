/* ============================================================
   WIKI.JS — Rogue Trader Wiki Engine
   ============================================================ */

(function () {
  'use strict';

  // ── Utilities ─────────────────────────────────────────────

  /** Parse ?file= from URL, return the value or null */
  function getFileParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get('file');
  }

  /** Slugify a heading text into an anchor id */
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /** Convert a relative .md path/link to a wiki.html?file=… URL,
   *  preserving any #anchor.
   *  e.g. "anatomy-of-a-starship.md#cruiser"
   *    → "wiki.html?file=wikis/anatomy-of-a-starship.md#cruiser"
   */
  function mdLinkToWikiUrl(href, currentFile) {
    if (!href) return href;
    // Absolute URLs: leave alone
    if (/^https?:\/\//.test(href)) return href;
    // Already rewritten
    if (href.startsWith('wiki.html')) return href;
    // Anchor-only links (same-page)
    if (href.startsWith('#')) return href;

    let path = href;
    let anchor = '';
    const hashIdx = href.indexOf('#');
    if (hashIdx !== -1) {
      path   = href.slice(0, hashIdx);
      anchor = href.slice(hashIdx); // includes the #
    }

    // If path ends in .md, turn it into a wiki link
    if (path.endsWith('.md') || path === '') {
      // Resolve relative to current file's directory
      let base = '';
      if (currentFile) {
        const lastSlash = currentFile.lastIndexOf('/');
        if (lastSlash !== -1) base = currentFile.slice(0, lastSlash + 1);
      }
      const resolved = path ? base + path : currentFile || '';
      return 'wiki.html?file=' + encodeURIComponent(resolved) + anchor;
    }

    return href;
  }

  /** Extract directory prefix from a file path */
  function dirOf(filePath) {
    const i = filePath.lastIndexOf('/');
    return i >= 0 ? filePath.slice(0, i + 1) : '';
  }

  /** Strip Markdown syntax for plain text preview */
  function stripMarkdown(md) {
    return md
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/^\s*>\s+/gm, '')
      .replace(/\n{2,}/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
  }

  // ── Markdown file cache ───────────────────────────────────
  const mdCache = {};

  function fetchMd(filePath) {
    if (mdCache[filePath]) return Promise.resolve(mdCache[filePath]);
    return fetch(filePath)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (text) {
        mdCache[filePath] = text;
        return text;
      });
  }

  // ── Marked configuration ──────────────────────────────────
  function configureMarked(currentFile) {
    const renderer = new marked.Renderer();
    const headingIds = [];

    // Headings: add id attributes for anchor links
    renderer.heading = function (text, level) {
      const id = slugify(text);
      headingIds.push({ id, text, level });
      return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>';
    };

    // Links: rewrite .md links to wiki links
    renderer.link = function (href, title, text) {
      const newHref = mdLinkToWikiUrl(href, currentFile);
      const isMd = newHref && newHref.startsWith('wiki.html?file=');
      return '<a href="' + newHref + '"'
        + (title ? ' title="' + title + '"' : '')
        + (isMd ? ' class="wiki-link" data-href="' + newHref + '"' : '')
        + '>' + text + '</a>';
    };

    // Images: resolve relative paths
    renderer.image = function (href, title, text) {
      let src = href;
      if (!/^https?:\/\//.test(href) && !href.startsWith('/')) {
        src = dirOf(currentFile) + href;
      }
      return '<img src="' + src + '" alt="' + text + '"'
        + (title ? ' title="' + title + '"' : '') + ' loading="lazy" />';
    };

    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: false,
      headerIds: false  // we handle our own IDs above
    });

    return { renderer, headingIds };
  }

  // ── Table of Contents ─────────────────────────────────────
  function buildTOC(headings) {
    const list = document.getElementById('toc-list');
    if (!list) return;
    list.innerHTML = '';

    headings.forEach(function (h) {
      if (h.level > 4) return;
      const li = document.createElement('li');
      li.className = 'toc-h' + h.level;
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.text;
      li.appendChild(a);
      list.appendChild(li);
    });

    // TOC scroll spy
    const tocLinks = list.querySelectorAll('a');
    if (tocLinks.length === 0) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tocLinks.forEach(function (l) { l.classList.remove('active'); });
            const link = list.querySelector('a[href="#' + entry.target.id + '"]');
            if (link) link.classList.add('active');
          }
        });
      },
      { rootMargin: '-20px 0px -70% 0px' }
    );

    document.querySelectorAll('.wiki-content h1, .wiki-content h2, .wiki-content h3, .wiki-content h4')
      .forEach(function (el) { observer.observe(el); });
  }

  // ── Right sidebar ─────────────────────────────────────────
  function buildSidebar(currentFile, links) {
    const sidebar = document.getElementById('wiki-sidebar-right');
    if (!sidebar) return;
    sidebar.innerHTML = '';


    // Wire up sidebar bookmark btn
    const sbbtn = document.getElementById('sidebar-bookmark-btn');
    if (sbbtn) {
      function refreshSbb() {
        const bm = JSON.parse(localStorage.getItem('rt_wiki_bookmarks') || '[]');
        const exists = bm.some(function (b) { return b.url === window.location.href; });
        sbbtn.textContent = exists ? '✓ Bookmarked' : '🔖 Bookmark';
        sbbtn.classList.toggle('bookmarked', exists);
      }
      refreshSbb();
      sbbtn.addEventListener('click', function () {
        const url = window.location.href;
        let bm = JSON.parse(localStorage.getItem('rt_wiki_bookmarks') || '[]');
        const idx = bm.findIndex(function (b) { return b.url === url; });
        if (idx >= 0) bm.splice(idx, 1);
        else bm.unshift({ url: url, title: document.title });
        localStorage.setItem('rt_wiki_bookmarks', JSON.stringify(bm));
        refreshSbb();
        // Also refresh header bookmark btn if present
        const hbtn = document.getElementById('bookmark-current');
        if (hbtn) hbtn.click(); // noop if already synced, but harmless
      });
    }

    // Related links (extract unique wiki links from content)
    if (links && links.length > 0) {
      const relDiv = document.createElement('div');
      relDiv.className = 'sidebar-widget';
      relDiv.innerHTML = '<div class="sidebar-widget-title">See Also</div>';
      const ul = document.createElement('ul');
      links.slice(0, 8).forEach(function (link) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        li.appendChild(a);
        ul.appendChild(li);
      });
      relDiv.appendChild(ul);
      sidebar.appendChild(relDiv);
    }
  }

  // ── Link Preview ──────────────────────────────────────────
  const previewEl = document.getElementById('link-preview');
  const lpTitle   = document.getElementById('lp-title');
  const lpBody    = document.getElementById('lp-body');
  let previewTimer = null;
  let hideTimer    = null;

  function showPreview(link, x, y) {
    const href = link.getAttribute('data-href') || link.href;
    if (!href || !href.startsWith('wiki.html?file=')) return;

    // Parse file + anchor
    const url    = new URL(href, window.location.href);
    const file   = decodeURIComponent(url.searchParams.get('file') || '');
    const anchor = url.hash.replace('#', '');
    if (!file) return;

    fetchMd(file)
      .then(function (mdText) {
        let preview = '';
        let title   = file.split('/').pop().replace('.md', '').replace(/-/g, ' ');

        if (anchor) {
          // Find the section starting at this heading
          const lines = mdText.split('\n');
          let inSection = false;
          let paragraphs = [];
          const headingSlug = anchor;

          for (let i = 0; i < lines.length; i++) {
            const hMatch = lines[i].match(/^(#{1,6})\s+(.+)/);
            if (hMatch) {
              const sectionSlug = slugify(hMatch[2]);
              if (sectionSlug === headingSlug) {
                title     = hMatch[2];
                inSection = true;
                continue;
              } else if (inSection) {
                // Stop at next same-or-higher heading
                break;
              }
            }
            if (inSection && lines[i].trim()) {
              paragraphs.push(lines[i]);
              if (paragraphs.join(' ').length > 300) break;
            }
          }
          preview = stripMarkdown(paragraphs.join(' ')).slice(0, 300);
        } else {
          // First paragraph of the file (skip headings at the top)
          const lines = mdText.split('\n');
          let paragraphLines = [];
          let started = false;
          for (let i = 0; i < lines.length; i++) {
            const l = lines[i].trim();
            if (!started && (l.startsWith('#') || l === '')) continue;
            started = true;
            if (l === '') break;
            paragraphLines.push(l);
          }
          preview = stripMarkdown(paragraphLines.join(' ')).slice(0, 300);

          // Try to extract title from first H1/H2
          const hMatch = mdText.match(/^#{1,2}\s+(.+)/m);
          if (hMatch) title = hMatch[1];
          else title = file.split('/').pop().replace('.md', '').replace(/-/g, ' ');
        }

        if (!preview) preview = 'No preview available.';

        lpTitle.textContent = title.replace(/`/g, '');
        lpBody.textContent  = preview + (preview.length >= 300 ? '…' : '');

        // Position
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let left = x + 16;
        let top  = y + 16;
        previewEl.style.left = '0';
        previewEl.style.top  = '0';
        previewEl.style.visibility = 'hidden';
        previewEl.style.display    = 'block';
        const pw = previewEl.offsetWidth;
        const ph = previewEl.offsetHeight;
        previewEl.style.visibility = '';
        previewEl.style.display    = '';

        if (left + pw + 20 > vw) left = x - pw - 16;
        if (top  + ph + 20 > vh) top  = y - ph - 16;
        left = Math.max(8, left);
        top  = Math.max(8, top);

        previewEl.style.left = left + 'px';
        previewEl.style.top  = top + 'px';
        previewEl.classList.add('visible');
      })
      .catch(function () {
        // silently fail
      });
  }

  function hidePreview() {
    previewEl.classList.remove('visible');
  }

  function attachLinkPreview(container) {
    container.querySelectorAll('a.wiki-link').forEach(function (link) {
      link.addEventListener('mouseenter', function (e) {
        clearTimeout(hideTimer);
        previewTimer = setTimeout(function () {
          showPreview(link, e.clientX, e.clientY);
        }, 350);
      });

      link.addEventListener('mousemove', function (e) {
        // Update position if not yet visible
        if (!previewEl.classList.contains('visible')) return;
        const vw  = window.innerWidth;
        const vh  = window.innerHeight;
        const pw  = previewEl.offsetWidth;
        const ph  = previewEl.offsetHeight;
        let left  = e.clientX + 16;
        let top   = e.clientY + 16;
        if (left + pw + 20 > vw) left = e.clientX - pw - 16;
        if (top  + ph + 20 > vh) top  = e.clientY - ph - 16;
        previewEl.style.left = Math.max(8, left) + 'px';
        previewEl.style.top  = Math.max(8, top) + 'px';
      });

      link.addEventListener('mouseleave', function () {
        clearTimeout(previewTimer);
        hideTimer = setTimeout(hidePreview, 200);
      });
    });
  }

  // ── Main render function ──────────────────────────────────
  function renderPage(filePath) {
    const article = document.getElementById('wiki-article');
    if (!article) return;

    article.innerHTML = '<div class="wiki-loading" id="wiki-status">Loading manuscript…</div>';
    document.getElementById('toc-list').innerHTML = '';
    document.getElementById('wiki-sidebar-right').innerHTML = '';

    fetchMd(filePath)
      .then(function (mdText) {
        // Configure marked with link rewriting
        const { headingIds } = configureMarked(filePath);

        // Render HTML
        const html = marked.parse(mdText);

        // Extract title (first H1 or filename)
        let pageTitle = filePath.split('/').pop().replace('.md', '').replace(/-/g, ' ');
        const titleMatch = mdText.match(/^#\s+(.+)/m);
        if (titleMatch) pageTitle = titleMatch[1];

        // Capitalise
        document.title = pageTitle + ' — Rogue Trader Compendium';

        // Build article markup
        article.innerHTML =
          '<header>' +
            '<h1 class="wiki-article-title">' + pageTitle + '</h1>' +
            '<div class="wiki-article-meta">' +
              '<span>📜 ' + filePath + '</span>' +
              '<a href="search.html" style="color:var(--text-muted)">⌕ Search</a>' +
            '</div>' +
          '</header>' +
          '<div class="wiki-content">' + html + '</div>';

        // Collect headings populated during rendering
        // (marked calls renderer.heading synchronously, so headingIds is filled)
        buildTOC(headingIds);

        // Collect wiki links for sidebar
        const wikiLinks = [];
        article.querySelectorAll('a.wiki-link').forEach(function (a) {
          const text = a.textContent.trim();
          if (text && !wikiLinks.find(function (l) { return l.href === a.href; })) {
            wikiLinks.push({ href: a.href, text: text });
          }
        });

        buildSidebar(filePath, wikiLinks);
        attachLinkPreview(article);

        // Scroll to anchor if present
        const hash = window.location.hash;
        if (hash) {
          setTimeout(function () {
            const target = document.getElementById(hash.slice(1));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      })
      .catch(function (err) {
        article.innerHTML =
          '<div class="wiki-error">' +
            '<p>Could not load <code>' + filePath + '</code></p>' +
            '<p style="font-size:0.85rem;color:var(--text-muted);margin-top:12px;">' + err.message + '</p>' +
            '<p style="margin-top:20px;"><a href="home.html" class="btn btn-secondary">← Return to Home</a></p>' +
          '</div>';
      });
  }

  // ── Initialise ────────────────────────────────────────────
  function init() {
    const filePath = getFileParam();

    if (!filePath) {
      // No file param: show index page
      const article = document.getElementById('wiki-article');
      if (article) {
        article.innerHTML =
          '<h1 class="wiki-article-title">Wiki Index</h1>' +
          '<div class="wiki-content">' +
            '<p>No page selected. Use the navigation above to browse, or ' +
            '<a href="search.html">search the compendium</a>.</p>' +
          '</div>';
      }
      document.title = 'Wiki — Rogue Trader Compendium';
      return;
    }

    renderPage(filePath);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle browser back/forward navigation
  window.addEventListener('popstate', function () {
    const filePath = getFileParam();
    if (filePath) renderPage(filePath);
  });

})();
