/**
 * Local stand-in for `@recharts/devtools` mock helpers.
 * RNG matches https://github.com/recharts/devtools/blob/main/src/random.ts (LCG)
 * so chart demos produce the same values as Recharts examples for the same seed.
 */

export type MockDataType = {
  label: string
  x: number
  y: number
  z: number
}

export type MarketCandle = {
  time: number
  open: number
  close: number
  low: number
  high: number
  /** حجم معاملات — برای پنل Volume در نمودارهای سهام */
  volume: number
}

/**
 * Returns a random number generator.
 *
 * IMPORTANT: this number generator is based on LCG and
 * IS NOT SAFE for anything security related!
 *
 * From wikipedia: https://en.wikipedia.org/wiki/Linear_congruential_generator
 */
export function* random(seed: number): Generator<number, number, unknown> {
  const m = 2 ** 16 + 1
  const a = 75
  const c = 74
  let x = seed
  if (x > 0 && x < 1) {
    x = Math.round(x * 1000)
  }
  while (x < 0) {
    x += m
  }
  while (true) {
    x = (a * x + c) % m
    yield Math.round(x)
  }
}

export function between(
  rng: Generator<number, number, unknown>,
  min: number,
  max: number
): number {
  const val = rng.next().value
  return (val % (max - min)) + min
}

export function generateMockData(length: number, seed: number): MockDataType[] {
  const result: MockDataType[] = []
  const gen = random(seed)
  for (let i = 0; i < length; i++) {
    result.push({
      label: `Iter: ${i}`,
      x: between(gen, 100, 300),
      y: between(gen, 400, 800),
      z: between(gen, 1000, 2000),
    })
  }
  return result
}

export function generateMockMarketData(
  length: number,
  seed: number,
  startPrice = 100,
  startTime = Date.now()
): MarketCandle[] {
  const gen = random(seed)
  const candles: MarketCandle[] = []
  const interval = 15 * 60 * 1000
  let lastClose = startPrice

  for (let i = 0; i < length; i++) {
    const time = startTime + i * interval
    const open = lastClose
    const move = between(gen, -200, 200) / 100
    const close = Math.max(0.01, +(open + move))
    const baseHigh = Math.max(open, close)
    const baseLow = Math.min(open, close)
    const extraHigh = between(gen, 0, 100) / 100
    const extraLow = between(gen, 0, 100) / 100
    const high = +(baseHigh + extraHigh)
    const low = Math.max(0.01, +(baseLow - extraLow))
    const volume = between(gen, 800, 12000)
    candles.push({ time, open, close, low, high, volume })
    lastClose = close
  }

  return candles
}

/** چند سری قیمت پایانی برای مقایسهٔ نمادها (مثل چند شرکت). */
export function generateMockStockSeries(
  length: number,
  seed: number,
  startPrices: Record<string, number>,
  startTime = Date.now()
) {
  const gen = random(seed)
  const interval = 24 * 60 * 60 * 1000
  const keys = Object.keys(startPrices)
  const last: Record<string, number> = { ...startPrices }
  const rows: Array<Record<string, number>> = []

  for (let i = 0; i < length; i++) {
    const row: Record<string, number> = { time: startTime + i * interval }
    for (const key of keys) {
      const move = between(gen, -300, 300) / 100
      const next = Math.max(0.01, +(last[key]! + move))
      row[key] = next
      last[key] = next
    }
    rows.push(row)
  }

  return rows
}
