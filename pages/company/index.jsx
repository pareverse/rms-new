import { Box, Button, Container, Flex, Text } from '@chakra-ui/react'

const Company = () => {
	return (
		<Container>
			<Flex gap={12} h="auto">
				<Flex flex={1} align="center">
					<Flex align="start" direction="column" gap={6}>
						<Text fontSize={64} fontWeight="bold" lineHeight={1} letterSpacing={0} color="accent-1">
							TSVJ Center
						</Text>

						<Text color="accent-1">TSVJ Center Dormitels is designed to provide a comfortable dwelling space that contributes to a higher level of performance at work and in school. Perfect for Students, Young Professionals, and WFH Employees alike!</Text>

						<Text color="accent-1">Visit our page and book your stay now!The area is a walking distance from many Major landmarks: Las Pinas City Hall, SM Center Las Pinas, Vista Mall Las Pinas, University of Perpetual Help, Perpetual Help Medical Center, STI Academic Center.</Text>

						<Text color="accent-1">✅ We believe that a comfortable dwelling space contributes to a higher level of performance at work and in school.</Text>

						<Text color="accent-1">📍 TSVJ Center consists of Law Offices, Photocopy Centers, Food Stalls, and many other commercial services, with a unique feature of having dual access that caters to residents of Crispina Avenue and clients of the Las Pinas City Hall Complex.</Text>

						<Text color="accent-1">✅ Ideal for: Convenience Store, Korean Grocery, Laundry, Bills Payment Services, Gym.</Text>

						<Text color="accent-1">✅ Location: Lot 3-A Crispina Avenue, Las Pinas Village, Pamplona 3, Las Pinas City.</Text>
					</Flex>
				</Flex>

				<Flex display={{ base: 'none', lg: 'flex' }} flex={1} align="center">
					<Box bgImage="url('/assets/hero.jpg')" bgRepeat="no-repeat" bgSize="cover" bgPos="center" borderRadius="100px 0 100px 0" h="full" w="full" />
				</Flex>
			</Flex>
		</Container>
	)
}

export default Company
