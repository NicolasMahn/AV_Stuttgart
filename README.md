# Website AV Stuttgart

## Wie füge ich Inhalt hinzu?

Wenn man Inhalt hinzufügen will, oder ändern will, muss man einfach das [content.yaml](https://github.com/NicolasMahn/AV_Stuttgart/blob/main/public/content.yaml) aufmachen und editieren.

<img width="414" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/fd2e905c-3a3f-4946-b206-61ab891980ad">

Dann kann man den Link zu einer Quelle hinzufügen. Dafür muss man sich zuerst überlegen unter welcher Überkategorie die Quelle fällt. Die Reihenfolge der Links in der yaml Datei entspricht der Anzeige Reihenfolge auf der Website.
Beispielsweise wird hier die Rede von Joey Carbstrong hinzufügen ([Link zum Video](https://www.youtube.com/watch?v=4XDVGgZijLA)). Diese fällt unter die Kategorie Ethik.
Dafür muss ich einen Titel hinzufügen, den Link, und am besten auch in welcher Sprache das Video ist. Wenn man will kann man auch eine 'description' zu der Quelle hinzufügen.

```
  - title: "Wieso wir vegan leben sollten!"
    description: "Die Rede des australischen Tierrechtsaktivisten Joey Carbstrong in Oxford, in der er für eine vegane Welt argumentiert"
    url: "https://www.youtube.com/watch?v=4XDVGgZijLA"
    image_url: null # Was man für das Bild machen soll, kommt im nächsten Abschnitt
    dub: "en"
    sub: null
    keywords: []
```

Wenn ein Youtube Video mit deutschen Untertiteln (und englischem Dubbing) hinzugefügt wird empfiehlt es sich diese Erweiterung `&hl=de&cc_lang_pref=de&cc_load_policy=1` an den Link anzuhängen. Das aktieviert automatisch Untertitel wenn man bei Youtube nicht angemeldet ist.

Um ein Bild hinzuzufügen muss man sich ein Bild raussuchen und dieses am besten auf 100px zu 100px zuschneiden. Dieses Bild muss man dann in den ['assets' Ordner](https://github.com/NicolasMahn/AV_Stuttgart/tree/main/public/assets) ablegen.

1.
<img width="566" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/e364dd7b-d062-42ab-b37c-78f324629fc3">

2.
<img width="552" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/1a1c016c-d4b8-4f1d-9cbb-c7579ea7f36b">

Jetzt muss man 'den weg zum Bild' Machinenleserlich in die yaml hinzufügen.

```
  - title: "Wieso wir vegan leben sollten!"
    description: "Die Rede des australischen Tierrechtsaktivisten Joey Carbstrong in Oxford, in der er für eine vegane Welt argumentiert"
    url: "https://www.youtube.com/watch?v=4XDVGgZijLA"
    image_url: "/assets/Joey_Carbstrong.jpg"
    dub: "en"
    sub: null
    keywords: []
```
Jetzt muss man die content.yaml noch speichern:

1.
<img width="383" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/cc6ef97f-c64b-43ba-bd52-74aa12b3caed">

2.
<img width="322" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/609f37db-035e-45b8-940f-ec2aa5331142">

Die geupdatete Website sollte in den nächsten 3 Stunden Live sein.

<img width="418" alt="image" src="https://github.com/NicolasMahn/AV_Stuttgart/assets/64785342/d39afe34-7ab2-41d8-ad46-95f892613962">


