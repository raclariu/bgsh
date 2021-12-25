// @ Libraries
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import { useQuery } from 'react-query'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// @ Components
import UserProfileGameCard from '../components/UserProfileScreen/UserProfileGameCard'
import CustomAlert from '../components/CustomAlert'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'

// @ Others
import { getUserProfileData } from '../actions/userActions'
import { apiGetProfileData } from '../api/api'

// @ Main
const UserProfileScreen = () => {
	const dispatch = useDispatch()
	const { username } = useParams()

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'profile', { username } ],
		() => apiGetProfileData(username),
		{
			staleTime : 1000 * 60 * 5
		}
	)

	console.log(data)

	const [ tab, setTab ] = useState('sale')

	const handleChange = (e, val) => {
		setTab(val)
	}

	return (
        <Fragment>
			{isError && <Box>{error.response.data.message}</Box>}

			<Box borderRadius="4px" boxShadow={2} my={2} bgcolor="background.paper">
				<Tabs value={tab} centered indicatorColor="primary" textColor="primary" onChange={handleChange}>
					<Tab value="sale" label="For sale" />
					<Tab value="trade" label="For trade" />
					<Tab value="wanted" label="Wanted" />
				</Tabs>
			</Box>

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{tab === 'sale' && (
				<Fragment>
					{isSuccess &&
					data.saleGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{isSuccess &&
							data.saleGames.map((data) => (
								<Grid item key={data._id} md={4} sm={6} xs={12}>
									<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
										<UserProfileGameCard data={data} />
									</LazyLoad>
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'trade' && (
				<Fragment>
					{isSuccess &&
					data.tradeGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{isSuccess &&
							data.tradeGames.map((data) => (
								<Grid item key={data._id} md={4} sm={6} xs={12}>
									<UserProfileGameCard data={data} />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'wanted' && (
				<Fragment>
					{isSuccess &&
					data.wantedGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}

					<Grid container spacing={3}>
						{isSuccess &&
							data.wantedGames.map((data) => (
								<Grid item key={data._id} md={4} sm={6} xs={12}>
									<UserProfileGameCard data={data} />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}
		</Fragment>
    );
}

export default UserProfileScreen
