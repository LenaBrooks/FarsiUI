import {
  CalendarListIndex,
  CalendarSidebar,
} from "@/components/calendar-sidebar"
import { SidebarProvider } from "@/registry/new-york-v4/ui/sidebar"

import "@/app/(app)/(typeset)/typeset.css"

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col bg-background" dir="rtl" lang="fa" id="calendar">
      <CalendarListIndex />
      <div className="container-wrapper flex flex-1 flex-col px-2">
        <SidebarProvider
          className="min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)] 3xl:fixed:container 3xl:fixed:px-3"
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
            } as React.CSSProperties
          }
        >
          <CalendarSidebar />
          <div className="h-full w-full min-w-0 section-soft ps-1 pe-2 pt-2 md:ps-2 md:pe-4 md:py-6">
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
