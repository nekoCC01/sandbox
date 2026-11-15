# Bewegung – Fitnessjournal

Lokale App mit Vanilla HTML, CSS und JavaScript-Modulen. Kein Build und keine Abhängigkeiten. Retrospektives Erfassen absolvierter Workouts, Trainingslog, Körperkarte und Übungsbibliothek.

## Start

Im Repository:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Öffnen: http://127.0.0.1:8080/apps/fitness-tracker/

ES-Module und JSON-Fetch benötigen HTTP. Für gleichbleibende Browserdaten denselben Host und Port verwenden.

## Erfassen

1. „Workout erfassen“ öffnen, Workout oder Einzelübung und Datum auswählen.
2. Bei Hantelübungen Gewicht in **kg pro Hantel** prüfen/eintragen. Das gemeinsame Gewicht füllt die Hantelfelder; manuell angepasste Felder bleiben erhalten. Die Anzahl der Hanteln steht im Übungskatalog.
3. Wiederholungen insgesamt eintragen, ohne Seitenaufteilung. Ein leeres Feld übernimmt aktive Zeit ÷ 5 (3 Sekunden exzentrisch, 2 konzentrisch), ersatzweise eine feste Wiederholungsvorgabe. Ohne Vorgabe ist eine Eingabe erforderlich.
4. Bei Halteübungen stattdessen die aktive Dauer eintragen.
5. Speichern; Einträge können im Trainingslog bearbeitet werden.

Zeitbasierte Wiederholungen sind grobe Schätzungen, auf eine Dezimalstelle gerundet und mit ≈ markiert. Manuelle Werte haben Vorrang. Die Herkunft bleibt als `repsSource: manual|estimated|prescribed` erhalten. Bei einseitigen Übungsphasen enthält die Zeit beide Seiten insgesamt; simultane Bewegungen zählen als ein Bewegungszyklus.

Die eine übernommene Fitness+-Vorlage enthält sechs dokumentierte Slots; ihre ursprüngliche Warnung auf möglicherweise unvollständige Übungsfolge bleibt sichtbar. Es werden keine fehlenden Videophasen oder Gewichte erfunden.

## Datenmodell v2

`data/catalog.json`: Quellen, Anatomie, sechs Grundbewegungen, Übungsfamilien, 29 Übungen und Workouts. Ausschließlich Körpergewicht und Kurzhanteln; keine Bank, Bänder oder Geräte. Vertikales Ziehen bleibt ohne passende Übung, bis sich die Gerätebeschränkung ändert. Nicht sinnvoll zugeordnete Übungen erscheinen als ergänzend.

`data/user.json`: ausschließlich `schemaVersion: 2` und `sessions`.

```text
Grundbewegung ← Familie ← Übung → Muskelgruppen → Körperregion
Workout → geordnete Slots → Übungs-ID + Vorgaben
Session → Workout-ID + Datum + Einträge je Slot + Notizen
Eintrag → Slot-ID + Übungs-ID + tatsächliche Werte + Vorgaben-Snapshot
```

Workouts werden direkt in `catalog.json` gepflegt. Typen: `fitness-plus`, `custom`, `single`. Jeder Slot besitzt eine stabile ID, auch wenn dieselbe Übung mehrfach vorkommt. Das Array bestimmt die Reihenfolge. Beim Umordnen IDs beibehalten; Übungen bestehender Slot-IDs nicht austauschen. Bei inhaltlich neuen oder entfernten Slots eine neue Workout-ID verwenden, damit historische Logs gültig bleiben.

Vorgaben auf Workout-Ebene werden von Slot-Vorgaben überschrieben:

```json
{
  "id": "custom-example",
  "name": "Mein Workout",
  "type": "custom",
  "defaults": { "loadKg": 7 },
  "slots": [
    { "id": "s1", "exerciseId": "goblet-squat", "defaults": { "reps": 10 } },
    { "id": "s2", "exerciseId": "db-row", "defaults": { "durationSeconds": 40, "loadKg": 5 } }
  ]
}
```

Mehrteilige Workouts benötigen pro Slot Zeit oder Wiederholungen. Einzelübungs-Workouts dürfen ohne Vorgabe angelegt werden; dann sind tatsächliche Werte Pflicht. Zeit meint die aktive Phase, ohne Pausen. Bei Halteübungen ist eine Dauer erforderlich. Hantelgewichte müssen beim Erfassen bestätigt werden; fehlend bedeutet nicht null kg.

Sessions speichern die tatsächlichen Werte und eine Kopie der verwendeten Vorgaben (`prescription`). Spätere Änderungen von Vorgaben berechnen alte Sessions nicht neu. Keine Satzhierarchie, Wiederholungsbereiche, Seitenangaben, Tempoauswahl, Ziele oder Trainingsplanung.

## Auswertung

Körperkarte und Bewegungsverteilung verwenden aktive Übungszeit. Fehlt die Dauer, wird `reps × 5 Sekunden` verwendet. Primäre Muskelgruppen erhalten die volle Zeit, unterstützende die halbe Zeit. Die Körperkarte färbt relativ zum höchsten Gruppenwert im ausgewählten Zeitraum ein. Mehrere Muskelgruppen können dieselbe Zeit erhalten; ihre Werte werden nicht auf 100 % normiert.

Die sechs Grundbewegungen und ergänzende Übungen teilen sich die gesamte aktive Zeit. Gewichte und Wiederholungen bleiben im Log sichtbar. Dies beschreibt dokumentierten Bewegungsumfang, keine wissenschaftlich gemessene Intensität, Muskelaktivierung oder Erholung.

## Bereinigung vom 15. November 2026

Unveränderte v1-Dateien liegen in `data/archive/2026-11-15/` (83 Übungen, 15 Vorlagen, 29 Sessions). Das Import-Quelldokument liegt weiterhin unter `data/imports/`. Die aktive Sessionliste wurde geleert. Nur die Fitness+-Vorlage mit Zeitangaben für alle dokumentierten Slots blieb erhalten; dazu kommen Einzelübungs-Vorlagen.

Der neue Browser-Speicherschlüssel lautet `fitness-tracker.user.v2`. `fitness-tracker.user.v1` wird weder geladen noch überschrieben. Unter „Meine Daten → Alten Browserstand sichern“ lässt er sich separat exportieren. Alte v1-Exporte werden nicht importiert; damit kehren bereinigte Einträge nicht still zurück.

## Sichern und ins Repo übernehmen

Unter „Meine Daten“ JSON exportieren oder, in unterstützten Browsern, über „In Datei speichern …“ bewusst `data/user.json` auswählen. Direktspeichern schreibt den vollständigen App-Stand in die ausgewählte Datei.

```sh
node apps/fitness-tracker/scripts/persist.mjs /pfad/fitness-user.json
git diff -- apps/fitness-tracker/data/user.json
```

Das Skript validiert, führt anhand stabiler IDs zusammen und schreibt atomar. Gleiche IDs: Import gewinnt. Fehlende IDs bleiben erhalten. Kein automatischer Commit.

Beim Start gewinnt bei gleicher ID der Browserstand gegenüber der Repo-Datei. Externe Änderungen daher explizit importieren. Speicherfehler ändern den App-Stand nicht; beschädigte Browserdaten sperren Schreibaktionen. Bei Änderungen aus einem anderen Tab vor weiterem Speichern neu laden. Browserdaten sind unverschlüsselt und an Browser und Origin gebunden; regelmäßig exportieren.

## Prüfen

```sh
node --test apps/fitness-tracker/tests/*.test.mjs
node --check apps/fitness-tracker/js/app.mjs
node --check apps/fitness-tracker/js/models.mjs
```

Die Tests prüfen Archivtrennung, Schätzwerte, manuelle Angaben, Halteübungen, Gewichtspflicht, Referenzen, ungültige Daten, Vorgaben-Snapshots, zeitbasierte Statistik, idempotente Imports, Speicherfehler, konkurrierende Tabs und das Persistenzskript.
