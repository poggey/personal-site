# Design plan

Written in phase 02. `CLAUDE.md` ("Design direction v2") is the constitution; this file records how it was applied and why.

## Concept in one line

A clean printed record with one person's marks on it. Black print on cool copier paper; blue biro only where a person marked the page (sidenote markers, links, highlights, the reader's dot, the active depth setting, focus).

## Palette

| Token         | Light       | Dark        | Role                        |
| ------------- | ----------- | ----------- | --------------------------- |
| `--paper`     | #F3F4F2     | #000000     | Background                  |
| `--print`     | #000000     | #E6E7E4     | Text and data               |
| `--pencil`    | #5B5F63     | #9A9EA2     | Secondary text              |
| `--rule`      | #D5D8D6     | #26282A     | Lines that encode data only |
| `--biro`      | #2340E0     | #6F86FF     | The mark                    |
| `--biro-wash` | biro at 10% | biro at 18% | Highlights, selected rows   |

Contrast is computed on `/styleguide` from these values, not asserted. The interlude always uses the dark set, whatever the theme.

## Type

Two families, chosen to be clearly distinct:

- **Archivo** (wght 100 to 900, wdth 62 to 125): name, headlines, UI, figures. The hero name is set heavy and condensed (wdth 75) so it fills ten columns at a sane size; width is the one expressive device.
- **Newsreader** (wght 200 to 800, opsz 6 to 72): body, sidenotes, case-study prose. Optical size is automatic (`font-optical-sizing: auto`), so sidenotes get the sturdier small cut.

Scale: a 1.25 ratio (major third) on a 17px body at 375px, growing to an 18px body at 1440px. Every step is a `clamp()` between those two widths, documented in `tokens.css`. Hero name sits outside the scale (it is sized to its columns).

| Step | 375px | 1440px | Use                                |
| ---- | ----- | ------ | ---------------------------------- |
| -2   | 11px  | 12px   | Chart ticks                        |
| -1   | 14px  | 14.4px | Sidenotes, captions, sources       |
| 0    | 17px  | 18px   | Body                               |
| 1    | 19px  | 22.5px | Lead, row titles                   |
| 2    | 22px  | 28px   | Subheads                           |
| 3    | 26px  | 35px   | Section headings (mobile emphasis) |
| 4    | 30px  | 44px   | Section headings                   |
| 5    | 34px  | 55px   | Contact email                      |
| hero | 22vw  | 15.5vw | The name                           |

Numbers everywhere use `tabular-nums lining-nums`. Labels are sentence case. No monospace, no tracked capitals.

## Layout

12 columns, 1440px max, margins 24 / 48 / 80px, gutter 24px, spacing on an 8px scale. One repeated section structure gives the page its rhythm:

```
| heading (cols 1-3)  | body (cols 4-9)                  | margin (cols 10-12) |
| Selected work       | Newsreader text, short paragraphs| 1  sidenote in pencil|
```

The heading column is the "label" of a printed record; the margin column is where the biro goes. On mobile the three collapse into one column and sidenotes become inline toggles.

### Hero

```
+---------------------------------------------------------------+
| Economics and Finance, Queen Mary      [30 sec|3 min|10 min]  |
| London and Newcastle                                          |
|                                                               |
| PADRAIG                    (Archivo 800, wdth 75, 10 cols)    |
|      MIDDLETON             (second line indented 2 cols)      |
|                                                               |
| I build tools that pull the signal     Stirling No. 212      |
| out of financial data.                 Today: headline        |
| Open to Summer 2027 internships...                            |
+---------------------------------------------------------------+
```

### Fact sheet

```
Key facts                         As of Oct 2026
---------------------------------------------------
Year 1 average, First Class, Queen Mary      85% 1
UK councils using a template I designed     650+ 2
...
---------------------------------------------------
Sources: transcript, employers, GitHub.
```

A real factsheet table: label left, value right-aligned in Archivo tabular, footnote markers in biro. Rules only between rows (they separate data).

### Selected work row

```
| 1 | Stirling                      | [ mini visual, 7 cols      ] |
|   | Can a junior analyst's...     | [ already drawn            ] |
|   | One numbered edition a day... |                              |
|   | Live  Code  Open the case study                              |
```

Text 5 columns, visual 7, alternating sides on desktop, stacked on mobile. No card boxes; the visual sits on paper with its caption and source line.

### Positions

```
              2022   2023   2024   2025   2026
Zaltek        |=====================================>
House of Lords       *
ICD Energy                  *
Parkdean                                    ==
Raymond James                                 *
```

Bars and diamonds to a d3 time scale. Rows are buttons that expand outcomes beneath. On mobile the axis runs down the page.

### Interlude

```
#################### black, full bleed ######################
Beat my Sharpe
Eight London-listed ETFs...       | ISF.L FTSE 100     [----o--] 12%
[ scatter 8 cols, frontier,      ]| VWRL.L Global eq.  [--o----]  8%
[ reader's dot in biro          ]| ...
Return 6.1%  Volatility 9.8%  Sharpe 0.21   Target: within 0.05 of 0.76
############################################################
```

## Principles

1. Hierarchy from size and space. No boxes, no cards, no shadows except the focus ring and the open panel.
2. Lines only where they encode data (table rows, axes, bars).
3. The biro means a person's mark. If it is not a mark, it is print.
4. Motion answers the reader, except for the hero resolve.
5. Every figure has a source line within reach.

## Review against the generic student portfolio

| Part             | Generic default it could slip into             | Revision                                                                               |
| ---------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| Hero             | Huge serif name, gradient blob, "Hi, I'm"      | Condensed grotesque name, no greeting, a live Stirling chip instead of a tagline badge |
| Fact sheet       | Grid of giant numbers with tiny labels         | A table read left to right, with an as-of date and sources line                        |
| Section headings | Numbered "01 / About" eyebrows in tracked mono | Unnumbered sentence case headings in a fixed left column                               |
| Projects         | Three rounded cards with screenshots           | Full-width rows, visual drawn as a chart with a caption and source                     |
| Skills           | Logo wall or percentage bars                   | A matrix where every dot is evidence                                                   |
| Accent           | Brand colour on buttons everywhere             | Biro only for marks; buttons are print with an underline                               |
| Dark mode        | Charcoal with neon accents                     | True black, warm grey print, lighter biro                                              |

**Removed to earn its place:** the hairline grid overlay in the hero from the white paper. The grid is felt through alignment; drawing it was decoration.

## v3: riso print and gallery (2026-10-08)

Padraig wanted more colour, real images and motion, with distinct sections, keeping the clean structure. The concept stays Resolution, now as a risograph print: noise is pink ink, signal is black.

| Section         | Ink                    | Signature move                                                      |
| --------------- | ---------------------- | ------------------------------------------------------------------- |
| Hero            | paper                  | points scatter in pink (noise) and turn black as they land (signal) |
| Fact sheet      | blue, white text       | each figure widens along Archivo's width axis as its row arrives    |
| Approach        | paper                  | heading's second ink slides into register                           |
| Selected work   | each project's palette | pinned sideways gallery; screenshots resolve from halftone          |
| Beat my Sharpe  | black                  | each asset in its own ink                                           |
| Index           | paper                  | cursor-following preview                                            |
| Positions       | pink                   | bars draw to scroll                                                 |
| Islamic finance | green                  | the finding darkens word by word                                    |
| Education       | paper                  | mark bars draw                                                      |
| Toolkit         | yellow                 | matrix dots gather into the grid                                    |
| Off the clock   | ink cards              | a draggable row of printed cards                                    |
| Contact         | paper                  | a scatter collapses into one biro dot                               |

**Removed to earn its place:** a planned grain texture over the inks. The halftone and misregistration already say "print".
