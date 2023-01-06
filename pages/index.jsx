import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Container, Grid, GridItem } from '@chakra-ui/react'
import Profile from 'components/companies/profile'
import Tenants from 'components/companies/tenants'
import SOA from 'components/companies/soa'
import Payments from 'components/companies/payments'
import Hero from 'components/hero'

const Home = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const id = session?.user.company?.id
	const { data: company, isFetched: isCompanyFetched } = useQuery(['company'], () => api.get('/companies', session.user.company.id), { enabled: session?.user.company?.id ? true : false })

	if (session && session.user.role === 'Tenant' && session.user.company.id) {
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

	if (session && session.user.role === 'Tenant' && !session.user.company.id) {
		return <>tenant view no company assigned.</>
	}

	if (!session || (session && session.user.role === 'User')) {
		return (
			<Container>
				<Hero />
			</Container>
		)
	}
}

export default Home
