import { useState } from 'react'
import NextHead from 'next/head'
import NextLink from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { useForm } from 'react-hook-form'
import { Avatar, AvatarGroup, Badge, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Select, Skeleton, SkeletonCircle, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Modal from 'components/_modal'
import Card from 'components/_card'
import Table from 'components/_table'
import Toast from 'components/_toast'

const AddModal = () => {
	const queryClient = useQueryClient()
	const disclosure = useDisclosure()
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

	const addMutation = useMutation((data) => api.create('/companies', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Company successfully added." />
			})
		},
		onError: (error) => {
			setError('number', { type: 'server', message: error.response.data })
			setIsLoading(false)
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		if (!data.email.includes('@gmail.com')) {
			setError('email', { type: 'custom', message: 'Invalid email address.' })
			setIsLoading(false)
			return
		}

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
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Company Name</FormLabel>
						<Input size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.email}>
						<FormLabel>Company Email</FormLabel>
						<Input size="lg" {...register('email', { required: 'This field is required.' })} />
						<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
					</FormControl>

					<Flex justify="end" align="center" gap={3}>
						<Button size="lg" onClick={disclosure.onClose}>
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

const Companies = () => {
	const { data: companies, isFetched: isCompaniesFetched } = useQuery(['companies'], () => api.all('/companies'))
	const { data: units, isFetched: isUnitFetched } = useQuery(['units'], () => api.all('/units'))
	const { data: tenants, isFetched: isTenantsFetched } = useQuery(['tenants'], () => api.all('/tenants'))
	const { data: soa, isFetched: isSoaFetched } = useQuery(['soa'], () => api.all('/soa'))

	return (
		<>
			<NextHead>
				<title>Companies</title>
			</NextHead>

			<Container>
				<Flex justify="space-between" align="center" gap={6} mb={6}>
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Companies
					</Text>

					<AddModal />
				</Flex>

				<Card>
					<Table
						data={companies}
						fetched={isCompaniesFetched && isUnitFetched && isTenantsFetched && isSoaFetched}
						th={['Company', 'Tenants', 'Unit', 'Pending SOA', 'Created', '']}
						td={(company) => (
							<Tr key={company._id}>
								<Td maxW={200}>
									<Flex align="center" gap={3}>
										<Avatar name={company.name} src="" />

										<Text overflow="hidden" textTransform="capitalize" textOverflow="ellipsis" color="accent-1">
											{company.name}
										</Text>
									</Flex>
								</Td>

								<Td>
									<AvatarGroup>{company.tenants.map((company_tenant) => tenants.filter((tenant) => tenant._id === company_tenant.id).map((tenant) => <Avatar name={tenant.name} src={tenant.image} key={tenant._id} />))}</AvatarGroup>
								</Td>

								<Td>
									{company.unit.id
										? units
												.filter((unit) => unit._id === company.unit.id)
												.map((unit) => (
													<NextLink href={`/units/${unit._id}`} passHref key={unit._id}>
														<Badge cursor="pointer">{unit.number}</Badge>
													</NextLink>
												))
										: '-'}
								</Td>

								<Td>
									<Text>{soa.filter((soa) => soa.company.id === company._id).filter((soa) => soa.status === false).length}</Text>
								</Td>

								<Td>
									<Text>{company.created.split(',')[0]}</Text>
								</Td>

								<Td textAlign="right">
									<NextLink href={`/companies/${company._id}`} passHref>
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
									['name'].some((key) =>
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
							placeholder: 'Search Company'
						}}
					/>
				</Card>
			</Container>
		</>
	)
}

Companies.authentication = {
	authorized: 'Admin'
}

export default Companies
