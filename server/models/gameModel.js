import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const gameSchema = mongoose.Schema(
	{
		seller           : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		altId            : {
			type    : String,
			default : () => genNanoId(8)
		},
		games            : [],
		shipCities       : [],
		sellType         : String,
		extraInfoTxt     : String,
		shipCourier      : Boolean,
		shipPost         : Boolean,
		shipPersonal     : Boolean,
		shipCourierPayer : mongoose.Schema.Types.Mixed,
		shipPostPayer    : mongoose.Schema.Types.Mixed,
		totalPrice       : Number,
		isActive         : {
			type    : Boolean,
			default : true
		},
		isSold           : {
			type    : Boolean,
			default : false
		}
	},
	{
		timestamps : true
	}
)

const Game = mongoose.model('Game', gameSchema)

export default Game
