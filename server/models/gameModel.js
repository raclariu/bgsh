import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const gameSchema = mongoose.Schema(
	{
		mode             : String,
		seller           : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		altId            : {
			type    : String,
			default : () => genNanoId(8)
		},
		games            : [ Object ],
		shipCities       : [ String ],
		isPack           : Boolean,
		shipCourier      : Boolean,
		shipPost         : Boolean,
		shipPersonal     : Boolean,
		shipCourierPayer : String,
		shipPostPayer    : String,
		extraInfoPack    : String,
		totalPrice       : Number,
		isActive         : {
			type    : Boolean,
			default : true
		}
	},
	{
		timestamps : true
	}
)

const Game = mongoose.model('Game', gameSchema)

export default Game
