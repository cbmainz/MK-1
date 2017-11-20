MK-1 Offline
====

Ein Sampler Keyboard für Makey Makey, inspiriert durch das klassische Casio SK-1 Sampler Keyboard. 

Umgesetzt mit [p5.js](https://p5js.org)  
Original von [Eric Rosenbaum](https://www.ericrosenbaum.com/mk1-sampler/)  
Deutsche Übersetzung von [cbmainz](https://github.com/cbmainz/MK-1) 

Diese Version ist für die offline Verwendung gedacht. 

## Node http-server installieren

Um MK-1 auch offline zu benutzen, braucht es einen HTTP-Server auf dem Rechner, auf dem MK-1 mit Makey Makey laufen soll. Das geht ganz einfach mit Node.js und diesem Repository:

1. [Node.js downloaden und installieren](https://nodejs.org/de/download/)

2. Das Terminal unter **OS X/Linux** oder die Eingabeaufforderung unter **Windows** (ggf. als Administrator) öffnen:

- unter **OS X/Linux** mit copy and paste dieses Kommando eingeben:

```
sudo npm install -g http-server
```

- unter **Windows** mit copy and paste dieses Kommando eingeben:

```
npm install -g http-server
```

## Quellcode der Seite Herunterladen

1. Dieses Github Repository herunterladen (entweder über ```git clone``` oder die [ZIP-Datei herunterladen](https://github.com/medienundbildung-com/MK-1-Offline/archive/gh-pages.zip) und entpacken).

2. Mit ```cd``` in das entsprechende Verzeichnis wechseln, bspw. mit (natürlich je nachdem, wohin die ZIP-Datei entpackt wurde):

- im Terminal unter **OS X/Linux**:

```
cd /Users/<USERENAME>/Downloads/MK-1-Offline-gh-pages
```

- unter **Windows** mit der Eingabeaufforderung:

```
cd C:\Users\<USERENAME>\Documents\MK-1-Offline-gh-pages
```  

Natürlich ```<USERENAME>``` durch den eigenen Benutzername ersetzen.

3. Dann folgenden Befehl ausführen:  
```
http-server
```   

Fertig!

## MK-1 anzeigen

1. Ich benutze dazu den Browser Opera im Vollbildmodus (alle Leisten ausgeblendet), es geht aber auch jeder andere moderne Browser. [Opera herunterladen](http://www.opera.com/de).

2. Im Browser kann die Seite nun unter ```localhost``` aufgerufen werden: 

```
[http://127.0.0.1:8080](http://127.0.0.1:8080)
```

3. Makey Makey anschließen und los …

Viel Spaß!