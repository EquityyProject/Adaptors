import { Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/types'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  beforeAll(() => {
    process.env.WS_RPC_URL = process.env.WS_RPC_URL || 'ws_rpc_url'
    process.env.RPC_URL = process.env.RPC_URL || 'rpc_url'
  })

  describe('validation error', () => {
    const requests = [{ name: 'empty body', testData: {} }]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        try {
          await execute(req.testData as AdapterRequest)
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})