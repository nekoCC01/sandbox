// repo/scripts/module.js
import { greetUser } from './part.js';

export function initSharedModule(context = {}) {
    // Beispiel: DOM-bezogene Initialisierung
    const root = document.querySelector('[data-shared-widget]');
    if (!root) return;

    root.textContent = `Shared widget for: ${context.siteId ?? 'unknown site'}`;

    // nur zu Demo-Zwecken:
    greetUser('Visitor', context);
}
