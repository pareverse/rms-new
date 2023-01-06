import { useState } from 'react'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppProvider from 'components/_app'

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
	const [queryClient] = useState(() => new QueryClient())
	const layout = Component.layout || ((page) => page)

	return (
		<>
			<Head>
				<title>TSVJ CENTER</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="description" content="" />
				<link rel="icon" type="image/png" size="96x96" href="favicon.ico" />
			</Head>

			<SessionProvider session={session}>
				<QueryClientProvider client={queryClient}>
					<Hydrate state={pageProps.dehydratedState}>
						<PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
							<AppProvider active={true} authentication={Component.authentication}>
								{layout(<Component {...pageProps} />)}
							</AppProvider>
						</PayPalScriptProvider>
					</Hydrate>
				</QueryClientProvider>
			</SessionProvider>
		</>
	)
}

export default App
