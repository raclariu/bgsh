import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const historySchema = mongoose.Schema(
	{
		mode          : String,
		isPack        : Boolean,
		addedBy       : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		otherUser     : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'User'
		},
		games         : Array,
		finalPrice    : Number,
		extraInfoPack : String
	},
	{
		timestamps : true,
		collection : 'histories'
	}
)

historySchema.index({ createdAt: -1 })
const History = mongoose.model('History', historySchema)

export default History
