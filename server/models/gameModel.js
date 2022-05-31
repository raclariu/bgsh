import mongoose from 'mongoose'

const gameSchema = mongoose.Schema(
	{
		mode          : String,
		addedBy       : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		altId         : {
			type   : String,
			unique : true
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
			shipPostPayer    : String
		},
		extraInfoPack : String,
		totalPrice    : Number,
		isPack        : Boolean,
		isActive      : {
			type    : Boolean,
			default : true
		},
		slug          : String,
		reactivatedAt : {
			type    : Date,
			default : Date.now
		}
	},
	{
		timestamps : true
	}
)

gameSchema.index({ createdAt: -1 })
gameSchema.index({ updatedAt: -1 })
gameSchema.index({ reactivatedAt: -1 })
const Game = mongoose.model('Game', gameSchema)

export default Game
