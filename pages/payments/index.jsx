import { useState } from 'react'
import NextHead from 'next/head'
import NextLink from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Button, Container, Flex, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiCheckCircle, FiFileText, FiMoreHorizontal, FiXCircle } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'

const AcceptModal = ({ id, payment }) => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState()
	const toast = useToast()

	const mutation = useMutation((data) => api.update('/payments', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('payments')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Payment Accepted" description="Payment successfully accepted." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		mutation.mutate({
			type: 'accept'
		})
	}

	return (
		<Modal
			size="lg"
			header="off"
			toggle={(onOpen) => (
				<MenuItem icon={<FiCheckCircle size={16} />} color="blue.default" onClick={onOpen}>
					Accept
				</MenuItem>
			)}
			disclosure={disclosure}
		>
			<Flex align="center" direction="column" gap={6} p={6}>
				<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={24} w={24}>
					<Icon as={FiCheckCircle} boxSize={8} color="white" />
				</Flex>

				<Flex align="center" direction="column" textAlign="center">
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Accept Payments
					</Text>

					<Text>Are you sure you want to accept a payment?</Text>
				</Flex>

				{payment.payment_method === 'GCash' && (
					<Flex direction="column" gap={3}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Proof of Payment
						</Text>

						<Image alt="img" src={payment.proof_of_payment} />
					</Flex>
				)}

				<Flex align="center" gap={3}>
					<Button size="lg" colorScheme="brand" isLoading={isLoading} onClick={onSubmit}>
						Yes, sure
					</Button>

					<Button size="lg" onClick={disclosure.onClose}>
						No, cancel
					</Button>
				</Flex>
			</Flex>
		</Modal>
	)
}

const RejectModal = ({ id, payment }) => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState()
	const toast = useToast()

	const mutation = useMutation((data) => api.update('/payments', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('payments')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Payment Rejected" description="Payment successfully rejected." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		mutation.mutate({
			type: 'reject',
			soa: payment.soa.id
		})
	}

	return (
		<Modal
			size="lg"
			header="off"
			toggle={(onOpen) => (
				<MenuItem icon={<FiXCircle size={16} />} color="red.default" onClick={onOpen}>
					Reject
				</MenuItem>
			)}
			disclosure={disclosure}
		>
			<Flex align="center" direction="column" gap={6} p={6}>
				<Flex bg="red.default" justify="center" align="center" borderRadius="full" h={24} w={24}>
					<Icon as={FiXCircle} boxSize={8} color="white" />
				</Flex>

				<Flex align="center" direction="column" textAlign="center">
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Reject Payments
					</Text>

					<Text>Are you sure you want to reject a payment?</Text>
				</Flex>

				{payment.payment_method === 'GCash' && (
					<Flex direction="column" gap={3}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Proof of Payment
						</Text>

						<Image alt="img" src={payment.proof_of_payment} />
					</Flex>
				)}

				<Flex align="center" gap={3}>
					<Button size="lg" colorScheme="red" isLoading={isLoading} onClick={onSubmit}>
						Yes, sure
					</Button>

					<Button size="lg" onClick={disclosure.onClose}>
						No, cancel
					</Button>
				</Flex>
			</Flex>
		</Modal>
	)
}

const Payments = () => {
	const { data: users, isFetched: isUserFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: units, isFetched: isUnitFetched } = useQuery(['units'], () => api.all('/units'))
	const { data: companies, isFetched: isCompaniesFetched } = useQuery(['companies'], () => api.all('/companies'))
	const { data: payments, isFetched: isPaymentFetched } = useQuery(['payments'], () => api.all('/payments'))

	return (
		<>
			<NextHead>
				<title>Payments</title>
			</NextHead>

			<Container>
				<Flex justify="space-between" align="center" gap={6} mb={6}>
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Payments
					</Text>
				</Flex>

				<Card>
					<Table
						data={payments}
						fetched={isUserFetched && isUnitFetched && isCompaniesFetched && isPaymentFetched}
						th={['Company', 'Tenant', 'Unit', 'Amount', 'Date', 'Pay', 'Status', '']}
						td={(payment) => (
							<Tr key={payment._id}>
								<Td maxW={200}>
									{companies
										.filter((company) => company._id === payment.company.id)
										.map((company) => (
											<NextLink href={`/companies/${company._id}`} passHref key={company._id}>
												<Flex align="center" gap={3}>
													<Avatar name={company.name} />

													<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
														{company.name}
													</Text>
												</Flex>
											</NextLink>
										))}
								</Td>

								<Td>
									{users
										.filter((user) => user._id === payment.user.id)
										.map((user) => (
											<Avatar name={user.name} src={user.image} key={user._id} />
										))}
								</Td>

								<Td>
									{units
										.filter((unit) => unit._id === payment.unit.id)
										.map((unit) => (
											<NextLink href={`/units/${unit._id}`} passHref key={unit._id}>
												<Badge cursor="pointer">{unit.number}</Badge>
											</NextLink>
										))}
								</Td>

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

								<Td textAlign="right">
									<Menu placement="left">
										<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

										<MenuList>
											<NextLink href={`/soa/${payment.soa.id}`} passHref>
												<MenuItem icon={<FiFileText size={16} />}>View</MenuItem>
											</NextLink>

											{payment.status === 'processing' && <AcceptModal id={payment._id} payment={payment} />}
											{payment.status === 'processing' && <RejectModal id={payment._id} payment={payment} />}
										</MenuList>
									</Menu>
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
					/>
				</Card>
			</Container>
		</>
	)
}

Payments.authentication = {
	authorized: 'Admin'
}

export default Payments
