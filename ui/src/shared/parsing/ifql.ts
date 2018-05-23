import Papa from 'papaparse'
import _ from 'lodash'
import uuid from 'uuid'

import {ScriptResult} from 'src/types'

export const parseResults = (resp: string): ScriptResult[] => {
  return resp
    .trim()
    .split('\n\n')
    .map(parseResult)
}

export const parseResult = (raw: string, index: number): ScriptResult => {
  const lines = raw.split('\n')
  const rawMetadata: string = lines
    .filter(line => line.startsWith('#'))
    .map(line => line.slice(1))
    .join('\n')
  const rawData: string = lines.filter(line => !line.startsWith('#')).join('\n')

  const metadata = Papa.parse(rawMetadata).data
  const data = Papa.parse(rawData).data

  const headerRow = _.get(data, '0', [])
  const measurementHeaderIndex = headerRow.findIndex(v => v === '_measurement')
  const name = _.get(data, `1.${measurementHeaderIndex}`, `Result ${index}`)

  return {
    id: uuid.v4(),
    name,
    data,
    metadata,
  }
}
