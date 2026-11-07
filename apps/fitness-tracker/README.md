# Bewegung – Fitness Tracker

Lokale Fitness-App mit Vanilla HTML, CSS und JavaScript-Modulen. Kein Build, keine Abhängigkeiten, keine DB, kein Backend. Trainingsjournal, Ziele, Meilensteine, einzelne Planungstermine und schematische Muskelkarte. Keine PWA in dieser Version.

## Start

Im Repository:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Öffnen: http://127.0.0.1:8080/apps/fitness-tracker/

ES-Module und JSON-Fetch brauchen HTTP; `file://` genügt nicht. Für gleichbleibende Browserdaten immer denselben Host und Port verwenden. `localhost` und `127.0.0.1` sind verschiedene Origins.

## Was bereits geht

- 66 Übungsvarianten, 17 Familien, Filter nach Grundbewegung, Muskelgruppe und Widerstandsart.
- Training mit Variante, Datum, Kontext, kg, Lastdetails, Wiederholungen je Satz, Anstrengung und Notizen erfassen. Bestehende einzelne Übungseinträge bearbeiten.
- Persönliche Wiederholungsbestwerte je Variante, Kontext und Last. Der erste Eintrag gilt als Ausgangs-Meilenstein.
- Ziele für mindestens einen Satz mit kg und Wiederholungen. Vergleich nur bei gleicher Variante, gleichem Kontext und identischen Lastdetails.
- Verlauf nach Gewicht oder Wiederholungen, mit Ziellinie und zugänglicher Werteliste.
- Körperkarte für 14, 30 oder 90 Tage; auswählbare Muskelgruppen führen zu passenden Übungen. Relatives Satzaufkommen statt behauptetem Muskelwachstum oder Erholungszustand.
- Hinweise auf wenig erfasste Muskelgruppen und auf zweimal erreichte 12 Wiederholungen in allen Sätzen einer integrierten Übung. Kein automatisch verordnetes Gewicht.
- Routinen als einzelne Termine planen; Vorlage Mo A / Do B für noch kommende Tage dieser Woche. Ein Planungstermin zählt nicht als absolviertes Training. „Erfassen“ öffnet die erste Übung; weitere Übungen separat erfassen.
- JSON-Export und geprüfter Import; Browser mit File System Access API können die gewählte JSON-Datei direkt schreiben.

## Datenmodell

`data/catalog.json` enthält die veränderbaren Basisdaten, `data/user.json` ausschließlich persönliche Einträge. Beide sind JSON mit `schemaVersion: 1` und stabilen IDs. Eine ID bleibt auch bei einer Umbenennung gleich. Neue Basisdaten können schrittweise ergänzt werden.

```text
Region ← Muskelgruppe ← Muskel
Grundbewegung ← Übungsfamilie ← Übungsvariante
Unit → Slots mit Übungs-ID, Bewegungs-ID und Zielwiederholungen
Routine → Unit-IDs und Standardrunden
Schedule → Wochentage mit Routine-ID
Journey → Schedule-ID, Wochenzahl und Deload-Wochen
Training → Datum, Kontext, Übungseinträge → Lastdetails und Sätze
Ziel → Variante, Kontext, Lastdetails, Zielgewicht, Zielwiederholungen, Datum
Planungstermin → Datum, Routine-ID, Runden
```

`js/models.mjs` lädt Rohdaten in `Entity`-Unterklassen. `Object.assign` übernimmt skalare Rohdaten; Maps lösen IDs zu Objekten auf. `Exercise` verknüpft Familie, Grundbewegung, Muskelgruppen und Quelle und bietet `variants()` sowie Tempo- und Lastinformationen. `Unit` und `Routine` lösen ihre Beziehungen auf. `TrainingLog` berechnet Verlauf, Muskelbelastung, Zielstatus, Meilensteine und den einfachen Fortschrittshinweis. Muskeln sind bereits als eigene Entitäten angelegt; die Karte arbeitet zunächst auf Gruppenebene. Schedule und Journey sind im Modell vorbereitet; eine Oberfläche für mehrwöchige Blöcke fehlt noch.

Beispiel Training (ein Eintrag pro Übung ist der aktuelle Eingabefluss; das Modell unterstützt mehrere Übungen pro Training):

```json
{
  "id": "stabile-uuid",
  "date": "2026-11-07",
  "createdAt": "2026-11-07T10:00:00.000Z",
  "context": "3xa",
  "notes": "Technik kontrolliert",
  "entries": [{
    "exerciseId": "goblet-squat",
    "loadKg": 16,
    "loadNote": "eine 16-kg-Hantel",
    "sets": [{ "reps": 12, "effort": 3 }, { "reps": 10, "effort": 4 }]
  }]
}
```

`loadKg` ist externe Last, kein berechnetes Körpergewicht. Bei zwei Hanteln Gesamtlast eintragen und in `loadNote` erläutern. Bänder und Unterstützung nicht in kg schätzen: `loadKg: 0`, Aufbau und Bandstärke im Detailfeld dokumentieren. Bandfarbe allein ist nur innerhalb desselben Bandsystems vergleichbar. Einseitige Varianten je Seite dokumentieren und die Konvention konstant halten. Das Eingabeformular verwendet derzeit denselben Anstrengungswert für alle Sätze; JSON kann unterschiedliche Werte enthalten. Beim Bearbeiten im Formular wird dieser Wert vereinheitlicht.

Varianten sind Geschwister derselben Familie, keine automatische Schwierigkeitsrangfolge. Alternative Familien derselben Bewegung sind über `movementId` verbunden. Isolationsübungen müssen nicht zwanghaft einer der Big Six zugeordnet sein. Eine Variante kann `movementId` gezielt überschreiben, z. B. Good Morning.

### Auswertung und Grenzen

- Muskelbelastung: pro Satz 1 für primäre Gruppen, 0,5 für unterstützende Gruppen. Mehrere beteiligte Gruppen bekommen jeweils ihre Zuordnung; keine auf 100 % normierte Muskelverteilung.
- Einfärbung relativ zum höchsten Gruppenwert im Zeitraum. Kein wissenschaftliches Aktivierungsmodell und keine automatische Erholungsberechnung.
- Verlauf vergleicht Variante + Kontext + identische Lastdetails. Satzanzahl, Technik, Bewegungsumfang, tatsächliches Tempo und Erholung müssen zusätzlich berücksichtigt werden. Tempo ist vorerst eine Katalogvorgabe, kein pro Training gemessener Wert.
- Meilensteine beziehen sich auf Wiederholungsbestwerte bei identischer kg-Last, Variante, Lastdetail und Kontext; keine Hochrechnung auf 1RM.
- Ziele gelten als erreicht, sobald ein passender Eintrag mindestens einen Satz mit Zielwiederholungen und mindestens Zielgewicht enthält. Datum ist ein persönlicher Termin, keine Frist für die Anerkennung.
- Kein Löschen, kein automatisches Sync, kein Git-Commit aus dem Browser. Bei importierten Trainings mit mehreren Übungen erfolgt Bearbeitung vorerst in JSON.

## Vom Browser in Git

localStorage ist ein Zwischenspeicher für kleine strukturierte Einträge. Der Store ist separat gekapselt, damit später IndexedDB möglich bleibt. Kein Bild-/Dateispeicher. Privater Modus, gelöschte Browserdaten und Speicherlimits sind Gründe für regelmäßige Exporte. Alle Daten sind unverschlüsselt.

1. Unter **Meine Daten** JSON exportieren. Der Export enthält den zusammengeführten Stand aus Repo und Browser.
2. Datei übernehmen (Pfad mit Leerzeichen in Anführungszeichen):

```sh
node apps/fitness-tracker/scripts/persist.mjs ~/Downloads/fitness-user.json
```

Das Skript validiert gegen den aktuellen Katalog, führt anhand IDs zusammen und schreibt `data/user.json` über eine temporäre Datei mit anschließendem Rename. Gleiche IDs: Import gewinnt. Neue IDs werden ergänzt, fehlende IDs bleiben erhalten. Erneuter Import erzeugt keine Duplikate.

Alternativ **In Datei speichern …** nutzen und bewusst die Repo-Datei `apps/fitness-tracker/data/user.json` auswählen. Diese Aktion schreibt den vollständigen App-Stand direkt in die gewählte Datei; vorher extern geänderte Repo-Daten gegebenenfalls zuerst laden/importieren.

3. Diff prüfen und selbst committen:

```sh
git diff -- apps/fitness-tracker/data/user.json
git add apps/fitness-tracker/data/user.json
git commit -m "Update fitness journal"
```

4. App neu laden. Repo und Browser werden beim Start anhand IDs zusammengeführt; bei gleicher ID gewinnt der Browser. Um einen extern geänderten Stand zu übernehmen, die neue Repo-JSON explizit über **Meine Daten** importieren. Kein stilles Zusammenführen konkurrierender Änderungen innerhalb desselben Datensatzes.

Speicherfehler ändern den App-Stand nicht. Beschädigte lokale Daten werden nicht überschrieben; neue Schreibaktionen sind dann gesperrt. Zur Wiederherstellung zunächst den Wert `fitness-tracker.user.v1` in den Browser-Entwicklerwerkzeugen sichern, dann reparieren oder den Schlüssel nach Sicherung entfernen und eine gültige JSON importieren. Bei Änderungen in einem zweiten Tab vor weiterem Speichern neu laden.

## Quellen und initiale Zuordnungen

Alle zehn vom Nutzer gelieferten 10X-DOCX sind in `catalog.sources` mit Dateinamen erfasst. Es werden kuratierte Fakten gespeichert, nicht die vollständigen Unterlagen.

- Woche 1: sechs Bewegungsmuster; 3s exzentrisch und 2s konzentrisch; AMRAP-Kontext und gleiche Testbedingungen.
- Guides 01a/01b: integrierte Übungen und Varianten. Lunge gehört zu Lower Body Push / Squat.
- Woche 2: Unit A = Squat / Pull / Push, Unit B = Hinge / Row / Press; zwei Units bilden die Big Six.
- Woche 4 und 10: Fortschritt je Übung und vergleichbarer Variante/Kontext; Last und Volumen unterscheiden. Die Starter-Routinen, gewählten Varianten, zwei Wochentage und sechswöchige Journey sind editierbare Beispielentscheidungen, keine vollständige Kurswoche.
- Guides 05–07: zusätzliche Übungsfamilien. 3/2/2-Sekunden-Tempo ist als Standard der isolierenden Übungsart hinterlegt, nicht als vollständig geprüfte Einzelaussage für jedes Video. Rein bildlich dargestellte, unbenannte „Gym only“-Varianten wurden nicht erfunden.
- Good Morning wird in der Quelle unter Leg Curl geführt. Die Quellfamilie bleibt erhalten; die biomechanische Zusatzzuordnung ist Hinge. Auch nicht streng isolierende Kursübungen behalten ihre Kursfamilie.
- Muskelgruppen, einzelne Muskeln und Zuordnungen sind vereinfachte redaktionelle Ergänzungen und keine aus den Dokumenten abgeleiteten Aktivierungsprozente. Anatomiefigur ist ein eigenes schematisches SVG.
- Woche 8 und die nicht trainingsbezogenen Passagen wurden gesichtet. Supplement-, Schmerz-, Medikamenten- und sonstige Gesundheitsbehauptungen werden nicht zu automatischen App-Empfehlungen. Intensitätstechniken, Messwerte und Work-Capacity-Protokolle sind mögliche spätere Erweiterungen, noch kein Eingabefluss.

Bei neuen Buchquellen: zuerst Quelle mit eigener ID ergänzen, dann passende Familie/Muskelgruppe referenzieren oder neue Familie definieren, schließlich Varianten hinzufügen. Bestehende IDs nicht wiederverwenden. Optional können später spezifische Muskel-IDs, Quellen pro Muskelzuordnung und explizite Variantenrelationen hinzukommen.

## Prüfen

```sh
node --test apps/fitness-tracker/tests/*.test.mjs
node --check apps/fitness-tracker/js/app.mjs
```

Tests prüfen Beziehungen, Referenzen, Kalenderdaten, Wertebereiche, idempotentes Zusammenführen, Belastungsberechnung, kontextspezifische Ziele/Bestwerte, Speicherfehler und Änderungen aus konkurrierenden Tabs.
