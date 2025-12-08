// repo/scripts/bootstrap.js
// Klassischer Script-Kontext, KEIN type="module" nötig auf der Seite.

(async function () {
    try {
        // Kontext von der aufrufenden Seite lesen:
        const context = window.SITE_CONFIG || {};

        // Module aus demselben Repo importieren (origin bleibt repo)
        const { initSharedModule } = await import(
            'https://nekocc01.github.io/sandbox/testRepo/scripts/module.js'
        );

        // Initialisieren
        initSharedModule(context);
    } catch (err) {
        console.error('[repo/bootstrap] Failed to initialize shared module:', err);
    }
})();
