import mongoose from 'mongoose'

const gameSchema = mongoose.Schema(
	{
		seller           : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
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
		totalPrice       : Number
	},
	{
		timestamps : true
	}
)

const Game = mongoose.model('Game', gameSchema)

export default Game
