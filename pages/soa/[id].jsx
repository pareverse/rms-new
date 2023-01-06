import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Container, Divider, Flex, Text } from '@chakra-ui/react'
import Card from 'components/_card'

const Soa = () => {
	const router = useRouter()
	const { id } = router.query
	const { data: soa, isFetched: isSoaFetched } = useQuery(['view_soa', id], () => api.get('/soa', id))
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Nov', 'Oct', 'Dec']

	const sum_of_maintenance = (soa) => {
		let sum = 0

		soa.maintenance.forEach((data) => {
			sum += Number(data.amount)
		})

		return sum
	}

	if (!isSoaFetched) return null

	return (
		<Container>
			<Card>
				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
							Statement of Account
						</Text>

						<Text fontWeight="semibold" color="accent-1">
							{soa._id}
						</Text>
					</Flex>

					<Divider />

					<Flex direction="column" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Schedule
						</Text>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Start Date
							</Text>

							<Text fontSize="sm" color="accent-1">
								{months[soa.schedule.start_date.split('-')[1] - 1]} {soa.schedule.start_date.split('-')[2]}, {soa.schedule.start_date.split('-')[0]}
							</Text>
						</Flex>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Due Date
							</Text>

							<Text fontSize="sm" color="accent-1">
								{months[soa.schedule.due_date.split('-')[1] - 1]} {soa.schedule.due_date.split('-')[2]}, {soa.schedule.due_date.split('-')[0]}
							</Text>
						</Flex>
					</Flex>

					<Divider />

					<Flex direction="column" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Current Charges
						</Text>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Monthly Rent
							</Text>

							<Text fontSize="sm" color="accent-1">
								₱{Number(soa.monthly_rent).toLocaleString(undefined, { maximumFractionDigits: 2 })}
							</Text>
						</Flex>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								CAMC
							</Text>

							<Text fontSize="sm" color="accent-1">
								₱{Number(soa.camc.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
							</Text>
						</Flex>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Value-Added Tax (12%)
							</Text>

							<Text fontSize="sm" color="accent-1">
								₱{((Number(soa.monthly_rent) + Number(soa.camc.amount)) * (Number(soa.vat.percent) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
							</Text>
						</Flex>
					</Flex>

					<Divider />

					<Flex direction="column" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Water Bill
						</Text>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Current Reading
							</Text>

							<Text fontSize="sm" color="accent-1">
								{soa.water_bill.current_reading.value}
							</Text>
						</Flex>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Current Reading Date
							</Text>

							<Text fontSize="sm" color="accent-1">
								{months[soa.water_bill.current_reading.date.split('-')[1] - 1]} {soa.water_bill.current_reading.date.split('-')[2]}, {soa.water_bill.current_reading.date.split('-')[0]}
							</Text>
						</Flex>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Previous Reading
							</Text>

							<Text fontSize="sm" color="accent-1">
								{soa.water_bill.previous_reading.value}
							</Text>
						</Flex>

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Previous Reading Date
							</Text>

							<Text fontSize="sm" color="accent-1">
								{months[soa.water_bill.previous_reading.date.split('-')[1] - 1]} {soa.water_bill.previous_reading.date.split('-')[2]}, {soa.water_bill.previous_reading.date.split('-')[0]}
							</Text>
						</Flex>

						<Divider />

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Amount
							</Text>

							<Text fontSize="sm" color="accent-1">
								₱{Number(soa.water_bill.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
							</Text>
						</Flex>
					</Flex>

					<Divider />

					<Flex direction="column" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Maintenance
						</Text>

						{soa.maintenance.map((data, index) => (
							<Flex justify="space-between" align="center" key={index}>
								<Text fontSize="sm" fontWeight="semibold" color="accent-1">
									{data.label}
								</Text>

								<Text fontSize="sm" color="accent-1">
									₱{Number(data.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>
							</Flex>
						))}

						<Divider />

						<Flex justify="space-between" align="center">
							<Text fontSize="sm" fontWeight="semibold" color="accent-1">
								Total
							</Text>

							<Text fontSize="sm" color="accent-1">
								₱{sum_of_maintenance(soa).toLocaleString(undefined, { maximumFractionDigits: 2 })}
							</Text>
						</Flex>

						<Divider />

						<Flex justify="space-between" align="center">
							<Text fontSize="xl" fontWeight="semibold" color="accent-1">
								Total Amount Due
							</Text>

							<Text fontSize="xl" fontWeight="semibold" color="accent-1">
								₱{Number(soa.total_amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
							</Text>
						</Flex>
					</Flex>
				</Flex>
			</Card>
		</Container>
	)
}

export default Soa
