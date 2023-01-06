import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Flex, Select, Td, Text, Tr } from '@chakra-ui/react'
import Card from 'components/_card'
import Table from 'components/_table'

const Payments = () => {
	const { data: payments, isFetched: isPaymentFetched } = useQuery(['company_payment'], () => api.all('/payments'))
	const { data: users, isFetched: isUsersFetched } = useQuery(['company_users'], () => api.all('/users'))

	return (
		<Card>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					Payments History
				</Text>
			</Flex>

			<Table
				data={payments}
				fetched={isPaymentFetched && isUsersFetched}
				th={['Tenant', 'Total Amount', 'Date', 'Pay', 'Status']}
				td={(payment) => (
					<Tr key={payment._id}>
						{users
							.filter((user) => user._id === payment.user.id)
							.map((user) => (
								<Td maxW={200} key={user._id}>
									<Flex align="center" gap={3}>
										<Avatar name={user.name} src={user.image} />

										<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
											{user.name}
										</Text>
									</Flex>
								</Td>
							))}

						<Td>
							<Text>₱{Number(payment.total_amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
						</Td>

						<Td>
							<Text>{payment.created.split(',')[0]}</Text>
						</Td>

						<Td>
							<Badge variant="tinted" colorScheme="blue">
								{payment.payment_method}
							</Badge>
						</Td>

						<Td>
							<Badge variant="tinted" colorScheme={payment.status === 'processing' ? 'blue' : payment.status === 'accepted' ? 'green' : payment.status === 'rejected' && 'red'} textTransform="capitalize">
								{payment.status}
							</Badge>
						</Td>
					</Tr>
				)}
				select={(register) => (
					<Flex flex={1} justify="end" align="center" gap={3}>
						<Select placeholder="Payment Methods" size="lg" w="auto" {...register('method')}>
							<option value="Cash">Cash</option>
							<option value="GCash">GCash</option>
							<option value="Paypal">Paypal</option>
						</Select>

						<Select placeholder="Status" size="lg" w="auto" {...register('status')}>
							<option value="processing">Processing</option>
							<option value="accepted">Accepted</option>
							<option value="rejected">Rejected</option>
						</Select>
					</Flex>
				)}
				filters={(data, watch) => {
					return data.filter((data) => (watch('method') ? watch('method') === data.payment_method : data)).filter((data) => (watch('status') ? watch('status') === data.status : data))
				}}
				effects={(watch) => [watch('method'), watch('status')]}
				settings={{
					search: 'off',
					show: [5]
				}}
			/>
		</Card>
	)
}

export default Payments
