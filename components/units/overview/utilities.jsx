import { useForm } from 'react-hook-form'
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Skeleton } from '@chakra-ui/react'
import Modal from 'components/_modal'

const Utilities = ({ unit, isUnitFetched, mutation, disclosure, isLoading, setIsLoading }) => {
	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const onSubmit = (data) => {
		setIsLoading(true)

		mutation.mutate({
			water_bill: {
				current_reading: {
					value: data.current_reading_value,
					date: data.current_reading_date
				},
				previous_reading: {
					value: data.previous_reading_value,
					date: data.previous_reading_date
				},
				amount: data.amount
			}
		})
	}

	if (!isUnitFetched || !unit.company.id || !unit.schedule.start_date || !unit.schedule.due_date) return <Skeleton borderRadius={12} h={10} w="59px" />

	return (
		<Modal
			title="Utilities"
			toggle={(onOpen) => (
				<Button variant="tinted" colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Edit
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<Flex align="center" gap={6}>
						<FormControl isInvalid={errors.current_reading_value}>
							<FormLabel>Current Reading</FormLabel>
							<Input type="number" defaultValue={unit.water_bill.current_reading.value} size="lg" {...register('current_reading_value', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={errors.current_reading_date}>
							<FormLabel>Current Date</FormLabel>
							<Input type="date" defaultValue={unit.water_bill.current_reading.date} size="lg" {...register('current_reading_date', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>

					<Flex align="center" gap={6}>
						<FormControl isInvalid={errors.previous_reading_value}>
							<FormLabel>Previous Reading</FormLabel>
							<Input type="number" defaultValue={unit.water_bill.previous_reading.value} size="lg" {...register('previous_reading_value', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={errors.previous_reading_date}>
							<FormLabel>Previous Date</FormLabel>
							<Input type="date" defaultValue={unit.water_bill.previous_reading.date} size="lg" {...register('previous_reading_date', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>

					<Flex align="center" gap={6}>
						<FormControl isInvalid={errors.amount}>
							<FormLabel>Amount</FormLabel>

							<InputGroup>
								<InputLeftElement pointerEvents="none" pt={1} pl={1}>
									₱
								</InputLeftElement>

								<Input type="number" defaultValue={unit.water_bill.amount} size="lg" {...register('amount', { required: true })} />
							</InputGroup>

							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>

					<Flex align="center" gap={3} mt={6}>
						<Button size="lg" w="full" onClick={disclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" colorScheme="brand" w="full" isLoading={isLoading}>
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

export default Utilities
