import mongoose from 'mongoose'

const PaymentSchema = mongoose.Schema(
	{
		user: {
			id: {
				type: String,
				default: ''
			}
		},
		unit: {
			id: {
				type: String,
				default: ''
			}
		},
		company: {
			id: {
				type: String,
				default: ''
			}
		},
		soa: {
			id: {
				type: String,
				default: ''
			}
		},
		total_amount: {
			type: String,
			default: ''
		},
		payment_method: {
			type: String,
			default: ''
		},
		proof_of_payment: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: 'processing'
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

const Payments = mongoose.models.Payments || mongoose.model('Payments', PaymentSchema)

export default Payments
