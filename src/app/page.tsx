import { content } from "@/content";
import { Approach } from "@/components/Approach/Approach";
import { PaletteHost } from "@/components/CommandPalette/PaletteHost";
import type { PaletteData } from "@/components/CommandPalette/CommandPalette";
import { Contact, SiteFooter } from "@/components/Contact/Contact";
import { Education } from "@/components/Education/Education";
import { FactSheet } from "@/components/FactSheet/FactSheet";
import { Hero } from "@/components/Hero/Hero";
import { Intro } from "@/components/Hero/Intro";
import { Interlude } from "@/components/Interlude/Interlude";
import { MotionDirector } from "@/components/Motion/MotionDirector";
import { OffTheClock } from "@/components/OffTheClock/OffTheClock";
import { Positions } from "@/components/Positions/Positions";
import { ProgressRail } from "@/components/ProgressRail/ProgressRail";
import { ProjectIndex } from "@/components/ProjectIndex/ProjectIndex";
import { SelectedWork } from "@/components/SelectedWork/SelectedWork";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll/SmoothScroll";
import { Specialism } from "@/components/Specialism/Specialism";
import { Toaster } from "@/components/Toast/Toaster";
import { Toolkit } from "@/components/Toolkit/Toolkit";
import { personJsonLd } from "@/lib/json-ld";

const { profile, microcopy, interlude, specialism, projects } = content;

// The sections, top to bottom, as the command palette lists them.
const sections = [
  { id: "facts", label: microcopy.factSheetHeading },
  { id: "approach", label: microcopy.approachHeading },
  { id: "work", label: microcopy.selectedWorkHeading },
  { id: "interlude", label: interlude.heading },
  { id: "index", label: microcopy.indexHeading },
  { id: "positions", label: microcopy.positionsHeading },
  { id: "specialism", label: specialism.heading },
  { id: "education", label: microcopy.educationHeading },
  { id: "toolkit", label: microcopy.toolkitHeading },
  { id: "off-the-clock", label: microcopy.offTheClockHeading },
  { id: "contact", label: microcopy.contactHeading },
];

const paletteData: PaletteData = {
  sections,
  projects: projects.map((p) => ({ slug: p.slug, title: p.title })),
  email: profile.email,
  cv: profile.links.cv,
  text: {
    placeholder: microcopy.commandPlaceholder,
    heading: microcopy.paletteHeading,
    shortcutsHeading: microcopy.shortcutsHeading,
    copyEmail: microcopy.copyEmail,
    emailCopied: microcopy.emailCopied,
    downloadCv: microcopy.downloadCv,
    toggleTheme: microcopy.toggleTheme,
    depth: { "30s": microcopy.depth30s, "3m": microcopy.depth3m, "10m": microcopy.depth10m },
    depthLegend: microcopy.depthLegend,
    groupSections: microcopy.paletteSections,
    groupProjects: microcopy.paletteProjects,
    groupActions: microcopy.paletteActions,
    noResults: microcopy.paletteNoResults,
    consoleNote: microcopy.consoleNote,
    shortcuts: [
      { keys: "Ctrl K, /", action: microcopy.shortcutPalette },
      { keys: "?", action: microcopy.shortcutHelp },
      { keys: "Esc", action: microcopy.shortcutClose },
      { keys: "Arrows", action: microcopy.shortcutSliders },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <Intro label={microcopy.resolving} />
      <SiteHeader />
      <ProgressRail marks={sections} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <FactSheet />
        <Approach />
        <SelectedWork />
        <Interlude />
        <ProjectIndex />
        <Positions />
        <Specialism />
        <Education />
        <Toolkit />
        <OffTheClock />
        <Contact />
      </main>
      <SiteFooter />
      <PaletteHost data={paletteData} />
      <Toaster />
      <SmoothScroll />
      <MotionDirector />
    </>
  );
}
