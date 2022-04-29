import {BehaviorSubject} from 'rxjs'

const defaultCsvData: Array<Array<string>>= []

export const CSV = new BehaviorSubject(defaultCsvData)
