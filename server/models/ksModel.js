import mongoose from 'mongoose'

const kickstarterSchema = mongoose.Schema(
	{
		ksId             : String,
		title            : String,
		image            : String,
		shortDescription : String,
		creator          : String,
		backers          : Number,
		pledged          : Number,
		goal             : Number,
		percentFunded    : Number,
		country          : String,
		currencySymbol   : String,
		url              : String,
		launched         : Number,
		deadline         : Number
	},
	{
		timestamps : true
	}
)

const Kickstarter = mongoose.model('Kickstarter', kickstarterSchema)

export default Kickstarter
