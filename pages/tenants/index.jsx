import { useState } from 'react'
import NextHead from 'next/head'
import NextLink from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Button, Container, Flex, IconButton, Skeleton, SkeletonCircle, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import { FiTrash } from 'react-icons/fi'
import Toast from 'components/_toast'

const DeleteModal = ({ user }) => {
	const queryClient = useQueryClient()
	const deleteDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const deleteMutation = useMutation((data) => api.update('/users', user._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('users')
			setIsLoading(false)
			deleteDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Tenant removed." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		if (user.company.id) {
			setIsLoading(false)
			deleteDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Error" description="Tenant company is active." status="error" />
			})

			return
		}

		deleteMutation.mutate({
			role: 'User'
		})
	}

	return (
		<Modal size="sm" header="off" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="red" icon={<FiTrash size={12} />} onClick={onOpen} />} disclosure={deleteDisclosure}>
			<Flex align="center" direction="column" gap={6} p={6}>
				<Avatar size="xl" name={user.name} src={user.image} />

				<Flex direction="column">
					<Flex align="center" direction="column" textAlign="center">
						<Text fontWeight="semibold" color="accent-1" noOfLines={1}>
							{user.name}
						</Text>

						<Text fontSize="sm" noOfLines={1}>
							{user.email}
						</Text>
					</Flex>
				</Flex>

				<Text fontSize="sm" textAlign="center">
					Are you sure you want to remove this user?
				</Text>

				<Flex align="center" gap={3}>
					<Button size="lg" colorScheme="brand" onClick={onSubmit} isLoading={isLoading}>
						Yes, sure
					</Button>

					<Button size="lg" onClick={deleteDisclosure.onClose}>
						No, cancel
					</Button>
				</Flex>
			</Flex>
		</Modal>
	)
}

const Tenants = () => {
	const { data: tenants, isFetched: isTenantsFetched } = useQuery(['tenants'], () => api.all('/tenants'))
	const { data: companies, isFetched: isCompaniesFetched } = useQuery(['companies'], () => api.all('/companies'))

	return (
		<>
			<NextHead>
				<title>Tenants</title>
			</NextHead>

			<Container>
				<Flex justify="space-between" align="center" gap={6} mb={6}>
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Tenants
					</Text>
				</Flex>

				<Card>
					<Table
						data={tenants}
						fetched={isTenantsFetched && isCompaniesFetched}
						th={['Full Name', 'Email', 'Company', 'Role', 'Joined', '']}
						td={(user) => (
							<Tr key={user._id}>
								<Td maxW={200}>
									<Flex align="center" gap={3}>
										<Avatar name={user.name} src={user.image} />

										<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
											{user.name}
										</Text>
									</Flex>
								</Td>

								<Td>
									<Text>{user.email}</Text>
								</Td>

								<Td maxW={200}>
									{user.company.id ? (
										companies
											.filter((company) => company._id === user.company.id)
											.map((company) => (
												<NextLink href={`/companies/${company._id}`} passHref key={company._id}>
													<Flex align="center" gap={3} cursor="pointer">
														<Avatar name={company.name} src={company.image} />

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
									<Badge variant="tinted" colorScheme={user.role === 'Admin' ? 'yellow' : user.role === 'Tenant' ? 'blue' : user.role === 'User' && 'red'}>
										{user.role}
									</Badge>
								</Td>

								<Td>
									<Text>{user.created.split(',')[0]}</Text>
								</Td>

								<Td>
									<Flex justify="end" align="center" gap={3}>
										<DeleteModal user={user} />
									</Flex>
								</Td>
							</Tr>
						)}
						filters={(data, watch) => {
							return data.filter((data) =>
								['name', 'email'].some((key) =>
									data[key]
										.toString()
										.toLowerCase()
										.includes(watch('search') && watch('search').toLowerCase())
								)
							)
						}}
						settings={{
							placeholder: 'Search Tenant'
						}}
					/>
				</Card>
			</Container>
		</>
	)
}

Tenants.authentication = {
	authorized: 'Admin'
}

export default Tenants
