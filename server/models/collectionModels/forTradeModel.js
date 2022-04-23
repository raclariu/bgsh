import mongoose from 'mongoose'

const forTradeSchema = mongoose.Schema(
	{
		user          : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		bggUsername   : String,
		forTrade      : [
			{
				bggId     : {
					type     : String,
					required : true
				},
				subtype   : String,
				title     : String,
				year      : Number,
				thumbnail : String,
				image     : String,
				modified  : Date,
				numPlays  : Number,
				_id       : false,
				stats     : {
					userRating : Number,
					avgRating  : Number,
					ratings    : Number
				},
				version   : {
					type    : {
						title : String,
						year  : String
					},
					default : null,
					_id     : false
				}
			}
		],
		forTradeCount : Number
	},
	{
		timestamps : true,
		collection : 'bggForTrade'
	}
)

const ForTrade = mongoose.model('ForTrade', forTradeSchema)

export default ForTrade
