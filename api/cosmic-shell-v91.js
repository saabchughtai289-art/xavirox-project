/* V91/V92 — Isolated auth shell + shared client runtime for Xavirox Cosmic OS */

const { THEME_TOGGLE_HTML, THEME_RUNTIME_JS } = require('./cosmic-theme-v92');

const AUTH_UI = (opts = {}) => {
    const errorMsg = opts.error || '';
    const loginFailed = opts.loginFailed || false;
    const failedBanner = loginFailed
        ? '<div class="auth-error-banner">Invalid credentials — matrix sync denied.</div>'
        : '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | Enter The Matrix</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
</head>
<body class="auth-workspace cosmic-theme-body transition-colors duration-500">
    ${THEME_TOGGLE_HTML}
    <div class="auth-ambient-halo" aria-hidden="true"></div>
    <div class="stars-container" id="stars"></div>
    <main class="auth-workspace-inner w-screen h-screen flex items-center justify-center overflow-hidden relative">
        <div class="auth-glass-card ${loginFailed ? 'auth-glitch-flash auth-shake' : ''}" id="authGlassCard">
            <button type="button" class="audio-matrix-toggle" id="audioMatrixToggle" title="Toggle matrix ambience" aria-label="Toggle audio">
                <span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>
            </button>
            <div class="auth-card-header">
                <i class="fas fa-fingerprint auth-fingerprint"></i>
                <h1>ENTER THE MATRIX</h1>
                <p class="cosmic-ping-ticker"><span class="ping-dot"></span> [ ⚡ 4,129 AGENTS SYNCED IN THE MATRIX ]</p>
            </div>
            ${errorMsg ? `<div class="auth-error-banner">${errorMsg}</div>` : ''}
            ${failedBanner}
            <a href="/auth/google" class="hero-google-btn">
                <span class="google-g-mark" aria-hidden="true">G</span>
                <span>CONTINUE WITH GOOGLE</span>
            </a>
            <div class="auth-divider"><span>or sync manually</span></div>
            <form action="/login" method="POST" class="auth-form-stack" id="authLoginForm">
                <input type="text" name="username" class="auth-cyber-input" placeholder="@username" required autocomplete="username">
                <input type="password" name="password" class="auth-cyber-input" placeholder="Password" required autocomplete="current-password">
                <button type="submit" class="auth-submit-btn">LET ME IN</button>
            </form>
            <p class="auth-footer-link">No account? <a href="/signup">Forge identity</a></p>
        </div>
        <p class="auth-brand-signature">getxavirox.xyz</p>
    </main>
    <script>
        ${THEME_RUNTIME_JS}
        (function(){
            const c = document.getElementById('stars');
            if (c) for (let i = 0; i < 60; i++) {
                const s = document.createElement('div');
                s.className = 'star';
                s.style.width = s.style.height = (Math.random() * 2 + 1) + 'px';
                s.style.top = Math.random() * 100 + '%';
                s.style.left = Math.random() * 100 + '%';
                s.style.setProperty('--d', (Math.random() * 4 + 2) + 's');
                c.appendChild(s);
            }
            let audioCtx = null, audioOsc = null, audioGain = null;
            const toggle = document.getElementById('audioMatrixToggle');
            if (toggle) toggle.addEventListener('click', () => {
                toggle.classList.toggle('is-on');
                if (toggle.classList.contains('is-on')) {
                    try {
                        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
                        audioOsc = audioCtx.createOscillator();
                        audioGain = audioCtx.createGain();
                        audioOsc.type = 'sine';
                        audioOsc.frequency.value = 55;
                        audioGain.gain.value = 0.04;
                        audioOsc.connect(audioGain);
                        audioGain.connect(audioCtx.destination);
                        audioOsc.start();
                    } catch (e) {}
                } else {
                    try { if (audioOsc) { audioOsc.stop(); audioOsc = null; } } catch (e) {}
                }
            });
            const form = document.getElementById('authLoginForm');
            if (form) form.addEventListener('submit', (e) => {
                const u = form.querySelector('[name="username"]');
                const p = form.querySelector('[name="password"]');
                if (!u || !p || !u.value.trim() || !p.value) {
                    e.preventDefault();
                    const card = document.getElementById('authGlassCard');
                    if (card) {
                        card.classList.add('auth-glitch-flash', 'auth-shake');
                        setTimeout(() => card.classList.remove('auth-shake'), 600);
                    }
                }
            });
            const params = new URLSearchParams(location.search);
            if (params.get('error') || params.get('failed')) {
                const card = document.getElementById('authGlassCard');
                if (card) {
                    card.classList.add('auth-glitch-flash', 'auth-shake');
                    setTimeout(() => card.classList.remove('auth-glitch-flash', 'auth-shake'), 1200);
                }
            }
        })();
    </script>
</body>
</html>`;
};

const buildGlitchMarketHtml = (user, marketItems, unlockedSet) => {
    if (!user) return '';
    return `<div class="glitch-market-terminal">
        <h2 style="font-size:22px;font-weight:900;margin-bottom:8px;"><i class="fas fa-satellite-dish"></i> GLITCH MARKET TERMINAL</h2>
        <p style="opacity:0.55;font-size:12px;margin-bottom:20px;">Neon cosmetics &amp; matrix upgrades — spend Aura to unlock PRO-tier assets.</p>
        <div class="aura-balance-pill"><i class="fas fa-bolt"></i> ${user.aura} AURA AVAILABLE</div>
        <div class="glitch-market-grid">
            ${marketItems.map(item => {
                const owned = unlockedSet.includes(item.itemName);
                const isPro = item.tier === 'PRO' || item.costInAura >= 400;
                return `<div class="market-item-bento ${owned ? 'owned' : ''} ${isPro ? 'market-pro' : ''}">
                    ${isPro ? '<span class="market-pro-badge">PRO</span>' : ''}
                    <span class="market-item-icon"><i class="fas ${item.iconClass}"></i></span>
                    <div class="market-item-name">${item.itemName.toUpperCase()}</div>
                    <div class="market-item-cost">${item.costInAura} AURA</div>
                    <button type="button" class="market-buy-btn" ${owned ? 'disabled' : ''} onclick="${isPro && !owned ? `openCheckoutModal('${item.itemName}', ${item.costInAura})` : `buyMarketItem('${item.itemName}', ${item.costInAura})`}">${owned ? 'OWNED ✓' : (isPro ? 'UNLOCK PRO' : 'BUY ASSET')}</button>
                </div>`;
            }).join('')}
        </div>
    </div>
    <div id="checkoutModal" class="checkout-modal" hidden>
        <div class="checkout-modal-backdrop" onclick="closeCheckoutModal()"></div>
        <div class="checkout-modal-card glass-surface">
            <h3>PRO CHECKOUT</h3>
            <p id="checkoutItemLabel" style="opacity:0.7;font-size:12px;"></p>
            <button type="button" class="create-btn" id="checkoutConfirmBtn">CONFIRM PURCHASE</button>
            <button type="button" class="action-btn" onclick="closeCheckoutModal()" style="margin-top:10px;">CANCEL</button>
        </div>
    </div>`;
};

const COSMIC_CLIENT_JS = `
        function searchVoid(query) {
            const q = (query || '').toLowerCase().trim();
            document.querySelectorAll('#postsFeedMount .post-card').forEach(card => {
                if (!q) { card.style.display = ''; return; }
                card.style.display = (card.innerText || '').toLowerCase().includes(q) ? '' : 'none';
            });
        }

        async function blockUser(targetUser) {
            if (!confirm('Block this user? Their posts and DMs will be severed.')) return;
            try {
                const res = await fetch('/api/block', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ targetUsername: targetUser }) });
                if (res.status === 200) {
                    document.querySelectorAll('.post-card[data-author="' + targetUser + '"]').forEach(el => el.remove());
                    const dm = document.getElementById('dmComposer');
                    if (dm) dm.hidden = true;
                }
            } catch (e) { alert('Block sync failed.'); }
        }

        async function openDmComposer(targetUser) {
            const panel = document.getElementById('dmComposer');
            if (!panel) { window.location.href = '/dms?with=' + encodeURIComponent(targetUser); return; }
            panel.hidden = false;
            panel.dataset.peer = targetUser;
            document.getElementById('dmPeerLabel').textContent = '@' + targetUser;
            await loadDmThread(targetUser);
            const input = document.getElementById('dmMessageInput');
            if (input) { input.focus(); }
        }

        function closeDmComposer() {
            const panel = document.getElementById('dmComposer');
            if (panel) panel.hidden = true;
        }

        async function loadDmThread(peer) {
            const box = document.getElementById('dmMessages');
            if (!box) return;
            try {
                const res = await fetch('/api/dm/thread/' + encodeURIComponent(peer), { credentials: 'same-origin' });
                const data = await res.json();
                if (!res.ok) { box.innerHTML = '<p class="dm-error">' + (data.error || 'Thread blocked') + '</p>'; return; }
                box.innerHTML = (data.messages || []).map(m => {
                    const mine = m.mine ? 'dm-bubble-mine' : 'dm-bubble-peer';
                    return '<div class="dm-bubble ' + mine + '"><span class="dm-meta">@' + m.sender + '</span><p>' + m.content + '</p></div>';
                }).join('') || '<p style="opacity:0.4;font-size:11px;">No signals yet. Transmit first.</p>';
                box.scrollTop = box.scrollHeight;
            } catch (e) { box.innerHTML = '<p>DM uplink failed.</p>'; }
        }

        async function sendDmMessage(event) {
            event.preventDefault();
            const panel = document.getElementById('dmComposer');
            const peer = panel && panel.dataset.peer;
            const input = document.getElementById('dmMessageInput');
            if (!peer || !input || !input.value.trim()) return;
            const res = await fetch('/api/dm/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ receiver: peer, content: input.value.trim() }) });
            const data = await res.json();
            if (res.ok) { input.value = ''; await loadDmThread(peer); }
            else alert(data.error || 'DM failed');
        }

        let checkoutItem = null, checkoutCost = 0;
        function openCheckoutModal(itemName, cost) {
            checkoutItem = itemName; checkoutCost = cost;
            const modal = document.getElementById('checkoutModal');
            const label = document.getElementById('checkoutItemLabel');
            if (label) label.textContent = itemName.toUpperCase() + ' — ' + cost + ' AURA';
            if (modal) modal.hidden = false;
        }
        function closeCheckoutModal() {
            const modal = document.getElementById('checkoutModal');
            if (modal) modal.hidden = true;
        }
        document.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('checkoutConfirmBtn');
            if (btn) btn.addEventListener('click', () => { if (checkoutItem) buyMarketItem(checkoutItem, checkoutCost); closeCheckoutModal(); });
        });

        function toggleMatrixMode() {
            document.body.classList.toggle('matrix-mode-active');
            const bar = document.getElementById('matrixCommandBar');
            if (bar) bar.classList.toggle('is-open', document.body.classList.contains('matrix-mode-active'));
        }

        function runMatrixCommand() {
            const input = document.getElementById('matrixCommandInput');
            if (!input || !input.value.trim()) return;
            const cmd = input.value.trim().toLowerCase();
            if (cmd === 'help') alert('MATRIX COMMANDS: help, orbit, market, clear');
            else if (cmd === 'orbit') location.href = '/dashboard';
            else if (cmd === 'market') location.href = '/glitch-market';
            else if (cmd === 'clear') input.value = '';
            else alert('Unknown command: ' + cmd);
            input.value = '';
        }

        (function initMatrixToggle() {
            const btn = document.getElementById('matrixModeBtn');
            if (btn) btn.addEventListener('click', toggleMatrixMode);
        })();
`;

module.exports = { AUTH_UI, buildGlitchMarketHtml, COSMIC_CLIENT_JS };
