import mongoose from 'mongoose'

const CompanySchema = mongoose.Schema(
	{
		name: {
			type: String,
			default: ''
		},
		email: {
			type: String,
			default: ''
		},
		unit: {
			id: {
				type: String,
				default: ''
			}
		},
		tenants: {
			type: Array,
			default: []
		},
		archive: {
			type: Boolean,
			default: false
		},
		deleted: {
			type: Boolean,
			default: false
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

const Companies = mongoose.models.Companies || mongoose.model('Companies', CompanySchema)

export default Companies
