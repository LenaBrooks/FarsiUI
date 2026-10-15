import { type Registry } from "farsiui/schema"

export const lib: Registry["items"] = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["cn"],
    files: [
      {
        path: "lib/utils.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "digits",
    type: "registry:lib",
    files: [
      {
        path: "lib/digits.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "chart-locale",
    type: "registry:lib",
    registryDependencies: ["digits"],
    files: [
      {
        path: "lib/chart-locale.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "chart-mock-data",
    type: "registry:lib",
    files: [
      {
        path: "lib/chart-mock-data.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "chart-fa",
    type: "registry:lib",
    registryDependencies: ["chart-locale", "chart-mock-data", "chart"],
    files: [
      {
        path: "lib/chart-fa.ts",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "chart-toman-tick",
    type: "registry:lib",
    registryDependencies: ["chart-locale"],
    dependencies: ["recharts@3.8.0"],
    files: [
      {
        path: "lib/chart-toman-tick.tsx",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "chart-jalali-tick",
    type: "registry:lib",
    registryDependencies: ["chart-locale"],
    files: [
      {
        path: "lib/chart-jalali-tick.tsx",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "chart-live",
    type: "registry:lib",
    registryDependencies: ["chart-fa"],
    files: [
      {
        path: "lib/chart-live.tsx",
        type: "registry:lib",
      },
    ],
  },
  {
    name: "use-market-neon",
    type: "registry:lib",
    files: [
      {
        path: "lib/use-market-neon.ts",
        type: "registry:lib",
      },
    ],
  },
]
