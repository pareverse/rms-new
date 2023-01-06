import mongoose from 'mongoose'

const CollectedSchema = mongoose.Schema(
	{
		total: {
			type: Number,
			default: 0
		},
		created: {
			type: String,
			default: ''
		},
		updated: {
			type: String,
			default: ''
		}
	},
	{ timestamps: true }
)

const Collected = mongoose.models.Collected || mongoose.model('Collected', CollectedSchema)

export default Collected
