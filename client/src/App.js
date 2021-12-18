// @ Libraries
import React, { lazy, Suspense } from 'react'
import { SnackbarProvider } from 'notistack'
import { useSelector } from 'react-redux'
import { Route, Redirect, Switch, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'
import CssBaseline from '@material-ui/core/CssBaseline'

// @ CSS
import './fonts.css'

// @ Mui
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import IconButton from '@material-ui/core/IconButton'

// @ Icons
import ClearIcon from '@material-ui/icons/Clear'

// @ Components
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'

// @ Theme
import { light, dark } from './constants/themes'

// @ Screens
const Home = lazy(() => import('./screens/HomeScreen'))
const Auth = lazy(() => import('./screens/AuthScreen'))
const Settings = lazy(() => import('./screens/SettingsScreen'))
const Profile = lazy(() => import('./screens/ProfileScreen'))
const Collection = lazy(() => import('./screens/CollectionScreen'))
const SellGames = lazy(() => import('./screens/SellGamesScreen'))
const TradeGames = lazy(() => import('./screens/TradeGamesScreen'))
const AddWantedGames = lazy(() => import('./screens/AddWantedGamesScreen'))
const BuyGames = lazy(() => import('./screens/BuyGamesScreen'))
const Wishlist = lazy(() => import('./screens/WishlistScreen'))
const GamesIndex = lazy(() => import('./screens/GamesIndexScreen'))
const SingleGame = lazy(() => import('./screens/SingleGameScreen'))
const SavedGames = lazy(() => import('./screens/SavedGamesScreen'))
const Inbox = lazy(() => import('./screens/InboxScreen'))
const UserListedGames = lazy(() => import('./screens/UserListedGamesScreen'))
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
		<ThemeProvider theme={theme === 'light' ? light : dark}>
			<SnackbarProvider
				maxSnack={3}
				dense={isMobile ? true : false}
				ref={notistackRef}
				action={(key) => (
					<IconButton color="inherit" size="small" onClick={onClickDismiss(key)}>
						<ClearIcon fontSize="small" />
					</IconButton>
				)}
			>
				<CssBaseline />
				{location.pathname !== '/signin' && location.pathname !== '/signup' && <Header />}

				<Suspense fallback={<LinearProgress />}>
					<Container maxWidth="md" component="main">
						<Switch>
							<Route path="/" exact>
								<Home />
							</Route>

							<Route path={[ '/signin', '/signup' ]} exact>
								<Auth />
							</Route>

							<ProtectedRoute path="/profile" exact>
								<Profile />
							</ProtectedRoute>

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
								<UserListedGames />
							</ProtectedRoute>

							<ProtectedRoute path="/user/history/sold" exact>
								<GamesHistory />
							</ProtectedRoute>

							<ProtectedRoute path="/user/history/traded" exact>
								<GamesHistory />
							</ProtectedRoute>

							<ProtectedRoute path="/hot" exact>
								<HotGames />
							</ProtectedRoute>

							<ProtectedRoute path="/profile/:username" exact>
								<UserProfile />
							</ProtectedRoute>

							<ProtectedRoute path="/signout" exact>
								<Redirect to="/" />
							</ProtectedRoute>

							<Route>
								<NotFound />
							</Route>
						</Switch>
					</Container>
				</Suspense>

				{location.pathname !== '/signin' && location.pathname !== '/signup' && <Footer />}
			</SnackbarProvider>
		</ThemeProvider>
	)
}

export default App
