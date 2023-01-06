import { Avatar, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import Card from 'components/_card'

const Profile = ({ id, company, isCompanyFetched }) => {
	return (
		<Card>
			<Flex align="center" direction="column" gap={6} p={6}>
				{isCompanyFetched ? (
					<>
						<Avatar size="xl" name={company.name} />

						<Flex align="center" direction="column" textAlign="center">
							<Text fontWeight="semibold" color="accent-1" noOfLines={1}>
								{company.name}
							</Text>

							<Text fontSize="sm" noOfLines={1}>
								{company.email}
							</Text>
						</Flex>
					</>
				) : (
					<>
						<SkeletonCircle size={24} />

						<Flex align="center" direction="column" gap={3}>
							<Skeleton h={2} w={148} />
							<Skeleton h={2} w={124} />
						</Flex>
					</>
				)}
			</Flex>
		</Card>
	)
}

export default Profile
