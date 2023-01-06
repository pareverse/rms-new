import connect from 'database/connect'
import Units from 'database/schemas/units'
import Companies from 'database/schemas/companies'
import Soa from 'database/schemas/soa'

export default async (req, res) => {
	await connect()

	try {
		const { id, data } = req.body
		const unit = await Units.findById({ _id: id })

		console.log(unit)

		await Units.findByIdAndUpdate(
			{ _id: id },
			{
				company: {
					id: ''
				},
				status: 'vacant'
			}
		)

		await Companies.findByIdAndUpdate(
			{
				_id: unit.company.id
			},
			{
				unit: {
					id: ''
				}
			}
		)

		await Soa.create({
			...data.data,
			created: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
			updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
		})

		await Units.findByIdAndUpdate(
			{
				_id: id
			},
			{
				schedule: {
					start_date: '',
					due_date: ''
				},
				camc: {
					amount: ''
				},
				water_bill: {
					current_date: {
						value: '',
						date: ''
					},
					previous_date: {
						value: '',
						date: ''
					},
					amount: ''
				},
				maintenance: [],
				updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
			}
		)

		return res.status(200).send('request success.')
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
