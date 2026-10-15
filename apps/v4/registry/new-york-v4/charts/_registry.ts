import { type Registry } from "farsiui/schema"

export const charts: Registry["items"] = [
  // Area Charts
  {
    name: "chart-area-axes",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-axes.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-default",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-default.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-gradient",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-gradient.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-icons",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-icons.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-interactive",
    type: "registry:block",
    registryDependencies: ["card", "chart", "select", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-interactive.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-legend",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-legend.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-linear",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-linear.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-stacked-expand",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-stacked-expand.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-stacked",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-stacked.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },
  {
    name: "chart-area-step",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-area-step.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-area"],
  },

  // Bar Charts
  {
    name: "chart-bar-active",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-active.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-default",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/chart-bar-default.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-horizontal",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-horizontal.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-interactive",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-interactive.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-label-custom",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-label-custom.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-label",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-label.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-mixed",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-mixed.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-multiple",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-multiple.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-negative",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-negative.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },
  {
    name: "chart-bar-stacked",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-bar-stacked.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-bar"],
  },

  // Line Charts
  {
    name: "chart-line-default",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/chart-line-default.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-dots-colors",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-dots-colors.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-dots-custom",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-dots-custom.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-dots",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-dots.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-interactive",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-interactive.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-label-custom",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-label-custom.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-label",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-label.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-linear",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-linear.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-multiple",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-multiple.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },
  {
    name: "chart-line-step",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-line-step.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-line"],
  },

  // Pie Charts
  {
    name: "chart-pie-donut-active",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-donut-active.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-donut-text",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-donut-text.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-donut",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-donut.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-interactive",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-interactive.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-label-custom",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-label-custom.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-label-list",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-label-list.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-label",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-label.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-legend",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-legend.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-separator-none",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-separator-none.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-simple",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-simple.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },
  {
    name: "chart-pie-stacked",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-pie-stacked.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-pie"],
  },

  // Radar Charts
  {
    name: "chart-radar-default",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-default.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-dots",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-dots.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-grid-circle-fill",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-grid-circle-fill.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-grid-circle-no-lines",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-grid-circle-no-lines.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-grid-circle",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-grid-circle.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-grid-custom",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-grid-custom.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-grid-fill",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-grid-fill.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-grid-none",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-grid-none.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-icons",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-icons.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-label-custom",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-label-custom.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-legend",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-legend.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-lines-only",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-lines-only.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-multiple",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-multiple.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },
  {
    name: "chart-radar-radius",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radar-radius.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radar"],
  },

  // Radial Charts
  {
    name: "chart-radial-grid",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radial-grid.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radial"],
  },
  {
    name: "chart-radial-label",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radial-label.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radial"],
  },
  {
    name: "chart-radial-shape",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radial-shape.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radial"],
  },
  {
    name: "chart-radial-simple",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radial-simple.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radial"],
  },
  {
    name: "chart-radial-stacked",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radial-stacked.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radial"],
  },
  {
    name: "chart-radial-text",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-radial-text.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-radial"],
  },
  {
    name: "chart-tooltip-default",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-default.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-indicator-line",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-indicator-line.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-indicator-none",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-indicator-none.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-label-none",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-label-none.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-label-custom",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-label-custom.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-label-formatter",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-label-formatter.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-formatter",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-formatter.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-icons",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-icons.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
  {
    name: "chart-tooltip-advanced",
    type: "registry:block",
    registryDependencies: ["card", "chart", "chart-locale"],
    files: [
      {
        path: "charts/chart-tooltip-advanced.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts", "charts-tooltip"],
  },
// @generated by sync-gallery-charts-to-registry.mjs — do not edit
  {
    name: "simple-line-chart",
    type: "registry:block",
    description: "نمودار خطی ساده",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/simple-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "dashed-line-chart",
    type: "registry:block",
    description: "نمودار خطی خط‌چین",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/dashed-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "vertical-line-chart",
    type: "registry:block",
    description: "نمودار خطی عمودی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/vertical-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "biaxial-line-chart",
    type: "registry:block",
    description: "نمودار خطی دو‌محوره",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/biaxial-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-chart-connect-nulls",
    type: "registry:block",
    description: "اتصال مقادیر تهی در خطی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/line-chart-connect-nulls.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-chart-with-x-axis-padding",
    type: "registry:block",
    description: "خطی با فاصلهٔ محور X",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/line-chart-with-x-axis-padding.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-chart-with-reference-lines",
    type: "registry:block",
    description: "خطی با خطوط مرجع",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/line-chart-with-reference-lines.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "customized-dot-line-chart",
    type: "registry:block",
    description: "خطی با نقطهٔ سفارشی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/customized-dot-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "customized-label-line-chart",
    type: "registry:block",
    description: "خطی با برچسب سفارشی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/customized-label-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "synchronized-line-chart",
    type: "registry:block",
    description: "نمودارهای خطی همگام",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/synchronized-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "synchronized-different-data",
    type: "registry:block",
    description: "همگام با داده‌های متفاوت",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/synchronized-different-data.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-chart-custom-shape",
    type: "registry:block",
    description: "خط با انیمیشن شفافیت",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/line-chart-custom-shape.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "highlight-and-zoom-line-chart",
    type: "registry:block",
    description: "هایلایت و زوم خطی",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/line/highlight-and-zoom-line-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-chart-has-multi-series",
    type: "registry:block",
    description: "چند سری خطی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/line-chart-has-multi-series.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-chart-axis-interval",
    type: "registry:block",
    description: "فاصلهٔ تیک محور خطی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/line-chart-axis-interval.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-chart-negative-values-with-reference-lines",
    type: "registry:block",
    description: "مقادیر منفی با خطوط مرجع",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale"],
    files: [
      {
        path: "charts/gallery/line/line-chart-negative-values-with-reference-lines.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "compare-two-lines",
    type: "registry:block",
    description: "مقایسهٔ دو خط",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/compare-two-lines.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "dynamic-z-index-line-chart",
    type: "registry:block",
    description: "خطی با z-index پویا",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/dynamic-z-index-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "tiny-line-chart",
    type: "registry:block",
    description: "نمودار خطی فشرده",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/tiny-line-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "animated-time-series",
    type: "registry:block",
    description: "سری زمانی متحرک",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/line/animated-time-series.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-interactive",
    type: "registry:block",
    description: "خطی تعاملی",
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/line/line-interactive.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "line-step",
    type: "registry:block",
    description: "خطی پله‌ای",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/line/line-step.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-line"],
  },
  {
    name: "area-chart",
    type: "registry:block",
    description: "نمودار ناحیه‌ای ساده",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "stacked-area-chart",
    type: "registry:block",
    description: "ناحیه‌ای انباشته",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/stacked-area-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-chart-range",
    type: "registry:block",
    description: "ناحیه‌ای بازه‌ای",
    registryDependencies: ["chart", "chart-fa", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-chart-range.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-chart-connect-nulls",
    type: "registry:block",
    description: "اتصال تهی در ناحیه‌ای",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-chart-connect-nulls.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "cardinal-area-chart",
    type: "registry:block",
    description: "ناحیه‌ای Cardinal",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/cardinal-area-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "percent-area-chart",
    type: "registry:block",
    description: "ناحیه‌ای درصدی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/percent-area-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "synchronized-area-chart",
    type: "registry:block",
    description: "ناحیه‌ای همگام",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/synchronized-area-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "tiny-area-chart",
    type: "registry:block",
    description: "ناحیه‌ای فشرده",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/tiny-area-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-chart-fill-by-value",
    type: "registry:block",
    description: "پر شدن بر اساس مقدار",
    registryDependencies: ["chart", "chart-fa", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-chart-fill-by-value.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-chart-custom-animation",
    type: "registry:block",
    description: "انیمیشن سفارشی",
    registryDependencies: ["chart", "chart-fa", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-chart-custom-animation.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "range-area-chart-custom-animation",
    type: "registry:block",
    description: "انیمیشن ناحیه‌ای بازه‌ای",
    registryDependencies: ["chart", "chart-fa", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/range-area-chart-custom-animation.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-chart-with-custom-events",
    type: "registry:block",
    description: "ناحیه‌ای با رویداد سفارشی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-chart-with-custom-events.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "prevent-right-click",
    type: "registry:block",
    description: "جلوگیری از منوی راست‌کلیک",
    registryDependencies: ["chart", "chart-fa", "chart-live", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/prevent-right-click.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-interactive",
    type: "registry:block",
    description: "ناحیه‌ای تعاملی",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "select", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-interactive.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-step",
    type: "registry:block",
    description: "ناحیه‌ای پله‌ای",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-step.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "area-gradient",
    type: "registry:block",
    description: "ناحیه‌ای با گرادیان",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/area-gradient.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "market-cards",
    type: "registry:block",
    description: "کارت‌های بازار",
    registryDependencies: ["chart-fa", "digits", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/area/market-cards.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/area/market-cards-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-area"],
  },
  {
    name: "simple-bar-chart",
    type: "registry:block",
    description: "نمودار میله‌ای ساده",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick", "utils"],
    files: [
      {
        path: "charts/gallery/bar/simple-bar-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/line/line-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "stacked-bar-chart",
    type: "registry:block",
    description: "میله‌ای انباشته",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/bar/stacked-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "population-pyramid",
    type: "registry:block",
    description: "هرم جمعیتی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/population-pyramid.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "timeline",
    type: "registry:block",
    description: "خط زمانی",
    registryDependencies: ["chart", "chart-fa", "chart-live", "utils"],
    files: [
      {
        path: "charts/gallery/bar/timeline.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "box-plot",
    type: "registry:block",
    description: "نمودار جعبه‌ای",
    registryDependencies: ["chart", "chart-fa", "chart-live", "utils"],
    files: [
      {
        path: "charts/gallery/bar/box-plot.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "animated-bar-width",
    type: "registry:block",
    description: "عرض میله متحرک",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/bar/animated-bar-width.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "waterfall",
    type: "registry:block",
    description: "آبشاری",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/waterfall.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "animated-bar-time-series",
    type: "registry:block",
    description: "سری میله‌ای متحرک",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/animated-bar-time-series.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "mix-bar-chart",
    type: "registry:block",
    description: "میله‌ای ترکیبی",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/bar/mix-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "custom-shape-bar-chart",
    type: "registry:block",
    description: "میله با شکل سفارشی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/custom-shape-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "positive-and-negative-bar-chart",
    type: "registry:block",
    description: "میله مثبت و منفی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/positive-and-negative-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "brush-bar-chart",
    type: "registry:block",
    description: "میله با برس",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/brush-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "bar-chart-with-customized-event",
    type: "registry:block",
    description: "انتخاب میله با کلیک",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "utils"],
    files: [
      {
        path: "charts/gallery/bar/bar-chart-with-customized-event.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "biaxial-bar-chart",
    type: "registry:block",
    description: "میله دو‌محوره",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/bar/biaxial-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "bar-chart-has-background",
    type: "registry:block",
    description: "میله با پس‌زمینه",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/bar/bar-chart-has-background.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "bar-chart-with-label-background",
    type: "registry:block",
    description: "میله با پس‌زمینهٔ برچسب",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/bar-chart-with-label-background.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "ranged-stacked-bar-chart",
    type: "registry:block",
    description: "مراحل سفارش به‌صورت بازه",
    registryDependencies: ["chart", "chart-fa", "utils"],
    files: [
      {
        path: "charts/gallery/bar/ranged-stacked-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "bar-chart-range",
    type: "registry:block",
    description: "میله بازه‌ای",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/bar/bar-chart-range.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "tiny-bar-chart",
    type: "registry:block",
    description: "میله فشرده",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/bar/tiny-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "stacked-bar-chart-with-horizontal-line",
    type: "registry:block",
    description: "فروش در برابر هدف",
    registryDependencies: ["chart", "chart-fa", "chart-live", "utils"],
    files: [
      {
        path: "charts/gallery/bar/stacked-bar-chart-with-horizontal-line.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "bar-interactive",
    type: "registry:block",
    description: "میله‌ای تعاملی",
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/bar/bar-interactive.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "bar-horizontal",
    type: "registry:block",
    description: "میله‌ای افقی",
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/bar/bar-horizontal.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "bar-active",
    type: "registry:block",
    description: "میله فعال",
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/bar/bar-active.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-bar"],
  },
  {
    name: "asset-returns",
    type: "registry:block",
    description: "مقایسه بازدهی دارایی‌ها",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "utils"],
    files: [
      {
        path: "charts/gallery/stock/asset-returns.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "monthly-savings",
    type: "registry:block",
    description: "پس‌انداز ماه‌به‌ماه",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "utils"],
    files: [
      {
        path: "charts/gallery/stock/monthly-savings.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "line-bar-area-composed-chart",
    type: "registry:block",
    description: "فروش کانال‌ها (ترکیبی)",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/composed/line-bar-area-composed-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-composed"],
  },
  {
    name: "same-data-composed-chart",
    type: "registry:block",
    description: "فروش با خط روند",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/composed/same-data-composed-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-composed"],
  },
  {
    name: "vertical-composed-chart",
    type: "registry:block",
    description: "مقایسهٔ استان‌ها",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/composed/vertical-composed-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-composed"],
  },
  {
    name: "composed-chart-with-axis-labels",
    type: "registry:block",
    description: "درآمد و حاشیه با برچسب محور",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/composed/composed-chart-with-axis-labels.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-composed"],
  },
  {
    name: "scatter-and-line-of-best-fit",
    type: "registry:block",
    description: "تبلیغات و فروش",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/composed/scatter-and-line-of-best-fit.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-composed"],
  },
  {
    name: "banded-chart",
    type: "registry:block",
    description: "فروش با بازهٔ اطمینان",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/composed/banded-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-composed"],
  },
  {
    name: "target-price-chart",
    type: "registry:block",
    description: "قیمت و هدف تحلیلگران",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/composed/target-price-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-composed"],
  },
  {
    name: "simple-scatter-chart",
    type: "registry:block",
    description: "پراکندگی ساده",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/scatter/simple-scatter-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/scatter/scatter-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "joint-line-scatter-chart",
    type: "registry:block",
    description: "پراکندگی با خط اتصال",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/scatter/joint-line-scatter-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/scatter/scatter-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "bubble-chart",
    type: "registry:block",
    description: "نمودار حبابی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/scatter/bubble-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "custom-animation",
    type: "registry:block",
    description: "انیمیشن سفارشی پراکندگی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/scatter/custom-animation.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/scatter/scatter-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "scatter-chart-with-labels",
    type: "registry:block",
    description: "پراکندگی با برچسب",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/scatter/scatter-chart-with-labels.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/scatter/scatter-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "multiple-y-axes-scatter-chart",
    type: "registry:block",
    description: "پراکندگی با چند محور Y",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/scatter/multiple-y-axes-scatter-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/scatter/scatter-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "scatter-chart-with-cells",
    type: "registry:block",
    description: "پراکندگی با Cell",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/scatter/scatter-chart-with-cells.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/scatter/scatter-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "scatter-chart-performance",
    type: "registry:block",
    description: "پراکندگی پرتراکم (عملکرد)",
    registryDependencies: ["chart", "chart-fa", "chart-mock-data"],
    files: [
      {
        path: "charts/gallery/scatter/scatter-chart-performance.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/scatter/scatter-fa-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-scatter"],
  },
  {
    name: "two-level-pie-chart",
    type: "registry:block",
    description: "دایره‌ای دو سطحی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/pie/two-level-pie-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "straight-angle-pie-chart",
    type: "registry:block",
    description: "دایره‌ای نیم‌دایره",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/pie/straight-angle-pie-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "custom-active-shape-pie-chart",
    type: "registry:block",
    description: "دایره‌ای با شکل فعال سفارشی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/pie/custom-active-shape-pie-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "pie-chart-with-customized-label",
    type: "registry:block",
    description: "دایره‌ای با برچسب سفارشی",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/pie/pie-chart-with-customized-label.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "pie-chart-with-padding-angle",
    type: "registry:block",
    description: "دایره‌ای با فاصله و گوشه گرد",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/pie/pie-chart-with-padding-angle.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "pie-chart-in-grid",
    type: "registry:block",
    description: "دایره‌ای در Grid",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/pie/pie-chart-in-grid.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "pie-with-gradient",
    type: "registry:block",
    description: "سهم کانال با گرادیان",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/pie/pie-with-gradient.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "pie-donut-text",
    type: "registry:block",
    description: "دونات با متن مرکزی",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/pie/pie-donut-text.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "pie-interactive",
    type: "registry:block",
    description: "دایره‌ای تعاملی",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "select"],
    files: [
      {
        path: "charts/gallery/pie/pie-interactive.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "pie-stacked",
    type: "registry:block",
    description: "دایره‌ای انباشته",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/pie/pie-stacked.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-pie"],
  },
  {
    name: "simple-radar-chart",
    type: "registry:block",
    description: "راداری ساده",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/radar/simple-radar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radar"],
  },
  {
    name: "specified-domain-radar-chart",
    type: "registry:block",
    description: "راداری با دامنهٔ مشخص",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/radar/specified-domain-radar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radar"],
  },
  {
    name: "range-radar-chart-custom-animation",
    type: "registry:block",
    description: "راداری بازه‌ای با انیمیشن",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/radar/range-radar-chart-custom-animation.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radar"],
  },
  {
    name: "radar-lines-only",
    type: "registry:block",
    description: "راداری فقط خط",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/radar/radar-lines-only.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radar"],
  },
  {
    name: "radar-icons",
    type: "registry:block",
    description: "راداری با آیکون",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/radar/radar-icons.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radar"],
  },
  {
    name: "radar-multiple",
    type: "registry:block",
    description: "راداری چندسری",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/radar/radar-multiple.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radar"],
  },
  {
    name: "simple-radial-bar-chart",
    type: "registry:block",
    description: "میله شعاعی ساده",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/radial-bar/simple-radial-bar-chart.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radial-bar"],
  },
  {
    name: "radial-bar-chart-click-to-focus-legend",
    type: "registry:block",
    description: "میله شعاعی با فوکوس راهنما",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/radial-bar/radial-bar-chart-click-to-focus-legend.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radial-bar"],
  },
  {
    name: "radial-text",
    type: "registry:block",
    description: "میله شعاعی با متن",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/radial-bar/radial-text.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radial-bar"],
  },
  {
    name: "radial-shape",
    type: "registry:block",
    description: "میله شعاعی با شکل",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/radial-bar/radial-shape.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radial-bar"],
  },
  {
    name: "radial-stacked",
    type: "registry:block",
    description: "میله شعاعی انباشته",
    dependencies: ["lucide-react"],
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/radial-bar/radial-stacked.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-radial-bar"],
  },
  {
    name: "bundle-size-treemap",
    type: "registry:block",
    description: "درخت‌نقشهٔ حجم باندل",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/treemap/bundle-size-treemap.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/treemap/data.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-colors.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-content.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-treemap"],
  },
  {
    name: "simple-treemap",
    type: "registry:block",
    description: "درخت‌نقشهٔ ساده",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/treemap/simple-treemap.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/treemap/data.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-colors.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-content.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-treemap"],
  },
  {
    name: "custom-content-treemap",
    type: "registry:block",
    description: "درخت‌نقشه با محتوای سفارشی",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/treemap/custom-content-treemap.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/treemap/data.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-colors.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-content.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-treemap"],
  },
  {
    name: "nested-treemap",
    type: "registry:block",
    description: "درخت‌نقشهٔ تودرتو",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/treemap/nested-treemap.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/treemap/data.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-colors.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-content.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-treemap"],
  },
  {
    name: "treemap-with-padding-and-gaps",
    type: "registry:block",
    description: "درخت‌نقشه با فاصله",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/treemap/treemap-with-padding-and-gaps.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/treemap/data.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-colors.ts",
        type: "registry:component",
      },
      {
        path: "charts/gallery/treemap/treemap-content.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-treemap"],
  },
  {
    name: "bundle-size-sunburst",
    type: "registry:block",
    description: "خورشیدسان حجم باندل",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/sunburst/bundle-size-sunburst.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/sunburst/sunburst-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-sunburst"],
  },
  {
    name: "sunburst-chart",
    type: "registry:block",
    description: "نمونهٔ خورشیدسان",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/sunburst/sunburst-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/sunburst/sunburst-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-sunburst"],
  },
  {
    name: "sunburst-chart-theme-colors",
    type: "registry:block",
    description: "خورشیدسان با رنگ تم",
    registryDependencies: ["chart", "chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/sunburst/sunburst-chart-theme-colors.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/sunburst/sunburst-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-sunburst"],
  },
  {
    name: "custom-content-of-tooltip",
    type: "registry:block",
    description: "محتوای سفارشی تولتیپ",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/tooltip/custom-content-of-tooltip.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-tooltip"],
  },
  {
    name: "tooltip-styles",
    type: "registry:block",
    description: "سبک تولتیپ",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/tooltip/tooltip-styles.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-tooltip"],
  },
  {
    name: "tooltip-advanced",
    type: "registry:block",
    description: "تولتیپ پیشرفته",
    registryDependencies: ["chart", "chart-fa", "chart-locale"],
    files: [
      {
        path: "charts/gallery/tooltip/tooltip-advanced.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-tooltip"],
  },
  {
    name: "legend-effect-opacity",
    type: "registry:block",
    description: "راهنما با شفافیت",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/legend/legend-effect-opacity.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-legend"],
  },
  {
    name: "legend-position",
    type: "registry:block",
    description: "موقعیت راهنما",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/legend/legend-position.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-legend"],
  },
  {
    name: "legend-styles",
    type: "registry:block",
    description: "سبک سفارشی راهنما",
    registryDependencies: ["chart", "chart-fa", "chart-live", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/legend/legend-styles.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-legend"],
  },
  {
    name: "area-responsive-container",
    type: "registry:block",
    description: "ناحیه‌ای واکنش‌گرا",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/responsive/area-responsive-container.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-responsive"],
  },
  {
    name: "composed-responsive-container",
    type: "registry:block",
    description: "ترکیبی واکنش‌گرا",
    registryDependencies: ["chart", "chart-fa", "chart-locale", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/responsive/composed-responsive-container.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-responsive"],
  },
  {
    name: "pie-responsive-container",
    type: "registry:block",
    description: "دایره‌ای واکنش‌گرا",
    registryDependencies: ["chart", "chart-fa"],
    files: [
      {
        path: "charts/gallery/responsive/pie-responsive-container.tsx",
        type: "registry:block",
      },
    ],
    categories: ["charts","charts-responsive"],
  },
  {
    name: "candlestick",
    type: "registry:block",
    description: "نمودار کندل‌استیک",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/candlestick.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "candlestick-dashboard",
    type: "registry:block",
    description: "داشبورد کندل",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/candlestick-dashboard.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "candlestick-bar",
    type: "registry:block",
    description: "کندل‌استیک و میله‌ای",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data"],
    files: [
      {
        path: "charts/gallery/stock/candlestick-bar.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "candlestick-category",
    type: "registry:block",
    description: "کندل‌استیک با محور دسته‌ای",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data"],
    files: [
      {
        path: "charts/gallery/stock/candlestick-category.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "candlestick-line",
    type: "registry:block",
    description: "کندل‌استیک و خطی",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/candlestick-line.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "sparklines",
    type: "registry:block",
    description: "اسپارک‌لاین قیمت",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/sparklines.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "stock-ohlc",
    type: "registry:block",
    description: "نمودار میله‌ای OHLC",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-locale", "chart-mock-data"],
    files: [
      {
        path: "charts/gallery/stock/stock-ohlc.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "stock-line",
    type: "registry:block",
    description: "نمودار خط قیمت",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/stock-line.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "stock-column",
    type: "registry:block",
    description: "نمودار ستونی قیمت",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-locale", "chart-mock-data"],
    files: [
      {
        path: "charts/gallery/stock/stock-column.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "stock-with-volume",
    type: "registry:block",
    description: "نمودار قیمت و حجم معاملات",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data"],
    files: [
      {
        path: "charts/gallery/stock/stock-with-volume.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "stock-multi-series",
    type: "registry:block",
    description: "مقایسه چند نماد",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/stock-multi-series.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "stock-trendline",
    type: "registry:block",
    description: "نمودار خط روند",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/stock-trendline.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "tremor-area-charts",
    type: "registry:block",
    description: "نمودار ناحیه‌ای",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/tremor-area-charts.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "realtime-mountain-chart",
    type: "registry:block",
    description: "نمودار ناحیه‌ای زنده",
    registryDependencies: ["button", "chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/realtime-mountain-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "realtime-candlestick",
    type: "registry:block",
    description: "کندل زنده",
    registryDependencies: ["button", "chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/realtime-candlestick.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "heikin-ashi",
    type: "registry:block",
    description: "هیکن‌آشی",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/heikin-ashi.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "renko-chart",
    type: "registry:block",
    description: "نمودار رنکو",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/renko-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "volume-profile",
    type: "registry:block",
    description: "پروفایل حجم",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data"],
    files: [
      {
        path: "charts/gallery/stock/volume-profile.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "order-book-depth",
    type: "registry:block",
    description: "عمق بازار",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/order-book-depth.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "drawdown-chart",
    type: "registry:block",
    description: "نمودار افت سرمایه",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/drawdown-chart.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "bollinger-bands",
    type: "registry:block",
    description: "باندهای بولینگر",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick", "use-market-neon", "utils"],
    files: [
      {
        path: "charts/gallery/stock/bollinger-bands.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "candlestick-indicators",
    type: "registry:block",
    description: "کندل‌استیک با اندیکاتور",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/candlestick-indicators.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "multi-timeframe",
    type: "registry:block",
    description: "چند بازهٔ زمانی",
    registryDependencies: ["chart", "chart-fa", "chart-jalali-tick", "chart-live", "chart-locale", "chart-mock-data", "chart-toman-tick"],
    files: [
      {
        path: "charts/gallery/stock/multi-timeframe.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/stock/stock-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-stock"],
  },
  {
    name: "gauge-default",
    type: "registry:block",
    description: "گیج پیش‌فرض",
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/gauge-default.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "gauge-levels",
    type: "registry:block",
    description: "گیج چندسطحی",
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/gauge-levels.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "gauge-custom-colors",
    type: "registry:block",
    description: "گیج رنگی",
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/gauge-custom-colors.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "gauge-corner-radius",
    type: "registry:block",
    description: "گیج گوشه‌گرد",
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/gauge-corner-radius.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "gauge-custom-arcs",
    type: "registry:block",
    description: "گیج با کمان سفارشی",
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/gauge-custom-arcs.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "gauge-no-animation",
    type: "registry:block",
    description: "گیج بدون انیمیشن",
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/gauge-no-animation.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-default",
    type: "registry:block",
    description: "گیج پیش‌فرض HC",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-default.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-rounded-ends",
    type: "registry:block",
    description: "گیج انتهای گرد",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-rounded-ends.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-thin-ring",
    type: "registry:block",
    description: "گیج حلقهٔ نازک",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-thin-ring.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-semicircle",
    type: "registry:block",
    description: "گیج نیم‌دایره",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-semicircle.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-custom-pivot",
    type: "registry:block",
    description: "گیج محور سفارشی",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-custom-pivot.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-combo",
    type: "registry:block",
    description: "گیج ترکیبی",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-combo.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-fuel",
    type: "registry:block",
    description: "گیج سطح سوخت",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-fuel.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-activity",
    type: "registry:block",
    description: "گیج فعالیت",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-activity.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-kpi",
    type: "registry:block",
    description: "گیج چندحلقهٔ KPI",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-kpi.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-rounded-bands",
    type: "registry:block",
    description: "گیج نوار گرد",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-rounded-bands.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-threshold",
    type: "registry:block",
    description: "گیج آستانه",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-threshold.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "hc-gauge-custom-dial",
    type: "registry:block",
    description: "گیج عقربهٔ نقطه‌ای",
    dependencies: ["highcharts","highcharts-react-official"],
    registryDependencies: ["chart-fa", "chart-live"],
    files: [
      {
        path: "charts/gallery/gauge/hc-gauge-custom-dial.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/gauge/hc-gauge-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-gauge"],
  },
  {
    name: "heatmap-calendar",
    type: "registry:block",
    description: "تقویم حرارتی",
    registryDependencies: ["chart-fa", "chart-live", "utils"],
    files: [
      {
        path: "charts/gallery/heatmap/heatmap-calendar.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/heatmap/heatmap-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-heatmap"],
  },
  {
    name: "heatmap-calendar-emerald",
    type: "registry:block",
    description: "تقویم زمردی",
    registryDependencies: ["chart-fa", "chart-live", "utils"],
    files: [
      {
        path: "charts/gallery/heatmap/heatmap-calendar-emerald.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/heatmap/heatmap-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-heatmap"],
  },
  {
    name: "heatmap-matrix",
    type: "registry:block",
    description: "ماتریس روز و ساعت",
    registryDependencies: ["chart-fa", "chart-live", "utils"],
    files: [
      {
        path: "charts/gallery/heatmap/heatmap-matrix.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/heatmap/heatmap-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-heatmap"],
  },
  {
    name: "heatmap-matrix-values",
    type: "registry:block",
    description: "ماتریس با مقدار",
    registryDependencies: ["chart-fa", "chart-live", "utils"],
    files: [
      {
        path: "charts/gallery/heatmap/heatmap-matrix-values.tsx",
        type: "registry:block",
      },
      {
        path: "charts/gallery/heatmap/heatmap-shared.tsx",
        type: "registry:component",
      },
    ],
    categories: ["charts","charts-heatmap"],
  },
// @generated end
]
