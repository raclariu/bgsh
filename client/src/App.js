// @ Libraries
import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect, Switch, useLocation } from 'react-router-dom'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { isMobile } from 'react-device-detect'
import CssBaseline from '@mui/material/CssBaseline'

// @ CSS
import './css/App.css'

// @ Mui
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'

// @ Icons
import ClearIcon from '@mui/icons-material/Clear'

// @ Components
import CustomIconBtn from './components/CustomIconBtn'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header/Header'
import Footer from './components/Footer'

// @ Hooks
import { SnackbarProvider } from 'notistack'

// @ Theme
import { light, dark } from './constants/themes'

// @ Screens
const Home = lazy(() => import('./screens/HomeScreen'))
const Start = lazy(() => import('./screens/StartScreen'))
const LogIn = lazy(() => import('./screens/LogInScreen'))
const CreateAccount = lazy(() => import('./screens/CreateAccountScreen'))
const Settings = lazy(() => import('./screens/SettingsScreen'))
const Collection = lazy(() => import('./screens/CollectionScreen'))
const SellGames = lazy(() => import('./screens/SellGamesScreen'))
const AuctionGames = lazy(() => import('./screens/AuctionGamesScreen'))
const TradeGames = lazy(() => import('./screens/TradeGamesScreen'))
const AddWantedGames = lazy(() => import('./screens/AddWantedGamesScreen'))
const BuyGames = lazy(() => import('./screens/BuyGamesScreen'))
const Wishlist = lazy(() => import('./screens/WishlistScreen'))
const GamesIndex = lazy(() => import('./screens/GamesIndexScreen'))
const SingleGame = lazy(() => import('./screens/SingleGameScreen'))
const SavedGames = lazy(() => import('./screens/SavedGamesScreen'))
const Inbox = lazy(() => import('./screens/InboxScreen'))
const MyListedGames = lazy(() => import('./screens/MyListedGamesScreen'))
const GamesHistory = lazy(() => import('./screens/GamesHistoryScreen'))
const HotGames = lazy(() => import('./screens/HotGamesScreen'))
const UserProfile = lazy(() => import('./screens/UserProfileScreen'))
const NotFound = lazy(() => import('./screens/NotFoundScreen'))

// @ Main
const App = () => {
	const theme = useSelector((state) => state.userPreferences.theme)

	const location = useLocation()
	const notistackRef = React.createRef()
	const onClickDismiss = (key) => () => {
		notistackRef.current.closeSnackbar(key)
	}

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme === 'light' ? light : dark}>
				<SnackbarProvider
					maxSnack={3}
					dense={isMobile ? true : false}
					ref={notistackRef}
					action={(key) => (
						<CustomIconBtn size="small" onClick={onClickDismiss(key)}>
							<ClearIcon fontSize="small" />
						</CustomIconBtn>
					)}
				>
					<CssBaseline />
					{location.pathname !== '/login' && location.pathname !== '/create-account' && <Header />}

					<Suspense fallback={<LinearProgress />}>
						<Container
							maxWidth="md"
							component="main"
							sx={{
								py : 4
							}}
							// sx={{
							// 	minHeight     : 'calc(100% - 244px)',
							// 	paddingTop    : '32px',
							// 	paddingBottom : '32px'
							// }}
						>
							<Switch>
								<Route path="/" exact>
									<Home />
								</Route>

								<Route path="/start" exact>
									<Start />
								</Route>

								<Route path="/login" exact>
									<LogIn />
								</Route>

								<Route path="/activate/:tokenUid" exact>
									<LogIn />
								</Route>

								<Route path="/create-account" exact>
									<CreateAccount />
								</Route>

								<ProtectedRoute path="/user/settings" exact>
									<Settings />
								</ProtectedRoute>

								<ProtectedRoute path="/games" exact>
									<GamesIndex />
								</ProtectedRoute>

								<ProtectedRoute path="/trades" exact>
									<GamesIndex />
								</ProtectedRoute>

								<ProtectedRoute path="/wanted" exact>
									<GamesIndex />
								</ProtectedRoute>

								<ProtectedRoute path="/games/:altId" exact>
									<SingleGame />
								</ProtectedRoute>

								<ProtectedRoute path="/collection" exact>
									<Collection />
								</ProtectedRoute>

								<ProtectedRoute path="/wishlist" exact>
									<Wishlist />
								</ProtectedRoute>

								<ProtectedRoute path="/sell" exact>
									<SellGames />
								</ProtectedRoute>

								<ProtectedRoute path="/auction" exact>
									<AuctionGames />
								</ProtectedRoute>

								<ProtectedRoute path="/trade" exact>
									<TradeGames />
								</ProtectedRoute>

								<ProtectedRoute path="/want" exact>
									<AddWantedGames />
								</ProtectedRoute>

								<ProtectedRoute path="/buy" exact>
									<BuyGames />
								</ProtectedRoute>

								<ProtectedRoute path="/saved" exact>
									<SavedGames />
								</ProtectedRoute>

								<ProtectedRoute path="/received" exact>
									<Inbox />
								</ProtectedRoute>

								<ProtectedRoute path="/sent" exact>
									<Inbox />
								</ProtectedRoute>

								<ProtectedRoute path="/user/listed" exact>
									<MyListedGames />
								</ProtectedRoute>

								<ProtectedRoute path="/user/history/sold" exact>
									<GamesHistory />
								</ProtectedRoute>

								<ProtectedRoute path="/user/history/traded" exact>
									<GamesHistory />
								</ProtectedRoute>

								<ProtectedRoute path="/user/history/bought" exact>
									<GamesHistory />
								</ProtectedRoute>

								<ProtectedRoute path="/hot" exact>
									<HotGames />
								</ProtectedRoute>

								<ProtectedRoute path="/profile/:username" exact>
									<UserProfile />
								</ProtectedRoute>

								<ProtectedRoute path="/logout" exact>
									<Redirect to="/" />
								</ProtectedRoute>

								<Route>
									<NotFound />
								</Route>
							</Switch>
						</Container>
					</Suspense>

					{location.pathname !== '/login' && location.pathname !== '/create-account' && <Footer />}
				</SnackbarProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	)
}

export default App
