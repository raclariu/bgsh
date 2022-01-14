import { Storage } from '@google-cloud/storage'
import path from 'path'
const __dirname = path.resolve()
const serviceKey = path.join(__dirname, '/server/config/gcsKeys.json')
const gcsStorage = new Storage({ keyFilename: serviceKey, projectId: 'bgsh-avatars' })
export default gcsStorage
