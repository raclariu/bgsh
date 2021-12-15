import mongoose from 'mongoose'
import { genNanoId } from '../helpers/helpers.js'

const gameSchema = mongoose.Schema(
	{
		mode          : String,
		addedBy       : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		altId         : {
			type    : String,
			unique  : true,
			default : () => genNanoId(8)
		},
		games         : Array,
		shipping      : {
			shipCities       : {
				type    : Array,
				default : undefined
			},
			shipCourier      : Boolean,
			shipPost         : Boolean,
			shipPersonal     : Boolean,
			shipCourierPayer : String,
			shipPostPayer    : String,
			shipPreffered    : {
				type    : Array,
				default : undefined
			}
		},
		extraInfoPack : String,
		totalPrice    : Number,
		isPack        : Boolean,
		isActive      : {
			type    : Boolean,
			default : true
		}
	},
	{
		timestamps : true
	}
)

gameSchema.index({ createdAt: -1 })
const Game = mongoose.model('Game', gameSchema)

export default Game
