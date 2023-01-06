import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Avatar, Button, chakra, Checkbox, Flex, Icon, IconButton, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { FiBox, FiLogOut, FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import Modal from 'components/_modal'

const Google = ({ size }) => {
	return (
		<svg height={size ? size : 24} width={size ? size : 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_14_430)">
				<path d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z" fill="#4285F4" />
				<path d="M12.2399 24.0008C15.4763 24.0008 18.2057 22.9382 20.1943 21.1039L16.3273 18.1055C15.2514 18.8375 13.8625 19.252 12.2443 19.252C9.11364 19.252 6.45922 17.1399 5.5068 14.3003H1.51636V17.3912C3.55347 21.4434 7.70265 24.0008 12.2399 24.0008V24.0008Z" fill="#34A853" />
				<path d="M5.50253 14.3003C4.99987 12.81 4.99987 11.1962 5.50253 9.70581V6.61487H1.51649C-0.18551 10.0056 -0.18551 14.0005 1.51649 17.3913L5.50253 14.3003V14.3003Z" fill="#FBBC04" />
				<path d="M12.2399 4.74966C13.9507 4.7232 15.6042 5.36697 16.8432 6.54867L20.2693 3.12262C18.0999 1.0855 15.2206 -0.034466 12.2399 0.000808666C7.70265 0.000808666 3.55347 2.55822 1.51636 6.61481L5.50239 9.70575C6.4504 6.86173 9.10923 4.74966 12.2399 4.74966V4.74966Z" fill="#EA4335" />
			</g>
			<defs>
				<clipPath id="clip0_14_430">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	)
}

const Header = ({ onSidebarOpen }) => {
	const router = useRouter()
	const disclosure = useDisclosure()
	const { data: session } = useSession()
	const { toggleColorMode } = useColorMode()
	const colorModeIcon = useColorModeValue(<FiMoon size={16} fill="currentColor" />, <FiSun size={16} fill="currentColor" />)
	const [isScrolling, setIsScrolling] = useState(false)
	const [agree, setAgree] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', () => {
				setIsScrolling(window.pageYOffset > 0)
			})
		}
	}, [])

	return (
		<chakra.header bg="white" position="sticky" top={0} shadow={isScrolling && 'sm'} transition=".4s" zIndex={99} _dark={{ bg: isScrolling ? 'surface' : 'system', border: 'none', shadow: isScrolling && 'dark-xl' }}>
			<Flex justify="space-between" align="center" gap={6} mx="auto" px={6} h={20} w="full" maxW={1280}>
				<Flex justify="start" align="center" gap={3}>
					{session && session.user.role === 'Admin' && <IconButton display={{ base: 'none', md: 'flex' }} variant="outline" color="accent-1" icon={<FiMenu size={16} />} onClick={onSidebarOpen} />}

					<Flex align="center" gap={2} color="accent-1">
						<Icon as={FiBox} boxSize={6} />

						<Text fontSize="lg" fontWeight="semibold">
							TSVJ CENTER
						</Text>
					</Flex>
				</Flex>

				<Flex display={{ base: 'none', md: 'flex' }} justify="end" align="center" gap={3}>
					{(!session || (session && session.user.role === 'User')) && (
						<Flex align="center" gap={8}>
							<NextLink href="/" passHref>
								<Link as="span" active={router.pathname === '/' ? 1 : 0}>
									Home
								</Link>
							</NextLink>

							<NextLink href="/blogs" passHref>
								<Link as="span" active={router.pathname.includes('blogs') ? 1 : 0}>
									Blogs
								</Link>
							</NextLink>

							<NextLink href="/company" passHref>
								<Link as="span" active={router.pathname.includes('company') ? 1 : 0}>
									Company
								</Link>
							</NextLink>

							<NextLink href="/contact" passHref>
								<Link as="span" active={router.pathname.includes('contact') ? 1 : 0}>
									Call Us
								</Link>
							</NextLink>
						</Flex>
					)}

					{session ? (
						<Flex align="center" gap={3}>
							<IconButton variant="ghost" icon={colorModeIcon} onClick={toggleColorMode} />

							<Menu>
								<MenuButton>
									<Avatar name={session.user.name} src={session.user.image} />
								</MenuButton>

								<MenuList w={256}>
									<MenuItem>
										<Flex align="center" gap={3}>
											<Avatar name={session.user.name} src={session.user.image} />

											<Text color="accent-1" noOfLines={1}>
												{session.user.name}
											</Text>
										</Flex>
									</MenuItem>

									<MenuDivider />

									<MenuItem icon={<FiLogOut size={16} />} onClick={() => signOut()}>
										Log out
									</MenuItem>
								</MenuList>
							</Menu>
						</Flex>
					) : (
						<Flex align="center" gap={3}>
							<IconButton variant="ghost" icon={colorModeIcon} onClick={toggleColorMode} />

							<Modal
								title="Terms & Conditions."
								size="lg"
								toggle={(onOpen) => (
									<Button colorScheme="brand" onClick={() => setAgree(false) || onOpen()}>
										Sign in
									</Button>
								)}
								disclosure={disclosure}
							>
								<Flex direction="column" gap={6}>
									<Text color="accent-1">
										The TSVJ Center welcomes you! These Terms of Use apply to your use of this site.
										<br />
										<br /> IF YOU DO NOT AGREE TO ALL OF THESE TERMS, DO NOT USE THIS SITE.
										<br />
										<br /> By using this website and agreeing to these terms, you are agreeing to our use and terms in accordance with the terms of our cookie policy.
										<br />
										<br /> The contents of the pages of this site are subject to change without notice and are provided for general information and use.
									</Text>

									<Checkbox onChange={() => (agree ? setAgree(false) : setAgree(true))}>I Agree to Terms and Condition.</Checkbox>

									<Button color="accent-1" size="lg" leftIcon={<Google size={20} />} disabled={!agree} onClick={() => signIn('google')}>
										Continue with Google
									</Button>
								</Flex>
							</Modal>
						</Flex>
					)}
				</Flex>

				<Flex display={{ base: 'flex', md: 'none' }} align="center" gap={3}>
					<IconButton variant="ghost" icon={colorModeIcon} onClick={toggleColorMode} />
					<IconButton variant="outline" color="accent-1" icon={<FiMenu size={16} />} onClick={onSidebarOpen} />
				</Flex>
			</Flex>
		</chakra.header>
	)
}

export default Header
