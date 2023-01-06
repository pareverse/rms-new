import api from 'instance'
import { useForm } from 'react-hook-form'
import { Button, chakra, Container, Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input, SimpleGrid, Text, Textarea, useToast } from '@chakra-ui/react'
import { FiMail, FiMap, FiPhoneCall } from 'react-icons/fi'
import Card from 'components/_card'
import Toast from 'components/_toast'

const Contact = () => {
	const {
		register,
		formState: { errors },
		reset,
		handleSubmit
	} = useForm()

	const toast = useToast()

	const onSubmit = (data) => {
		api.create('/mail', data)
		reset()

		toast({
			position: 'top',
			render: () => <Toast title="Message Sent!" description="Your message successfully sent!" />
		})
	}

	return (
		<Container>
			<chakra.section>
				<Flex direction={{ base: 'column', lg: 'row' }} gap={12}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Flex direction="column" gap={6}>
							<Flex direction="column">
								<Text fontSize={32} fontWeight="semibold" color="accent-1">
									Contact Us
								</Text>

								<Text>Our friendly team would love to hear from you!</Text>
							</Flex>

							<FormControl isInvalid={errors.name}>
								<FormLabel>Full Name</FormLabel>
								<Input size="lg" {...register('name', { required: true })} />
								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={errors.email}>
								<FormLabel>Email Address</FormLabel>
								<Input size="lg" {...register('email', { required: true })} />
								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={errors.contact}>
								<FormLabel>Phone Number</FormLabel>
								<Input size="lg" {...register('contact', { required: true })} />
								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={errors.message}>
								<FormLabel>Message</FormLabel>
								<Textarea minH={148} {...register('message', { required: true })}></Textarea>
								<FormErrorMessage>This field is required.</FormErrorMessage>
							</FormControl>

							<Button type="submit" size="lg" colorScheme="brand">
								Send Message
							</Button>
						</Flex>
					</form>

					<Flex flex={1}>
						<chakra.div bgImage="url('/assets/map.png')" bgSize="cover" bgPos="center" borderRadius={12} h="full" w="full" />
					</Flex>
				</Flex>

				<SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} mt={12}>
					<Card>
						<Flex direction="column" gap={6}>
							<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={12} w={12}>
								<Icon as={FiMail} boxSize={6} color="brand.default" />
							</Flex>

							<Flex direction="column">
								<Text fontWeight="semibold" color="accent-1">
									Mail Us
								</Text>

								<Text fontSize="sm">Speak to our friendly team.</Text>
							</Flex>

							<Text fontWeight="semibold" color="accent-1">
								adminemail@gmail.com
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex direction="column" gap={6}>
							<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={12} w={12}>
								<Icon as={FiMap} boxSize={6} color="brand.default" />
							</Flex>

							<Flex direction="column">
								<Text fontWeight="semibold" color="accent-1">
									Visit Us
								</Text>

								<Text fontSize="sm">Visit our clinic.</Text>
							</Flex>

							<Text fontWeight="semibold" color="accent-1">
								Crispina Avenue, Las Piñas City
							</Text>
						</Flex>
					</Card>

					<Card>
						<Flex direction="column" gap={6}>
							<Flex bg="brand.alpha" justify="center" align="center" borderRadius={12} h={12} w={12}>
								<Icon as={FiPhoneCall} boxSize={6} color="brand.default" />
							</Flex>

							<Flex direction="column">
								<Text fontWeight="semibold" color="accent-1">
									Call Us
								</Text>

								<Text fontSize="sm">Mon-Fri 8am to 5pm.</Text>
							</Flex>

							<Text fontWeight="semibold" color="accent-1">
								09123456789
							</Text>
						</Flex>
					</Card>
				</SimpleGrid>
			</chakra.section>
		</Container>
	)
}

export default Contact
