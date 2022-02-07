import { expose } from '@chainlink/ea-bootstrap'
import { makeExecute } from './adapter'
import { makeConfig, NAME } from './config'

const adapterContext = { name: NAME }

const server = expose(adapterContext, makeExecute()).server
export { NAME, makeExecute, makeConfig, server }
