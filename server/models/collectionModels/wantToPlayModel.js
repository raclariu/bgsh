import mongoose from 'mongoose'

const wantToPlaySchema = mongoose.Schema(
	{
		user            : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		bggUsername     : String,
		wantToPlay      : [
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

		wantToPlayCount : Number
	},
	{
		timestamps : true,
		collection : 'bggWantToPlay'
	}
)

const WantToPlay = mongoose.model('WantToPlay', wantToPlaySchema)

export default WantToPlay
