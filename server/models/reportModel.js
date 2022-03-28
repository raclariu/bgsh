import mongoose from 'mongoose'

const reportSchema = mongoose.Schema(
	{
		type              : {
			required : true,
			type     : String
		},
		reportedUser      : String,
		reportedGameAltId : String,
		reportText        : {
			required : true,
			type     : String
		}
	},
	{
		timestamps : true
	}
)

const Report = mongoose.model('Report', reportSchema)

export default Report
