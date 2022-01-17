import { Storage } from '@google-cloud/storage'
import path from 'path'
const __dirname = path.resolve()
const serviceKey = path.join(__dirname, '/server/config/keyfile.json')
const storage = new Storage({ keyFilename: serviceKey })
export default storage
