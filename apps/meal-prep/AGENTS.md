# Meal-Prep-Projektregeln

Ziel: schnell sichtbar machen, wie einmal vorbereitete Zutaten mehrere Mahlzeiten ergeben. KISS: Vanilla HTML/CSS/JS, keine Datenbank, keine Build-Abhängigkeiten.

Bei Rezeptimporten zuerst `REZEPT-IMPORT.md` lesen. Als Formvorlage dienen `inbox/_beispiel-couscous/quelle.json` und `datensatz.json`; sie sind bereits eingearbeitet und dürfen nicht erneut importiert werden. Neue Quellen nur aus dem ausdrücklich genannten Ordner oder den aktuellen Chat-Anhängen übernehmen.

- Auf das Wesentliche reduzieren: möglichst 2–4 Gerichte je Kombi, umfangreiche Wochenpläne teilen, Bonusgerichte ignorieren. Keine vollständigen Buchtexte abschreiben.
- Gemeinsame Vorbereitungen als Bausteine erfassen. Pro Gericht Anteile und nur zusätzliche Zutaten angeben. Keine doppelte Erfassung derselben Menge in Baustein und Rezept.
- Deutsch, metrische Angaben, kurze Schritte. Originalmengen und eigene Anpassungen unterscheiden. Roh-/Garzustand und Abtropfgewicht erhalten. Garzeiten nicht proportional skalieren.
- Fehlende/unleserliche Mengen, Buchangaben oder Schritte nicht als Fakten erfinden. Kritische Unklarheiten gezielt erfragen; abhängige Daten bis dahin als Entwurf außerhalb von `data.js` behalten. Unabhängige Teile weiterbearbeiten.
- Kochbücher gesondert in `cookbooks.js`; Kombis mit `bookId`, `originalTitle` und `bookReference` zuordnen. Originaltitel bewahren, App-Kurztitel zusätzlich möglich. Seitenzahlen nur aus bestätigter Quelle.
- Bestehende Zutaten-IDs und Einheiten wiederverwenden. Neue IDs stabil und eindeutig. `supporting: true` nur für Nebenrollen wie Öl, Brühe oder Gewürze. Tragende Zutaten werden automatisch aus der Verwendung in mehreren Gerichten abgeleitet.
- Änderungen/Umrechnungen in `scalingNote`, Ablauf in `planNote`, Herkunft in `source` dokumentieren. Quellenmaterial unverändert lassen, Importentscheidungen in `import-notizen.md` im Quellordner festhalten.
- Bestehende Kombis nicht unbeauftragt löschen/ersetzen. Beispielablage nicht in den App-Katalog aufnehmen. Keine neue Oberfläche oder Infrastruktur für einen reinen Datenimport bauen.
- Nach Änderungen `node apps/meal-prep/scripts/check-data.mjs` vom Repository-Stamm aus ausführen. Bei Änderungen an Importprüfungen auch `--self-test` verwenden. Bei UI-Änderungen zusätzlich JS-Syntax und nach Möglichkeit Browseransicht prüfen. Nicht ausgeführte Prüfungen benennen.
- Abschluss kurz: neue Kombis, gemeinsame Bausteine, wesentliche Vereinfachungen, offene Angaben und Prüfergebnis. Kein Commit/Push allein aufgrund eines Imports.
