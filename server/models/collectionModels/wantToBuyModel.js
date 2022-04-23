import mongoose from 'mongoose'

const wantToBuySchema = mongoose.Schema(
	{
		user           : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		bggUsername    : String,
		wantToBuy      : [
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

		wantToBuyCount : Number
	},
	{
		timestamps : true,
		collection : 'bggWantToBuy'
	}
)

const WantToBuy = mongoose.model('WantToBuy', wantToBuySchema)

export default WantToBuy
