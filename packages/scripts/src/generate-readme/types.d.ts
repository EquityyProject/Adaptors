export type AdapterPackage = {
  name: string
  version: string
}

export type AdapterSchema = {
  description?: string
  endpointParameters: EndpointParameters
  properties: EnvVars
  required: string[]
}

export type Blacklist = {
  blacklist: string[]
}

export type EndpointDetails = {
  [endpointName: string]: {
    supportedEndpoints: string[]
    inputParameters: {
      [inputName: string]: string[] | boolean
    }
  }
}

export type EndpointParameters = {
  [endpoint: string]: {
    [inputParameter: string]: {
      default?: string | number
      description?: string
      enum?: (string | number)[]
      type?: string
    }
  }
}

export type EnvVars = {
  [envVar: string]: {
    default?: string | number
    description?: string
    enum?: (string | number)[]
    type?: string
  }
}

export type IOMap = Record<string, IOPair[]>

export type IOPair = {
  input: JsonObject
  output: JsonObject
}

export type JsonObject = Record<string, any>

export type MaxColChars = number[]

export type TableText = string[][]

export type TextRow = string[]
