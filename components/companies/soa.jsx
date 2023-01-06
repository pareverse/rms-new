import NextLink from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Badge, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Select, Td, Text, Tr } from '@chakra-ui/react'
import { FiCheckCircle, FiFileText, FiMoreHorizontal, FiPrinter } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'

const SOA = ({ id, company, isCompanyFetched }) => {
	const { data: soa, isFetched: isSoaFetched } = useQuery(['soa'], () => api.all('/soa'))

	return (
		<Card>
			<Flex justify="space-between" align="center" gap={6} mb={6}>
				<Text fontSize="xl" fontWeight="semibold" color="accent-1">
					Statement of Account
				</Text>
			</Flex>

			<Table
				data={soa}
				fetched={isCompanyFetched && isSoaFetched}
				th={['ID', 'Start Date', 'Due Date', 'Total Amount', 'Status', '']}
				td={(soa) => (
					<Tr key={soa._id}>
						<Td>
							<Text textTransform="uppercase">{soa._id}</Text>
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

									{!soa.status && (
										<NextLink href={`/checkout/${soa._id}`} passHref>
											<MenuItem icon={<FiCheckCircle size={16} />}>Pay</MenuItem>
										</NextLink>
									)}
								</MenuList>
							</Menu>
						</Td>
					</Tr>
				)}
				select={(register) => (
					<Flex flex={1} justify="end" align="center" gap={3}>
						<Select size="lg" w="auto">
							<option>Unpaid</option>
							<option>Paid</option>
						</Select>
					</Flex>
				)}
				filters={(data, watch) => {
					return data
						.filter((data) =>
							['_id'].some((key) =>
								data[key]
									.toString()
									.toLowerCase()
									.includes(watch('search') && watch('search').toLowerCase())
							)
						)
						.filter((data) => data.company.id === id)
				}}
				settings={{
					placeholder: 'Search ID',
					show: [5]
				}}
			/>
		</Card>
	)
}

export default SOA
