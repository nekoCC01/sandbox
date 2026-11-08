# Ausgefülltes Beispiel

Diese Vorlage zeigt die bereits erfasste Couscous-Kombi aus „Meal Prep“. **Nicht erneut importieren.**

- `quelle.json`: Angaben, die du vor dem Import bereitstellen kannst.
- `datensatz.json`: vollständiger, eigenständig prüfbarer Ausschnitt im bestehenden App-Datenformat. Zum Orientieren, nicht manuell ausfüllen müssen.
- `import-notizen.md`: Beispiel für das Ergebnisprotokoll.

Für neue Rezepte einen eigenen Ordner nach `../<bookId>/<originaltitel-slug>/` anlegen und die [leere Vorlage](../quelle.json) dorthin kopieren. Bekannte Angaben ergänzen, Unbekanntes als `null` lassen. Bei `files: null` liest Codex alle Bilder/PDFs direkt im neuen Ordner automatisch in numerischer Reihenfolge. `datensatz.json` wird nicht automatisch von der App geladen.
