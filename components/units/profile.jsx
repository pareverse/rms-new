import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Button, Flex, Icon, IconButton, Skeleton, SkeletonCircle, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiAlertTriangle, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'

const EditModal = ({ id, company, viewDisclosure }) => {
	const queryClient = useQueryClient()
	const editDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const editMutation = useMutation((data) => api.update('/units', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			editDisclosure.onClose()
			viewDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Company successfully added." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		editMutation.mutate({
			company: {
				id: company._id
			}
		})
	}

	return (
		<Modal size="sm" header="off" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiPlus size={16} />} onClick={onOpen} />} disclosure={editDisclosure}>
			<Flex align="center" direction="column" gap={6} p={6}>
				<Avatar size="xl" name={company.name} />

				<Flex direction="column">
					<Flex align="center" direction="column" textAlign="center">
						<Text fontWeight="semibold" color="accent-1" noOfLines={1}>
							{company.name}
						</Text>

						<Text fontSize="sm" noOfLines={1}>
							{company.email}
						</Text>
					</Flex>
				</Flex>

				<Text fontSize="sm" textAlign="center">
					Are you sure you want to add this company?
				</Text>

				<Flex align="center" gap={3}>
					<Button size="lg" colorScheme="brand" onClick={onSubmit} isLoading={isLoading}>
						Yes, sure
					</Button>

					<Button size="lg" onClick={editDisclosure.onClose}>
						No, cancel
					</Button>
				</Flex>
			</Flex>
		</Modal>
	)
}

const Profile = ({ id, unit, isUnitFetched }) => {
	const { data: company, isFetched: isCompanyFetched } = useQuery(['company', id], () => api.get('/companies', unit.company.id), { enabled: isUnitFetched && unit.company.id ? true : false })
	const { data: companies, isFetched: isCompaniesFetched } = useQuery(['companies'], () => api.all('/companies/vacant'))

	const queryClient = useQueryClient()
	const viewDisclosure = useDisclosure()
	const deleteDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)

	const deleteMutation = useMutation((data) => api.update('/units/remove', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			deleteDisclosure.onClose()
		}
	})

	const sum_of_maintenance = (unit, isUnitFetched) => {
		let sum = 0

		isUnitFetched
			? unit.maintenance.forEach((data) => {
					sum += Number(data.amount)
			  })
			: 0

		return sum
	}

	const total_amount_due = (unit, isUnitFetched) => {
		let total = 0
		let monthly_rent = 0
		let camc = 0
		let value_added_tax = 0
		let water_bill = 0
		let maintenance = 0

		if (isUnitFetched) {
			total = 0
			monthly_rent = Number(unit.monthly_rent)
			camc = Number(unit.camc.amount)
			value_added_tax = (Number(unit.monthly_rent) + Number(unit.camc.amount)) * (Number(unit.vat.percent) / 100)
			water_bill = Number(unit.water_bill.amount)
			maintenance = sum_of_maintenance(unit, isUnitFetched)

			return (total = monthly_rent + camc + value_added_tax + water_bill + maintenance)
		} else {
			return 0
		}
	}

	const onDelete = () => {
		setIsLoading(true)
		deleteMutation.mutate({
			id: unit._id,
			data: {
				unit: {
					id: unit._id
				},
				company: {
					id: unit.company.id
				},
				schedule: {
					start_date: unit.schedule.start_date,
					due_date: unit.schedule.due_date
				},
				monthly_rent: unit.monthly_rent,
				camc: {
					amount: unit.camc.amount
				},
				vat: {
					percent: unit.vat.percent
				},
				water_bill: {
					current_reading: {
						value: unit.water_bill.current_reading.value,
						date: unit.water_bill.current_reading.date
					},
					previous_reading: {
						value: unit.water_bill.previous_reading.value,
						date: unit.water_bill.previous_reading.date
					},
					amount: unit.water_bill.amount
				},
				maintenance: unit.maintenance,
				total_amount: total_amount_due(unit, isUnitFetched)
			}
		})
	}

	return (
		<Card>
			<Flex align="center" direction="column" gap={6} p={6}>
				{isUnitFetched && isCompanyFetched && unit.company.id ? (
					<>
						<Avatar size="xl" name={company.name} />

						<Flex align="center" direction="column" textAlign="center">
							<Text fontWeight="semibold" color="accent-1" noOfLines={1}>
								{company.name}
							</Text>

							<Text fontSize="sm" noOfLines={1}>
								{company.email}
							</Text>
						</Flex>

						<Modal
							size="sm"
							header="off"
							toggle={(onOpen) => (
								<Button variant="tinted" size="lg" colorScheme="red" onClick={onOpen}>
									Remove Company
								</Button>
							)}
							disclosure={deleteDisclosure}
						>
							<Flex align="center" direction="column" gap={6} px={6}>
								<Flex bg="red.default" mt={6} justify="center" align="center" borderRadius="full" h={24} w={24} color="white">
									<Icon as={FiAlertTriangle} boxSize={10} />
								</Flex>

								<Flex align="center" direction="column" textAlign="center">
									<Text fontSize="xl" fontWeight="semibold" color="accent-1">
										Remove Company
									</Text>

									<Text fontSize="sm">Are you sure you want to remove this company?</Text>
								</Flex>

								<Flex gap={3}>
									<Button size="lg" onClick={deleteDisclosure.onClose}>
										No, cancel
									</Button>

									<Button size="lg" colorScheme="red" isLoading={isLoading} onClick={onDelete}>
										Yes, sure
									</Button>
								</Flex>
							</Flex>
						</Modal>
					</>
				) : (
					<>
						<SkeletonCircle size={24} />

						<Flex align="center" direction="column" gap={3}>
							<Skeleton h={2} w={148} />
							<Skeleton h={2} w={124} />
						</Flex>
					</>
				)}

				{isUnitFetched && !unit.company.id && (
					<Modal
						title="Add Company"
						size="lg"
						toggle={(onOpen) => (
							<Button size="lg" colorScheme="brand" onClick={onOpen}>
								Add Company
							</Button>
						)}
						disclosure={viewDisclosure}
					>
						<Table
							data={companies}
							fetched={isCompaniesFetched}
							td={(company) => (
								<Tr key={company._id}>
									<Td>
										<Flex align="center" gap={3}>
											<Avatar name={company.name} />

											<Text fontWeight="medium" color="accent-1" noOfLines={1}>
												{company.name}
											</Text>
										</Flex>
									</Td>

									<Td textAlign="right">
										<EditModal id={id} company={company} viewDisclosure={viewDisclosure} />
									</Td>
								</Tr>
							)}
							filters={(data, watch) => {
								return data.filter((data) =>
									['name'].some((key) =>
										data[key]
											.toString()
											.toLowerCase()
											.includes(watch('search') && watch('search').toLowerCase())
									)
								)
							}}
							settings={{
								placeholder: 'Search Company',
								searchWidth: 'full',
								show: [5]
							}}
						/>
					</Modal>
				)}
			</Flex>
		</Card>
	)
}

export default Profile
