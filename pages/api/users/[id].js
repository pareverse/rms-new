import connect from 'database/connect'
import Users from 'database/schemas/users'

export default async (req, res) => {
	const { id } = req.query
	await connect()

	try {
		console.log(req.query)
		const data = await Users.findById({ _id: id })
		//const results = data.filter((data) => !data.archive && !data.deleted)
		res.status(200).send('')
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
