"use client"

import { CardsDemo, CardsDemoMobile } from "./cards"

/**
 * Both collages in the tree; CSS picks the viewport.
 * No skeleton gate and no media-query swap after hydrate.
 */
export function CardsCollage() {
  return (
    <>
      <section className="relative -mx-4 overflow-x-clip md:hidden">
        <CardsDemoMobile />
      </section>
      <section className="relative hidden overflow-x-clip md:block">
        <CardsDemo />
      </section>
    </>
  )
}
