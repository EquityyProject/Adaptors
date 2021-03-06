import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteFactory, ExecuteWithConfig } from '@chainlink/types'
import { DEFAULT_BASE_URL, ExtendedConfig, makeConfig } from './config'

const inputParams = {
  url: false,
  method: false,
  params: false,
  requestId: false,
}

// Export function to integrate with Chainlink node
export const execute: ExecuteWithConfig<ExtendedConfig> = async (request, _, config) => {
  const validator = new Validator(request, inputParams)

  const jobRunID = validator.validated.id
  const url = config.RPC_URL || validator.validated.data.url || DEFAULT_BASE_URL
  const method = validator.validated.data.method || ''
  const params = validator.validated.data.params
  const requestId = validator.validated.data.requestId || jobRunID

  const data = {
    id: requestId,
    jsonrpc: '2.0',
    method,
    params,
  }

  const options = {
    ...config.api,
    url,
    method: 'POST',
    headers: {
      ...config.api.headers,
      'Content-Type': 'application/json',
    },
    // Remove undefined values
    data: JSON.parse(JSON.stringify(data)),
  }

  const response = await Requester.request(options)
  if (response.status >= 400) throw response.data.error

  return Requester.success(request.id, response)
}

export const makeExecute: ExecuteFactory<Config> = (config) => {
  return async (request, context) => execute(request, context, config || makeConfig())
}
