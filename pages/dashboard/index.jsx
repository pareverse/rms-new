import NextHead from 'next/head'
import { Container, Grid, GridItem } from '@chakra-ui/react'
import Statistics from 'components/dashboard/statistics'
import Payments from 'components/dashboard/payments'
import Duedate from 'components/dashboard/duedate'
import Accounts from 'components/dashboard/accounts'

const Dashboard = () => {
	return (
		<>
			<NextHead>
				<title>Dashboard</title>
			</NextHead>

			<Container>
				<Grid templateColumns="repeat(12, 1fr)" gap={6}>
					<Statistics />

					<GridItem colSpan={12}>
						<Payments />
					</GridItem>

					<GridItem colSpan={{ base: 12, xl: 7 }}>
						<Duedate />
					</GridItem>

					<GridItem colSpan={{ base: 12, xl: 5 }}>
						<Accounts />
					</GridItem>
				</Grid>
			</Container>
		</>
	)
}

Dashboard.authentication = {
	authorized: 'Admin'
}

export default Dashboard
