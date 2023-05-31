# Basic Principles of Operating Systems

Computer Hardware Review

Betriebssystem: eine Abstraktionsebene zwischen Hardware und
Anwendungssoftware.

Es verwaltet Ressourcen:

- CPU: Rechenleistung

- Speicher: Primärspeicher

- Daten: Sekundärspeicher

- I/O: Geräte-Schnittstellen

- Netzwerk: Kommunikation

- Energie: Kontrolle Energieverbrauch

## Dienste des Betriebssystems

- Werkzeuge zur Programmerstellung: Editor, Compiler, Linker, Debugger

- Programmausführung: Programme in Speicher laden, Initialisierung von
  I/O und Files

- Systemzugriff: Schützt und überwacht Zugriff auf Ressourcen und Daten,
  löst Konflikte bei Mehrfachzugriff

- Interprozesskommunikation: Datenaustausch zwischen Prozessen

- Fehlererkennung: interne und externe Hardwarefehler, Softwarefehler wie
  Überlauf, Zugriff auf nicht vorhandene Dienste

- Accounting (Benutzerkonto): Statistiken zur Ressourcenbenutzung,
  Überwachung von Leistungsparametern

### Varianten von Betriebssystemen

- Mainframe Operating Systems

- Server Operating Systems

- Multiprocessor Operating Systems

- Personal Computer Operating Systems

- Handheld Computer Operating Systems

- Embedded Operating Systems

- Sensor Node Operating Systems

- Real-Time Operating Systems

- Smart Card Operating Systems

Distributions: A distribution is just the kernel (which may include
distribution specific patches) plus all the extra programs that make it
usable.

# Booting an OS

Der Systemstart eines Betriebssystems umfasst zwei wesentliche
Phasen: Eine hardwareabhängige Phase und der Start des eigentlichen
Betriebssystems. In der hardwareabhängigen Phase wartet der Prozessor
auf seiner Reset-Adresse. Der Code aus Festwertspeicher (ROM, Flash) auf
Platine wird ausgeführt: Hardwareüberprüfung, initialisiert
Minimalzugriff auf "Disk" oder Netzwerk $\rightarrow$ Lädt Boot Code in
Speicher. In der Betriebssystemabhängigen Phase wird der Boot Code
ausgeführt welcher alle weiteren Schritte steuert.

1. Step 1 - Basic Input Output System (BIOS)
   - Durchläuft Power-On-Self-Test (POST), Geräte werden durch das Scannen
     der PCI-Busse erkannt. Master Boot Record (MBR) wird eingelesen und
     ausgeführt.
2. Bootloader
   - Der MBR-Code lädt den Bootloader (GRUB).
   - Dieser erhält Zugriff auf die Bootpartition und lädt das OS und führt es anschliessend aus.
3. Initialization of the OS and Environment
   - Alle Devices initialisieren ihren Driver
   - Initialisiert OS Management Structure (process table)
   - Erstellt System Services
   - Erzeugt (User)-Interface

### Linux booting as an example

1.  System startup / HW Initialization

2.  GRand Unified Bootloader (GRUB): Liesst OS ein $\rightarrow$ dev
    drivers + fs modules

3.  Kernel (Linux OS): OS Start-up Code

4.  UNIT Process (Run levels)

5.  User Prompt (Shell or GUI)

### BIOS vs UEFI

Das UEFI ist im Gegensatz zum BIOS ein eigenes kleines Betriebssystem.
Das UEFI können Sie zudem per Maus bedienen und die Oberfläche ist
grafisch aufbereitet. Ein weiterer entscheidender Unterschied ist, dass
Festplatten und SSDs nun anders partitioniert werden. Während das BIOS
mit MBR arbeitet, nutzt UEFI jetzt das GPT-Partitionsschema. UEFI nutzt
eine architektur unabhängige virtuelle Maschine. Dadurch lassen sich EFI
binaries (.efi) ausführen.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-02.jpg" alt="image" />

</div>

MBR: Der Master Boot Record enthält ein Startprogramm für BIOS-basierte
Computer und eine Partitionstabelle. Er befindet sich im ersten Sektor
eines in Partitionen aufteilbaren Speichermediums. Bootloader: Ein
Bootmanager ist ein Hilfsprogramm, das - sofern vorhanden - die Auswahl
von mehreren Betriebssystemen beim Hochfahren eines Rechners ermöglicht.

GRUB: ist ein freies Bootloader-Programm, das oft zum Starten von
unixoiden Betriebssystemen wie z. B. Linux eingesetzt wird. GRUB wurde
innerhalb des GNU-Hurd-Projektes als Bootloader entwickelt und wird
unter der GPL bereitgestellt.

cat /boot/grub/grub.cfg

RAMDISK: ist ein virtueller und temporärer Datenträger im
Arbeitsspeicher eines Computers.

initrd (initial RAM disk image): ist ein temporäres Dateisystem, das vom
Linux-Kernel während des Bootvorgangs verwendet wird. Die initrd ist ein
reservierter Bereich im Arbeitsspeicher, der vom Kernel wie eine
Festplattenpartition behandelt wird. Beinhaltet Kernel Modules +
Device-Special Files

runlevels

systemd

# Processes and Threads

## Processes

Ein Prozess ist ein Programm in Ausführung, wobei er jedoch nicht
zwingend aktiv sein muss. Jeder Prozess hat einen eigenen Kontext, also
alle Informationen, die den Ausführungszustand beschreiben: Daten, Code,
Stack, Register, Zustandsinfo aller Ressourcen, etc. Zu einem Prozess
gehören also alle Daten, die benötigt werden, damit ein Programm auf
einem Rechner ausgeführt, an einem beliebigen Zeitpunkt unterbrochen und
dort wieder gestartet werden kann.

Unit of Resource Ownership: eine Einheit, die Ressourcen besitzt und
Kontrolle darüber hat (Files, I/O Geräte, ...), ein virtueller
Adressraum, in dem das Process Image steht

Unit of Scheduling: ...eine Einheit, die schedulierbar (einteilbar) ist

### Prozessausführung

Für die Beschreibung des Ausführens von Prozessen werden zwei Modelle
benötigt: Das

Zustandsmodell beschreibt den aktuellen Zustand eines Prozesses (z.B.
Running oder Not Running). Das Queuing-Diagramm beschreibt den Ort, wo
sich Prozesse aufhalten, wenn sie sich in einem bestimmten Zustand
befinden. Dabei können sich mehrere Prozesse im gleichen Zustand
befinden, in diesem Fall warten sie in einer Warteschlange (Queue).
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-03.jpg" alt="image" />

Process States - Life-Cycle

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-04.jpg" alt="image" />

</div>

Ready: Der Prozess kann ausgeführt werden.

Running: Der Prozess läuft (ist aktiv).

Blocked: Der Prozess wartet auf Ereignis, z.B. I/O Operation etc

### Prozesswechsel

Ein Prozesswechsel findet statt, wenn das Betriebssystem die Kontrolle
über die CPU erhält.

System Call: Ein expliziter Aufruf aus einem Benutzerprogramm, der
Prozess wird ev. blockiert (muss aber nicht).

Interrupt: Äussere Ursache: z.B. Timer, DMA beendet, I/O-Interrupt etc.
Kontrolle an Interrupt Handler, oft nur für sehr kurze Zeit.

Trap: Die letzte Instruktion hat einen Fehler erzeugt, der Prozess wird
unter Umständen abgebrochen (z.B. Division durch 0). Dabei gibt es den
Mode Switch, wo kein Prozesswechsel stattfindet (nur "Unterbruch") und
den Context Switch, wo ein Prozesswechsel stattfindet (impliziert auch
Mode Switch).

### Gründe für Prozesswechsel

Timer: Zeitintervall ist abgelaufen, Prozess geht in den Zustand READY.

I/O-Interrupt: Auf Interrupt wartender Prozess in den Zustand READY oder
READY SUSPEND versetzen. Dabei muss entschieden werden, ob der laufende
Prozess weiterverarbeitet oder unterbrochen werden soll oder ob der
Prozess mit höherer Priorität aktiviert werden soll.

Page Fault (Virtual Memory): Adressierter Datenwert steht nicht im
physikalischen Speicher, entsprechender Speicherblock muss vom Disk
geladen werden. Prozess wird in den Zustand blocked versetzt.

Trap / Exception: Laufenden Prozess abbrechen.

System Call: Die meisten System Calls blockieren den aufrufenden
Prozess.

### Prozessausführungs-Modi

Die Prozessausführung findet in zwei Modi statt: Dem weniger
privilegierten User Mode (Anwenderprogramme) und dem underprivileged
System Mode bzw. Kernel Mode (Betriebssystemfunktionen). Die meisten
modernen Prozessoren unterstützen diese beiden Modi in Hardware. Diese
Aufteilung existiert, um kritische Systemkomponenten vor
unbeabsichtigtem resp. unerlaubtem Zugriff zu schützen.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-04(1).jpg" alt="image" />

</div>

### Mode Switch

Nur der Prozessor-Zustand muss auf dem Stack gespeichert werden, d.h.
die Prozessor Register und die Flags. Dabei gibt es wenig Overhead, da
der Prozesskontrollblock nicht aufdatiert werden muss wie beim
Prozesswechsel. SW oder HW-Interrupts machen vorerst keinen
Context-Switch notwendig, da die ISR im gleichen Prozesskontext (aber im
System-Mode) ausgeführt werden. Danach wird in das unterbrochene
Programm zurückgekehrt und falls der Prozess blockiert

findet ein Context Switch statt.

### Context Switch

Beim Context Switch (Prozesswechsel) muss der gesamte Prozesszustand
abgespeichert werden, dazu gehört auch der Prozessorzustand und
sämtliche Register. Der Prozesskontrollblock (PCB) muss aufdatiert und
an die entsprechende Liste gehängt werden. Danach wird ein neuer Prozess
für die Ausführung ausgewählt, wobei wiederum der PCB aufdatiert wird
und der Prozessorzustand und Register wiederhergestellt werden. Dies ist
eine kostspielige Operation (Time Sharing Systeme: Nur ca. 10 bis 1000
Context Switches pro Sekunde).

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-05.jpg" alt="image" />

</div>

Prozesswechsel durch Scheduler/Dispatcher

Falls ein Context Switch ausgeführt werden muss (z.B. durch
blockierenden System Call) wählt der Scheduler ein Prozess aus der Ready
Queue aus. Mögliche Auswahlkriterien sind minimale Antwortzeit,
maximaler Durchsatz, faire CPU Zuteilung, Auslastung CPUs, etc. Falls
kein Context Switch notwendig ist wird in den unterbrochenen Prozess
zurückgekehrt.

### Prozesskontrollblock (PCB)

Der PCB ist eine der wichtigsten Datenstrukturen im Betriebssystem, er
speichert den Prozesskontext und ist Teil des Prozessimages. Er enthält
alle wichtigen Informationen zum Prozess (Process Identification,
Process Control Information, Process State Information). Die Menge von
PCBs definiert den Zustand des Betriebssystems. Der Zugriff auf PCBs ist
hochkrittisch und findet nur über eine entsprechende Handler-Routine
statt. Queues sind im Grundsatz Linked Lists von PCBs.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-05(1).jpg" alt="image" />

</div>

Elemente des PCBs: Process Identification (PID, PPID, UID, GID), Process
State Information (Inhalt der Prozessorregister), Process Control
Information (Scheduling und Zustandsinfo etc.)

### Prozesserzeugung

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-06.jpg" alt="image" />

</div>

- Eindeutigen Prozessidentifikator erzeugen

- Speicher für Image allozieren

- Prozesskontrollblock initialisieren (Defaultwerte setzen)

- Verkettungen für Queues aufsetzen (z.B. Prozess in die Liste mit neuen
  Prozessen einfügen)

- Weitere Datenstrukturen initialisieren (z.B. Accounting Informationen)

- Prozesse sind oft hierarchisch organisiert (Eltern- und Kindprozesse)

Der System Call fork() erzeugt einen Kindprozess, der System Call exec()
startet ein neues Programm. Der Rückgabewert von fork() ist die PID des
Kindes im Elternprozess und 0 im Kindprozess. Beim Systemstart wird
Prozess 0 (init) erzeugt, welcher Prozess 1 abspaltet und selbst zum
Swapper/Scheduler wird. Prozess 1 startet Daemonprozesse und erzeugt
einen neuen Prozess, wenn sich ein Benutzer anmeldet. Er ist der Vater
aller Prozesse (sorgt auch für "Waisenkinder") und ist im Gegensatz zu
Prozess 0 ein normaler Prozess, allerdings mit Super-User Rechten. Mit
Ausnahme von Prozess 0, welcher nicht mehr in der Prozessliste
erscheint, haben alle Prozesse einen Elternprozess.

#### Funktionalität / Arbeitsweise

Der Elternprozess (parent) kann gleichzeitig mit den Kindern (child)
arbeiten. Er kann auf die Beendingung eines oder mehrerer Kinder warten.
Kinder, die terminieren und auf die der Elternprozess nicht wartet,
werden zu Zombies. Zombies belegen Betriebssystem-Resourcen und müssen
verwaltet werden (sie können aber auch verhindert werden). Sie sind
nützlich, wenn man Statusinformationen (verbrauchte Rechenzeit, benutzte
Ressourcen) abgfragen will. Für die endgültige Entfernung ist
grundsätzlich der Elternprozess zuständig, entweder durch Warten
(wait(), waitpid()) oder durch Terminieren des Elternprozesses.

Ein Kind ist eine fast identische Kopie des Elternprozesses, hat aber
eine eindeutige PID (ProzessID). Die PID des Elternprozesses wird PPID
(Parent Process-ID) genannt. Jeder Prozess gehört zu einer
Prozessgruppe, die aus einem oder mehreren Prozessen besteht. Sie können
einen Leader haben, den man daran erkennt, dass seine PID gleich wie die
Prozessgruppen-ID ist. Eine Prozessgruppe hört auf zu existieren, wenn
sie keine Mitglieder mehr hat. Ein Prozess kann die Prozessgruppe
wechseln.

Eine weitere Gruppierung sind Sessions, zu welcher eine oder mehrere
Prozessgruppen gehören. Eine Session kann genau ein Kontrollterminal
besitzen und der Prozess, der die Verbindung zum Kontrollterminal hat,
wird Kontrollprozess genannt (und ist Sessionführer). In einer Session
gibt es maximal eine Vordergrund-Prozessgruppe, alle anderen
Prozessgruppen sind HintergrundProzessgruppen. Die
Vordergrund-Prozessgruppe existiert genau dann, wenn die Session ein
Kontrollterminal hat. Nur Prozesse in der Vordergrund-Prozessgruppe
können mit dem Kontrollterminal kommunizieren.

exec( ) überlagert Programm- und Datenbereich mit einem neuen Programm-
und Datenbereich. Der Prozesskontext wird von Eltern geerbt, was den
Zugriff auf offene Files des Elternprozess und weiteres ermöglicht.
Viele Unix Implementationen erstellen bei fork zuerst keine Kopie von
den Speicherbereichen, da sie oft mit exec überlagert werden und dadurch
viel Overhead entstünde. Diese Systeme verwenden das Copy-On-Write
Verfahren: Es wird keine Kopie erstellt wenn nur gelesen wird, alle nur
lesbaren Bereiche können problemlos gemeinsam genutzt werden. Es wird
erst eine Kopie erstellt, wenn geschrieben wird, d.h. wenn der Prozess
versucht, in den entsprechenden Bereich zu schreiben.

### Daemon-Prozesse

Daemons sind eine spezielle Art von Prozessen (bzw. Threads), die
vollständig unabhängig arbeiten, d.h. ohne direkte Interaktion mit dem
Anwender. Sie sind Hintergrundprozesse und terminieren im Allgemeinen
nur wenn das System heruntegefahren wird oder abstürzt. Sie erledigen
meist Aufgaben, die periodisch ausgeführt werden müssen, z.B.
Überwachung von Systemkomponenten. Meist kann nur ein Daemon pro Aufgabe
aktiv sein, es muss aber auch dafür gesorgt werden, dass ein Daemon
wieder gestartet wird, falls er stirbt.

## Threads

Threads sind Leichtgewichtprozesse, die keinen eigenen Prozesskontext
benötigen sondern in einem gemeinsamen Prozesskontext parallel ablaufen.
Dabei bilden der Prozess und die Threads eine Einheit, wenn der Prozess
terminiert, terminieren auch die Threads. Durch Multicore-Prozessoren
haben sie stark an Bedeutung gewonnen, da das Konzept Software- und
Hardware-Parallelität unterstützt und sie relativ leicht zu Handhaben
sind.

<div class="center">

| Thread call          | Description                                          |
| :------------------- | :--------------------------------------------------- |
| Pthread_create       | Create a new thread                                  |
| Pthread_exit         | Terminate the calling thread                         |
| Pthread_join         | Wait for a specific thread to exit                   |
| Pthread_yield        | Release the CPU to let another thread run            |
| Pthread_attr_init    | Create and initialize a thread’s attribute structure |
| Pthread_attr_destroy | Remove a thread’s attribute structure                |

</div>

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-07.jpg" alt="image" />

</div>

Der Thread ist dabei keine Unit of Resource Ownership (da geteilter
Kontext), aber eine Unit of Scheduling. Der Threadwechsel ist weniger
aufwendig und Aufgaben können geteilt werden. Threads sind immer an
einen Prozess gebunden, jedoch ein unabhängiges Stück Code innerhalb
eines Prozesses. Adressraum, Daten, Kontext sind geteilt, jeder Thread
hat aber eigene lokale Variablen, Register, PC, Stack und Stackpointer.
Sie haben auch Ausführungszustände (running, ready, ...). Wenn ein
Thread inaktiv wird, wird der Threadkontext gespeichert.

Single Threading: Das Betriebssystem kennt das Konzept des Threads
nicht.

Multithreading: Das Betriebssystem unterstützt die gleichzeitige
Ausführung mehrerer Threads innerhalb eines Prozesses.

Warum Threads?

Ein Thread ist "billig": Er kann schnell erzeugt und beendet werden
(braucht nur Stack und Speicher für die Register), Threadwechsel können
schnell durchgeführt werden (nur PC, SP und Register austauschen). Sie
benötigen wenig Ressourcen, keinen neuen Adressraum, keinen eigenen
Datenbereich oder Programmcode und keine zusätzlichen
Betriebssystemressourcen.

Die CPU ist im Allgemeinen besser ausgelastet, bei Multicores können
Threads echt parallel ausgeführt werden.

Bei Single-Threading bestimmt die "Summe" der beiden Anfragen die
Ausführungszeit, bei MultiThreading nur die längere der beiden (sofern
beide Antworten benötigt werden).

### User-Level Threads (ULT)

Bei User-Level Threads weiss der Kernel nicht, dass es Threads gibt. Sie
laufen im Benutzerbereich und werden durch Bibliotheken realisiert. Die
Anwendung ist für das Threadmanagement verantwortlich, wodurch der
Threadwechsel keine Kernel Mode Privilegien braucht. Threadscheduling
ist applikationsspezifisch wählbar. Da der Kernel nur einen Prozess,
aber keine Threads, sieht, blockieren alle anderen Threads bei einem
System Call eines Threads im gleichen Prozess. Aus Sicht des
Threadschedulers ist der Thread nach wie vor am Laufen. Die Thread
Zustände sind unabhängig von den Prozesszuständen. Threads können nicht
unterbrochen werden, sie können nur freiwillig die Kontrolle über die
CPU abgeben.

Vorteile:

- Threadwechsel involviert Kernel nicht

- Läuft auf jedem Betriebssystem (mit entsprechender Bibliothek)

- Scheduling kann anwendungsspezifisch gewählt werden

- Schnell und einfach.

Nachteile:

- Die meisten System Calls blockieren $\rightarrow$ Prozess blockiert
  und damit auch alle anderen Threads des Prozesses

- Nur der Kernel kann Prozesse den Prozessoren zuweisen, d.h.
  Parallelverarbeitung ist nicht möglich

- Page Fault eines Threads blockiert ganzen Prozess

### Kernel-Level Threads (KLT)

Der Kernel weiss, dass es Threads gibt und stellt Systemfunktionen für
die Threadverwaltung zur Verfügung (Linux: pthreads). Es wird keine
Bibliothek verwendet sondern es existiert eine API zu den
Threadfunktionen des Kernels. Der Kernel verwaltet alle
Kontextinformationen von Prozessen und Threads. Ein Threadwechsel
erfordert die Intervention des Kernels, dafür können sie auch vom Kernel
scheduliert und somit auf mehrere Prozessoren verteilt werden. Im
Grundsatz sind Kernel-Level Threads leichtgewichtige Prozesse.

Vorteile:

- Kernel kennt alle Threads

- Scheduling auf Thread Basis - Geeignet für Anwendungen die häufig
  blockieren (z.B. Server mit viel IPC)

- Kernelfunktionen können selbst Multithreaded sein

- Geeignet für Symmetric Multiprocessing (SMP)

Nachteile:

- Threadwechsel innerhalb eines Prozesses durch Kernel kostet 2 Mode
  Switches

- Spürbarer Overhead und höhere Kernelkompleität (jeder Thread benötigt
  Thread Control Block (TCB)

- Spürbar langsamer bei 1 CPU

### Kombination KLT/ULT

Threads werden im User Space erzeugt, Scheduling und Synchronisation
finden ebenfalls hauptsächlich im User Space statt. Der Programmierer
kann zur Optimierung die Anzahl KLTs anpassen und somit beide Verfahren
optimal kombinieren.

## Threads: Schutz und Synchronisation

Threads nutzen gemeinsame Ressourcen, die Inter-Thread Kommunikation ist
ohne Kernel-Hilfe möglich. Es gibt dadurch aber keinen Schutz der Daten
gegen unbeabsichtigten Zugriff und es ist eine synchronisation der
Threads notwendig. Die Synchronisation muss die Ausführung von Threads
koordinieren und die Datenkonsistenz garantieren wenn zwei oder mehr
Threads auf die gleichen Daten zugreifen, mind. einer davon schreibend
(Race Condition).

# Scheduling

## Scheduling-Klassen

Scheduling ist abhängig von der Art der Anwendung, es gibt drei wichtige
Klassen:

Batch: Keine Anwender, die am Terminal auf Antwort warten, Jobs können
am Stück verarbeitet werden. Non-preemtive Scheduling $\rightarrow$
keine Unterbrechung durch Scheduler sofern Prozess nicht blockiert.

Interaktiv: Anwender warten am Terminal auf Antwort, Umschaltung
zwischen Prozessen notwendig. Preemtive Scheduling $\rightarrow$
Prozesse erhalten CPU für "time-slice" und werden danach von Scheduler
unterbrochen.

Real-Time: Resultat muss zur richtigen Zeit verfügbar sein, oft
periodische Jobs.

Für alle Systeme (Scheduling Algorithmen) gilt: Fairness, Einhalten von
Policies, optimale Systemnutzung. Batch Systeme: Durchsatz (Anzahl Jobs
pro Zeit), Turnaround Zeit (Zeit zwischen Aufgabe und Terminierung, wie
lange der Anwender im Mittel warten muss) CPU-Nutzung (möglichst 100%).
Interaktive Systeme: Antwortzeit (schnelle Reaktion), erfüllen Erwartung
des Anwenders. Real Time: Deadlines einhalten (kein Datenverlust),
Vorhersagbarkeit (kein Qualitätsverlust z.B. bei Multimedia).

## Wichtigste Scheduling-Verfahren

Non-preemtive Scheduling: First Come First Served, Shortest Job First,
Priority Scheduling.

Meistens Batch- und Soft Real Time Systeme. Shortest Job First birgt die
Gefahr, dass lange Jobs verhungern.

Preemtive Scheduling: Round Robin, Multilevel (prioritätsbasiert). Im
Allgemeinen interaktive- und Multiprozessor-Systeme.

Real Time Scheduling: Rate Monotonig Scheduling, Deadline Scheduling.

Scheduler - FIFO / FCFS: Non-preemptive mit einer Queue und einem
Scheduler

## Non-Preemtive Scheduling

Auswahlfunktion: First Come First Served

Ready Queue: FIFO. Non-preemtive Scheduling: Nicht blockierende Prozesse
werden am Stück abgearbeitet. Blockierende Prozesse werden in Blocked
Queue gehängt und bleiben da, bis sie vom entsprechenden Event geweckt
werden, danach wieder in Ready Queue. Freiwillige Prozessabgabe werden
in Ready Queue gehängt. Kommt gleichzeitig ein neuer Prozess und einer
wird geweckt, kommt im Allgemeinen zuerst der neue dran.

Diskussion: Lange und CPU-bound Prozesse werden bevorzugt, schlechte
Ausnutzung von I/O Geräten, ggf. lange Antwortzeit. Jedoch einfach zu
Implemnentieren (kleiner Overhead) und Verhungern nicht möglich.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-10(1).jpg" alt="image" />

</div>

## Shortest Job First

Auswahlfunktion: Der Prozess mit der kürzesten erwarteten Rechen- bzw.
Bedienzeit kommt dran $\rightarrow$ Implizierte Priorität.

Diskussion: Gute Antwortzeit für kurze Prozesse, lange müssen warten.
Durchsatz ist hoch (viele kurze Prozesse), jedoch weniger Fair (lange
Prozesse bestraft). Ebenfalls Verhungern möglich und der Overhead ist
durch Schätzung der Rechenzeit relativ gross.

## Priority Scheduling

Auswahlfunktion: Priorität. Neue und aufgeweckte Prozesse werden anhand
ihrer Priorität in die Ready Queue einsortiert.

Diskussion: Prozesse mit tiefen Prioritäten können verhungern
$\rightarrow$ Mögliche Abhilfe sind dynamische Prioritäten, Anpassung in
abhängigkeit der Zeit

## Preemtive Scheduling

Ready Queue: FIFO. Prozesse können vom Scheduler unterbrochen und wieder
in die Ready Queue eingereiht werden. Unterbruch wenn time-slice
abgelaufen oder Prozess blockiert.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-10.jpg" alt="image" />

</div>

## Round Robin (RR)

Auswahlfunktion: Round Robin (nächster Prozess in Ready Queue). Wie bei
FCFS aber preemtive. Diskussion: Gute Response Time für kurze Prozesse,
lange Prozesse müssen auf nächstem Time Slice warten (TW $=n * q$ ( $n$
Anzahl Prozesse)). Throughput ist abhängig von Time Slice
$q \rightarrow$ Tief wenn klein (zuviele Prozesse / Context Switches),
FCFS Verhalten wenn gross. Fairness: I/O-bound Prozesse werden
benachteiligt. Verhungern ist nicht möglich, kleiner Overhead.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-11.jpg" alt="image" />

</div>

### Wahl von q

Time Slice q muss einiges grösser als Zeit für Clock Interrupt und
Dispatching gewählt werden, etwas grösser als eine typische Interaktion
( 1ms), aber nicht viel grösser, sonst werden I/O-bound Prozesse
bestraft.

## Multilevel Scheduling / Multilevel Feedback Scheduling

In üblichen Systemen gibt es verschiedene Arten von Jobs (batch,
interaktiv, systembezogen, rechenintensiv, ...). Sie werden nach Art
priorisiert, für jede Priorität eine Queue und Scheduler wählt immer
Jobs mit höchster Priorität $\rightarrow$ Round Robin pro Queue.

Diskussion: Jobs mit tiefen Prioritäten können verhungern. Bei
Multilevel Feedback Scheduling werden Prozesse bei zu hohem
CPU-Verbrauch tiefer priorisiert. Die unterste Queue ist Round Robin.
Kürzere Prozesse (I/O-bound) fallen nicht so tief.

Diskussion: Prozesse können immernoch verhungern, Priorität abhängig von
konsumierter Rechenzeit. Bestrafung rechenintensiver Jobs begünstigt
kurze Jobs. Verhungern kann nur mit dynamischen Prioritäten gelöst
werden (bei zu langer Wartezeit Priorität erhöhen).

Anmerkung zu variablem Time Slice: Ein Prozess der gestartet ist, kann
nur unterbrochen werden, wenn sein Time Slice abläuft, auch wenn in der
Zwischenzeit ein höher priorisierter Prozess ankommt. Die Queues werden
demzufolge bis auf diejenige mit der tiefsten Priorität mit einem FCFS
Verfahren scheduliert.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-11(1).jpg" alt="image" />

</div>

Scheduling - Linux Linux verfügt über drei Scheduler Klassen (in
absteigender Prioriät):

- Real Time: SCHED_FIFO, SCHED_RR

- CFS: SCHED_OTHER

- Idle: SCHED_IDLE

CFS (Completely Fair Scheduler): die Idee ist, dass Tasks kein
Time-Slice, sondern "Anteil an Prozessorleistung" erhalten. Die Laufzeit
wird also fair auf die Anzahl lauffähigen Tasks verteilt. Es gibt keine
Run-Queue (RQ) sondern ein Red-Black Tree (selbstbalancierender
Binärbaum).

Unterstützt Group-Scheduling (Prozessgruppe, wird für Scheduling wie
einzelner Task behandelt), nice-Werte sind multiplikativ.

CFS hat ein verbessertes Anwortverhalten für interaktive Systeme und
verwendet keine Heuristiken, ist jedoch deutlich weniger schlank bezogen
auf Programmcode. Ziel Laufzeit "target scheduling latency" wird
gleichmässig auf Tasks aufgeteilt (1/n der Laufzeit bei n Tasks). Bei
einer target scheduling latency von $20 \mathrm{~ms}$ und 4 lauffähigen
Tasks bekommt also jeder Task $5 \mathrm{~ms}$.

## Multiprozessor Scheduling

Uniprozessor Scheduling ist eindimensional (Zeit), es muss lediglich
bestimmt werden, welcher Task als nächster läuft. Multiprozessor
Scheduling ist zweidimensional, es muss neben der Zeit (welcher Task)
auch noch der Ort eingeplant werden (auf welcher CPU). Anforderungen:
Load Balancing $\rightarrow$ CPU Last muss möglichst gleich verteilt
werden, Prozesse müssen zwischen CPUs verschoben werden können.
Affinität $\rightarrow$ Tasks sollten wenn möglich auf CPU gebunden
werden können (wegen Caches, NUMA, etc.).

## Nicht verwandte Tasks

Im einfachsten Fall gibt es einen gemeinsamen Scheduler, wobei Tasks
nach Prioritäten der CPU zugewiesen werden $\rightarrow$ Automatisches
Load Balancing und eine gemeinsame Scheduling Datenstruktur.

Problemstellungen:

- Falls der Task lange auf der CPU läuft, müssen bei einem CPU-Wechsel
  viele Daten im Cache ersetzt werden.

- Task hält Spin-Lock (Spin-Lock = busywait auf Lock), Time-Slice läuft
  ab $\rightarrow$ Task wird unterbrochen und auf Lock wartende Tasks
  müssen warten bis er wieder läuft.

Lösungsansätze:

- Affinity Scheduling $\rightarrow$ Scheduler versucht Task immer auf
  gleicher CPU zu halten. Scheduling in zwei Stufen: Zuerst CPU (z.B.
  mit kleinster Last), danach auf CPU-Stufe schedulieren. Nachteil: Ev.
  schlechte CPU-Nutzung.

- Smart-Scheduling $\rightarrow$ Tasks, die Lock halten, setzen Flag.
  Scheduler unterbricht nicht falls Flag gesetzt.

Verwandte Tasks $\rightarrow$ Space Sharing

Mehrere Tasks (Threads) arbeiten zusammen, Scheduling mehrerer Tasks
über mehrere CPUs.

Einfachstes Verfahren ist non-preemtive, gestarteter Task wird
abgearbeitet $\rightarrow$ kein Overhead wegen Kontextwechsel, dafür
schlechtes Load Balancing. Alternatives Verfahren ist eine zentrale
Instanz (Server), welche Scheduling überwacht. Anzahl Threads wird von
Applikation dynamisch angepasst. Eine weitere Möglichkeit ist Gang
Scheduling, eine Gruppe verwandter Threads (Gang) wird gemeinsam auf
verschiedenen CPUs scheduliert.

### Zusammenfassung - Multiprocessor Scheduling

Multicore Scheduling berücksichtig Load Balancing, Affinity und
Synchronisation / Kommunikation zwischen verschiedenen CPUs. Eine echte
Parallelverarbeitung ist möglich, aber die Spitzenleistung wird oft
nicht ausgenutzt (Tasks meist nicht unabhängig, strikte Affinität nicht
durchsetzbar).

## Embedded Scheduler

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-13.jpg" alt="image" />

</div>

## Real-Time Systeme

Real-Time Systeme sind Systeme, die auf Ereignisse in der "äusseren
Welt" reagieren. Real-Time Systeme verhalten sich korrekt, wenn das
logische Resultat einer Berechnung stimmt und das Resultat zum richtigen
Zeitpunkt ausgeliefert wird (innerhalb Deadline).

Hard Real-Time Systeme: Deadlines müssen eingehalten werden,
nichteinhalten hat schwerwiegende Konsequenzen. Bsp.: Flugzeugsteuerung

Soft Real-Time Systeme: Deadlines sollten eingehalten werden,
nichteinhalten hat keine schwerwiegenden Konsequenzen. Bsp.:
Banküberweisungen

Eine typische Eigenschaft von Echtzeitsystemen ist es, dass sich
zeitkritische Tasks in regelmässigen Abständen wiederholen und die Dauer
und die benötigten Betriebsmittel bekannt sind. Bsp.

Flugzeugsteuerung: Erfassung der Beschleunigung alle $5 \mathrm{~ms}$,
Drehung alle 40ms, Temperattur jede Sekunde, absolute Position alle
$10 \mathrm{~s}, \ldots$

### Real-Time Tasks

Drei Real-Time Task Klassen:

- kritische Tasks: periodische Tasks (Video Rendering,
  Audioverarbeitung, ...), asynchrone, sporadische Tasks (Airbag, 10ms
  für Entscheid, nach 30ms aufgeblasen)

- nicht kritische aber notwendige Tasks (Selbsttests, Kalibrierung,
  Logging, ...)

- nicht notwendige Tasks

Abhängig davon wird das entsprechende Scheduling Verfahren gewählt: Rate
Monotonic / Deadline für kritische, übliche Scheduling Kriterien für
nicht kritische und verbleibende Zeit für nicht notwendige Tasks.

Real Time Tasks sind meist "lightweight processes", also im wesentlichen
Threads. Sie arbeiten in einem gemeinsamen Adressraum $\rightarrow$ Kein
Kontextwechsel, effiziente Umschaltung.

### Real-Time Scheduling

Der Short-Time Scheduler ist eine der wichtigsten Komponenten eines
Real-Time Systems. Die Scheduling Strategie ist abhängig von den
Systemanforderungen: (Hard- oder Soft Real Time, periodische Tasks vs.
asynchrone Tasks). Im Folgenden die preemtiven Verfahren "Rate Monotonic
Scheduling" und "Deadline Scheduling" sowie das statische "Cyclic
Executives". proportional zur Repetitionsrate ist. Tasks müssen also
unterbrechbar, periodisch und unabhängig sein (kein gegenseitiges
Warten).

## Deadline Scheduling

Die Idee dieses Verfahrens ist, die Tasks zum richtigen Zeitpunkt zu
starten bzw. zu beenden. Mögliche Deadlines sind die Start-Deadline
(Zeitpunkt, zu dem ein Task gestartet werden muss) und die
Completion-Deadline. Earliest Deadline Scheduling: Priorität ist
umgekehrt proportional zur Zeit bis zur Deadline. Scheduling ist
aufwendiger als bei RMS (dynamische Anpassung von Prioritäten), dafür
ist theoretisch eine 100%-tige Prozessorauslastung möglich.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-14.jpg" alt="image" />

</div>

Cyclic Executives

Hierbei handelt es sich um statisches, non-preemtive Scheduling. Es gibt
ein Schedule für den periodischen Hauptzyklus (100ms) und mehrere
Nebenzyklen (hier 4, 25ms). Realisierung durch Aufruf von Prozeduren.

Real-Time-Linux

Aufteilung in Foreground- und Background-Scheduling. Antwortzeiten in
der Grössenordnung von Mikrosekunden (abhängig von Treibern und anderen
RTTasks). Kritische Real-Time Tasks sind Foreground Tasks (Threads) mit
Direktzugriff auf Hardware und Interrupts.

Affinity: Keine Zeitverschwendung für Cache-Swap

Scheduling-Verfahren

Non-Preemptive:

- First come first serve

- Shortest Job First (Shortest

Process Next)

- Priority Scheduling

- i.d.R. Batch Systeme und Soft

Real Time Systeme Preemptive Scheduling:

- Round Robin

- Multilevel und Multilevel

Feedback (prioritätsbasiert)

- i.d.R. interactive Systeme

und Multiprozessor-Systeme Real-Time Scheduling:

- Rate monotonic Scheduling

- Deadline Scheduling

# Resource Control

Erstellung von Prozessen

fork() und exec()

Beide Commands kreieren einen neuen Child-Prozess und retournieren eine
neue Prozess-ID (PID).

Child-Prozess hat eigenes Memory Map, Speicher zwischen Parent und
Childs nicht gegenseitig lesund schreibbar.

fork() Childprozess erstellen, führt Code an gleicher Linie (+ 1) wie
Parent-Prozess aus.

exec () Ersetzt den Parent-Prozess mit neuem Child-Prozess, Child führt
ein neues Programm aus.

## Zombies / Orphans

Zombie Wenn Childprozess fertig ist und auf wait() wartet, der
Parentprozess weiterläuft (und kein wait() aufruft). Child ist zwischen
Beendigung seines Prozesses und wait() des Parents ein Zombie. Orphan
Wenn Childprozess noch nicht fertig, aber der Parentprozess fertig ist
und kein wait() vor dessen Beendigung aufgerufen hat.

## Erstellung von Threads

clone3(), clone() Kreiert neuen, konfigurierbaren Prozess. Was geteilt
wird, ist von Parametern abhängig.

exec() Ersetzt den Parent-Prozess mit neuem Child-Prozess, Child führt
ein neues Programm aus.

## cgroups

cgroup Hierarchische Sammlung von Prozessen. Sind definiert via cgroup
filesystem und Prozesse werden durch dieses ausgeführt. Regeln (control
configuration) wirken 1:1 auf Sub-Hierarchien.

cgroup core Kernsystem, kreiert die Hierarchie und hält sie instand.
Wird vom Kernel geladen, muss als Modul mit dem Kernel mitkompiliert
werden.

cgroup filesystem Ist in /sys/fs/cgroup. Virtuelles Filesystem im
tmpfs-Format (ist im Memory). Ähnlich wie /proc. Verbindet PIDs mit
control configurations. Kernel führt Prozesse mit vordefinierter
configuration aus.

Subsystem / (Resource) Controller Kernel-Komponente, modifiziert das
Verhalten von Prozessen in einer cgroup. Kann nicht gegen mehrere
cgroup-Hierarchien dazugemountet werden.

Beispiel: CPU-Zeit limitieren, Memory limitieren, Einfrieren und
Wiederaufnehmen von Prozessen in einer cgroup.

control configuration Einzelne Files in z.B. /sys/fs/cgroup/cpuset/\<
programmname $>$ /. Beispielsweise kann man im file cpuset.cpus die
Anzahl CPUs, die das Programm benutzen darf, anpassen.

cat /proc/cgroups

## Unterschiede Version 1 und 2

Beide Versionen koexistieren miteinander, aber Controllers können nicht
in beiden Versionen auf einen Prozess/Thread angewendet werden.

## Cgroups Version 1

- Zwischen Tasks und Prozesse wird unterschieden.

- Man muss aufpassen, dass man Threads eines Prozesses nicht mehreren
  Controllern zuweist.

Cgroups Version 2

- Immer noch in Entwicklung.

- Prozesse und Tasks werden gleich behandelt.

- Alle Controllers sind in einer einzigen vereinigten Hiearchie.

- Controllers: io, memory, pids, perf_event, rdma, cpu, freezer.

- Unterstützung für Thread Subtrees (wie Prozesshierarchien aber für
  Threads), Thread-Level Controllers.

Kreieren und Löschen von cgroups (V1)

- Anfangskonfiguration: Ein cgroup filesystem hat anfänglich nur eine
  root cgroup ’%, alle Prozesse gehören zu dieser. - Erstellen: Eine
  neue cgroup wird erstellt, in dem man einen Ordner unter einem
  entsprechenden Controller (zB cpu) im cgroup filesystem erstellt. zB
  mkdir

/sys/fs/cgroup//

- Löschen: Ordner unter/sys/fs/cgroup/\<controller〉/\<cgroup〉 löschen.
  Achtung: Es dürfen keine child cgroups und Non-Zombie-Prozesse
  existieren.

Prozesse einer cgroup hinzufügen

1.  Ein File namens cgroup.procs in /sys/fs/cgroup//\<cgroup-name〉
    erstellen.

2.  PID von Prozess in das File hineinschreiben.

3.  Alle Threads des Prozesses werden gleichzeitig in die cgroup bewegt,
    und vorherige Einträge dieser PID werden von vorherigen croups
    entfernt.

Regeln / Kontingente konfigurieren

1.  Möglichkeit: Konfiguration via SystemD ausserhalb cgroup file
    system.

systemd.slice(5) systemd unit files can be used to define a custom
cgroup configuration. They must be placed in a systemd directory, such
as /etc/systemd/system/. The resource control options that can be
assigned are documented in systemd.resource-control(5).

Beispiel, um CPU des Slices auf $30 \%$ zu beschränken:

Eintrag in File /etc/systemd/system/my.slice:

\[Slice\]

CPUQuota $=30 \%$

2.  Möglichkeit: Filebasiert innerhalb cgroup file system. Filenamen
    unterschiedlich je nach Controller und Art des Kontingents.

- Für Complete Fair Schedule beispielsweise neue Files namens
  cpu.cfs_period_us in /sys/fs/cgroup/cpu erstellen, und Wert
  (Beispielsweise 100000) in dieses File hineinschreiben (MV S.169)

- Um CPU-Cycles auf 10% zu limitieren, cpu.cfs_period_us $=100000$
  (entspricht $10 \%$ der Runtime), cpu.cfs_quota_us
  $=10000 \rightarrow 100000 /$ $10000=10 \%$ der CPU cycles.

# Memory Management

Bei Multiprogramming stehen im Gegensatz zu Uniprocessing nicht nur das
Betriebssystem und ein einziger Prozess, sondern das Betriebssystem und
mehrere Prozesse im Speicher. Mehrere Prozesse werden gleichzeitig
verarbeitet (davon diverse Verwaltungsprozesse), d.h. die aktiven
Prozesse müssen im Speicher stehen. Wenn sich zu wenige Prozesse im
Speicher befinden warten zu viele auf I/O und der Prozessor ist idle.
Ein Prozess muss an einem beliebigen ort im Speicher stehen können, der
Programmierer / Anwender will sich im Allgemeinen jedoch nicht um die
Verwaltung kümmern $\rightarrow$ transparente Speicherverwaltung
notwendig.

## Begriffe

**Frame** Unterteilung des physischen Speichers in fixer Grösse.

**Page** Können verschieden gross sein (Page Size, typischerweise 1KB, 4KB
oder 8KB). TLB Translation Lookaside Buffer

**USS** Unique Set Size. Satz von Pages, die eindeutig zu einem Prozess
gehören.

**PSS** Proportional Set Size. Zwischen Prozessen geteiltes Memory.

**VSS** Virtual Set Size

**RSS** Resident Set Size

**Minor Page Fault** Wenn die Page zwar im Memory ist, aber das logische
Mapping noch nicht existiert, oder die MMU die Page noch nicht als
existent markiert.

**Major Page Fault** Page ist nicht mehr im Memory. à Resultiert in
Segmentation Fault.

**Invalid Page Fault** Passiert beispielsweise bei fehlerhafter
Pointer-Arithmetik, bei Zugriff auf einem ge-freetem Speicher, oder auf
Speicher ausserhalb des virtuellen Address Space des Prozesses.

**Segmentation Fault** Zugriff auf etwas, was man nicht zugreifen darf. Ist
ein kritischer Fehler, der Kernel lässt das Programm crashen (aufgrund
der Memory Protection).

**Lazy Allocation** Es wird nur Memory alloziert, wenn wirklich
reingeschrieben wird (keine vorherige Allokation wie $z B$ malloc().

Locked memory (VmLock)

- Wird nie aus RAM geswappt.

- Keine Garantie gegen Page Fault.

- Im physischen Memory kann die Page herumgeschoben werden

Pinned memory (VmPin)

- Ähnlich wie VmLock

- Kann nicht im physischen Memory herumgeschoben werden

- Deshalb garantiert keine Page Faults.

### Wichtige C-commands

```c
getpagesize()
```

Retourniert die Anzahl Bytes einer Page (Page Size).

```c
malloc()
```

Alloziert Speicher basierend auf Grösse eines Typs oder einer diskreten
Angabe und ist nicht auf die Page Size aligned.

```c
aligned_alloc()
```

Alloziert Speicher basierend auf der Grösse des ersten Parameters mit
dem Mehrfachen des zweiten Parameters. Beispielsweise
aligned_alloc(PAGE_SIZE, 4) alloziert Speicher in Grösse des Vierfachen
der Page Size.

```c
mincore()
```

Bestimmt, ob Pages im Memory (und nicht im Swap) sind, und daher auch
keine Page Faults

passieren. Beispielsweise mincore(address_to_check, PAGE_LENGTH,
vector). Im vector -Array wird byteweise hineingeschrieben, ob das
korrespondierende Byte im buffer-Parameter im RAM ist oder nicht. (0 à
Success, -1 à Failure)

### Swap-File erstellen

1.) Create a file that can be used for swapping

a.) sudo fallocate $-11 \mathrm{G} /$ swapfile

2.) Give this file root permissions only

a.) sudo chmod 600 /swapfile

3.  ) Setup a Linux swap area in the file

a.) sudo mkswap /swapfile

4.) Activate the swap file

a.) sudo swapon / swapfile

5.  ) If this is to be permanent then

a.) sudo nano/etc/fstab

b.) Andadd: /swapfile swap swap defaults 0

6.) sudo swapon–show or

7.) sudo free - $\mathrm{h}$ will now show a swap area

### Swappiness

Definiert, wie früh das System den Swap nutzen wird. Je höher der Wert,
desto eher swappt das System.

Wert auslesen: cat /proc/sys/vm/swappiness

Wert justieren: sudo sysctl vm. swappiness $=10$

### Einfaches Memory Management

Der ganze Prozess steht im Speicher (traditioneller Ansatz) und der
Anwender ist oft selbst für Memory Management verantwortlich. Typische
Anwendung: Kleine Systeme wie Embedded Systeme, Echtzeitsysteme, etc.

### Virtual Memory

Nur der aktive Teil des Prozesses steht im Speicher, der rest ist auf
Sekundärspeicher ausgelagert. Der Speicher wird virtualisiert, d.h. der
Anwender sieht den gesamten Adressraum des Prozessors, unabhängig von
der Grösse des physikalischen Speichers. Das Betriebssystem verwaltet
physikalischen Speicher transparent. Hard und Softwareunterstützung
notwendig, typische Anwendung in grossen Systemen wie Workstation,
Server, PCs, etc.

Logical Organisation: "Was der Anwender sieht". Logischer Adressraum,
lineare Folge von Bytes (Words). Logische Segmente: Programm, Daten,
Stack. Vorteile: Verschiedene Zugriffsrechte möglich, gemeinsame Nutzung
von Modulen (Adressierung zur Laufzeit)

Physikalische Organistaion: "Was das Betriebssystem sieht".
Physikalische Realisierung: Cache-, Haupt-, und Sekundärspeicher. Im
Hauptspeicher befinden sich Programme in Ausführung, Sekundärspeicher
für Zwischen- und Langzeitspeicherung. Der Datenfluss zwischen Haupt-
und Sekundärspeicher ist Teil des Memory Managements.

Protection: Verhindern, dass sich Prozesse gegenseitig beeinflussen.
Prozesse müssen getrennte Adressräume haben, Adressen müssen zur
Laufzeit überprüft werden und Betriebssystem braucht eigenen
Speicherbereich.

Sharing: Geneinsame Speicherbereiche (z.B. für kooperierende Prozesse)
zur Verfügung stellen. Relocation: Prozesse müssen auf Disk aus- und
eingelagert werden $\rightarrow$ Swapping. Prozesse stehen nicht immer
am gleichen Ort im physikalischen Speicher, ev. müssen Prozesse sogar
verschoben werden.

### Logische / Physikalische Adressen

Eine logische Adresse ist eine Referenz auf Speicherplatz, unabhängig
von der Speicherorganisation. Eine physikalische Adresse ist eine
Referenz auf physikalischen Speicherplatz. Compiler erzeugen Code mit
relativen (logischen) Adressen.

### Adressübersetzung

Die CPU erzeugt eine logische bzw. relative Adresse, meist beziehen sie
sich auf Adresse 0 . Die Übersetzung auf eine physikalische Adresse muss
schnell und transparent geschehen $\rightarrow$ Hardwareunterstützung
notwendig.

### Swapping

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-19.jpg" alt="image" />

</div>

Oft haben nicht alle Prozesse im Speicher Platz, deswegen wird Swapping
benötigt. Dies bezeichnet das Auslagern eines Prozesses oder Teilen
davon vom Speicher auf Disk bzw. umgekehrt. Ein ausgelagerter Prozess
ist dabei suspendiert. Heute steht jedoch viel Speicher zur Verfügung,
es können sehr viele und vor allem auch ganze Prozesse im Speicher
gehalten werden.

Mögliche Memory Management Verfahren: Adressraum zuteilen (fixed
partitioning, dynamic partitioning, placement), Adressraum aufteilen
(paging).

### Fixed Partitioning

Der Hauptspeicher wird in mehrere, nicht überlappende Partitionen
aufgeteilt. Das Betriebssystem belegt im Allgemeinen eine feste
Partition. Es können sich eine vorgegebene Anzahl Prozesse im Speicher
befinden und wenn alle Partitionen besetzt sind, kann das BS Prozesse
auslagern. Falls ein Programm zu gross für eine Partition ist muss sich
der Anwender darum kümmern nur die benötigten Module zu laden
(Overlays). Bei gleich grossen Partitionen ist die Nutzung des
Hauptspeichers ineffizient, da ein Programm, egal wie gross es ist, eine
Partition belegt. Partition nicht vollständig gefüllt: internal
fragmentation.

Partitionen gleich gross Partitionen verschieden gross

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-19(1).jpg" alt="image" />

</div>

Verschieden grosse Partitionen reduzieren das Problem, lösen es aber
nicht. Es gibt zwei Varianten:

- Für jede Partition eine Prozess Queue: Prozess wird der
  kleinstmöglichen Partition zugewiesen. Versucht interne Fragmentierung
  zu minimieren, jedoch bleiben Queues leer, wenn keine entsprechenden
  Prozesse vorhanden sind $\rightarrow$ mehr Swapping.

- Für alle Partitionen eine Prozess Queue: Prozesse werden der kleinsten
  verfügbaren Partition zugewisen. Dies stellt eine Verbesserung
  bezüglich Multiprogramming dar, jedoch ist die interne Fragmentierung
  wieder erhöht.

### Dynamic Partitioning

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-20.jpg" alt="image" />

Die Grösse und Anzahl der Partitionen ist variabel, jedem Prozess wird
soviel Speicher zugewiesen, wie er benötigt. Ein entstehendes Problem
ist die externe Fragmentierung: Im Hauptspeicher bilden sich mit der
Zeit Löcher, da Prozesse ausgelagert und nicht immer durch gleich grosse
Prozesse ersetzt werden können. Deswegen ist Compaction notwendig, d.h.
Prozesse verschieben, bis die Löcher geschlossen sind.

## Platzierungsalgorithmen (Placement Algorithms)

Gesucht: Block mit 16 MByte. Welchen freien Block allozieren?

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-20(1).jpg" alt="image" />

</div>

First Fit: Einfachster Algorithmus, i.d.R. auch am schnellsten und
besten. Alloziert Block eher in der Nähe des Speicheranfangs. Tendiert
zu weniger Fragmentierung als Next Fit.

Next Fit: Alloziert oft freien Block am Schluss des Speichers, Blöcke am
Ende des Speichers sind oft am grössten. Tendiert zu mehr Compaction als
First Fit.

Best Fit: Sucht den kleinsten passenden Block, was externes Fragment zum
nächsten Block minimiert. Tendiert zur schnellen Bildung von vielen
kleinen Fragmenten. Im Allgemeinen ist es der schlechteste Algorithmus,
da oft Compaction durchgeführt werden muss.

## Buddy System

Beim Buddy System handelt es sich um einen Kompromiss zwischen fixed und
dynamic Partitioning. Es ist ein schneller Allokations und
Deallokationsalgorithmus, welcher in modifizierter Form von Linux/Unix
verwendet wird. Es werden so lange Blöcke halbiert, bis ein Block
minimaler Grösse zur Verfügung steht $\rightarrow$ Lässt sich als
Binärbaum darstellen, wofür effiziente Algorithmen verfügbar sind.
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-21(2).jpg" alt="image" />

## Paging

Der logische Adressraum der Prozesse wird in Blöcke gleicher Länge
aufgeteilt, die sogenannten Pages. Ebenfalls wird der Speicher in Blöcke
gleicher Länge aufgeteilt, die sogenannten Frames. Die Zuweisung von
Pages zu Frames kann beliebig sein, was bedeutet, dass Prozesse nicht
immer zusammenhängend im physikalischen Speicher stehen müssen (auf
beliebige Frames verteilt). Die Pagegrösse entspricht jedoch der
Framegrösse, wobei heute 1KB, 4KB und 8KB übliche Grössen sind. Beispiel

## Prozesse

- $\mathrm{P}_{\mathrm{A}}: 4$ Pages

- $P_{B}: 3$ Pages

- $P_{\mathrm{C}}: 4$ Pages

- $P_{D}: 5$ Pages

Speicher

- 16 Frames

Ablauf

$\Rightarrow P_{A}$ wird geladen

$\Rightarrow P_{B}$ wird geladen

$\Rightarrow \mathrm{P}_{\mathrm{C}}$ wird geladen

$\Rightarrow$ Prozess $P_{B}$ blockiert wird ausgelagert

$\rightarrow$ Prozess $\mathrm{P}_{\mathrm{D}}$ geladen
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-21.jpg" alt="image" />

Tabellen
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-21(1).jpg" alt="image" />

Pro Prozess unterhält das Betriebssystem eine Page Tabelle. Die
Pagenummer referenziert Tabelleneinträge, wobei die Einträge die
Framenummer des physikalischen Adresstaums beinhalten. Weiter ist eine
Liste mit freien Blöcken notwendig.

Logische Adresse in physikalische Adresse übersetzen

Jede logische Adresse (N Bit) besteht aus zwei Feldern: Einer Pagenummer
(k höherwertige Bits der Adresse) und einem Offset ( $m$ tieferwertige
Bits der Adresse). Pagegrösse entspricht $2^{\wedge} m$, Offset vom
Beginn der Page. Es gilt $N=k+m$. Jeder Prozess hat eine eigene
Pagetabelle (Page Table), welche für jede Pagenummer die entsprechende
Framenummer enthält. Die Pagenummer dient als Referenz (Adresse) zum
Lesen der Framenummer. Die letzte Page (Frame) ist nicht unbedingt voll
$\rightarrow$ interne Fragmentierung, jedoch klein. Die Anzahl Bits der
Frame Nummer ist kleiner oder gleich der Anzahl Bits der Page Nummer.

## Segmentation

Anwenderprogramme sind in mehrere Segmente (Programm, Daten, Stack)
unterteilt, diese Segmente haben haben verschiedene Grössen. Sie bilden
einen zusammenhängenden Adressraum und können an beliebigem Ort im
Speicher platziert werden. Segmentation ist im Gegensatz zu Paging für
den Programmierer bzw. Compiler sichtbar und es hilft, Programme logisch
zu organisieren. Der Programmierer muss jedoch die Grenzen der Segmente
kennen. Segmentation vereinfacht die Handhabung von wachsenden
Datenstrukturen, unterstützt die Nutzung gemeinsamer Daten und den
Schutz des Speichers. Das Betriebssystem muss pro Prozess eine
Segmenttabelle unterhalten, welche die physikalische Startadresse und
die Länge des Segments beinhaltet.

## Paging vs. Segmentation

## Paging

- Für Programmierer transparent

- Kleine, interne Fragmentierung

- Adressübersetzung: Tabellen-Lookup

- Schutz auf Ebene von logischen Segmenten

## Segmentation

- Für den Programmierer sichtbar

- Externe Fragmentierung

- Adressübersetzung: Tabellen-Lookup und Addition

- Schutz von physikalischen Segmenten

Es ist auch eine Kombination von Paging und Segmentation möglich, jedoch
nur OS/2 hat dieses Verfahren je genutzt. Aktuelle Betriebssystem
verwenden nur Paging und segmentieren auf der logischen Ebene (z.B. über
Zugriffsrechte).

## Virtual Memory (VM)

Bis jetzt musste der gesamte Prozess im Speicher stehen und die
Prozessgrösse wird durch den physikalischen Speicher bestimmt. Der
Speicher ist im Allgemeinen jedoch deutlich kleiner als der
Adressbereich, vor allem bei 64 Bit. Der Programmierer muss sich um die
Programmgrösse kümmern, was früher sehr aufwendig war (Programme in
Overlays aufteilen, BS lädt benötigt Overlays von Disk).

Lösung Speichergrösse: Virtual Memory. Der logische / virtuelle
Adressraum wird in Pages aufgeteilt, der physikalische Adressraum wird
in Frames aufgeteilt. Nur aktuell benötigte Frames befinden sich im
Hauptspeicher, der Rest befinden sich als "Image" auf der Disk.

Konsequenzen: Der Programmierer sieht einen logischen (virtuellen)
Adressraum, beschränkt durch die Adressbreite und Diskkapazität. Auf der
Disk muss ein Image des Prozesses verwaltet werden. Mehr Prozesse können
im Speicher abgelegt werden, sie können sogar grösser als der
physikalische Speicher sein. Alle Speicherreferenzen müssen logische
Adressen sein. Dies ist effizient, wenn Hardwareunterstützung für
Adressübersetzung und Softwareunterstützung für Ein- und Auslagern der
Pages auf Sekundärspeicher vorhanden ist.

Wie funktioniert VM?

Der Prozessor referenziert eine virtuelle Adresse. Wenn die
referenzierte Page nicht im Speicher steht, wird ein Page Fault
ausgelöst. Das Betriebssystem blockiert den Prozess und lädt den
entsprechenden Block von der Disk, dazwischen wird ein anderer Prozess
ausgeführt. VM basiert auf dem Lokalitätsprinzip (räumliche und
zeitliche Lokalität). Nur wenige Pages stehen im Speicher, das BS muss
bei Page Fault eine intelligente Entscheidung treffen, damit oft
gebrauchte Pages nicht ständig neu geladen werden müssen (Thrashing,
Prozessor hauptsächlich mit Swapping beschäftigt).

Adressübersetzung - VM

Virtual Address Page Number

Offset

Page Table Entry

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-23.jpg" alt="image" />

</div>

Die Page Tabelle ist etwas aufwendiger, sie benötigt zusätzliche
Einträge:

$\mathrm{m}$ : modified Bit (Page wurde modifiziert)

p: present Bit (Page steht im Hauptspeicher)

zusätzliche Bits

- Zugriffschutz (read, write, execute $\rightarrow$ z.B. Code readonly)

- Referenziert (Auf Page wurde zugegriffen)

- Caching (z.B. Page darf nicht "gecached" werden, lock im cache)

## Page Table Organisation

Ein Problem mit Page Tabellen ist, dass sie sehr gross werden (32 Bit
Adressen, 4KB Pages führt zu 2^20 Einträgen). Mögliche Abhilfen:
Multilevel Organisation, Hashed Page Table, Inverted Page Table.

## Hashed Page Table

Die Page Nummer wird als Hash Wert verwendet, geeignet für Invertierte
Page Tabellen und Adressräume \> 32 Bit. Verschiedene Page Nummern
führen zum gleichen Hash Wert. Jeder Eintrag in der Hash Tabelle zeigt
auf eine Liste mit den Einträgen, jeder Listeneintrag enthält Page
Nummer unt entsprechende Frame Nummer. Bei Zugriff muss jeweils Page
Nummer verglichen werden (gleicher Hash Wert). Zusätzlicher Aufwand:
Suchen in Hash Liste

## Invertierte Page Tabellen

Die Invertierte Page Tabelle hat pro Frame einen Eintrag. Die Nummer des
Eintrags (j) entspricht der Framenummer. Die gleiche Page wird von
verschiedenen Prozessen in verschiedenen Frames abgelegt, die Prozess ID
muss in der Tabelle gespeichert werden.

Problem: Ganze Tabelle muss nach Page Nummer und PID abgesucht werden,
ineffizient wenn vollständig in Software implementiert.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-24.jpg" alt="image" />

</div>

## Translation Lookaside Buffer (TLB)

Problem: Jede Speicherreferenz benötigt bis zu zwei Speicherzugriffe
(Frame Nummer aus Page Tabelle und Zugriff auf Daten). Bei Hash Tabellen
und invertierten Page Tabellen sind es sogar nochmals zusätzliche
(gleicher Hash Wert für verschiedene Pages bzw. zusätzlicher Zugriff auf
Prozess ID). Ein spezieller Hardware Cache für Page Tabellen, der
Translation Lookaside Buffer, bietet Abhilfe. Er enthält kürzlich
verwendete Page Tabellen Einträge und wird pro Prozess aufgesetzt. Es
sind bis zu drei Schritte notwendig:

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-24(2).jpg" alt="image" />

</div>

TLB: Associative Mapping

Die Page Nummer wird am TLB abgelegt. Die Zelle mit dem entsprechenden
Page Nummer Eintrag meldet sich selbst $\rightarrow$
Hardwareunterstützung notwendig (Vergleicher für jede Page Nummer). TLB
gehört zur MMU, arbeitet zusammen mit dem Cache System.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-24(1).jpg" alt="image" />

</div>

Die Pagegrösse wird durch Hardware bestimmt. Kleine Pages führen zu
wenig interner Fragmentierung und einer kleinen Page Fault Rate,
bedeuten aber viele Pages und somit grosse Page Tabellen. Auch grosse
Pages reduzieren die Page Fault Rate, wenn Pages ungefähr so gross wie
der Prozess sind. Der TLB wächst nicht so schnell wie der Hauptspeicher
und interagiert zudem mit anderen Komponenten wie Cache. Verschiedene
Pagegrössen helfen, den TLB effizient zu nutzen, aber die meisten BS
nutzen nur eine Grösse.

Memory Management Software

Alle wichtige Betriebssysteme unterstützen heute Virtual Memory,
ausnahmen sind einige alte (z.B. DOS) und einige Embedded- oder
Echtzeitsysteme. Virtual Memory benötigt Hard- und
Softwareunterstützung. Mit VM steht nicht der ganze Prozess im Speicher,
es ergeben sich drei Fragestellungen: Wann wird eine neue Page geladen
(fetch policy), wo wird die Page abgelegt (placement policy) und welche
Page wird ersetzt (replacement policy).

## Page Replacement

Auch beim Page Replacement ergeben sich wieder drei Fragestellungen:
Welche Page wird ersetzt, wenn Speicher voll ist? Welche Pages bzw.
Frames kommen für Ersatz in Frage? Wie viele Frames sollen einem Prozess
zugewiesen werden? Im Folgenden werden vier Algorithmen (optimal, least
recently used, fifo, clock) für die Frage, welche Page ersetzt werden
soll, erläutert. Sie basieren auf der Idee des Lokalitätsprinzips.

## Replacement Policy: Optimal

Ersetzt die Page, die (in der Zukunft) am spätesten referenziert wird.
Das ist zwar nicht implementierbar, aber es zeigt die minimale Anzahl
Page Faults auf und ist gut für den Vergleich mit anderen
(implementierbaren) Algorithmen. Die Zahlen im Beispiel über den Frames
zeigen an, welche Page referenziert wird (1 am spätesten, wird also als
erstes Frame ersetzt).

- Optimal - replaces page which is used the latest in the future

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-25(1).jpg" alt="image" />

</div>

## Replacement Policy: Least

Recently Used Ersetzt die am längsten nicht referenzierte Page
(Lokalitätsprinzip: Wird wahrscheinlich nicht mehr referenziert), was
fast so gut wie optimal ist. Die Implementation ist allerdings
aufwendig: Time Stamp oder Usage Counter notwendig.

- Least recently used (Linux approach) is Vogamphat slearem, meder Pruer
  verumbet wumters

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-25.jpg" alt="image" />

</div>

## Replacement Policy: FIFO

Älteste Page wird zuerst ersetzt. Das Problem hierbei ist, dass auch oft
referenzierte Pages ausgelagert werden. Die Implementation ist zwar sehr
einfach, liefert jedoch schlechte Resultate

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-26.jpg" alt="image" />

</div>

## Replacement Policy: Clock

Die Page Frames werden in einem ziruklären Buffer angeordnet, jedes
Frame besitzt ein Use Bit u, welches beim Laden und Referenzieren auf 1
gesetzt wird. Der Zeiger wird beim Laden auf das nächste Frame gesetzt.
Das Ersetzen einer Page geschieht indem ausgehend von der Zeigerposition
das erste Frame mit Use Bit $=0$ gesucht und ersetzt wird. Angetroffene
Frames mit $u=1$ werden auf 0 gesetzt.

## Page Buffering

Bis jetzt wurden Frames durch neue Pages ersetzt. Nun werden Pages auch
gebuffert, das Betriebssystem unterhält zwei Listen: Free Page List und
Modified Page List, die Replacement Policy ist FIFO. Bei Page
Replacement mit Page Buffering gehen ersetzte Pages nicht sofort
verloren. Nicht modifzierte Pages werden an die Free Page List gehängt,
modifizierte an die Modified Page List. Die Page am Kopf der Free Page
List wird ersetzt. Pages auf der Modified Page List werden in Clustern
auf die Disk geschrieben und kommen dann in die Free Page List.

## Resident Set Management

Nicht alle Pages eines Prozesses müssen oder können im Hauptspeicher
stehen. Bis jetzt wurde nur beantwortet, welche Page aus einer
vorgegebenen Menge ersetzt wird. Es existieren aber noch die
Fragestellungen was die vorgegebene Menge ist (replacement scope: Local
Replacement $\rightarrow$ nur zum Prozess gehörende Frames, Global
Replacement $\rightarrow$ gesamthaft verfügbare Frames) und wie viele
Frames einem Prozess zugewiesen werden (Fixed Allocation $\rightarrow$
Feste Anzahl Frames zuweisen, Variable Allocation $\rightarrow$ Anzahl
Frames ändert mit Zeit).

Unix / Linux verwenden Variable Allocation im Global Scope, was einfach
zu implementieren ist. Oft wird eine globale Liste mit freien Frames
verwendet, was eine schnelle Anforderung neuer Frames ermöglicht. Der
Page Daemon holt sich Frames von Prozessen, wenn es keine freien Frames
gibt. Problemstellung: Welche Frames können welchem Prozess weggenommen
werden? Ev. ist Wahl des Prozesses nicht optimal.

## Working Set

Resident Set: Die Anzahl aktuell zugewiesener Frames

Working Set: Die in letzter Zeit benutzten Frames

## Working Set Strategy

Die Working Set Strategy bedeutet die Bestimmung des Working Sets aus
dem Resident Set. Das Vorgehen ist das bestimmen des Working Sets, das
periodische entfernen von Pages, die nicht mehr zum WS gehören und den
Prozess nur ausführen, wenn sein Working Set im Speicher steht.

## Page Fault Frequency

Die Page Fault Rate nimmt mit zunehmendem Working Set bzw. Resident Set
ab. Folgerung: Die Grösse des Working Set kann über die Page Fault Rate
bestimmt werden. Dies wird über die Messung der Anzahl Page Faults
während eines Zeitintervalls realisiert. Das Zeitintervall wird aus der
konsumierten CPU-Zeit eines Prozesses berechnet (virtuelle CPU-Zeit).

Implementation Page Fault Frequency (PFF): Verwenden des Use Bit,
Schranke TF für Zeitintervall definieren. Bei einem Page Fault: Wenn das
Zeitintervall seit letztem Page Fault kleiner als TF ist, die Page zum
Working Set hinzufügen. Wenn das Zeitintervall grösser ist, alle Pages
mit used bit $=0$ aus dem Working Set entfernen.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-27(1).jpg" alt="image" />

</div>

## Load Control

Wenn sich zu wenig Prozesse im Speicher befinden, ist das Working Set
genügend gross, die CPU aber schlecht ausgelastet wegen viel I/O. Wenn
sich zu viele Prozesse im Speicher befinden wird das Working Set zu
klein $\rightarrow$ thrashing und CPU Auslastung sinkt drastisch. Eine
Working Set Strategie impliziert Load Control, ein Prozess läuft nur,
wenn minimales Working Set im Speicher verfügbar. Durch Anpassen des
notwendigen Working Sets wird die Anzahl Prozesse im Speicher
automatisch angepasst.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-27.jpg" alt="image" />

</div>

## Load Control: Process Suspension

Welche Prozesse sollen suspendiert werden, wenn zu viele Prozesse im
Speicher stehen?

Es gibt sechs Möglichkeiten:

- Prozess mit tiefster Priorität: Implementiert Scheduling Policy
  Entscheidung

- Prozess mit (vielen) Page Faults: Grosse Wahrscheinlichkeit, dass
  Working Set nicht Resident ist und Prozess wegen Page Faults
  blockiert.

- Der am längsten nicht aktivierte Prozess: Hat mit grosser
  Wahrscheinlichkeit das Working Set nicht vollständig im Speicher.

- Prozess mit kleinstem Resident Set: Erfordert am wenigsten Aufwand für
  das Aus-/Einlagern.

- Grösster Prozess: Gibt am meisten Frames frei, mit grosser
  Wahrscheinlichkeit muss kein zusätzlicher Prozess ausgelagert werden.

- Prozess mit dem längsten Verarbeitungsfenster

## Memory Management - Linux

# Input / Output

Computer haben zwei Hauptaufgaben: "Processing" und I/O, wobei I/O oft
Hauptaufgabe ist (z.B. Daten-Aufnahme und -Speicherung, Web Browsing
bzw. Networking). Das Betriebssystem muss dabei I/O-Operationen und
geräte verwalten und steuern. Dabei müssen standardisierte Soft- und
Hardwareschnittstellen (SUB, PCMCIA, $\mathrm{PCI}, \ldots$ ) und die
Vielfalt von I/O-Geräten berücksichtigt werden. Trotz Standardisierung
hat jedes Betriebssystem ein eigenes Treibermodell. Der Begriff "Gerät"
kann physikalisch und logisch interprtiert werden. Physikalisch: An
Computer angeschlossene Hardware wie Disk, Drucker, etc. Logisch: Eine
Softwarekomponente, die über Geräteschnittstelle angesprochen wird
(meist Filesystem). Unter Linux ist z.B. /dev/null ein solches logisches
Gerät.

## I/O-Hardware

Es gibt eine grosse Hardwarevielfalt, jedoch nur wenige Konzepte: Wie
Geräte am Computer angeschlossen werden und wie die Software die
Hardware steuert. Geräte werden über Ports (ein Gerät, Datenstrom, z.B.
serielle Schnittstelle) oder über Busse (mehrere Geräte, mehrere Dräte,
ein Protokoll) angeschlossen. Der I/O Controller ist Steuerelektronik
für Port, Bus oder Gerät.

## I/O-Ports

Eine typische Port Konfiguration hat vier Register: Statusregister,
Kontrollregister, Dataln und DataOut. Kontrollregister für die
Konfiguration und Steuerung, Datenregister für Datenpufferung und
Datenaustausch. Die Interaktion zwischen Prozess(or) und Geräten kann
über Polling (synchron, busy wait), Interrupts (asynchron, Interrupt
Handler) oder DMA (asynchron, Datentransfer im Hintergrund) geschehen.

synchronous interrupt: generiert durch Clock

asynchronous: wird bei externem Event generiert

maskable interrupts: können von der CPU ignoriert werden

non-maskable interrupts: können von der CPU nicht ignoriet werden

## I/O-Software

Die Ziele von I/O Software sind:

- Geräteunabhängigkeit: Anwendersoftware soll unabhängig von den aktuell
  verwendeten Geräten laufen $\rightarrow$ Abstraktion

- Einheitliche Namensgebung: Zum Beispiel alles als File behandeln
  (Linux)

- Fehlerbehandlung: Sollte möglichst nah an der Hardware geschehen.

- Asynchroner- / Synchroner I/O: Auch asynchroner I/O soll für Anwender
  blockierend sein.

- Buffering: Daten können meist nicht an der Zieldestination gespeichert
  werden $\rightarrow$ Vorverarbeitung, Echtzeitprobleme

- Sharing: Verwaltung und Organisation gemeinsam nutzbarer und
  dedizierter Ressourcen

## I/O Architektur

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-28.jpg" alt="image" />

</div>

Zur Architektur wird ein Schichtenmodell verwendet. Die wichtigste
Komponente sind dabei die Device Drivers. Sie bilden eine
standardisierte Schnitstelle zum Kernel I/O-Subsystem und sind intern an
die Gerätedetails angepasst. Die wichtigsten Services des Kernels sind:

- I/O-Scheduling, da I/O-Anfragen von Anwendungen selten in optimaler
  Reihenfolge auftreten. Das BS ordnet Anfragen nach
  Optimierungskriterien (Performance, Fairness, Wartezeit).

- Buffering, das bereitstellen von Temporärspeicher für Datenaustausch
  zwischen zwei Geräten oder zwischen Gerät, Kernel und Applikation.
  Gründe für das Buffering sind verschiedene Übertragungsraten und
  Blockgrössen.

- Caching: Kopie für schnelleren Zugriff halten)

- Spooling: Speicher mit Daten für Geräte, die keine überlappenden
  Datenströme erlauben (z.B. Drucker)

- Reservation: Zugriffsreservation für nur exklusiv allozierbare Geräte
  (Tape, Soundkarte, ...)

- Fehlerbehandlung

## Error Handling

Fehler im Zusammenhang mit l/O sind vielfältig. Sie können temporär
sein, z.B. bei einem überlasteten Netzwerk. Sie können aber auch
permanent sein, z.B. bei einem defekten Disk Controller. Das
Betriebssystem muss entsprechende Aktionen bei Hardware-Fehlern oder
Defekten auslösen (z.B. Programm stoppen). Wenn eine wichtige
Hardwareeinheit defekt ist, kann sich das BS mit grosser
Wahrscheinlichkeit nicht mehr erholen.

I/O-Geräte: Charakteristiken

<div class="center">

|   Eigenschaft   |                                           Möglichkeiten                                           |                                               Beispiel                                                |
| :-------------: | :-----------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
| Transfer-Modus  | $\begin{array}{l}\text { character (stream) } \\ \text { block } \\ \text { network }\end{array}$ |  $\begin{array}{l}\text { Terminal } \\ \text { Disk } \\ \text { Netzwerk (sockests) }\end{array}$   |
| Zugriffsmethode |               $\begin{array}{l}\text { sequential } \\ \text { random }\end{array}$               |                    $\begin{array}{l}\text { Modem } \\ \text { Disk }\end{array}$                     |
|     Ablauf      |              $\begin{array}{l}\text { synchron } \\ \text { asynchron }\end{array}$               |                   $\begin{array}{l}\text { Tape } \\ \text { Keyboard }\end{array}$                   |
|     Sharing     |              $\begin{array}{l}\text { dedicated } \\ \text { sharable }\end{array}$               |                   $\begin{array}{l}\text { Tape } \\ \text { Keyboard }\end{array}$                   |
|    Richtung     |  $\begin{array}{l}\text { read write } \\ \text { readonly } \\ \text { writeonly }\end{array}$   |               $\begin{array}{l}\text { Disk } \\ \text { CD-ROM } \\ \ldots\end{array}$               |
| Geschwindigkeit |   $\begin{array}{l}\text { latency } \\ \text { transfer rate } \\ \text { delay }\end{array}$    | $\begin{array}{l}\text { Reaktionszeit } \\ \text { Datenmenge } \\ \text { Verzögerung }\end{array}$ |

</div>

Es gibt Character (Byte) Stream und Block Geräte. Stream Geräte
übertragen Daten Byte um Byte, z.B. serielle Schnittstelle
(charakteristisch spontan erzeugter Input). Block Geräte übertragen
Daten als Blöcke von Bytes, z.B. Disks (charakteristisch random access).
Netzwerkgeräte unterscheiden sich wesentlich von Disks, es wird auch
eine eigene Schnittstelle verwendet: Sockets.

Bei sequentieller Übertragung bestimmt das Gerät die Reihenfolge. Bei
random access bestimmt die Anwendung, welche Daten gelesen werden
sollen.

Blocking vs. Non-Blocking I/O

Physikalische Aktionen von I/O Geräten sind im Allgemeinen asynchron,
Ausführungszeiten sind variabel und nicht vorhersagbar. Trotzdem sind
die entsprechenden System Calls meistens Blocking, da sie so einfacher
und sicherer zu handhaben sind. Typische Non-Blocking Operationen sind
die API zu Maus und Keyboard (interaktive Applikationen) und Video
Interfaces (Daten von Disk lesen, gleichzeitig dekomprimieren und
darstellen).

Gerätetypen und Schnitstelle

- block Device

- character (stream) Device - network Device

Geräte werden wie Files angesprochen. Zugriffsfunktionen sind unter
anderem open(), close(), $\operatorname{read()}$ und write().

## I/O-Architektur Linux

Linux ist ein monolithischer Kernel und Treiber werden oft als Module
realisiert, da man sonst für jede Änderung den Kernel neu kompilieren
müsste. Module sind zur Laufzeit on demand (automatisch) ladbar und
stapelbar. Ein geladenes Modul ist Teil des Kernels.

Linux IO Subsystem and Device Model: dynamic nature of devices

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-30.jpg" alt="image" />

</div>

Der Kernel verwendet:

- device: physiches Gerät, welches am Bus hängt

- driver: die mit dem Gerät verbundene Software

- bus: Ein Gerät, welches ander Geräte verbindet

- class: Ein Gerätetyp mit ähnlichem Verhalten (disks, partitions,
  serial ports, etc.)

- subsystem: Eine Sicht auf die Systemstruktur (devices hierarchies, bus
  structures, device classes)

sysfs

Sysfs ist ein virtuelles Dateisystem des Linux-Kernels. Es exportiert
Informationen über verschiedene Kernel-Subsysteme, Hardware und
assoziierte Geräte-Treiber durch virtuelle Dateien in den
Benutzer-Modus. Bestimmte Parameter können über dieses Interface auch
konfiguriert werden.

- block: block devices (disks, partitions)

- bus: types of bus (pci, ide, usb)

- class: drivers classes in the system (net, sound, usb)

- devices: hierarchical structure of devices

- firmware: system firmware (ACPI)

- fs: mounted file systems

- kernel: kernel status information

- module: list of modules (drivers)

- power: power management subsystem UDEV (userspace /dev): ist ein
  Programm, mit welchem der Linux-Kernel Gerätedateien für die Datenein-
  und -ausgabe verwaltet.

Linux Device Access
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-31.jpg" alt="image" />

Modul und Device-Treiber

Mit mknod kann ein neues Device erstellt werden, welches mit einer Major
nummer verbunden wird und so einem Treiber zuweisbar ist.
register_chrdev registriert einen Treiber im Betriebssystem und
verbindet die Treiberfunktionen (in einer Struktur abgelegt) mit der
entsprechenden Major Nummer (in der File Operations Tabelle).

## Datentransfer: Kernel und User

Die Datenbufferung findet im Kernel Space statt, die Daten müssen
zwischen User Space und Kernel Space kopiert werden. Das Problem ist,
dass der Anwenderprozess "swappable" ist, d.h. es kann sein, dass er
nicht im Speicher steht. Deswegen werden die Spezialfunktionen
copy_to_user() und copy_from_user() angeboten.

Interrupts

TODO

## Input / Output - Software

Building and Using a Custom Linux Kernel
Creating, Compiling, and Installing a Custom Linux Kernel Module

TODO

# File Systems

File Systeme und File Management

Applikationen benötigen und erzeugen Daten, diese Daten "Ieben" auch
ausserhalb der Applikationen $\rightarrow$ Persistenz. Wie werden diese
Daten gespeichert und verwaltet? In Files: Speichern alle Daten
persistent ausserhalb von Applikationen. Sozusagen alle Anwendungen
lesen ihre Daten von Files und schreiben Resultate für den späteren
Gebrauch wieder auf Files. Ausnahme bilden einige RealTime Systeme und
Spezialanwendungen.

Es gibt zwei grundsätzliche Komponenten eines File Verwaltungssystems:

- logische Organisation oder logische Sicht $\rightarrow$ Was der
  Benutzer wahrnimmt.

- physikalische Organisation oder physikalische Sicht $\rightarrow$ Wie
  das File Management System implementiert ist.

Für Anwender ist nur der Zugriff auf ein File relevant. Das
Betriebssystem kümmert sich darum, wie der Zugriff geschieht (API), wie
Daten abgelegt werden und wie Geräte verwaltet werden.

Field: Einzelner Datenwert, kleinste speicherbare Einheit: Byte, Word,
String (z.B. Name), etc. Feste Länge oder Variable Länge mit
Feld-Terminator (z.B. ’IO’)

Record: Sammlung von zusammengehörigen Feldern (z.B. 512 oder 4096
Bytes, oder Personalien wie Geburtsjahr, Vorname, Name, ...). Feste oder
variable Länge, feste oder variable Anzahl Felder (variable Anzahl
Felder $\rightarrow$ Feldname Notwendig) File: physikalische Sicht. Eine
Menge von gleichen bzw. ähnlichen Records, eine Menge von gleichen
Feldern. Im Allgemeinen Zugriffskontrolle auf Fileebene.

## Konzept - File

Aus Anwendersicht ist das File die kleinste logische Speichereinheit von
Sekundärspeicherplatz, unabhängig vom Sekundärspeichermedium
(Magnetische/Elektronische/Optische Disks, Memory Sticks, Ram Disks,
Magnetische Tapes, ...). Es abstrahiert von physikalischen Eigenschaften
des Mediums und ist ein Objekt mit Namen. Daten können nur in Form von
Files auf Sekundärspeicher abgelegt werden, es werden Methoden für
Zugriff und Verwaltung angeboten.

## Funktionen / Methoden

- positionieren (Record): $\operatorname{seek}()$

- erzeugen /öffnen: create() / open()

- löschen / schliessen: delete() / close()

- lesen / schreiben: read() / write()

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-32.jpg" alt="image" />

</div>

- Files erzeugen, löschen und ändern

- Über symbolische Namen auf Files zugreifen

- Zugriffsart auf Files festlegen

- Kontrollierter Zugang zu Files anderer Benutzer

- Filestruktur an die Problemstellung anpassen können

- Daten zwischen Files verschieben

- Files sichern, bei Schäden wiederherstellen

Benutzeranforderungen:

- Persistenz (File bleibt trotz Crashes und An- / Abschaltzyklen
  vorhanden)

- Einfache Benutzbarkeit (Files sind einfach zu finden, lesen,
  modifizieren, ...)

- Effizienz (Disk Space wird gut ausgenutzt)

- Geschwindigkeit (Daten stehen schnell zur Verfügung)

- Schutz (Andere Benutzer haben keinen beabsichtigten oder
  unbeabsichtigten Zugriff)

File System Architektur

file access: Standardschnittstellen für verschiedene Filestrukturen und
Fileorganisationen logical I/O: Übersetzt logische $\leftrightarrow$
physikalische Records, verwaltet grundlegende Daten zu Files basic I/O
supervisor: Verantwortlich für gesamten physikalischen I/O, erzeugt
Schreib-/Lesebefehle (z.B. Drive 1, Cylinder 73, Head 2, Sector 10 bzw.
Logical Block Addressing)

basic file system: Primäre Schnittstelle zwischen Computer und
Peripherie, kümmert sich um Austausch und Platzierung von Datenblöcken

device drivers: Kommunikation mit Geräten: low level commands zur
Ansteuerung der HW, Interrupt Handler

Files - Organisation, Verwaltung, Zugriff

File Attribute

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-33.jpg" alt="image" />

</div>

File Attribute enthalten Informationen zum File und werden im File
Control Block gespeichert. Bei Linux befindet sich der File Control
Block im I-Node (Information Node). Zu den File Attributen gehören unter
anderem Protection (Zugriffsrechte), Links (Anzahl Referenzen auf das
File), Besitzer, Grösse, Zeiten, Name, ...

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-34(1).jpg" alt="image" />

</div>

Open File Table: Für jedes offene File von jedem Prozess, File Status
Flags, Position des Schreib-/Lesezeigers (verschiedene pro File sind
möglich!)

V-Node Tabelle: Information zu jedem offenen File. File Info (z.B.
Dateityp: ext2, vfat, ...), I-Node (Referenz auf I-Node mit Eigentümer,
Grösse, Zugriffsrechte, wie oft das File geöffnet ist, ...)

## File Typen

Für das Betriebssystem notwendige File Typen sind Directories
(Verzeichnisse) und Regular Files (Dateien). Verzeichnisse enthalten
weitere Referenzen auf Dateien und Verzeichnisse, Dateien können
beliebige Benutzerdaten wie z.B. Programme sein. Weitere
Unterscheidungen sind möglich, bei Windows wird diese Unterscheidung
z.B. durch die File Extension gemacht. File Typen können verwendet
werden, um die dazugehörige Applikation zu finden, um zu verhindern,
dass z.B. ein Binärfile editiert wird etc.

Interne File Struktur

Files werden auf der Disk meistens in Blöcken vordefinierter Länge
gespeichert. Traditionell sind dies 512 Bytes, heute aber oft 4096 Bytes
(zumindest logisch). Linux / Unix behandeln Files als eine Folge von
Bytes, einzelne Bytes sind über den Offset relativ zum Fileanfang
adressierbar. Das Filesystem verpackt einzelne Bytes in Disk Blöcke,
wobei der letzte Block des Files oft nicht voll ist $\rightarrow$
interne Fragmentierung.

## File Organisation

Die interne File Struktur hängt von der betrachteten Schicht ab. Auf
Diskebene sind es 512 Byte Blöcke, auf Betriebssystemebene eine Sequenz
von Bytes und aus der Sicht des Anwenders ist es entweder eine Sequenz
von Bytes oder eine Menge von Records. Die File Organisation bezieht
sich auf die logische Strukturierung der Records und wie auf die Records
zugegriffen wird.

## Zugriffsmethoden

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-34.jpg" alt="image" />

</div>

Es gibt zwei Zugriffsmethoden auf Records: sequentieller Zugriff
(sequential access) und direkter Zugriff (random / direct access).
Zugriffsrechte

Zugriffschutz auf Files basiert meist auf einer Benutzeridentität.
Zugriff für mehrere Benutzer wird durch eine Liste mit Zugriffsrechten
realisiert (Access Control Lists). Traditionell (und immer noch
standardmässig) gibt es drei Typen von Anwenderrechten: User, Group und
Other.

Konsistenzsemantik

Wie manifestiert sich ein Filezugriff durch mehrere Anwender? Unter Unix
ist ein Schreibvorgang für alle Anderen sofort sichtbar, ein gemeinsamer
Location Pointer ist möglich. Filezugriff durch verschiedene Prozesse
wird durch exklusiven Zugriff auf read() und write() ermöglicht, die
Reihenfolge wird eingehalten.

## File Management

## File Management: Record Locking

Da in Multiuser-Umgebungen Mehrfachzugriffe möglich sind, ist Mutex auf
Files notwendig (z.B. bei Datenbanksystemen, Daemonen, ...). Das sperren
einer ganzen Datei ist ineffizient, deswegen werden durch Record-Locking
nur Teile des Files gesperrt. Dafür ist jedoch
BetriebssystemUnterstützung notwendig, bei Linux/Unix ist das fcntl().

## File Management: Journaling

Journaling verhindert Inkonsistenzen des File Systems bei Crashes,
sämtliche Änderungen am File System geschieht über Transaktionen.
Moderne Betriebssysteme unterstützen Journaling (Linux: ext3, ext4,
reiserfs - Windows: NTFS). Aktuelle Jorunaling Filesysteme verwenden
Journaling meist nur für Metadaten.

Ext3 verfügt über drei Journaling-Modi:

- Ordered: Nur Metadaten (Info zu Files, nicht zu Inhalt) werden im
  Journal gespeichert.

- Writeback: Nur Metadaten, ordered, aber nicht synchron.

- Jorunal: Auch Daten werden im Journal eingetragen. Wegen zweifachem
  Speichern deutlich langsamer.

Beispiel File löschen unter Unix: Geschieht in drei Schritten:

1.  File im Verzeichnis löschen

2.  I-Node löschen, in den Pool zurückgeben

3.  Alle Disk Blöcke freigeben, in den Pool zurückgeben

## File Management: Memory Mapped Files

Memory Mapped Files werden in den Virtual Memory des Prozesses
abgebildet und mit "demand paging" in den physischen Speicher gelesen:
Filezugriff = Speicherzugriff. Bei Memory Mapped Files und File Sharing
ist die Konsistenzsemantik zu beachten (Wann sind Daten ins File
geschrieben und zum Lesen verfügbar?) $\rightarrow$ Ev. Synchronisation
durch Anwender nötig.

## File Management: Quotas

Legen Grenzen für Disk-Usage (Partitions) fest, im Allgemeinen pro
Anwender.

## Directories (Verzeichnisse)

Die Organisation von (sehr) vielen Files ist meist zweiteilig: Es gibt
eine oder mehrere Partitionen pro Disk, Directories enthalten
Informationen zu den Files in einer Partition.
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-36.jpg" alt="image" />

## Directories: Organisation

Die einfachste Organisation bzw. Struktur für Verzeichnisse ist eine
Liste, jedoch ist dies oft unpraktisch und durch die lineare Suche
zeitaufwendig. Die meistverwendete Form ist deshalb eine Baum- oder
hierarchische Struktur, wodurch auch verschieden tiefe Hierarchieebenen
möglich werden.

Verzeichnisse sind Files mit Referenzen auf Verzeichnisse (directory
files), Dateien (regular files) und enthalten ggf. zusätzliche Infos zu
Files. Operationen auf Directories: Files suchen, erzeugen, löschen,
umbenennen. Inhalt auflisten, gesamtes Filesystem durchlaufen.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-36(1).jpg" alt="image" />

</div>

Naming

Jedes File muss einen eindeutigen Namen haben. Baumartige
Verzeichnisstrukturen unterstützen diese Forderung, da ein File
eindeutig durch seinen Pfadnamen (path) definiert ist. Da Pfadnamen
mühsam sind, gibt es pro Anwender respektive Prozess ein
Working-Directory (cd /home/user $\rightarrow$ working directory).

## File System Implementation

Wie werden Disk Blöcke alloziert? $\rightarrow$ Einfluss auf Zugriff und
Ausnutzung des Disk Platzes. Auf einer einzigen Disk können sich viele
Files mit verschiedensten Grössen befinden. Die Allozierung von
Diskspace für diese Files muss zwei Anforderungen erfüllten: Diskspace
muss effizient genutzt werden und der Filezugriff muss effizient sein.
Es gibt drei wesentliche Lösungsmöglichkeiten:

- Contiguous allocation

- Linked allocation

- Indexed allocation

## Contiguous Allocation

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-37.jpg" alt="image" />

</div>

Blöcke werden zusammenhängend hintereinander gespeichert. Unterstützt
sowohl sequential als auch random access. Für das Finden von freiem
Speicherplatz werden die gleichen Lösungsstrategien wie bei Memory
Management angewendet, am häufigsten werden First-Fit und Best-Fit
eingesetzt ( $\rightarrow$ externe Fragmentierung). Ein weiteres Problem
ist jedoch die Frage, wie viel Platz alloziert werden soll. Beim
Kopieren eines Files ist die grösse bekannt, aber was, wenn das File
vergrössert werden soll? Entweder muss File kopiert werden (kein Platz
durch Best-Fit) oder durch die vorherige Allocation ensteht interne
Fragmentierung.

## Linked Allocation

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-37(1).jpg" alt="image" />

</div>

Die Blöcke eines Files bilden eine verkettete Liste, was alle Probleme
von Contiguous Allocation löst. Jedoch hat diese Methode eigene Probleme:
Sie ist ineffizient für Random Access (Lösungsstrategien: First-Fit,
Best-Fit), ausserdem brauchen die Zeiger Disk Space (4 Byte pro Pointer,
512 Byte Blöcke $\rightarrow$ 0.78% des Disk Space. Lösung: Clustering,
Cluster von Blöcken anfordern, damit Pointer im Verhältnis weniger Platz
brauchen). Ein weiteres Problem ist die Zuverlässigkeit: Was, wenn ein
Zeiger verloren geht? Teilweiser Lösungsansatz ist "double linked list",
was jedoch auch mehr Overhead bedeutet. FAT16 und FAT32 verwenden
Varianten von Linked Allocation.

## Indexed Allocation

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-37(2).jpg" alt="image" />

</div>

Bei der Indexed Allocation werden die Blockzeiger in einem Index Block
gespeichert. Vorteile dieser Methode sind keine externe Fragmentation
und effizienter Random Access. Ein Problem ist natürlich, dass die
Zeigerblöcke Speicherplatz brauchen. Filesystems ab. Für Sequential
Access (heute eher irrelevant) am ehesten Linked Allocation, für Direct
(Random) Access eher Contiguous oder Indexed Allocation. Oft ist auch
mixed allocation (Contiguous für kleine, Indexed für grosse Files) und
Clustering anzutreffen. Die heutige CPU-Leistung lässt auch eher
aufwendige Algorithmen zu.

## Free Space Management

Freie Blöcke auf der Disk müssen verwaltet werden, deswegen führt das BS
eine Liste mit freien Blöcken (Free Space List genannt, jedoch nicht
zwingend eine Liste).

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-38(2).jpg" alt="image" />

</div>

- Bit Vector / Bit Map: Jeder Block entspricht einem Bit in der Liste.
  Effizient wenn im Speicher, aber Speicheraufwendig (bei 6 GB Disk mit
  512 Byte Blöcken 1.5 MB).

- Linked List: Freie Blöcke als Linked List, Zeiger auf ersten Block im
  Speicher. Absuchen der Free List ist aufwendig, jedoch nicht häufig
  notwendig.

- Grouping: Im ersten freien Block werden die Adressen von N freien
  Blöcken gespeichert. Der letzte Block der Adresse zeigt auf den
  nächsten Block mit freien Blöcken.

Effizienz und Performance

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-38.jpg" alt="image" />

</div>

Die Effiziente Diskausnutzung ist durch Allocation und
Verzeichnis-Algorithmen bestimmt. Da Disks relativ langsam sind ist
effizienter Zugriff ein Muss. Auf on-board Cache können ganze Tracks
zwischengespeichert werden. Im Hauptspeicher gibt es Disk Cache
(Kontrolle durch Betriebssystem) und Ram Disks (durch Anwender
Kontrolliert).

Unix Filesystem: Benutzersicht

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-38(1).jpg" alt="image" />

</div>

Linux (/ Unix) unterstützt diverse Filesysteme, wobei das Virtual File
System als zusätzliche Abstraktion vom Filesystem eingeführt wird. Es
bietet ein gemeinsames System Call Interface für sämtliche Filesysteme
und übersetzt die System Calls auf die spezifische Schnittstelle des
jeweiligen Filesystems.

Bsp: Network file system (NFS)

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-39.jpg" alt="image" />

</div>

## Das Unix Filesystem: Systemsicht

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-39(1).jpg" alt="image" />

</div>

Bootblock: Bootstrap-Code zum starten des BS, meistens erster Sektor.

Superblock: Beschreibt Aufbau des Filesystems. Grösse, Anzahl Dateien,
freier Platz, Inodeinformation, Blockinformation, ...

Inode Liste: Inodes enthalten Informationen zu Files (z.B. Diskblöcke,
Metadaten wie Datum, Zugriffsrechte, Open Count). Grösse beim
Konfigurieren des Filesystems festgelegt.

Datenblöcke: Beginnen nach der Inode Liste und enthalten echte Daten bei
Datenfiles, Verwaltungsinformation für Directories. Ein Datenblock kann
nur zu einem einzigen File gehören.

## I-Nodes

Für kleine Files erhalten I-Nodes direkte Zeiger auf Datenblöcke. Für
Grosse Files: Zeiger auf Blöcke, die weitere Zeiger enthalten (oder auch
direkt auf Datenblöcke).

Die Maximale Filegrösse ergibt sich folgendermassen:

Blockgrösse 1 Kbyte und 32 Byte Zeiger (Standard Unix).

- 10 (Linux: 12) direkte Blöcke à 1 Kbyte: $10 \mathrm{~KB}$

- 1 indirekter Block mit 256 direkten Blöcken: $256 \mathrm{~KB}$

- 1 doppelt indirekter Block mit 256 indirekten Blöcken:
  $64 \mathrm{MB}$

- 1 dreifach indirekter Block mit 256 doppelt indirekten Blöcken: 16 GB

## File System Konsistenz

Periodische Checks garantieren die Konsistenz des File Systems. fsck()
(Unix / Linux) verwendet dafür zwei Tabellen: Wie oft kommt ein Block in
einem File vor, wie oft kommt ein Block in der FreeList vor. Es gibt nun
vier Fälle:
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-40(1).jpg" alt="image" />

Konsistent: Alles in Ordnung

Block fehlt: Zum Beispiel nach Crash. Kein Problem, nur
Platzverschwendung $\rightarrow$ Block in FreeList eintragen.

Duplikat in Free-List: Free List neu aufbauen

Duplikat bei Daten: Wenn eines der Files entfernt wird, kommt Block in
Free-List $\rightarrow$ Resulat: Block ist frei, aber wird benutzt.
Lösung: Neuen Block allozieren, Daten aus Duplikat in Block eintragen
und Kopie in eines der Files hängen.

Tmpfs: tmpfs ist ein Dateisystem, das in vielen Unix-artigen
Betriebssystemen, als verbesserter Ersatz für ramfs, zum Anlegen einer
RAM-Disk eingesetzt wird. Wie auch mit ramfs, können mit tmpfs Teile des
realen Arbeitsspeichers wie eine Festplatte eingebunden und beschrieben
werden.

## Logical volume management (LVM)

ist ein hauptsächlich im Unix- und Linux-Umfeld verbreitetes
Partitionsschema, das eine Abstraktionsebene zwischen Festplatten,
Partitionen und Dateisystemen bietet. Durch den LVM ist es möglich,
dynamisch veränderbare Partitionen (Logical Volumes, kurz LV) zu bilden,
die sich auch über mehrere Festplatten hinweg erstrecken können.

<div class="center">

<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-40.jpg" alt="image" />

</div>

Volume groups (VG): Diese VG stellt einen Pool an Datenspeicher dar, aus
dem später Logical Volumes allokiert werden können. Der verfügbare
Speicher einer VG wird dabei in kleine, gleich groß bleibende Teile
unterteilt - den Logical Extents.

Logical volumes (LV): VGs werden in eine oder mehrere LVs aufgeteilt,
auf denen anschließend die Dateisysteme aufsetzen.

Physical volumes (PV): Wird eine Partition bzw. ein Device als PV
initialistiert, so wird das BlockDevice mit einem LVM-Label
gekennzeichent und mit Metadaten versehen.

## LVM - Linux

- Free space management (allocate anywhere)

- On-line space management (resizing)

- Snapshots (Copy-on-Write, next slide)

- Balancing (see lab)

- Thin-provisioning

- RAID Vollständigen Zuordnung wird bei der schlanken Speicherzuweisung
  nur der Speicher reserviert, welcher auch tatsächlich benötigt wird.

Copy on write (COW): Das Copy-On-Write-Verfahren ist in der
Datenverarbeitung eine Optimierungsmethode zur Vermeidung unnötiger
Kopien und Kopiervorgänge, beispielsweise zwischen Prozessen unter
unixartigen Systemen, insbesondere bei oder nach einem forkSystemaufruf.
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-41.jpg" alt="image" />

Duplikate, welche nicht verändert wurden, müssen nicht zwingend an einem
anderen Ort gespeichert werden.

Snapshots: LVM Snapshots ermöglichen einfache Point-In-Time Kopien von
LVM Logical Volumes (LVs). Bei Snapshots handelt es sich jedoch nicht um
echte Kopien des Original-LVs. Nur wenn Daten des Original-LV nach der
Erstellung eines Snapshots verändert werden, werden jeweils zuvor die
ursprünglichen Daten in den Snapshot kopiert (Copy-on-Write).

Linux - BtrFS (B-tree file system): General purpose file system

## BtrFS

TODO

## RAID (Redundant array of independent disk)

Disks sind unzuverlässig, die Annualized Failure Rate beträgt $1.7 \%$
in Jahr 1 und $8.6 \%$ in Jahr 3 (Google Studie). Der Ausfall einer Disk
darf aus Kostengründen nicht zum Systemausfall führen. Idee: Mit
mehreren Disks einen zuverlässigen und schnellen Massenspeicher
realisieren.

- Baut einen performanten und sicheren Massenspeicher

- Idea: Nimmt mehrere Disk (also hot spares) zusammen
  <img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-41(2).jpg" alt="image" />

Union file system wie zB. AuFS oder overlayfs vereinigen Datein aus
verschiedenen Dateisystemen zu einem einzigen logischen Dateisystem.
<img src="/summaries/BSY/img/2023_05_31_9bd9f8992b69b04f3491g-41(1).jpg" alt="image" />
