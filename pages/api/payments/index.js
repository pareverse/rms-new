import connect from 'database/connect'
import Payments from 'database/schemas/payments'
import Soa from 'database/schemas/soa'
import Collected from 'database/schemas/collected'
import Users from 'database/schemas/users'
import sgMail from '@sendgrid/mail'

export default async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Payments.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				const { data } = req.body

				await Payments.create({
					...data,
					created: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
					updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
				})

				await Soa.findByIdAndUpdate(
					{ _id: data.soa.id },
					{
						status: true,
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'PATCH':
			try {
				const { id, data } = req.body

				const payment = await Payments.findById({ _id: id })
				const user = await Users.findById({ _id: payment.user.id })

				if (data.type === 'accept') {
					await Payments.findByIdAndUpdate(
						{ _id: id },
						{
							status: 'accepted',
							updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
						}
					)

					const total = await Collected.findById({ _id: '6381649564a114f3102033d0' })

					await Collected.findByIdAndUpdate(
						{ _id: '6381649564a114f3102033d0' },
						{
							total: total.total + Number(payment.total_amount)
						}
					)

					const msg = {
						to: user.email,
						from: process.env.EMAIL_FROM,
						subject: 'We have already received your partial payment for rental in TSVJ CENTER successfully!',
						text: '.',
						html: '.'
					}

					sgMail.send(msg)
				} else {
					await Payments.findByIdAndUpdate(
						{ _id: id },
						{
							status: 'rejected',
							updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
						}
					)

					await Soa.findByIdAndUpdate(
						{ _id: data.soa },
						{
							status: false,
							updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
						}
					)

					const msg = {
						to: user.email,
						from: process.env.EMAIL_FROM,
						subject: 'We have rejected your partial payment for rental in TSVJ CENTER.',
						text: '.',
						html: '.'
					}

					sgMail.send(msg)
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
