import { HTTP } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const NAME = 'BRAVENEWCOIN'

export const DEFAULT_ENDPOINT = 'crypto'

export const makeConfig = (prefix = ''): Config => {
  const config = HTTP.getDefaultConfig(prefix, true)
  config.defaultEndpoint = DEFAULT_ENDPOINT
  return config
}
