import { Flex, Skeleton, Text } from '@chakra-ui/react'
import Card from 'components/_card'

const Details = ({ unit, isUnitFetched }) => {
	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Text fontSize="lg" fontWeight="semibold" color="accent-1">
					Details
				</Text>

				<Flex justify="space-between" align="center">
					<Text fontSize="sm" fontWeight="semibold" color="accent-1">
						Number
					</Text>

					{isUnitFetched ? (
						<Text fontSize="sm" fontWeight="medium">
							{unit.number}
						</Text>
					) : (
						<Skeleton h={2} w="64px" />
					)}
				</Flex>

				<Flex justify="space-between" align="center">
					<Text fontSize="sm" fontWeight="semibold" color="accent-1">
						Type
					</Text>

					{isUnitFetched ? (
						<Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
							{unit.type}
						</Text>
					) : (
						<Skeleton h={2} w="64px" />
					)}
				</Flex>

				<Flex justify="space-between" align="center">
					<Text fontSize="sm" fontWeight="semibold" color="accent-1">
						Rent
					</Text>

					{isUnitFetched ? (
						<Text fontSize="sm" fontWeight="medium">
							₱{Number(unit.monthly_rent).toLocaleString(undefined, { maximumFractionDigits: 2 })}
						</Text>
					) : (
						<Skeleton h={2} w="64px" />
					)}
				</Flex>

				<Flex justify="space-between" align="center">
					<Text fontSize="sm" fontWeight="semibold" color="accent-1">
						Created
					</Text>

					{isUnitFetched ? (
						<Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
							{unit.created.split(',')[0]}
						</Text>
					) : (
						<Skeleton h={2} w="64px" />
					)}
				</Flex>
			</Flex>
		</Card>
	)
}

export default Details
