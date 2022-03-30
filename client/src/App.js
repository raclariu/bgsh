// @ Modules
import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Route, Navigate, Routes, useLocation } from 'react-router-dom'
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
const Dashboard = lazy(() => import('./screens/DashboardScreen'))
const LogIn = lazy(() => import('./screens/LogInScreen'))
const CreateAccount = lazy(() => import('./screens/CreateAccountScreen'))
const Settings = lazy(() => import('./screens/SettingsScreen'))
const Collection = lazy(() => import('./screens/CollectionScreen'))
const SellGames = lazy(() => import('./screens/SellGamesScreen'))
const TradeGames = lazy(() => import('./screens/TradeGamesScreen'))
const AddWantedGames = lazy(() => import('./screens/AddWantedGamesScreen'))
const BuyGames = lazy(() => import('./screens/BuyGamesScreen'))
const Wishlist = lazy(() => import('./screens/WishlistScreen'))
const GamesIndex = lazy(() => import('./screens/GamesIndexScreen'))
const SingleGame = lazy(() => import('./screens/SingleGameScreen'))
const SavedGames = lazy(() => import('./screens/SavedGamesScreen'))
const Messages = lazy(() => import('./screens/MessagesScreen'))
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

					<Suspense fallback={<LinearProgress />}>
						{location.pathname !== '/login' && location.pathname !== '/create-account' && <Header />}

						<Container
							maxWidth="md"
							component="main"
							sx={{
								display       : 'flex',
								flexDirection : 'column',
								pt            : 4,
								pb            : 8,
								minHeight     :
									location.pathname !== '/login' && location.pathname !== '/create-account'
										? 'calc(100% - 155px)'
										: '100%'
							}}
						>
							<Routes>
								<Route index path="/" element={<Home />} />

								<Route path="dashboard" element={<Dashboard />} />

								<Route path="login" element={<LogIn isActivationPage={false} />} />

								<Route path="activate/:tokenUid" element={<LogIn isActivationPage={true} />} />

								<Route path="create-account" element={<CreateAccount />} />

								<Route
									path="sales"
									element={
										<ProtectedRoute>
											<GamesIndex mode="sell" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="trades"
									element={
										<ProtectedRoute>
											<GamesIndex mode="trade" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="wanted"
									element={
										<ProtectedRoute>
											<GamesIndex mode="want" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="sales/:altId"
									element={
										<ProtectedRoute>
											<SingleGame />
										</ProtectedRoute>
									}
								/>

								<Route
									path="trades/:altId"
									element={
										<ProtectedRoute>
											<SingleGame />
										</ProtectedRoute>
									}
								/>

								<Route
									path="collection"
									element={
										<ProtectedRoute>
											<Collection />
										</ProtectedRoute>
									}
								/>

								<Route
									path="wishlist"
									element={
										<ProtectedRoute>
											<Wishlist />
										</ProtectedRoute>
									}
								/>

								<Route
									path="sell"
									element={
										<ProtectedRoute>
											<SellGames />
										</ProtectedRoute>
									}
								/>

								<Route
									path="trade"
									element={
										<ProtectedRoute>
											<TradeGames />
										</ProtectedRoute>
									}
								/>

								<Route
									path="want"
									element={
										<ProtectedRoute>
											<AddWantedGames />
										</ProtectedRoute>
									}
								/>

								<Route
									path="buy"
									element={
										<ProtectedRoute>
											<BuyGames />
										</ProtectedRoute>
									}
								/>

								<Route
									path="saved"
									element={
										<ProtectedRoute>
											<SavedGames />
										</ProtectedRoute>
									}
								/>

								<Route
									path="received"
									element={
										<ProtectedRoute>
											<Messages type="received" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="sent"
									element={
										<ProtectedRoute>
											<Messages type="sent" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="settings"
									element={
										<ProtectedRoute>
											<Settings />
										</ProtectedRoute>
									}
								/>

								<Route
									path="user/settings"
									element={
										<ProtectedRoute>
											<Settings />
										</ProtectedRoute>
									}
								/>

								<Route
									path="user/listed"
									element={
										<ProtectedRoute>
											<MyListedGames />
										</ProtectedRoute>
									}
								/>

								<Route
									path="user/history/sold"
									element={
										<ProtectedRoute>
											<GamesHistory mode="sell" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="user/history/traded"
									element={
										<ProtectedRoute>
											<GamesHistory mode="trade" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="user/history/bought"
									element={
										<ProtectedRoute>
											<GamesHistory mode="buy" />
										</ProtectedRoute>
									}
								/>

								<Route
									path="profile/:username"
									element={
										<ProtectedRoute>
											<UserProfile />
										</ProtectedRoute>
									}
								/>

								<Route
									path="hot"
									element={
										<ProtectedRoute>
											<HotGames />
										</ProtectedRoute>
									}
								/>

								<Route
									path="logout"
									element={
										<ProtectedRoute>
											<Navigate to="/" />
										</ProtectedRoute>
									}
								/>

								<Route path="*" element={<NotFound />} />
							</Routes>
						</Container>

						{location.pathname !== '/login' && location.pathname !== '/create-account' && <Footer />}
					</Suspense>
				</SnackbarProvider>
			</ThemeProvider>
		</StyledEngineProvider>
	)
}

export default App
