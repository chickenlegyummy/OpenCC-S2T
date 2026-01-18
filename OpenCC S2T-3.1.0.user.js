// ==UserScript==
// @name         OpenCC S2T
// @namespace    opencc-s2t-full
// @version      3.1.0
// @description  Full OpenCC Simplified → Traditional (HuijiWiki-safe, debug)
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js
// ==/UserScript==

(function () {
    'use strict';

    const TAG = '[OpenCC-S2T]';

    console.log(TAG, 'Userscript start');

    if (typeof OpenCC === 'undefined') {
        console.error(TAG, 'OpenCC NOT loaded');
        return;
    }

    console.log(TAG, 'OpenCC loaded');

    // CN (Mainland) → TW (Traditional)
    const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
    console.log(TAG, 'Converter ready');

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = converter(node.nodeValue);
        } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            !['SCRIPT','STYLE','TEXTAREA','CODE','PRE','NOSCRIPT'].includes(node.tagName)
        ) {
            node.childNodes.forEach(walk);
        }
    }

    function apply() {
        console.log(TAG, 'Applying conversion');
        walk(document.body);
    }

    // renders late
    setTimeout(apply, 1500);

    // SPA re-render protection
    setInterval(apply, 3000);
})();
