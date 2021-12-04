import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const messageSchema = mongoose.Schema(
	{
		sender       : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		recipient    : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		subject      : String,
		message      : String,
		read         : {
			type    : Boolean,
			default : false
		},
		delRecipient : {
			type    : Boolean,
			default : false
		},
		delSender    : {
			type    : Boolean,
			default : false
		}
	},
	{
		timestamps : true
	}
)

messageSchema.index({ createdAt: -1 })
const Message = mongoose.model('Message', messageSchema)

export default Message
