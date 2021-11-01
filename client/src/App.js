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
const AddWantedGames = lazy(() => import('./screens/AddWantedGamesScreen'))
const Wishlist = lazy(() => import('./screens/WishlistScreen'))
const GamesIndex = lazy(() => import('./screens/GamesIndexScreen'))
const WantedGamesIndex = lazy(() => import('./screens/WantedGamesIndexScreen'))
const SingleGame = lazy(() => import('./screens/SingleGameScreen'))
const SavedGames = lazy(() => import('./screens/SavedGamesScreen'))
const Inbox = lazy(() => import('./screens/InboxScreen'))
const ListedGames = lazy(() => import('./screens/ListedGamesScreen'))
const HistorySoldGames = lazy(() => import('./screens/HistorySoldGamesScreen'))
const HistoryTradedGames = lazy(() => import('./screens/HistoryTradedGamesScreen'))
const HotGames = lazy(() => import('./screens/HotGamesScreen'))
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
								<Home />
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

							<ProtectedRoute path="/wanted" exact>
								<WantedGamesIndex />
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

							<ProtectedRoute path="/saved" exact>
								<SavedGames />
							</ProtectedRoute>

							<ProtectedRoute path="/received" exact>
								<Inbox />
							</ProtectedRoute>

							<ProtectedRoute path="/sent" exact>
								<Inbox />
							</ProtectedRoute>

							<ProtectedRoute path="/listed" exact>
								<ListedGames />
							</ProtectedRoute>

							<ProtectedRoute path="/history/sold" exact>
								<HistorySoldGames />
							</ProtectedRoute>

							<ProtectedRoute path="/history/traded" exact>
								<HistoryTradedGames />
							</ProtectedRoute>

							<ProtectedRoute path="/hot" exact>
								<HotGames />
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
