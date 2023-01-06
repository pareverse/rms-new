import connect from 'database/connect'
import Users from 'database/schemas/users'

export default async (req, res) => {
	await connect()

	try {
		const data = await Users.find({}).sort({ createdAt: -1 })
		const results = data.filter((data) => data.role === 'Tenant' && !data.company.id && !data.archive && !data.deleted)
		res.status(200).send(results)
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
