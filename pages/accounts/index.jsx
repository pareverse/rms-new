import { useState } from 'react'
import NextHead from 'next/head'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { useForm } from 'react-hook-form'
import { Avatar, Badge, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiEdit2, FiTrash } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import Modal from 'components/_modal'
import Toast from 'components/_toast'

const EditModal = ({ user }) => {
	const queryClient = useQueryClient()
	const editDisclosure = useDisclosure()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const editMutation = useMutation((data) => api.update('/users', user._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('users')
			setIsLoading(false)
			editDisclosure.onClose()

			toast({
				position: 'top',
				render: () => <Toast title="Success" description="User update successfull." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)
		editMutation.mutate(data)
	}

	return (
		<Modal title="Edit User" toggle={(onOpen) => <IconButton variant="tinted" size="xs" colorScheme="brand" icon={<FiEdit2 size={12} />} onClick={() => clearErrors() || reset() || onOpen()} />} disclosure={editDisclosure}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Full Name</FormLabel>
						<Input defaultValue={user.name} size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>Email Address</FormLabel>
						<Input defaultValue={user.email} size="lg" disabled />
					</FormControl>

					<FormControl>
						<FormLabel>Role</FormLabel>

						<Select defaultValue={user.role} size="lg" {...register('role')}>
							<option value="Admin">Admin</option>
							<option value="Tenant">Tenant</option>
							<option value="User">User</option>
						</Select>
					</FormControl>

					<Flex align="center" gap={3} mt={6}>
						<Button size="lg" w="full" onClick={editDisclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" colorScheme="brand" w="full" isLoading={isLoading}>
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

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
				render: () => <Toast title="Success" description="User update successfull." />
			})
		}
	})

	const onSubmit = () => {
		setIsLoading(true)

		deleteMutation.mutate({
			archive: true
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

const Accounts = () => {
	const { data: users, isFetched: isUserFetched } = useQuery(['users'], () => api.all('/users'))

	return (
		<>
			<NextHead>
				<title>Accounts</title>
			</NextHead>

			<Container>
				<Flex justify="space-between" align="center" gap={6} mb={6}>
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Accounts
					</Text>
				</Flex>

				<Card>
					<Table
						data={users}
						fetched={isUserFetched}
						th={['Full Name', 'Email', 'Role', 'Joined', '']}
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
										<EditModal user={user} />
										<DeleteModal user={user} />
									</Flex>
								</Td>
							</Tr>
						)}
						select={(register) => (
							<Flex flex={1} justify="end" align="center" gap={3}>
								<Select placeholder="Role" size="lg" w="auto" {...register('role')}>
									<option value="Admin">Admin</option>
									<option value="User">User</option>
								</Select>
							</Flex>
						)}
						filters={(data, watch) => {
							return data
								.filter((data) =>
									['name', 'email'].some((key) =>
										data[key]
											.toString()
											.toLowerCase()
											.includes(watch('search') && watch('search').toLowerCase())
									)
								)
								.filter((data) => (watch('role') ? watch('role') === data.role : data))
								.filter((data) => data.role !== 'Tenant')
						}}
						effectts={(watch) => [watch('role')]}
						settings={{
							placeholder: 'Search User'
						}}
					/>
				</Card>
			</Container>
		</>
	)
}

Accounts.authentication = {
	authorized: 'Admin'
}

export default Accounts
