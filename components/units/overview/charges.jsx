import { useForm } from 'react-hook-form'
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Skeleton } from '@chakra-ui/react'
import Modal from 'components/_modal'

const Charges = ({ unit, isUnitFetched, mutation, disclosure, isLoading, setIsLoading }) => {
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
			monthly_rent: data.monthly_rent,
			camc: {
				amount: data.camc_amount
			},
			vat: {
				percent: data.vat_percent
			}
		})
	}

	if (!isUnitFetched || !unit.company.id || !unit.schedule.start_date || !unit.schedule.due_date) return <Skeleton borderRadius={12} h={10} w="59px" />

	return (
		<Modal
			title="Current Charges"
			toggle={(onOpen) => (
				<Button variant="tinted" colorScheme="brand" onClick={() => clearErrors() || reset() || onOpen()}>
					Edit
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.monthly_rent}>
						<FormLabel>Monthly Rent</FormLabel>

						<InputGroup>
							<InputLeftElement pointerEvents="none" pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input type="number" defaultValue={unit.monthly_rent} size="lg" {...register('monthly_rent', { required: true })} />
						</InputGroup>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.camc_amount}>
						<FormLabel>CAMC</FormLabel>

						<InputGroup>
							<InputLeftElement pointerEvents="none" pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input type="number" defaultValue={unit.camc.amount} size="lg" {...register('camc_amount', { required: true })} />
						</InputGroup>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.vat_percent}>
						<FormLabel>Value-added Tax</FormLabel>

						<InputGroup>
							<InputLeftElement pointerEvents="none" pt={1} pl={1}>
								%
							</InputLeftElement>

							<Input type="number" defaultValue={unit.vat.percent} size="lg" {...register('vat_percent', { required: true })} />
						</InputGroup>

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

export default Charges
