import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, GridItem, Icon, Text } from '@chakra-ui/react'
import { FiCheckSquare, FiDollarSign, FiGrid, FiUsers } from 'react-icons/fi'
import Card from 'components/_card'

const Statistics = () => {
	const { data: units, isFetched: isUnitsFetched } = useQuery(['units'], () => api.all('/units'))
	const { data: tenants, isFetched: isTenantsFetched } = useQuery(['tenants'], () => api.all('/tenants'))
	const { data: collected, isFetched: isCollectedFetched } = useQuery(['collected'], () => api.get('/collected', '6381649564a114f3102033d0'))

	return (
		<>
			<GridItem colSpan={{ base: 12, md: 6, xl: 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								{isUnitsFetched ? units.filter((unit) => !unit.company.id).length : 0}
							</Text>

							<Text fontSize="sm" fontWeight="medium">
								Vacant Units
							</Text>
						</Flex>

						<Flex bg="brand.alpha" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Icon as={FiCheckSquare} boxSize={6} color="brand.default" />
						</Flex>
					</Flex>
				</Card>
			</GridItem>

			<GridItem colSpan={{ base: 12, md: 6, xl: 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								{isUnitsFetched ? units.length : 0}
							</Text>

							<Text fontSize="sm" fontWeight="medium">
								Total Units
							</Text>
						</Flex>

						<Flex bg="brand.alpha" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Icon as={FiGrid} boxSize={6} color="brand.default" />
						</Flex>
					</Flex>
				</Card>
			</GridItem>

			<GridItem colSpan={{ base: 12, md: 6, xl: 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								{isTenantsFetched ? tenants.length : 0}
							</Text>

							<Text fontSize="sm" fontWeight="medium">
								Total Tenants
							</Text>
						</Flex>

						<Flex bg="brand.alpha" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Icon as={FiUsers} boxSize={6} color="brand.default" />
						</Flex>
					</Flex>
				</Card>
			</GridItem>

			<GridItem colSpan={{ base: 12, md: 6, xl: 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								₱{isCollectedFetched ? collected.total.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}
							</Text>

							<Text fontSize="sm" fontWeight="medium">
								Total Collected
							</Text>
						</Flex>

						<Flex bg="brand.alpha" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Icon as={FiDollarSign} boxSize={6} color="brand.default" />
						</Flex>
					</Flex>
				</Card>
			</GridItem>
		</>
	)
}

export default Statistics
