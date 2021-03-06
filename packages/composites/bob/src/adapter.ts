import { ExecuteFactory, ExecuteWithConfig } from '@chainlink/types'
import { Validator, AdapterError } from '@chainlink/ea-bootstrap'
import { DEFAULT_ENDPOINT, makeConfig, ExtendedConfig } from './config'
import { format } from './endpoint'

const inputParams = {
  endpoint: false,
}

// Export function to integrate with Chainlink node
export const execute: ExecuteWithConfig<ExtendedConfig> = async (request, context, config) => {
  const validator = new Validator(request, inputParams)

  const jobRunID = validator.validated.id
  const endpoint = validator.validated.data.endpoint || DEFAULT_ENDPOINT
  switch (endpoint.toLowerCase()) {
    case format.NAME: {
      return format.execute(request, context, config)
    }
    default: {
      throw new AdapterError({
        jobRunID,
        message: `Endpoint ${endpoint} not supported.`,
        statusCode: 400,
      })
    }
  }
}

export const makeExecute: ExecuteFactory<ExtendedConfig> = (config) => {
  return async (request, context) => execute(request, context, config || makeConfig())
}
