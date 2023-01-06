import { Container, Flex, Text } from '@chakra-ui/react'
import NextHead from 'next/head'

const Settings = () => {
	return (
		<>
			<NextHead>
				<title>Settings</title>
			</NextHead>

			<Container>
				<Flex align="center" direction="column" gap={3}>
					<Text fontSize="lg" fontWeight="semibold" color="accent-1">
						TSVJ CENTER
					</Text>

					<Text>Version Beta 1.0.0</Text>

					<Text fontWeight="semibold" color="accent-1">
						Github
					</Text>

					<a href="https://github.com/tancoc/rms-11-4">TSVJ Center</a>
				</Flex>
			</Container>
		</>
	)
}

export default Settings
