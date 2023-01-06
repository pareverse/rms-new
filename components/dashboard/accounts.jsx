import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiLink, FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'

const Accounts = () => {
	const router = useRouter()
	const { data: users, isFetched: isUserFetched } = useQuery(['users'], () => api.all('/users'))

	return (
		<Card>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					Accounts
				</Text>

				<IconButton icon={<FiLink size={16} />} onClick={() => router.push('/accounts')} />
			</Flex>

			<Table
				data={users}
				fetched={isUserFetched}
				th={['Email', 'Status', '']}
				td={(user) => (
					<Tr key={user._id}>
						<Td maxW={200}>
							<Flex align="center" gap={3}>
								<Avatar name={user.name} src={user.image} />

								<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
									{user.email}
								</Text>
							</Flex>
						</Td>

						<Td>
							<Badge variant="tinted" colorScheme="red">
								Unauthorized
							</Badge>
						</Td>

						<Td textAlign="right">
							<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
						</Td>
					</Tr>
				)}
				filters={(data, watch) => {
					return data.filter((data) => data.role === 'User')
				}}
				settings={{
					search: 'off',
					show: [5]
				}}
			/>
		</Card>
	)
}

export default Accounts
