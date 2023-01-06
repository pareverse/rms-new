import { PayPalButtons } from '@paypal/react-paypal-js'

const PaypalButton = ({ amount, onSubmit }) => {
	const handleApprove = (orderId) => {
		console.log(orderId)
		onSubmit()
	}

	return (
		<PayPalButtons
			createOrder={(data, actions) => {
				return actions.order.create({
					purchase_units: [
						{
							amount: {
								value: amount,
								currency: 'PHP'
							}
						}
					]
				})
			}}
			onApprove={async (data, actions) => {
				await actions.order.capture()
				handleApprove(data.orderID)
			}}
			onError={(err) => {
				console.log(err)
			}}
		/>
	)
}

export default PaypalButton
