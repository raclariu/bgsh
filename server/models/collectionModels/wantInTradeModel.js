import mongoose from 'mongoose'

const wantInTradeSchema = mongoose.Schema(
	{
		user             : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		bggUsername      : String,
		wantInTrade      : [
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
				priority  : Number,
				modified  : Date,
				numPlays  : Number,
				_id       : false,
				stats     : {
					userRating : Number,
					avgRating  : Number,
					ratings    : Number
				}
			}
		],

		wantInTradeCount : Number
	},
	{
		timestamps : true,
		collection : 'bggWantInTrade'
	}
)

const WantInTrade = mongoose.model('WantInTrade', wantInTradeSchema)

export default WantInTrade
