# Website AV Stuttgart

**Abhängigkeitssicherheit (2026-11-02):** Express wurde auf 4.22.3 aktualisiert (u. a. body-parser 1.20.9, path-to-regexp 0.1.13, qs 6.16.2, send 0.19.2, serve-static 1.16.3). Beide Apps verwenden jetzt Vite statt des veralteten CRA-Werkzeugs; React 18 und die bestehende Oberfläche bleiben erhalten. React Router wurde auf 7.18.5 aktualisiert, da neuere Sicherheitskorrekturen nicht vollständig in Version 6 verfügbar sind.

Geprüft mit den aktuellen npm-Advisory-Daten:

- Root: `npm audit --omit=dev` meldet **0** Schwachstellen. Diese Abhängigkeiten werden im Produktionscontainer installiert; Vite und Testwerkzeuge sind dort nicht enthalten.
- `my-app`: `npm audit --prefix my-app` meldet **0** Schwachstellen einschließlich der Build-/Testwerkzeuge. Die eigenständige Starter-App bleibt erhalten. Docker und das Deployment verwenden ausschließlich die Root-App mit `server.js`; kein Script verweist auf `my-app` als Teil des ausgelieferten Builds.
- Root einschließlich Entwicklungswerkzeugen: **4 moderate betroffene Pakete**, keine hohen oder kritischen Befunde. Die Kette `@applitools/eyes-playwright → … → webdriver → @wdio/config → glob → minimatch` enthält noch [glob 13.0.6](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) und [minimatch 10.2.6](https://github.com/advisories/GHSA-g3hv-75wg-m249). Die korrigierten Hauptversionen passen nicht zu den Vorgaben der Elternpakete. Applitools wird von keinem vorhandenen Test oder Anwendungscode aufgerufen und bleibt ausschließlich eine Entwicklungsabhängigkeit. Keine erzwungenen Overrides.

Die Prüfungen betreffen npm-Abhängigkeiten in diesem Stand, nicht bereits laufende Deployments oder alle Anwendungssicherheitsprobleme. Bereits vorhanden und weiterhin offen: Die Analytics-Lese-/Export-API prüft das Passwort nicht serverseitig; außerdem erlaubt die CORS-Middleware fremde Origins. Eine fehlerfreie Dependency-Prüfung behebt diese Zugriffskontrollen nicht.

## Lokal entwickeln und prüfen

Node.js 24 LTS verwenden (`.node-version`). Die Produktionsimages verwenden ebenfalls Node 24 statt des nicht mehr unterstützten Node 18.

```sh
npm ci
npm start                 # Vite auf Port 3000
npm run server           # separates Terminal: Express/API auf Port 3001
npm run build            # Ausgabe weiterhin in build/
npm test                 # isolierte Express-Integrationstests
npx playwright install chromium firefox webkit
npm run test:e2e          # baut die Seite und testet sie über Express
npm ci --prefix my-app
npm run build --prefix my-app
npm test --prefix my-app
```

Die Express-Tests prüfen statische Dateien, Cache-/Range-Anfragen, SPA-Routen, API-404, ungültige/zu große JSON-Anfragen und Analytics-Schreib-/Lesevorgänge in einem temporären Verzeichnis. Die Browser-Tests prüfen Navigation, Sprachen, YAML-Inhalte, Menü und responsive Darstellung. Drei vorhandene Browser-Tests pro Browser sind weiterhin übersprungen.

Pull Requests prüfen Builds, Tests und Audits und bauen das ARM64-Dockerimage ohne Veröffentlichung. Nur ein Push auf `main` darf anschließend ein Image veröffentlichen und das vorhandene Deployment ausführen. Der Root-Audit blockiert hohe/kritische Entwicklungsbefunde sowie sämtliche Produktionsbefunde; die dokumentierten moderaten Applitools-Befunde bleiben sichtbar.

## Wie füge ich Inhalt hinzu?

Wenn man Inhalt hinzufügen will, oder ändern will, muss man einfach das [content_de.yaml](https://github.com/NicolasMahn/AV_Stuttgart/blob/main/public/content_de.yaml) (oder die Datei mit dem englischen Inhalt [content_en.yaml](https://github.com/NicolasMahn/AV_Stuttgart/blob/main/public/content_en.yaml)) aufmachen und editieren.

<img width="414" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/fd2e905c-3a3f-4946-b206-61ab891980ad">

Dann kann man den Link zu einer Quelle hinzufügen. Dafür muss man sich zuerst überlegen unter welcher Überkategorie die Quelle fällt. Die Reihenfolge der Links in der yaml Datei entspricht der Anzeige Reihenfolge auf der Website.
Beispielsweise wird hier die Rede von Joey Carbstrong hinzufügen ([Link zum Video](https://www.youtube.com/watch?v=4XDVGgZijLA)). Diese fällt unter die Kategorie Ethik.
Dafür muss ich einen Titel hinzufügen, den Link, und am besten auch in welcher Sprache das Video ist. Wenn man will kann man auch eine 'description' zu der Quelle hinzufügen.
Bei den Spach-Kategorien, bitte nur 'de' für deutsch ode 'en' für englisch schreiben.

```yaml
  - title: "Wieso wir vegan leben sollten!"
    description: "Die Rede des australischen Tierrechtsaktivisten Joey Carbstrong in Oxford, in der er für eine vegane Welt argumentiert"
    url: "https://www.youtube.com/watch?v=4XDVGgZijLA"
    thumbnail_url: null # Hier kann man dem Link ein großes Bild geben.
    image_url: null # Was man für das Bild machen soll, kommt im nächsten Abschnitt
    dub: "en"
    sub: null
```

Wenn ein Youtube Video mit deutschen Untertiteln (und englischem Dubbing) hinzugefügt wird empfiehlt es sich diese Erweiterung `&hl=de&cc_lang_pref=de&cc_load_policy=1` an den Link anzuhängen. Das aktieviert automatisch Untertitel.

Um ein Bild hinzuzufügen muss man sich ein Bild raussuchen und dieses am besten zu einem quadratischen Bild zuschneiden. Dieses Bild muss man dann in den ['assets' Ordner](https://github.com/NicolasMahn/AV_Stuttgart/tree/main/public/assets) ablegen.

1.
<img width="566" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/e364dd7b-d062-42ab-b37c-78f324629fc3">

2.
<img width="552" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/1a1c016c-d4b8-4f1d-9cbb-c7579ea7f36b">

Jetzt muss man 'den weg zum Bild' Machinenleserlich in die yaml hinzufügen.

```yaml
  - title: "Wieso wir vegan leben sollten!"
    description: "Die Rede des australischen Tierrechtsaktivisten Joey Carbstrong in Oxford, in der er für eine vegane Welt argumentiert"
    url: "https://www.youtube.com/watch?v=4XDVGgZijLA"
    image_url: "/assets/Joey_Carbstrong.jpg"
    dub: "en"
    sub: null
```
Jetzt muss man die content.yaml noch speichern:

1.
<img width="383" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/cc6ef97f-c64b-43ba-bd52-74aa12b3caed">

2.
<img width="322" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/609f37db-035e-45b8-940f-ec2aa5331142">

Die geupdatete Website sollte in den nächsten 3 Stunden Live sein.

<img width="418" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/d39afe34-7ab2-41d8-ad46-95f892613962">

## Wie erstelle ich einen neuen Menü-Punkt?

Um einen neuen Menü-Punkt zu erstellen, muss man sowohl in der [content_de.yaml](https://github.com/NicolasMahn/AV_Stuttgart/blob/main/public/content_de.yaml) Datei einen neuen Menü-Eintrag unter `_config.menu` hinzufügen.

Die Felder bedeuten:
- **"name"**: Der Anzeige-Name im Menü
- **"key"**: Der Schlüssel, der auf die entsprechende Inhalts-Sektion in der YAML-Datei verweist

**Beispiel für einen neuen Menü-Punkt:**

```yaml
_config:
  menu:
    - name: "Ethik"
      key: "Ethik"
    - name: "Neuer Menüpunkt"  # Neuer Eintrag
      key: "Neuer_Menuepunkt" # Keine Sonderzeichen
```

