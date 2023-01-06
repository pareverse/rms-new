import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { chakra, Container, Flex, Grid, GridItem, Text } from '@chakra-ui/react'

const Print = () => {
	const router = useRouter()
	const { id } = router.query
	const { data: soa, isFetched: isSoaFetched } = useQuery(['soa', id], () => api.get('/soa', id))
	const { data: company, isFetched: isCompanyFetched } = useQuery(['company', id], () => api.get('/companies', soa.company.id), { enabled: isSoaFetched })
	const { data: unit, isFetched: isUnitFetched } = useQuery(['unit', id], () => api.get('/units', soa.unit.id), { enabled: isCompanyFetched })

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const months2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

	if (!isSoaFetched || !isCompanyFetched || !isUnitFetched) return null

	return (
		<chakra.div bg="white" mx="auto" my={6} h="full" minH="100vh" w="992px" color="black">
			<Container>
				<Grid templateColumns="1fr" gap={6}>
					<GridItem>
						<Flex direction="column">
							<Text fontSize="sm" fontWeight="semibold">
								TSVJ Management Corp
							</Text>

							<Text fontSize="sm" fontWeight="semibold">
								Lot 6, Crispina Avenue, Pamplona Tes Las Pinas City
							</Text>

							<Text fontSize="sm" fontWeight="semibold">
								VAT TIN 010-357-903-000
							</Text>
						</Flex>
					</GridItem>

					<Grid templateColumns="1fr 1fr 1fr" border="1px solid black" p={3}>
						<GridItem>
							<Text fontSize="sm" fontWeight="semibold">
								TSVJ Center Unit No.
							</Text>

							<Text fontSize="sm" fontWeight="semibold">
								Lessee
							</Text>
						</GridItem>

						<GridItem>
							<Text fontSize="sm" fontWeight="medium">
								{unit.number}
							</Text>

							<Text fontSize="sm" fontWeight="medium">
								{company.name}
							</Text>
						</GridItem>
					</Grid>

					<Grid templateColumns="3fr 1fr 1fr" border="1px solid black">
						<GridItem colSpan={3} borderBottom="1px solid black">
							<Flex align="center" direction="column" p={3}>
								<Text fontSize="md" fontWeight="semibold">
									STATEMENT OF ACCOUNT
								</Text>
								<Text fontSize="sm" fontWeight="semibold"></Text>
								{months[soa.schedule.start_date.split('-')[1] - 1]} {soa.schedule.start_date.split('-')[2]}, {soa.schedule.start_date.split('-')[0]}
							</Flex>
						</GridItem>

						<GridItem display="grid" justifyContent="center" borderRight="1px solid black" borderBottom="1px solid black" p={3}>
							<Text fontSize="sm" fontWeight="semibold">
								Particulars
							</Text>
						</GridItem>

						<GridItem display="grid" justifyContent="center" borderRight="1px solid black" borderBottom="1px solid black" p={3}>
							<Text fontSize="sm" fontWeight="semibold">
								Amount Due (in PHP)
							</Text>
						</GridItem>

						<GridItem display="grid" justifyContent="center" borderBottom="1px solid black" p={3}>
							<Text fontSize="sm" fontWeight="semibold">
								Remarks
							</Text>
						</GridItem>

						<GridItem display="grid" gap={3} borderRight="1px solid black" p={3}>
							<Text fontSize="sm" fontWeight="semibold">
								Current Charges
							</Text>

							<Flex direction="column">
								<Flex justify="space-between">
									<Text fontSize="sm" fontWeight="medium">
										1. Monthly Rent
									</Text>

									<Text fontSize="xs">
										(for the month of {months2[soa.schedule.start_date.split('-')[1] - 1]} {soa.schedule.start_date.split('-')[2]}, {soa.schedule.start_date.split('-')[0]} - {months2[soa.schedule.due_date.split('-')[1] - 1]} {soa.schedule.due_date.split('-')[2]}, {soa.schedule.due_date.split('-')[0]})
									</Text>
								</Flex>

								<Text fontSize="sm" fontWeight="medium">
									2. CAMC
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									Add: 12% VAT
								</Text>

								<Text fontSize="sm" fontWeight="semibold">
									Subtotal
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									3. Water Bill
								</Text>

								<Flex justify="space-between">
									<Text fontSize="sm" fontWeight="medium">
										Current Reading
									</Text>

									<Text fontSize="sm" fontWeight="medium">
										{soa.water_bill.current_reading.value}
									</Text>
								</Flex>

								<Flex justify="space-between">
									<Text fontSize="sm" fontWeight="medium">
										Previous Reading
									</Text>

									<Text fontSize="sm" fontWeight="medium">
										{soa.water_bill.previous_reading.value}
									</Text>
								</Flex>

								<Flex justify="space-between">
									<Text fontSize="sm" fontWeight="medium">
										Comsumption
									</Text>

									<Text fontSize="sm" fontWeight="medium">
										{Number(soa.water_bill.current_reading.value) - Number(soa.water_bill.previous_reading.value)}
									</Text>
								</Flex>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									4. Meralco Bill
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="semibold">
									Total Amount Due
								</Text>
							</Flex>
						</GridItem>

						<GridItem display="grid" justifyContent="end" alignItems="end" borderRight="1px solid black" p={3}>
							<Flex align="end" direction="column" w="full">
								<Text fontSize="sm" fontWeight="medium">
									{Number(soa.monthly_rent).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									{Number(soa.camc.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									{(Number(soa.monthly_rent) + Number(soa.camc.amount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									{((Number(soa.monthly_rent) + Number(soa.camc.amount)) * (Number(soa.vat.percent) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									{(Number(soa.monthly_rent) + Number(soa.camc.amount) + (Number(soa.monthly_rent) + Number(soa.camc.amount)) * (Number(soa.vat.percent) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									{Number(soa.water_bill.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="semibold">
									{Number(soa.total_amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
								</Text>
							</Flex>
						</GridItem>

						<GridItem display="grid" p={3}>
							<chakra.div w="full">
								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontStyle="italic">
									{months2[soa.water_bill.current_reading.date.split('-')[1] - 1]} {soa.water_bill.current_reading.date.split('-')[2]}, {soa.water_bill.current_reading.date.split('-')[0]} reading
								</Text>

								<Text fontSize="sm" fontStyle="italic">
									{months2[soa.water_bill.previous_reading.date.split('-')[1] - 1]} {soa.water_bill.previous_reading.date.split('-')[2]}, {soa.water_bill.previous_reading.date.split('-')[0]} reading
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontStyle="italic">
									Please pay directly to Meralco
								</Text>

								<Text fontSize="sm" fontWeight="medium">
									⠀
								</Text>

								<Text fontSize="sm" fontStyle="italic">
									Due on or before {months[soa.schedule.due_date.split('-')[1] - 1]} {soa.schedule.due_date.split('-')[2]}, {soa.schedule.due_date.split('-')[0]}
								</Text>
							</chakra.div>
						</GridItem>
					</Grid>

					<Text fontSize="sm">We hope you will find this in order. Please settle in cash or check payable to TSVJ Management Corp. or though online fund transfer to the account below. Please submit proof of payment to our office or via e-mail at tsvjmanagementcorp@gmail.com</Text>

					<Flex direction="column">
						<Text fontSize="sm" fontWeight="semibold">
							Account Name: <chakra.span fontWeight="medium">TSVJ Management Corp</chakra.span>
							<chakra.span ml="368px">09123456789</chakra.span>
						</Text>

						<Text fontSize="sm" fontWeight="semibold">
							Account Bank #1: <chakra.span fontWeight="medium">Banco De Oro (BDO) checking account</chakra.span>
							<chakra.span ml="256px">09123456789</chakra.span>
						</Text>

						<Text fontSize="sm" fontWeight="semibold">
							Account Bank #2: <chakra.span fontWeight="medium">Union Bank checking account</chakra.span>
						</Text>
					</Flex>

					<Text fontSize="sm">Please let us know if you have any concerns.</Text>

					<Text></Text>

					<Flex justify="center" borderTop="1px solid black" w={256}>
						<Text fontSize="sm" fontWeight="semibold">
							Authorized Signatory
						</Text>
					</Flex>
				</Grid>
			</Container>
		</chakra.div>
	)
}

export default Print
