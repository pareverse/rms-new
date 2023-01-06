import connect from 'database/connect'
import Units from 'database/schemas/units'
import Companies from 'database/schemas/companies'

export default async (req, res) => {
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Units.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body
				const search = await Units.findOne({ number: data.number })

				if (search) return res.status(417).send('Unit number is already exists.')

				await Units.create({
					...data,
					created: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
					updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
				})

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'PATCH':
			try {
				const { id, data } = req.body

				await Units.findByIdAndUpdate(
					{ _id: id },
					{
						status: 'occupied',
						...data,
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				await Companies.findByIdAndUpdate(
					{ _id: data.company.id },
					{
						unit: {
							id: id
						},
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'DELETE':
			try {
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		default:
			res.status(400).send('request failed.')
			break
	}
}
