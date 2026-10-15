"use client"
import { Check, Copy, Terminal } from "lucide-react"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"

export function CodeBlockCommand({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
}: React.ComponentProps<"pre"> & {
  __npm__?: string
  __yarn__?: string
  __pnpm__?: string
  __bun__?: string
}) {
  const [config, setConfig] = useConfig()
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  const packageManager = config.packageManager || "npm"
  const tabs = React.useMemo(() => {
    return {
      npm: __npm__,
      pnpm: __pnpm__,
      yarn: __yarn__,
      bun: __bun__,
    }
  }, [__npm__, __pnpm__, __yarn__, __bun__])

  const copyCommand = React.useCallback(() => {
    const command = tabs[packageManager]

    if (!command) {
      return
    }

    copyToClipboardWithMeta(command, {
      name: "copy_npm_command",
      properties: {
        command,
        pm: packageManager,
      },
    })
    setHasCopied(true)
  }, [packageManager, tabs])

  return (
    <div dir="ltr" className="overflow-x-auto">
      <Tabs
        value={packageManager}
        className="gap-0"
        dir="ltr"
        onValueChange={(value) => {
          setConfig({
            ...config,
            packageManager: value as "pnpm" | "npm" | "yarn" | "bun",
          })
        }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1">
          <div className="flex size-4 items-center justify-center rounded-[1px] bg-code-foreground/80">
            <Terminal className="size-3 text-code" />
          </div>
          <TabsList className="rounded-none bg-transparent p-0">
            {Object.entries(tabs).map(([key]) => {
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="h-7 border border-transparent pt-0.5 text-code-foreground/55 shadow-none! hover:bg-white/10 hover:text-code-foreground dark:hover:text-code-foreground data-[state=active]:border-white/20 data-[state=active]:bg-white/10! data-[state=active]:text-code-foreground dark:data-[state=active]:bg-white/10! dark:data-[state=active]:text-code-foreground after:opacity-0!"
                >
                  {key}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
        <div className="no-scrollbar overflow-x-auto">
          {Object.entries(tabs).map(([key, value]) => {
            return (
              <TabsContent key={key} value={key} className="mt-0 px-4 py-3.5">
                <pre>
                  <code
                    className="relative font-mono text-sm leading-none"
                    data-language="bash"
                  >
                    {value}
                  </code>
                </pre>
              </TabsContent>
            )
          })}
        </div>
      </Tabs>
      <Button
        data-slot="copy-button"
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 z-10 size-7 cursor-pointer text-code-foreground opacity-70 hover:bg-white/10 hover:opacity-100 focus-visible:opacity-100"
        onClick={copyCommand}
      >
        <span className="sr-only">Copy</span>
        {hasCopied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}
