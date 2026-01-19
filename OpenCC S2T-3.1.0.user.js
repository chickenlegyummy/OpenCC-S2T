// ==UserScript==
// @name         OpenCC S2T
// @namespace    opencc-s2t-full
// @version      3.1.1
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

    function walk(node, skipElement) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = converter(node.nodeValue);
        } else if (
            node.nodeType === Node.ELEMENT_NODE &&
            !['SCRIPT','STYLE','TEXTAREA','CODE','PRE','NOSCRIPT'].includes(node.tagName)
        ) {
            // Skip the currently focused element to avoid cursor jumping
            if (node === skipElement) return;
            node.childNodes.forEach(child => walk(child, skipElement));
        }
    }

    function apply() {
        // Check if user is currently typing in an editable element
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );

        if (isTyping) {
            return;
        }

        walk(document.body, null);
    }

    // renders late
    setTimeout(apply, 1500);

    // SPA re-render protection
    setInterval(apply, 3000);
})();
