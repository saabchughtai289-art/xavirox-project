/* V92 — Hex-perfect theme runtime, post composer media, aura matrix FX */

const THEME_TOGGLE_HTML = `
<button type="button" id="cosmicThemeToggle" class="cosmic-theme-toggle" aria-label="Toggle light and dark theme" title="Toggle theme">
    <i class="fas fa-sun theme-icon-light" aria-hidden="true"></i>
    <i class="fas fa-moon theme-icon-dark" aria-hidden="true"></i>
</button>`;

const THEME_RUNTIME_JS = `
(function initCosmicTheme() {
    const STORAGE_KEY = 'xavirox_theme';
    const root = document.documentElement;
    const btn = document.getElementById('cosmicThemeToggle');
    const apply = (mode) => {
        const isDark = mode === 'dark';
        root.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
        if (btn) {
            btn.classList.toggle('is-dark', isDark);
            btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        }
    };
    const saved = localStorage.getItem(STORAGE_KEY);
    apply(saved === 'dark' ? 'dark' : 'light');
    window.toggleTheme = function toggleTheme() {
        const next = root.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        apply(next);
        fetch('/api/theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ theme: next })
        }).catch(() => {});
    };
    if (btn) btn.addEventListener('click', window.toggleTheme);
})();
`;

const POST_COMPOSER_JS = `
(function initPostComposer() {
    const form = document.getElementById('mainPostForm');
    const fileInput = document.getElementById('postMediaInput');
    const preview = document.getElementById('mediaPreviewMount');
    if (!form || !fileInput || !preview) return;

    let objectUrl = null;
    const clearPreview = () => {
        if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
        preview.innerHTML = '';
        preview.hidden = true;
        fileInput.value = '';
    };

    fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) { clearPreview(); return; }
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = URL.createObjectURL(file);
        const isVideo = (file.type || '').startsWith('video/');
        preview.hidden = false;
        preview.innerHTML = isVideo
            ? '<video src="' + objectUrl + '" controls playsinline class="rounded-xl w-full max-h-96 object-cover composer-media-preview"></video><button type="button" class="media-preview-clear" aria-label="Remove media">✕</button>'
            : '<img src="' + objectUrl + '" alt="Preview" class="rounded-xl w-full max-h-96 object-cover composer-media-preview" /><button type="button" class="media-preview-clear" aria-label="Remove media">✕</button>';
        const clearBtn = preview.querySelector('.media-preview-clear');
        if (clearBtn) clearBtn.addEventListener('click', clearPreview);
    });

    form.addEventListener('submit', async (event) => {
        if (form.dataset.ajax !== '1') return;
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        try {
            const fd = new FormData(form);
            const res = await fetch('/addpost', { method: 'POST', body: fd, credentials: 'same-origin' });
            if (res.redirected || res.ok) {
                const tx = document.getElementById('txBarEngine');
                if (tx) tx.value = '';
                localStorage.removeItem('xavirox_draft');
                clearPreview();
                window.location.href = res.url && res.redirected ? res.url : '/dashboard';
                return;
            }
            alert('Transmission failed — matrix uplink rejected.');
        } catch (e) {
            alert('Transmission uplink failed.');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
})();
`;

const AURA_MATRIX_JS = `
async function interact(event, postId, type) {
    const card = document.querySelector('.post-card[data-post-id="' + postId + '"]');
    const btn = event && event.currentTarget;
    try {
        const res = await fetch('/interact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ postId, type })
        });
        if (res.status === 200) {
            const data = await res.json();
            if (type === 'save') {
                if (btn) btn.classList.toggle('active-save');
                return;
            }
            if (type === 'crown' && card) {
                spawnAuraBurst(card, '+100', 'aura-burst-win');
                card.classList.add('aura-w-flash');
                setTimeout(() => card.classList.remove('aura-w-flash'), 600);
            }
            if (type === 'skull' && card) {
                card.classList.add('aura-l-aberration');
                spawnAuraBurst(card, '-50', 'aura-burst-lose');
                setTimeout(() => card.classList.remove('aura-l-aberration'), 700);
            }
            if (data.reactions && data.counts) {
                const wBtn = card && card.querySelector('.wl-w-btn');
                const lBtn = card && card.querySelector('.wl-l-btn');
                if (wBtn) {
                    wBtn.innerHTML = 'W ' + (data.counts.crown || 0);
                    wBtn.classList.toggle('active', data.userVote === 'crown');
                }
                if (lBtn) {
                    lBtn.innerHTML = 'L ' + (data.counts.skull || 0);
                    lBtn.classList.toggle('active', data.userVote === 'skull');
                }
            }
            if (typeof data.authorAura === 'number') {
                const badge = card && card.querySelector('.aura-badge-live');
                if (badge) badge.textContent = data.authorAura;
            }
            if (typeof data.voterAura === 'number') {
                const island = document.querySelector('.island-main');
                if (island && island.dataset.selfAura !== undefined) {
                    island.textContent = '⚡ AURA LEVEL: ' + data.voterAura;
                }
            }
        } else if (res.status === 401) {
            window.location.href = '/login';
        }
    } catch (e) {}
}

function spawnAuraBurst(anchor, label, cls) {
    const burst = document.createElement('div');
    burst.className = 'aura-particle-burst ' + (cls || '');
    burst.textContent = label + ' AURA';
    const rect = anchor.getBoundingClientRect();
    burst.style.left = (rect.left + rect.width / 2) + 'px';
    burst.style.top = (rect.top + 40) + 'px';
    document.body.appendChild(burst);
    requestAnimationFrame(() => burst.classList.add('is-active'));
    setTimeout(() => burst.remove(), 900);
}
`;

function renderPostMedia(mediaUrl) {
    if (!mediaUrl) return '';
    const isVideo = mediaUrl.startsWith('data:video')
        || /video\//i.test(mediaUrl)
        || /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl);
    if (isVideo) {
        return `<video src="${mediaUrl}" controls playsinline class="rounded-xl w-full max-h-96 object-cover post-media-node"></video>`;
    }
    return `<img src="${mediaUrl}" alt="transmission media" class="rounded-xl w-full max-h-96 object-cover post-media-node" loading="lazy" />`;
}

function auraAvatarRingClass(aura) {
    if (aura >= 500) return 'aura-ring-god';
    if (aura < 0) return 'aura-ring-glitch';
    if (aura < 50) return 'aura-ring-critical';
    return '';
}

function wrapAuraAvatar(innerHtml, aura) {
    const ring = auraAvatarRingClass(aura);
    return `<div class="aura-avatar-wrap ${ring}">${innerHtml}</div>`;
}

function formatTopAlphaTicker(topUser) {
    if (!topUser) {
        return `[ 👑 CURRENT TOP ALPHA AGENT: @void // STATUS: SCANNING // AURA: — ]`;
    }
    const status = topUser.aura >= 9000 ? 'GOD MODE' : topUser.aura >= 500 ? 'SIGMA PRIME' : 'RISING';
    const auraLabel = topUser.aura >= 9000 ? 'LEVEL OVER 9000' : String(topUser.aura);
    return `[ 👑 CURRENT TOP ALPHA AGENT: @${topUser.username} // STATUS: ${status} // AURA: ${auraLabel} ]`;
}

function topAlphaTickerHtml(topUser) {
    return `<div class="top-alpha-ticker glass-surface" aria-live="polite">${formatTopAlphaTicker(topUser)}</div>`;
}

module.exports = {
    THEME_TOGGLE_HTML,
    THEME_RUNTIME_JS,
    POST_COMPOSER_JS,
    AURA_MATRIX_JS,
    renderPostMedia,
    auraAvatarRingClass,
    wrapAuraAvatar,
    formatTopAlphaTicker,
    topAlphaTickerHtml
};
