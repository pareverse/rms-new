import NextLink from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Td, Text, Tr } from '@chakra-ui/react'
import { FiCheckCircle, FiFileText, FiMoreHorizontal, FiPrinter } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'

const History = ({ id, unit, isUnitFetched }) => {
	const { data: soa, isFetched: isSoaFetched } = useQuery(['soa'], () => api.all('/soa'))
	const { data: companies, isFetched: isCompaniesFetched } = useQuery(['search_companies'], () => api.all('/companies'))

	return (
		<Card>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					History
				</Text>
			</Flex>

			<Table
				data={soa}
				fetched={isSoaFetched && isUnitFetched && isCompaniesFetched}
				th={['Company', 'Start Date', 'Due Date', 'Total Amount', 'Status', '']}
				td={(soa) => (
					<Tr key={soa._id}>
						<Td maxW={200}>
							{companies
								.filter((company) => soa.company.id === company._id)
								.map((company) => (
									<NextLink href={`/companies/${company._id}`} passHref key={company._id}>
										<Flex align="center" gap={3} cursor="pointer">
											<Avatar name={company.name} />

											<Text overflow="hidden" textOverflow="ellipsis" color="accent-1">
												{company.name}
											</Text>
										</Flex>
									</NextLink>
								))}
						</Td>

						<Td>
							<Text>{soa.schedule.start_date}</Text>
						</Td>

						<Td>
							<Text>{soa.schedule.due_date}</Text>
						</Td>

						<Td>
							<Text>₱ {Number(soa.total_amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
						</Td>

						<Td>
							<Badge variant="tinted" colorScheme={soa.status ? 'blue' : 'red'}>
								{soa.status ? 'Paid' : 'Unpaid'}
							</Badge>
						</Td>

						<Td textAlign="right">
							<Menu>
								<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

								<MenuList>
									<NextLink href={`/soa/${soa._id}`} passHref>
										<MenuItem icon={<FiFileText size={16} />}>View</MenuItem>
									</NextLink>

									<NextLink href={`/print/${soa._id}`} passHref>
										<MenuItem icon={<FiPrinter size={16} />}>Print</MenuItem>
									</NextLink>
								</MenuList>
							</Menu>
						</Td>
					</Tr>
				)}
				filters={(data) => {
					return data.filter((data) => data.unit.id === id)
				}}
				settings={{
					search: 'off',
					show: [5]
				}}
			/>
		</Card>
	)
}

export default History
