import { useState } from 'react'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import api from 'instance'
import { useForm } from 'react-hook-form'
import { Button, Container, Divider, Flex, FormControl, FormLabel, Grid, GridItem, Icon, Input, Select, Text, useToast } from '@chakra-ui/react'
import { FiDollarSign } from 'react-icons/fi'
import Information from 'components/checkout/information'
import Card from 'components/_card'
import PaypalButton from 'components/checkout/paypal-button'
import Toast from 'components/_toast'

const Checkout = () => {
	const router = useRouter()
	const { id } = router.query
	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const { data: soa, isFetched: isSoaFetched } = useQuery(['checkout_soa', id], () => api.get('/soa', id))
	const [isLoading, setIsLoading] = useState(false)
	const [image, setImage] = useState(null)
	const toast = useToast()

	const { register, watch } = useForm()

	const handleImage = (e) => {
		const file = e.target.files[0]

		if (!file) {
			toast({
				position: 'top',
				render: () => <Toast title="Invalid Image" description="file does not exists." status="error" />
			})

			return
		}

		if (file.size > 5120 * 5120) {
			toast({
				position: 'top',
				render: () => <Toast title="Invalid Image" description="Largest image size is 5mb." status="error" />
			})

			return
		}

		if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
			toast({
				position: 'top',
				render: () => <Toast title="Invalid Image" description="Image format is incorrect." status="error" />
			})

			return
		}

		setImage(file)
	}

	const addMutation = useMutation((data) => api.create('/payments', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('payments')
			setIsLoading(false)
			router.push('/')

			toast({
				position: 'top',
				duration: 10000,
				render: () => <Toast title="Payment Success" description="Your payment will process 2 to 3 working days." />
			})
		}
	})

	const onSubmit = async () => {
		setIsLoading(true)

		if (watch('payment_method') === '') {
			toast({
				position: 'top',
				render: () => <Toast title="Error" description="Please select payment method." status="error" />
			})

			setIsLoading(false)
			return
		}

		if (watch('payment_method') === 'GCash') {
			let res = null

			for (const item of [image]) {
				const formData = new FormData()

				formData.append('file', item)
				formData.append('upload_preset', 'uploads')

				res = await axios.post('https://api.cloudinary.com/v1_1/commence/image/upload', formData)

				addMutation.mutate({
					user: {
						id: session.user.id
					},
					unit: {
						id: soa.unit.id
					},
					company: {
						id: soa.company.id
					},
					soa: {
						id: soa._id
					},
					total_amount: soa.total_amount,
					payment_method: watch('payment_method'),
					proof_of_payment: res.data.secure_url
				})

				return
			}
		}

		addMutation.mutate({
			user: {
				id: session.user.id
			},
			unit: {
				id: soa.unit.id
			},
			company: {
				id: soa.company.id
			},
			soa: {
				id: soa._id
			},
			total_amount: soa.total_amount,
			payment_method: watch('payment_method')
		})
	}

	if (!session) {
		router.push('/')
		return null
	}

	return (
		<>
			<NextHead>
				<title>Checkout</title>
			</NextHead>

			<Container>
				<Grid templateColumns="1fr 360px" gap={6}>
					<GridItem>
						<Information soa={soa} isSoaFetched={isSoaFetched} />
					</GridItem>

					<GridItem>
						<Card>
							<Flex direction="column" gap={6}>
								<Flex align="center" direction="column" gap={6}>
									<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={24} w={24}>
										<Icon as={FiDollarSign} boxSize={8} color="white" />
									</Flex>

									<Flex align="center" direction="column" textAlign="center">
										<Text fontSize="sm" fontWeight="medium" color="accent-1">
											Total Amount Due
										</Text>

										<Text fontSize="4xl" fontWeight="semibold" color="accent-1">
											₱{Number(isSoaFetched ? soa.total_amount : 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
										</Text>
									</Flex>
								</Flex>

								<Divider />

								<Select placeholder="Payment Method" size="lg" {...register('payment_method')}>
									<option value="Cash">Cash</option>
									<option value="GCash">GCash</option>
									<option value="Paypal">Paypal</option>
								</Select>

								{watch('payment_method') === 'GCash' && (
									<FormControl>
										<FormLabel>Proof of Payment</FormLabel>
										<Input type="file" onChange={handleImage} />
									</FormControl>
								)}

								{isSoaFetched && watch('payment_method') === 'Paypal' ? (
									<PaypalButton amount={soa.total_amount} onSubmit={onSubmit} />
								) : (
									<Button size="lg" colorScheme="brand" isLoading={isLoading} onClick={onSubmit}>
										Pay now
									</Button>
								)}
							</Flex>
						</Card>
					</GridItem>
				</Grid>
			</Container>
		</>
	)
}

export default Checkout
