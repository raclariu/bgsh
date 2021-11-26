import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const historySchema = mongoose.Schema(
	{
		mode       : String,
		isPack     : Boolean,
		seller     : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		buyer      : String,
		games      : [ Object ],
		finalPrice : Number
	},
	{
		timestamps : true,
		collection : 'gamesHistory'
	}
)

const History = mongoose.model('History', historySchema)

export default History
