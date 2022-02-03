import { HTTP } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const NAME = 'OILPRICEAPI'
export const DEFAULT_ENDPOINT = 'price'

export const DEFAULT_BASE_URL = 'https://api.oilpriceapi.com/v1/'

export const makeConfig = (prefix?: string): Config => {
  const config = HTTP.getDefaultConfig(prefix, true)
  config.api.baseURL = config.api.baseURL || DEFAULT_BASE_URL
  config.defaultEndpoint = DEFAULT_ENDPOINT
  return config
}
