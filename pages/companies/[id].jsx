import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Container, Grid, GridItem } from '@chakra-ui/react'
import Profile from 'components/companies/profile'
import Tenants from 'components/companies/tenants'
import SOA from 'components/companies/soa'
import Payments from 'components/companies/payments'

const Company = () => {
	const router = useRouter()
	const { id } = router.query
	const { data: company, isFetched: isCompanyFetched } = useQuery(['company', id], () => api.get('/companies', id))

	return (
		<Container>
			<Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} alignItems="start" gap={6}>
				<GridItem display="grid" gap={6}>
					<Profile id={id} company={company} isCompanyFetched={isCompanyFetched} />
					<Tenants id={id} company={company} isCompanyFetched={isCompanyFetched} />
				</GridItem>

				<GridItem display="grid" gap={6}>
					<SOA id={id} company={company} isCompanyFetched={isCompanyFetched} />
					<Payments />
				</GridItem>
			</Grid>
		</Container>
	)
}

Company.authentication = {
	authorized: 'Admin'
}

export default Company
