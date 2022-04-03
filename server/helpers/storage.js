import { Storage } from '@google-cloud/storage'
import path from 'path'
import { __dirname } from '../helpers/helpers.js'

const serviceKey = path.join(__dirname, '..', 'config', 'keyfile.json')
const storage = new Storage({ keyFilename: serviceKey })
export default storage
