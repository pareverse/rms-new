import mongoose from 'mongoose'

const UnitSchema = mongoose.Schema(
	{
		number: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: 'vacant'
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

const Units = mongoose.models.Units || mongoose.model('Units', UnitSchema)

export default Units
