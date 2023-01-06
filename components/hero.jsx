import NextLink from 'next/link'
import { Box, Button, Flex, Text } from '@chakra-ui/react'

const Hero = () => {
	return (
		<Flex gap={12} h={600}>
			<Flex flex={1} align="center">
				<Flex align="start" direction="column" gap={8}>
					<Text fontSize={{ base: 64, xl: 80 }} fontWeight="bold" lineHeight={1} letterSpacing={0} color="accent-1">
						Create your success business.
					</Text>

					<Text fontSize="lg">Technology can save you time and money when trying to grow a successful small business. The more of your business operations you can streamline, the easier it becomes to focus on tasks that can promote growth.</Text>

					<NextLink href="/company" passHref>
						<Button size="xl" colorScheme="brand" w={{ base: 'full', sm: 'auto' }}>
							Inquire Now
						</Button>
					</NextLink>
				</Flex>
			</Flex>

			<Flex display={{ base: 'none', lg: 'flex' }} flex={1} align="center">
				<Box bgImage="url('/assets/hero.jpg')" bgRepeat="no-repeat" bgSize="cover" bgPos="center" borderRadius="100px 0 100px 0" h="full" w="full" />
			</Flex>
		</Flex>
	)
}

export default Hero
