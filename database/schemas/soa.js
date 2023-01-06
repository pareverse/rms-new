import mongoose from 'mongoose'

const SoaSchema = mongoose.Schema(
	{
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
		schedule: {
			start_date: {
				type: String,
				default: ''
			},
			due_date: {
				type: String,
				default: ''
			}
		},
		monthly_rent: {
			type: String,
			default: ''
		},
		camc: {
			amount: {
				type: String,
				default: ''
			}
		},
		vat: {
			percent: {
				type: String,
				default: '12'
			}
		},
		water_bill: {
			current_reading: {
				value: {
					type: String,
					default: ''
				},
				date: {
					type: String,
					default: ''
				}
			},
			previous_reading: {
				value: {
					type: String,
					default: ''
				},
				date: {
					type: String,
					default: ''
				}
			},
			amount: {
				type: String,
				default: ''
			}
		},
		maintenance: {
			type: Array,
			default: []
		},
		total_amount: {
			type: String,
			default: ''
		},
		status: {
			type: Boolean,
			default: false
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

const Soa = mongoose.models.Soa || mongoose.model('Soa', SoaSchema)

export default Soa
