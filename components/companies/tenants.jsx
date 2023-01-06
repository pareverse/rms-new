import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Button, Flex, IconButton, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Table from 'components/_table'
import Toast from 'components/_toast'

const EditModal = ({ id, tenant, viewDisclosure }) => {
	const queryClient = useQueryClient()
	const editDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const editMutation = useMutation((data) => api.update('/companies', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('tenants')
			setIsLoading(false)
			editDisclosure.onClose()
			viewDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Tenant successfully added." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		editMutation.mutate({
			tenants: {
				id: tenant._id
			}
		})
	}

	return (
		<Modal size="sm" header="off" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiPlus size={16} />} onClick={onOpen} />} disclosure={editDisclosure}>
			<Flex align="center" direction="column" gap={6} p={6}>
				<Avatar size="xl" name={tenant.name} src={tenant.image} />

				<Flex direction="column">
					<Flex align="center" direction="column" textAlign="center">
						<Text fontWeight="semibold" color="accent-1" noOfLines={1}>
							{tenant.name}
						</Text>

						<Text fontSize="sm" noOfLines={1}>
							{tenant.email}
						</Text>
					</Flex>
				</Flex>

				<Text fontSize="sm" textAlign="center">
					Are you sure you want to add this Tenant?
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

const DeleteModal = ({ user, index }) => {
	const queryClient = useQueryClient()
	const deleteDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const deleteMutation = useMutation((data) => api.update('/companies', user.company.id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('companies')
			setIsLoading(false)
			deleteDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="Tenant removed successfully." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		deleteMutation.mutate({
			tenants: {
				id: user._id,
				remove: {
					index: index
				}
			}
		})
	}

	return (
		<Modal size="sm" header="off" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="red" icon={<FiMinus size={12} />} onClick={onOpen} />} disclosure={deleteDisclosure}>
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

const Tenants = ({ id, company, isCompanyFetched }) => {
	const { data: session } = useSession()
	const { data: vacantTenants, isFetched: isVacantTenantsFetched } = useQuery(['vacant_tenants'], () => api.all('/tenants/vacant'))
	const { data: tenants, isFetched: isTenantsFetched } = useQuery(['tenants'], () => api.all('/tenants/'))
	const viewDisclosure = useDisclosure()

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="lg" fontWeight="semibold" color="accent-1">
						Tenants
					</Text>

					{session && session.user.role === 'Admin' && (
						<Modal title="Add Tenant" size="lg" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiPlus size={14} />} onClick={onOpen} />} disclosure={viewDisclosure}>
							<Table
								data={vacantTenants}
								fetched={isVacantTenantsFetched}
								td={(tenant) => (
									<Tr key={tenant._id}>
										<Td>
											<Flex align="center" gap={3}>
												<Avatar name={tenant.name} src={tenant.image} />

												<Text fontWeight="medium" color="accent-1" noOfLines={1}>
													{tenant.name}
												</Text>
											</Flex>
										</Td>

										<Td textAlign="right">
											<EditModal id={id} tenant={tenant} viewDisclosure={viewDisclosure} />
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
									placeholder: 'Search Tenant',
									searchWidth: 'full',
									show: [5]
								}}
							/>
						</Modal>
					)}
				</Flex>

				{isCompanyFetched &&
					company.tenants.map(
						(company_tenant) =>
							isTenantsFetched &&
							tenants
								.filter((tenant) => tenant._id === company_tenant.id)
								.map((tenant, index) => (
									<Flex justify="space-between" align="center" gap={6} key={tenant._id}>
										<Flex align="center" gap={3}>
											<Avatar name={tenant.name} src={tenant.image} />

											<Text fontSize="sm" fontWeight="medium" color="accent-1" noOfLines={1}>
												{tenant.name}
											</Text>
										</Flex>

										{session && session.user.role === 'Admin' && <DeleteModal user={tenant} index={index} />}
									</Flex>
								))
					)}
			</Flex>
		</Card>
	)
}

export default Tenants
