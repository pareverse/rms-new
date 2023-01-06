import { useRouter } from 'next/router'
import { Avatar, Badge, Flex, IconButton, Td, Text, Tr } from '@chakra-ui/react'
import { FiLink, FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'

const Duedate = () => {
	const router = useRouter()

	return (
		<Card>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					Due Date
				</Text>

				<IconButton icon={<FiLink size={16} />} onClick={() => router.push('/units')} />
			</Flex>

			<Table
				data={[]}
				fetched={true}
				th={['Company', 'Unit', 'Start Date', 'Due Date', '']}
				td={(data, index) => (
					<Tr key={index}>
						<Td maxW={200}>
							<Flex align="center" gap={3}>
								<Avatar name="" src="" />

								<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
									Company Name
								</Text>
							</Flex>
						</Td>

						<Td>
							<Badge>000</Badge>
						</Td>

						<Td>
							<Badge>09/30/2022</Badge>
						</Td>

						<Td>
							<Badge variant="tinted" colorScheme="red">
								10/30/2022
							</Badge>
						</Td>

						<Td textAlign="right">
							<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
						</Td>
					</Tr>
				)}
				settings={{
					search: 'off',
					show: [5]
				}}
			/>
		</Card>
	)
}

export default Duedate
