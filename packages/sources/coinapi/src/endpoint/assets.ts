import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, Config } from '@chainlink/types'
import { NAME as AdapterName } from '../config'

export const NAME = 'assets'

export type AssetsResponse = {
  asset_id: string
  name: string
  type_is_crypto: number
  data_start: string
  data_end: string
  data_quote_start: string
  data_quote_end: string
  data_orderbook_start: string
  data_orderbook_end: string
  data_trade_start: string
  data_trade_end: string
  data_symbols_count: number
  volume_1hrs_usd: number
  volume_1day_usd: number
  volume_1mth_usd: number
  price_usd: number
  id_icon: string
}[]

const customError = (data: AssetsResponse) => data.length === 0

const customParams = {
  base: ['base', 'from', 'coin'],
  path: false,
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const path = validator.validated.data.path || 'price_usd'
  const symbol = validator.overrideSymbol(AdapterName)
  const url = `assets`
  const params = {
    filter_asset_id: (Array.isArray(symbol) ? symbol : [symbol]).join(','),
  }

  const options = {
    ...config.api,
    url,
    params: { ...config.api.params, ...params },
  }

  const response = await Requester.request<AssetsResponse>(options, customError)

  if (Array.isArray(symbol)) {
    const payload: Record<string, number> = {}
    for (const asset of response.data) {
      payload[asset.asset_id] = Requester.validateResultNumber(asset, [path])
    }
    return Requester.success(jobRunID, Requester.withResult(response, undefined, payload), true)
  }

  const result = Requester.validateResultNumber(response.data[0], [path])
  return Requester.success(jobRunID, Requester.withResult(response, result), config.verbose)
}