import mongoose from 'mongoose'

const wantedGamesSchema = mongoose.Schema(
	{
		bggId        : {
			type     : String,
			required : true
		},
		type         : String,
		title        : String,
		year         : Number,
		thumbnail    : String,
		image        : String,
		prefVersion  : Object,
		prefShipping : [ String ],
		designers    : [ String ],
		wantedBy     : {
			type     : mongoose.Schema.Types.ObjectId,
			required : true,
			ref      : 'User'
		},
		isActive     : {
			type    : Boolean,
			default : true
		}
	},
	{
		timestamps : true,
		collection : 'wanted'
	}
)

const Wanted = mongoose.model('Wanted', wantedGamesSchema)

export default Wanted
