# CDT Study App — Plan

Phone-first, offline PWA to help Nathaniel Latham study for **all** NBC CDT written exams:
Comprehensive + every specialty (Ceramics, Complete Dentures, Crown & Bridge, Implants,
Orthodontics, Partial Dentures, and Digital Workflow, the 7th specialty NBC now offers).

## 1. Exam structure (verified from official NBC sources, retrieved 2026-10-23)

Sources (copies in `sources/`):
- [H] CDT Examination Handbook & Application, revised 3/1/2026 — https://nbccert.org/pdfs/CDTExamHandbook.pdf (pp. 17–28)
- [E] Exam content page — https://nbccert.org/certificants/certified-dental-technician/cdt-rg-exam.cfm
- [A] CDT Application & Exam Process — https://nbccert.org/certificants/certified-dental-technician/cdt-application.cfm
- [DW] Digital Workflow Job Task Outline (rev. June 2022) — https://nbccert.org/?845jee ; specialty page https://nbccert.org/digital-workflow-cdt-specialty.cfm

To become a CDT you must pass three exams within 4 years: Written Comprehensive (or RG), Written Specialty, and a Practical in the same specialty [A].
- **Comprehensive:** 160 MCQ (4 options, best answer), 2 h 45 min [E][H].
- **Written Specialty:** 80 MCQ, 1 h 30 min [E][H].
- Each form also has 10 ungraded field-test items [E]. Passing scores = number correct; the current minimum is sent with the confirmation letter and isn't published [H].
- UNVERIFIED / not published: how the 160 Comprehensive items split between "general knowledge" and "specialty-specific" questions.

### Comprehensive — General knowledge domains [H p.21–22]
| Domain | % of general knowledge Qs |
|---|---|
| A. Dental Laboratory Industry Regulations & Scope of Practice | 8–10 |
| B. Anatomy | 17–19 |
| C. Terminology & Principles | 6–8 |
| D. Articulation | 6–8 |
| E. Types, processes, physical properties & handling of dental lab materials | 34–36 |
| F. Impressions & Models | 10–12 |
| G. Safe Working Practices | 12–14 |

### Comprehensive — Specialty-specific share [H]
Ceramics, Complete Dentures, Crown & Bridge, Orthodontics, Partial Dentures and Implants are **each 16–18%** of the specialty-specific Comprehensive questions. Digital Workflow has no figure given; [E] says DW items were "to be added in 2024".

### Written Specialty exams (% of that specialty exam) [H p.22–28]
**Ceramics:** A Preliminary & Diagnostic Work Up 10–12 · B Master Cast (Trad/Digital) 9–11 · C Substructure for Ceramics 18–20 · D Ceramic Application & Contouring 36–38 · E Materials & Equipment 21–23

**Complete Dentures:** A Master Casts from Stock/Custom Tray Impressions 15–17 · B Record Base Plate & Occlusal Rim 5–7 · C Select & Arrange Artificial Teeth 16–18 · D Process the Denture 14–16 · E Finish & Polish 15–17 · F Repairs & Alterations 13–15 · G Materials & Equipment for Removable 14–16

**Crown & Bridge:** A Preliminary & Diagnostic Work Up 9–11 · B Master Cast 10–12 · C Design & Manufacture Patterns 17–19 · D Manufacture Restoration 11–13 · E Finish & Polish 24–26 · F Materials & Equipment 21–23

**Orthodontics:** A Growth & Development 11–13 · B Ortho Treatment & Appliances 16–18 · C Wire Components & Auxiliaries 21–23 · D Acrylics, Composites, Plastics 14–16 · E Soldering & Welding 14–16 · F Materials & Equipment 16–18

**Partial Dentures:** A Master Casts 6–8 · B Survey, Design & Preparation for Framework 25–27 (*the figure is detached from its heading in the PDF two-column layout; assigned by elimination, totals check to 99–100*) · C Refractory Cast 3–5 · D Frameworks 10–12 · E Select/Arrange Teeth & Process 9–11 · F Finish & Polish Base 9–11 · G Repairs & Alterations 11–13 · H Materials & Equipment 18–20

**Implants:** A Preliminary & Diagnostic Work Up 20–22 · B Master Cast 10–12 · C Removable Prosthesis 8–10 · D Bar/Substructure 15–17 · E Screw-Retained Fixed or Removable (Hybrid) 16–18 · F Abutment & Cement-Retained 14–16 · G Materials & Equipment 9–11

**Digital Workflow** [DW][H]: Data Acquisition 21–25 · Design Indications 30–34 · Fabricating Restorations 22–26 · Maintaining Digital Equipment 20–24

The full task lists for each domain (numbered sub-tasks) are in `sources/hb-raw.txt` and `sources/DigitalWorkflowJobTaskOutline.txt`. These become card tags.

### Official references [H p.17–18]
NBC says the exams are "not based on a specific textbook". From the NADL store: Visual Reference Guides (one per specialty), an Examination Preparation Guide, and USAF Pamphlet 47-103 Vol 1 (Basic Sciences, Removable Prosthodontics, Orthodontics, 2005) and Vol 2 (Fixed & Special Prosthodontics, 2005).
- General: Mosby's Dental Dictionary 3e (2014); Nelson, Wheeler's Dental Anatomy, Physiology & Occlusion 9e (2009); O'Brien, Dental Materials and their Selection 4e (2009); USAF 47-103 Vols 1–2.
- Ceramics / C&B: Hohmann & Hielscher, Principles of Design and Fabrication in Prosthodontics (2016); Chu et al., Fundamentals of Color 2e (2011); Hämmerle et al., Dental Ceramics: Essential Aspects (2008); Kelly, Ceramics in Dentistry (2016); Naylor, Intro to Metal-Ceramic Technology 2e (2009).
- Complete Dentures: MacEntee, The Complete Denture: A Clinical Pathway 2e (1999).
- Partial Dentures: Carr, McCracken's Removable Partial Prosthodontics 13e (2015).
- Orthodontics: McNamara, Orthodontics and Dentofacial Orthopedics (2001); Willison & Warunek, Practical Guide to Orthodontic Appliances (Great Lakes Orthodontics).
- Implants: Babbush et al., Dental Implants: The Art and Science 2e (2011); Misch, Contemporary Implant Dentistry 3e (2008); Misch, Dental Implant Prosthetics 2e (2014); Shafie, Clinical and Laboratory Manual of Implant Overdentures (2007); White, Osseointegrated Dental Technology (1993).
- Digital Workflow: listed online at https://nbccert.org/?w68d5h (**fetch timed out — still TODO**). General references page: https://nbccert.org/?gmxhvx (also timed out).

## 2. Content model
- One **exam** per test (comprehensive, ceramics, complete-dentures, crown-bridge, orthodontics, partial-dentures, implants, digital-workflow). Each has **decks** that match the official domains, with the weight ranges listed above.
- Data lives in `content/<exam>.json`.
```json
{ "id":"cb-E-003", "exam":"crown-bridge", "domain":"E", "task":"E.6",
  "type":"flash|mcq", "front":"...", "back":"...",
  "choices":["a","b","c","d"], "answer":2, "explanation":"...",
  "source":{"ref":"O'Brien 4e","loc":"ch. 15"}, "verified":false, "tags":["alloys"] }
```
- `verified:true` only when a human has checked the card against the cited reference. The UI shows a badge on unverified cards. No card may claim an exam fact unless it cites [H]/[DW].

## 3. Features
- Flashcards with SRS. Use **SM-2**, with an FSRS-lite upgrade later. Grades: Again/Hard/Good/Easy.
- Quizzes: 4-option MCQ in exam style. A mock-exam mode draws items in proportion to the domain weights and uses the real timing (160 Q / 165 min; 80 Q / 90 min).
- Progress per exam and domain: mastery %, due counts, weak-domain heatmap. "Study next" favors high-weight, low-mastery domains.
- Hands-free audio: Web Speech API `speechSynthesis` reads the question, pauses, then reads the answer. Optional voice grading via `SpeechRecognition` where available; otherwise large tap targets or media keys.
- Offline-first, installable, dark mode, export/import progress as JSON.

## 4. Tech stack (tiny)
- Static files: `index.html`, vanilla ES modules, a single CSS file. No build step and no framework.
- Service worker uses cache-first for the app shell and content JSON. `manifest.webmanifest` + icons.
- Storage: IndexedDB for review state and history (via a small wrapper), localStorage for settings.
- Tests: a few node-run unit tests for the SM-2 scheduler and weighted sampling.

## 5. Preview hosting
- Tailscale is **not installed** on the box (`which tailscale` → not found). Options: install Tailscale and run `tailscale serve` (needs Nathaniel to sign in), or use free static hosting (GitHub Pages / Cloudflare Pages). Both are HTTPS, which installing the service worker requires.
- Local: `python3 -m http.server`.

## 6. Build order
1. Scaffold: shell, manifest, service worker, routing, IndexedDB store, and the exam/domain registry (weights from this file).
2. Flashcards + SM-2 + per-domain progress. Seed ~10 cards per domain, all `verified:false`.
3. MCQ quiz + weighted mock exam with timer.
4. TTS hands-free mode.
5. Content expansion, one exam at a time (Comprehensive first, then the specialties), each card cited. A verification pass flips the `verified` flags.
6. Hosting, install test on phone, export/import.
7. Optional: FSRS-lite, voice answers, DW references once fetched.

## 7. iOS notes (target device: iPhone, Safari)
- Paths are all relative, so the app works under a static-host subpath. The SW scope is `./`.
- apple-touch-icon is 180px, and `apple-mobile-web-app-capable` / status-bar meta are set. `viewport-fit=cover` + `env(safe-area-inset-*)` padding handle the notch and home bar.
- An in-app Add to Home Screen hint shows the Safari Share sheet steps on iOS and the menu steps on Chrome. It is hidden when running standalone and can be dismissed.
- Phase 4 (audio): iOS `speechSynthesis` only starts from a user gesture. Prime it with a tap, e.g. a "Start hands-free" button that speaks an empty utterance. The voice list loads asynchronously (`voiceschanged`), and speech can stop when the screen locks or the app is backgrounded. Keep each utterance short and chain them with `onend`. There is no `SpeechRecognition` in iOS PWAs, so use tap or headphone controls.
- iOS can evict PWA storage after long disuse, so the Export backup matters.
