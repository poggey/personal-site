import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";
import ApexPanel from "./projects/apex.mdx";
import BuiltByPanel from "./projects/built-by.mdx";
import EscapeVelocityPanel from "./projects/escape-velocity.mdx";
import GreenlinePanel from "./projects/greenline.mdx";
import MarginaliaPanel from "./projects/marginalia.mdx";
import PortfolioOptimiserPanel from "./projects/portfolio-optimiser.mdx";
import RiskDashboardPanel from "./projects/risk-dashboard.mdx";
import ShariahResearchPanel from "./projects/shariah-research.mdx";
import StirlingPanel from "./projects/stirling.mdx";
import TheSlatePanel from "./projects/the-slate.mdx";

// Case-study prose by slug. Static imports (rather than a dynamic import of a template
// path) so the bundler sees every file and a missing one fails the build.
export const panels: Record<string, ComponentType<MDXProps>> = {
  apex: ApexPanel,
  "built-by": BuiltByPanel,
  "escape-velocity": EscapeVelocityPanel,
  greenline: GreenlinePanel,
  marginalia: MarginaliaPanel,
  "portfolio-optimiser": PortfolioOptimiserPanel,
  "risk-dashboard": RiskDashboardPanel,
  "shariah-research": ShariahResearchPanel,
  stirling: StirlingPanel,
  "the-slate": TheSlatePanel,
};
