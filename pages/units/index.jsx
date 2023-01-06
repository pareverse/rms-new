import { useState } from 'react'
import NextHead from 'next/head'
import NextLink from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { useForm } from 'react-hook-form'
import { Avatar, Badge, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Select, Skeleton, SkeletonCircle, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Modal from 'components/_modal'
import Card from 'components/_card'
import Table from 'components/_table'
import Toast from 'components/_toast'

const AddModal = () => {
	const queryClient = useQueryClient()
	const addDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		setError,
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const addMutation = useMutation((data) => api.create('/units', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			addDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Unit successfully added." />
			})
		},
		onError: (error) => {
			setError('number', { type: 'server', message: error.response.data })
			setIsLoading(false)
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		addMutation.mutate(data)
	}

	return (
		<Modal
			title="Add Unit"
			toggle={(onOpen) => (
				<Button colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Add New
				</Button>
			)}
			disclosure={addDisclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.number}>
						<FormLabel>Unit Number</FormLabel>
						<Input size="lg" {...register('number', { required: 'This field is required.' })} />
						<FormErrorMessage>{errors.number?.message}</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>Unit Type</FormLabel>

						<Select size="lg" {...register('type')}>
							<option value="single">Single</option>
							<option value="attached">Attached</option>
						</Select>
					</FormControl>

					<FormControl>
						<FormLabel>Monthly Rent</FormLabel>
						<Input type="number" placeholder="0.00" size="lg" {...register('monthly_rent', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Flex justify="end" align="center" gap={3}>
						<Button size="lg" onClick={addDisclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const Units = () => {
	const { data: units, isFetched: isUnitFetched } = useQuery(['units'], () => api.all('/units'))
	const { data: companies, isFetched: isCompaniesFetched } = useQuery(['companies'], () => api.all('/companies'))

	return (
		<>
			<NextHead>
				<title>Units</title>
			</NextHead>

			<Container>
				<Flex justify="space-between" align="center" gap={6} mb={6}>
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Units
					</Text>

					<AddModal />
				</Flex>

				<Card>
					<Table
						data={units}
						fetched={isUnitFetched && isCompaniesFetched}
						th={['Company', 'Unit', 'Type', 'Rent', 'Start Date', 'Due Date', 'Status', '']}
						td={(unit) => (
							<Tr key={unit._id}>
								<Td maxW={200}>
									{unit.company.id ? (
										companies
											.filter((company) => unit._id === company.unit.id)
											.map((company) => (
												<NextLink href={`/companies/${company._id}`} passHref key={company._id}>
													<Flex align="center" gap={3} cursor="pointer">
														<Avatar name={company.name} />

														<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
															{company.name}
														</Text>
													</Flex>
												</NextLink>
											))
									) : (
										<Flex align="center" gap={3}>
											<SkeletonCircle size={8} />
											<Skeleton h={2} w={148} />
										</Flex>
									)}
								</Td>

								<Td>
									<Badge>{unit.number}</Badge>
								</Td>

								<Td>
									<Badge textTransform="capitalize">{unit.type}</Badge>
								</Td>

								<Td>
									<Text>₱ {Number(unit.monthly_rent).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
								</Td>

								<Td>
									<Text>{unit.schedule.start_date ? unit.schedule.start_date : '-'}</Text>
								</Td>

								<Td>
									<Text>{unit.schedule.due_date ? unit.schedule.due_date : '-'}</Text>
								</Td>

								<Td>
									<Badge variant="tinted" colorScheme={unit.status === 'occupied' ? 'blue' : 'red'} textTransform="capitalize">
										{unit.status}
									</Badge>
								</Td>

								<Td textAlign="right">
									<NextLink href={`/units/${unit._id}`} passHref>
										<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
									</NextLink>
								</Td>
							</Tr>
						)}
						select={(register) => (
							<Flex flex={1} justify="end" align="center" gap={3}>
								<Select placeholder="Type" size="lg" w="auto" {...register('type')}>
									<option value="single">Single</option>
									<option value="attached">Attached</option>
								</Select>

								<Select placeholder="Status" size="lg" w="auto" {...register('status')}>
									<option value="occupied">Occupied</option>
									<option value="vacant">Vacant</option>
								</Select>
							</Flex>
						)}
						filters={(data, watch) => {
							return data
								.filter((data) =>
									['number'].some((key) =>
										data[key]
											.toString()
											.toLowerCase()
											.includes(watch('search') && watch('search').toLowerCase())
									)
								)
								.filter((data) => (watch('type') ? watch('type') === data.type : data))
								.filter((data) => (watch('status') ? watch('status') === data.status : data))
						}}
						effectts={(watch) => [watch('type'), watch('status')]}
						settings={{
							placeholder: 'Search Unit'
						}}
					/>
				</Card>
			</Container>
		</>
	)
}

Units.authentication = {
	authorized: 'Admin'
}

export default Units
