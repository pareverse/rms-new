import connect from 'database/connect'
import Users from 'database/schemas/users'
import Companies from 'database/schemas/companies'

export default async (req, res) => {
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Companies.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body

				await Companies.create({
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

				if (data.tenants) {
					const company = await Companies.findById({ _id: id })

					if (data.tenants.remove) {
						company.tenants.splice(data.tenants.remove.index, 1)

						await Users.findByIdAndUpdate(
							{ _id: data.tenants.id },
							{
								company: {
									id: ''
								},
								updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
							}
						)
					} else {
						company.tenants.push(data.tenants)

						await Users.findByIdAndUpdate(
							{ _id: data.tenants.id },
							{
								company: {
									id: id
								},
								updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
							}
						)
					}

					await company.save()
				}

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
