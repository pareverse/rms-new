import { useForm } from 'react-hook-form'
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Skeleton } from '@chakra-ui/react'
import Modal from 'components/_modal'

const Schedule = ({ unit, isUnitFetched, mutation, disclosure, isLoading, setIsLoading }) => {
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
			schedule: {
				...data
			}
		})
	}

	if (!isUnitFetched || !unit.company.id) return <Skeleton borderRadius={12} h={10} w="59px" />

	return (
		<Modal
			title="Schedule"
			toggle={(onOpen) => (
				<Button variant="tinted" colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Edit
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.start_date}>
						<FormLabel>Start Date</FormLabel>
						<Input type="date" defaultValue={unit.schedule.start_date} size="lg" {...register('start_date', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.due_date}>
						<FormLabel>Due Date</FormLabel>
						<Input type="date" defaultValue={unit.schedule.due_date} size="lg" {...register('due_date', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

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

export default Schedule
