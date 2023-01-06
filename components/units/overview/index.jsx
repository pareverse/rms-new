import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Button, Divider, Flex, FormControl, FormLabel, Icon, Input, InputGroup, InputLeftElement, Skeleton, Text, useDisclosure, useToast, VisuallyHidden } from '@chakra-ui/react'
import { FiDollarSign, FiSend } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Toast from 'components/_toast'
import Schedule from './schedule'
import Charges from './charges'
import Utilities from './utilities'
import { Add, View } from './maintenance'

const AddModal = ({ unit, total, isUnitFetched }) => {
	const queryClient = useQueryClient()
	const addDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const addMutation = useMutation((data) => api.create('/soa', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			addDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Statement of account successfully sent." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		addMutation.mutate({
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
				total_amount: total
			}
		})
	}

	if (!isUnitFetched || !unit.company.id || !unit.schedule.start_date || !unit.schedule.due_date) return <Skeleton borderRadius={12} h="44px" w="99px" />

	return (
		<Modal
			size="sm"
			header="off"
			toggle={(onOpen) => (
				<Button size="lg" colorScheme="brand" leftIcon={<FiSend size={16} />} onClick={onOpen}>
					Send
				</Button>
			)}
			disclosure={addDisclosure}
		>
			<Flex align="center" direction="column" gap={6} p={6}>
				<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={24} w={24}>
					<Icon as={FiDollarSign} boxSize={8} color="white" />
				</Flex>

				<Flex align="center" direction="column" textAlign="center">
					<Text fontSize="sm" fontWeight="medium" color="accent-1">
						Total Amount Due
					</Text>

					<Text fontSize="4xl" fontWeight="semibold" color="accent-1">
						₱{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
					</Text>
				</Flex>

				<Divider />

				<Flex justify="space-between" align="center" gap={6} w="full">
					<Text fontSize="sm" fontWeight="medium" color="accent-1">
						Start Date
					</Text>

					<Text fontSize="sm" fontWeight="medium">
						{unit.schedule.start_date}
					</Text>
				</Flex>

				<Flex justify="space-between" align="center" gap={6} w="full">
					<Text fontSize="sm" fontWeight="medium" color="accent-1">
						Due Date
					</Text>

					<Text fontSize="sm" fontWeight="medium">
						{unit.schedule.due_date}
					</Text>
				</Flex>

				<Divider />

				<Button size="lg" colorScheme="brand" w="full" isLoading={isLoading} onClick={onSubmit}>
					Send
				</Button>
			</Flex>
		</Modal>
	)
}

const Overview = ({ id, unit, isUnitFetched }) => {
	const queryClient = useQueryClient()
	const scheduleDisclosure = useDisclosure()
	const chargesDisclosure = useDisclosure()
	const utilitiesDisclosure = useDisclosure()
	const addMaintenanceDisclosure = useDisclosure()
	const viewMaintenanceDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const editMutation = useMutation((data) => api.update('/units/overview', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			scheduleDisclosure.onClose()
			chargesDisclosure.onClose()
			utilitiesDisclosure.onClose()
			addMaintenanceDisclosure.onClose()
			viewMaintenanceDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Update successfull." />
			})
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

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Overview
					</Text>

					<Flex align="center" gap={3}>
						<AddModal unit={unit} total={total_amount_due(unit, isUnitFetched)} isUnitFetched={isUnitFetched} />
					</Flex>
				</Flex>

				<Divider />

				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Schedule
						</Text>

						<Schedule unit={unit} isUnitFetched={isUnitFetched} mutation={editMutation} disclosure={scheduleDisclosure} isLoading={isLoading} setIsLoading={setIsLoading} />
					</Flex>

					<Flex justify="end" align="end" direction={{ base: 'column', md: 'row' }} gap={6} w={{ base: 'full', md: 'auto' }}>
						<FormControl w={{ base: 'full', md: 200 }}>
							<FormLabel>Start Date</FormLabel>
							<Input type="date" value={isUnitFetched ? unit.schedule.start_date : ''} size="lg" readOnly />
						</FormControl>

						<FormControl w={{ base: 'full', md: 200 }}>
							<FormLabel>Due Date</FormLabel>
							<Input type="date" value={isUnitFetched ? unit.schedule.due_date : ''} size="lg" readOnly />
						</FormControl>
					</Flex>
				</Flex>

				<Divider />

				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Current Charges
						</Text>

						<Charges unit={unit} isUnitFetched={isUnitFetched} mutation={editMutation} disclosure={chargesDisclosure} isLoading={isLoading} setIsLoading={setIsLoading} />
					</Flex>

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="semibold" color="accent-1">
							Monthly Rent
						</Text>

						<FormControl w={200}>
							<InputGroup>
								<InputLeftElement pointerEvents="none" pt={1} pl={1}>
									₱
								</InputLeftElement>

								<Input value={isUnitFetched ? Number(unit.monthly_rent).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''} size="lg" readOnly />
							</InputGroup>
						</FormControl>
					</Flex>

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="semibold" color="accent-1">
							CAMC
						</Text>

						<FormControl w={200}>
							<InputGroup>
								<InputLeftElement pointerEvents="none" pt={1} pl={1}>
									₱
								</InputLeftElement>

								<Input value={isUnitFetched ? Number(unit.camc.amount).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''} size="lg" readOnly />
							</InputGroup>
						</FormControl>
					</Flex>

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="semibold" color="accent-1">
							Value-added Tax ({isUnitFetched ? unit.vat.percent : '0'}%)
						</Text>

						<FormControl w={200}>
							<InputGroup>
								<InputLeftElement pointerEvents="none" pt={1} pl={1}>
									₱
								</InputLeftElement>

								<Input size="lg" value={isUnitFetched ? ((Number(unit.monthly_rent) + Number(unit.camc.amount)) * (Number(unit.vat.percent) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''} readOnly />
							</InputGroup>
						</FormControl>
					</Flex>
				</Flex>

				<Divider />

				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Utilities
						</Text>

						<Utilities unit={unit} isUnitFetched={isUnitFetched} mutation={editMutation} disclosure={utilitiesDisclosure} isLoading={isLoading} setIsLoading={setIsLoading} />
					</Flex>

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="semibold" color="accent-1">
							Water Bill
						</Text>

						<FormControl w={200}>
							<InputGroup>
								<InputLeftElement pointerEvents="none" pt={1} pl={1}>
									₱
								</InputLeftElement>

								<Input value={isUnitFetched ? Number(unit.water_bill.amount).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''} size="lg" readOnly />
							</InputGroup>
						</FormControl>
					</Flex>
				</Flex>

				<Divider />

				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Maintenance
						</Text>

						<Flex align="center" gap={3}>
							<Add unit={unit} isUnitFetched={isUnitFetched} mutation={editMutation} disclosure={addMaintenanceDisclosure} isLoading={isLoading} setIsLoading={setIsLoading} />
							<View unit={unit} isUnitFetched={isUnitFetched} mutation={editMutation} disclosure={viewMaintenanceDisclosure} isLoading={isLoading} setIsLoading={setIsLoading} />
						</Flex>
					</Flex>

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="semibold" color="accent-1">
							Amount
						</Text>

						<FormControl w={200}>
							<InputGroup>
								<InputLeftElement pointerEvents="none" pt={1} pl={1}>
									₱
								</InputLeftElement>

								<Input value={isUnitFetched ? sum_of_maintenance(unit, isUnitFetched).toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''} size="lg" readOnly />
							</InputGroup>
						</FormControl>
					</Flex>
				</Flex>

				<Divider />

				<Flex direction="column" gap={6}>
					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							Total amount due
						</Text>

						<Text fontSize="lg" fontWeight="semibold" color="accent-1">
							₱{total_amount_due(unit, isUnitFetched).toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Card>
	)
}

export default Overview
