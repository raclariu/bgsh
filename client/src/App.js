// @ Libraries
import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

// @ CSS
import './App.css'

// @ Mui
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'

// @ Components
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'

// @ Theme
import { light, dark } from './themePalette'

// @ Screens
const Home = lazy(() => import('./screens/HomeScreen'))
const Auth = lazy(() => import('./screens/AuthScreen'))
const Settings = lazy(() => import('./screens/SettingsScreen'))
const Profile = lazy(() => import('./screens/ProfileScreen'))
const Collection = lazy(() => import('./screens/CollectionScreen'))
const SellGames = lazy(() => import('./screens/SellGamesScreen'))
const TradeGames = lazy(() => import('./screens/TradeGamesScreen'))
const Wishlist = lazy(() => import('./screens/WishlistScreen'))
const GamesIndex = lazy(() => import('./screens/GamesIndexScreen'))
const SingleGame = lazy(() => import('./screens/SingleGameScreen'))
const SavedGames = lazy(() => import('./screens/SavedGamesScreen'))
const InboxReceived = lazy(() => import('./screens/InboxReceivedScreen'))
const InboxSent = lazy(() => import('./screens/InboxSentScreen'))
const ActiveGames = lazy(() => import('./screens/ActiveGamesScreen'))
const HistorySoldGames = lazy(() => import('./screens/HistorySoldGamesScreen'))
const HistoryTradedGames = lazy(() => import('./screens/HistoryTradedGamesScreen'))
const NotFound = lazy(() => import('./screens/NotFoundScreen'))

// @ Main
const App = () => {
	const theme = useSelector((state) => state.userPreferences.theme)

	return (
		<ThemeProvider theme={theme === 'light' ? light : dark}>
			<BrowserRouter>
				<CssBaseline />
				<Header />

				<Suspense fallback={<LinearProgress />}>
					<Container maxWidth="md" component="main">
						<Switch>
							<Route path="/" exact>
								<Home test={1} />
							</Route>

							<Route path={[ '/signin', '/signup' ]} exact>
								<Auth />
							</Route>

							<ProtectedRoute path="/profile" exact>
								<Profile />
							</ProtectedRoute>

							<ProtectedRoute path="/settings" exact>
								<Settings />
							</ProtectedRoute>

							<ProtectedRoute path="/games" exact>
								<GamesIndex />
							</ProtectedRoute>

							<ProtectedRoute path="/trades" exact>
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

							<ProtectedRoute path="/saved" exact>
								<SavedGames />
							</ProtectedRoute>

							<ProtectedRoute path="/inbox" exact>
								<InboxReceived />
							</ProtectedRoute>

							<ProtectedRoute path="/inbox/sent" exact>
								<InboxSent />
							</ProtectedRoute>

							<ProtectedRoute path="/history/active" exact>
								<ActiveGames />
							</ProtectedRoute>

							<ProtectedRoute path="/history/sold" exact>
								<HistorySoldGames />
							</ProtectedRoute>

							<ProtectedRoute path="/history/traded" exact>
								<HistoryTradedGames />
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

				<Footer />
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
