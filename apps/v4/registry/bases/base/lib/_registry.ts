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
    name: "iran",
    type: "registry:lib",
    registryDependencies: ["digits"],
    files: [
      {
        path: "lib/iran.ts",
        type: "registry:lib",
      },
    ],
  },
]
