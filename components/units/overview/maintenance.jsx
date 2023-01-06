import { useForm } from 'react-hook-form'
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputLeftElement, Skeleton, Text } from '@chakra-ui/react'
import { FiTrash } from 'react-icons/fi'
import Modal from 'components/_modal'

export const Add = ({ unit, isUnitFetched, mutation, disclosure, isLoading, setIsLoading }) => {
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
			maintenance: {
				...data
			}
		})
	}

	if (!isUnitFetched || !unit.company.id || !unit.schedule.start_date || !unit.schedule.due_date) return <Skeleton borderRadius={12} h={10} w="60px" />

	return (
		<Modal
			title="Maintenance"
			toggle={(onOpen) => (
				<Button variant="tinted" colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Add
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.label}>
						<FormLabel>Label</FormLabel>
						<Input size="lg" {...register('label', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.amount}>
						<FormLabel>Amount</FormLabel>

						<InputGroup>
							<InputLeftElement pointerEvents="none" pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input type="number" size="lg" {...register('amount', { required: true })} />
						</InputGroup>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Flex align="center" gap={3} mt={6}>
						<Button size="lg" w="full" onClick={disclosure.onClose}>
							Close
						</Button>

						<Button type="submit" size="lg" w="full" colorScheme="brand" isLoading={isLoading}>
							Submit
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}
export const View = ({ unit, isUnitFetched, mutation, disclosure, isLoading, setIsLoading }) => {
	const onSubmit = (index) => {
		setIsLoading(true)

		mutation.mutate({
			maintenance: {
				remove: {
					index: index
				}
			}
		})
	}

	if (!isUnitFetched || !unit.company.id || !unit.schedule.start_date || !unit.schedule.due_date) return <Skeleton borderRadius={12} h={10} w="66px" />

	return (
		<Modal
			title="Maintenance"
			toggle={(onOpen) => (
				<Button variant="tinted" colorScheme="brand" onClick={onOpen}>
					View
				</Button>
			)}
			disclosure={disclosure}
		>
			<Flex direction="column" gap={6}>
				{unit.maintenance.map((data, index) => (
					<Flex justify="space-between" align="start" gap={6} key={index}>
						<Flex direction="column">
							<Text fontSize="sm" textTransform="capitalize" color="accent-1" noOfLines={1}>
								{data.label}
							</Text>

							<Text fontSize="sm" fontWeight="medium">
								₱{Number(data.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
							</Text>
						</Flex>

						<IconButton variant="tinted" size="sm" colorScheme="red" icon={<FiTrash size={14} />} onClick={() => onSubmit(index)} />
					</Flex>
				))}
			</Flex>
		</Modal>
	)
}
