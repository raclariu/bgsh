import React from 'react'
import './App.css'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'

import { light, dark } from './themePalette'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePageScreen from './screens/HomePageScreen'
import AuthScreen from './screens/AuthScreen'
import SettingsScreen from './screens/SettingsScreen'
import ProfileScreen from './screens/ProfileScreen'
import CollectionScreen from './screens/CollectionScreen'
import SellGamesScreen from './screens/SellGamesScreen'
import TradeGamesScreen from './screens/TradeGamesScreen'
import WishlistScreen from './screens/WishlistScreen'
import ProtectedRoute from './components/ProtectedRoute'
import GamesIndexScreen from './screens/GamesIndexScreen'
import SingleGameScreen from './screens/SingleGameScreen'
import SavedGamesScreen from './screens/SavedGamesScreen'
import MyActiveGamesScreen from './screens/MyActiveGamesScreen'
import HistorySoldGamesScreen from './screens/HistorySoldGamesScreen'
import HistoryTradedGamesScreen from './screens/HistoryTradedGamesScreen'

const App = () => {
	const theme = useSelector((state) => state.userPreferences.theme)

	return (
		<ThemeProvider theme={theme === 'light' ? light : dark}>
			<BrowserRouter>
				<CssBaseline />
				<Header />

				<Container maxWidth="md" component="main">
					<Route path="/" exact>
						<HomePageScreen test={1} />
					</Route>

					<Route path={[ '/signin', '/signup' ]} exact>
						<AuthScreen />
					</Route>

					<ProtectedRoute path="/profile" exact>
						<ProfileScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/settings" exact>
						<SettingsScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/games" exact>
						<GamesIndexScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/trades" exact>
						<GamesIndexScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/games/:altId" exact>
						<SingleGameScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/collection" exact>
						<CollectionScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/wishlist" exact>
						<WishlistScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/sell" exact>
						<SellGamesScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/trade" exact>
						<TradeGamesScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/saved" exact>
						<SavedGamesScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/history/active" exact>
						<MyActiveGamesScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/history/sold" exact>
						<HistorySoldGamesScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/history/traded" exact>
						<HistoryTradedGamesScreen />
					</ProtectedRoute>

					<ProtectedRoute path="/signout" exact>
						<Redirect to="/" />
					</ProtectedRoute>
				</Container>

				<Footer />
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
