import connect from 'database/connect'
import Companies from 'database/schemas/companies'

export default async (req, res) => {
	await connect()

	try {
		const data = await Companies.find({}).sort({ createdAt: -1 })
		const results = data.filter((data) => !data.unit.id)
		res.status(200).send(results)
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
