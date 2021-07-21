import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const historySchema = mongoose.Schema(
	{
		seller     : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		buyer      : String,
		games      : [],
		finalPrice : Number
	},
	{
		timestamps : true
	}
)

const History = mongoose.model('History', historySchema)

export default History
