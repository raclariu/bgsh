import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const tokenSchema = mongoose.Schema(
	{
		addedBy  : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		tokenUid : {
			type    : String,
			default : () => genNanoId(64)
		},
		sent     : {
			type    : Date,
			default : new Date()
		}
	},
	{
		timestamps : true
	}
)

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 21600 })
const PwToken = mongoose.model('PwToken', tokenSchema)

export default PwToken
