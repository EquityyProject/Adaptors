import { HTTP, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, Config, InputParameters } from '@chainlink/types'
import { COINS } from '../config'

export const supportedEndpoints = ['stats', 'height', 'difficulty']

export const endpointResultPaths = {
  stats: 'stats',
  height: 'blocks',
  difficulty: 'difficulty',
}

export const inputParameters: InputParameters = {
  blockchain: {
    aliases: ['coin'],
    description: '',
    type: 'string',
    required: true,
  },
  endpoint: {
    description: 'The parameter to query for',
    type: 'string',
    default: 'difficulty',
    required: false,
  },
}

export const execute: ExecuteWithConfig<Config> = async (input, _, config) => {
  const validator = new Validator(input, inputParameters)

  const jobRunID = validator.validated.id
  const resultPath = validator.validated.data.resultPath

  const blockchain = HTTP.toVendorName(validator.validated.data.blockchain.toLowerCase(), COINS)
  const url = `/${blockchain}/stats`

  const reqConfig = { ...config.api, url }

  const response = await HTTP.request(reqConfig)
  response.data.result = HTTP.validateResultNumber(response.data, ['data', resultPath])
  return HTTP.success(jobRunID, response)
}
