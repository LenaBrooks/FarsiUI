import { source } from "@/lib/source"
import { ComponentDependencies } from "@/components/component-dependencies"
import { ComponentPreview } from "@/components/component-preview"
import { ComponentSourceLazy as ComponentSource } from "@/components/component-source-lazy"
import { ComponentVariantPreview } from "@/components/component-variant-preview"
import { DocsApiProps } from "@/components/docs-api-props"
import { ComponentsList } from "@/components/components-list"
import { mdxProseComponents } from "@/mdx-components-prose"

function getComponentsFolder() {
  const componentsFolder = source.pageTree.children.find(
    (page) => page.$id === "components"
  )

  if (componentsFolder?.type !== "folder") {
    return null
  }

  return componentsFolder
}

// This is only used on /docs/components/ index page, so default to base.
function ComponentsListWrapper() {
  const componentsFolder = getComponentsFolder()

  if (!componentsFolder) {
    return null
  }

  return (
    <ComponentsList componentsFolder={componentsFolder} currentBase="base" />
  )
}

/** Full MDX map for component/demo docs that need registry previews. */
export const mdxComponents = {
  ...mdxProseComponents,
  ComponentDependencies,
  ComponentPreview,
  ComponentSource,
  ComponentVariantPreview,
  DocsApiProps,
  ComponentsList: ComponentsListWrapper,
}
