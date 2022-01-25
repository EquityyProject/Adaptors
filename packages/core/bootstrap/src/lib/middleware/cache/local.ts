import LRU from 'lru-cache'
import { LRUInterface } from './types'
import { parseBool } from '../../../util'
import { ICache, CacheEntry } from '../types'

// Options
const DEFAULT_CACHE_MAX_ITEMS = 1000
const DEFAULT_CACHE_MAX_AGE = 1000 * 60 * 1.5 // 1.5 minutes
const DEFAULT_CACHE_UPDATE_AGE_ON_GET = false

const env = process.env
export interface LocalOptions {
  type: 'local'
  max: number
  maxAge: number
  updateAgeOnGet: boolean
}
export const defaultOptions = (): LocalOptions =>
  ({
    type: 'local',
    max: Number(env.CACHE_MAX_ITEMS) || DEFAULT_CACHE_MAX_ITEMS,
    maxAge: Number(env.CACHE_MAX_AGE) || DEFAULT_CACHE_MAX_AGE,
    updateAgeOnGet: parseBool(env.CACHE_UPDATE_AGE_ON_GET) || DEFAULT_CACHE_UPDATE_AGE_ON_GET,
  } as const)
// Options without sensitive data
export const redactOptions = (opts: CacheOptions): CacheOptions => opts

type CacheOptions = Omit<
  LRU.Options<string, CacheEntry | boolean>,
  'max' | 'maxAge' | 'updateAgeOnGet'
> &
  ReturnType<typeof defaultOptions>

export class LocalLRUCache implements ICache {
  options: CacheOptions
  client: LRUInterface<string, CacheEntry | boolean>
  static cacheInstance: LocalLRUCache

  static getInstance(options: CacheOptions): LocalLRUCache {
    if (!LocalLRUCache.cacheInstance) {
      this.cacheInstance = new LocalLRUCache(options)
    }
    return this.cacheInstance
  }

  constructor(options: CacheOptions) {
    this.options = options
    this.client = new LRU(options) as LRUInterface<string, CacheEntry | boolean>
  }

  setResponse(key: string, value: boolean | CacheEntry, maxAge: number): boolean {
    return this.client.set(key, value, maxAge)
  }

  setFlightMarker(key: string, maxAge: number): boolean {
    return this.client.set(key, true, maxAge)
  }

  async getResponse(key: string): Promise<CacheEntry | undefined> {
    return this.client.get(key) as CacheEntry | undefined
  }

  async getFlightMarker(key: string): Promise<boolean> {
    return this.client.get(key) as boolean
  }

  del(key: string): void {
    return this.client.del(key)
  }

  ttl(key: string): number {
    // Get LRU internal 'cache' symbol
    const _isCacheSymbol = (sym: symbol) => sym.toString().includes('cache')
    const cacheSymbol = Object.getOwnPropertySymbols(this.client).find(_isCacheSymbol)
    if (!cacheSymbol) return 0

    // Get raw LRU entry
    const cacheMap = this.client[cacheSymbol.toString() as 'cache']
    const hit = cacheMap.get(key)
    if (!hit) return 0

    // Return ttl >= 0
    const ttl = hit.value?.now + (hit.value?.maxAge || 0) - Date.now()
    return ttl < 0 ? 0 : ttl
  }

  close(): void {
    // noop
  }
}
