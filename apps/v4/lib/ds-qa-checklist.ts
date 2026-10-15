/**
 * Shared QA checklist for non-default design systems (light + dark).
 * Used by the DS 10/10 polish plan — Nova/default is frozen.
 */

export const DS_QA_ROUTE_PATHS = [
  "/demos",
  "/blocks",
  "/charts",
  "/charts/view/area-chart",
  "/charts/view/area-step",
] as const

export const DS_QA_SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "muted",
  "card",
  "popover",
  "border",
  "input",
  "ring",
  "primary",
  "secondary",
  "accent",
  "destructive",
] as const

export const DS_QA_CHART_TOKENS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const

export const DS_QA_CONTROL_MARKS = [
  "Button",
  "Input",
  "Textarea",
  "Select",
  "Checkbox",
  "Radio",
  "Switch",
  "Slider",
  "Card",
  "Alert",
  "Dialog",
  "Sheet",
  "Popover",
  "Dropdown",
  "Tooltip",
  "Tabs",
  "Badge",
  "Table",
  "Sidebar",
] as const

/** Picker order for polish runs (Nova excluded). */
export const DS_QA_ORDER = [
  "comfort",
  "rose",
  "khesht",
  "glass",
  "nili",
] as const

export type DsQaOrderId = (typeof DS_QA_ORDER)[number]

export const DS_TO_REGISTRY_STYLE: Record<
  DsQaOrderId | "default",
  string
> = {
  default: "base-nova",
  comfort: "base-vega",
  rose: "base-rose",
  khesht: "base-khesht",
  glass: "base-glass",
  nili: "base-nili",
}
