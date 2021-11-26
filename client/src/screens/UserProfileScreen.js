// @ Libraries
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import LazyLoad from 'react-lazyload'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// @ Components
import UserProfileGameCard from '../components/UserProfileScreen/UserProfileGameCard'
import CustomAlert from '../components/CustomAlert'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'

// @ Others
import { getUserProfileData } from '../actions/userActions'

// @ Main
const UserProfileScreen = () => {
	const dispatch = useDispatch()
	const { username } = useParams()

	const [ tab, setTab ] = useState('sale')

	const userProfileData = useSelector((state) => state.userProfileData)
	const { loading, success, error, saleGames, tradeGames, wantedGames } = userProfileData

	useEffect(
		() => {
			dispatch(getUserProfileData(username))
		},
		[ dispatch, username ]
	)

	const handleChange = (e, val) => {
		setTab(val)
	}

	return (
		<Fragment>
			{error && <Box>{error}</Box>}

			<Box borderRadius={4} boxShadow={2} my={2} bgcolor="background.paper">
				<Tabs value={tab} centered indicatorColor="primary" textColor="primary" onChange={handleChange}>
					<Tab value="sale" label="For sale" />
					<Tab value="trade" label="For trade" />
					<Tab value="wanted" label="Wanted" />
				</Tabs>
			</Box>

			{loading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{tab === 'sale' && (
				<Fragment>
					{success && saleGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{success &&
							saleGames.map((listedGame) => (
								<Grid item key={listedGame._id} md={4} sm={6} xs={12}>
									<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
										<UserProfileGameCard gameId={listedGame._id} slice="sale" />
									</LazyLoad>
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'trade' && (
				<Fragment>
					{success && tradeGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{success &&
							tradeGames.map((listedGame) => (
								<Grid item key={listedGame._id} md={4} sm={6} xs={12}>
									<UserProfileGameCard gameId={listedGame._id} slice="trade" />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'wanted' && (
				<Fragment>
					{success &&
					wantedGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}

					<Grid container spacing={3}>
						{success &&
							wantedGames.map((listedGame) => (
								<Grid item key={listedGame._id} md={4} sm={6} xs={12}>
									<UserProfileGameCard gameId={listedGame._id} slice="wanted" />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}
		</Fragment>
	)
}

export default UserProfileScreen
