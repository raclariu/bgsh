import mongoose from 'mongoose'

const gameSchema = mongoose.Schema(
	{
		user             : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		games            : [],
		shipCities       : [],
		sellType         : {
			type     : String,
			required : true
		},
		extraInfoTxt     : {
			type : String
		},
		shipCourier      : {
			type : Boolean
		},
		shipPost         : {
			type : Boolean
		},
		shipPersonal     : {
			type : Boolean
		},
		shipCourierPayer : {
			type : String
		},
		shipPostPayer    : {
			type : String
		},
		totalPrice       : {
			type : Number
		}
	},
	{
		timestamps : true
	}
)

const Game = mongoose.model('Game', gameSchema)

export default Game
