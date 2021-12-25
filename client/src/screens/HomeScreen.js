// @ Libraries
import React, { useEffect, Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LazyLoad from 'react-lazyload'
import axios from 'axios'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// @ Components
import HotGameCard from '../components/HotGameCard'
import KsCard from '../components/KsCard'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { apiFetchHotGames, fetchKickstarters } from '../api/api'

// @ Main
const HomeScreen = () => {
	const dispatch = useDispatch()

	const options = {
		refetchOnWindowFocus : false,
		refetchOnMount       : false,
		refetchOnReconnect   : false,
		staleTime            : 1000 * 60 * 60
	}

	const {
		isLoading : isLoadingHotGames,
		error     : errorHotGames,
		data      : hotGamesList,
		isSuccess : isSuccessHotGames
	} = useQuery([ 'hotGames' ], apiFetchHotGames, options)

	const { isLoading: isLoadingKs, error: errorKs, data: ksList, isSuccess: isSuccessKs } = useQuery(
		[ 'kickstarters' ],
		fetchKickstarters,
		options
	)

	if (errorHotGames) {
		console.log(errorHotGames.response)
	}

	return (
		<Fragment>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				width="100%"
				bgcolor="primary.main"
				color="primary.contrastText"
				fontWeight="fontWeightMedium"
				fontSize={14}
				p={1}
				borderRadius="4px"
				my={4}
			>
				<Box>BGG Hot games</Box>
				{!errorHotGames && (
					<Button component={RouterLink} to="/hot" variant="outlined" size="small" color="inherit">
						See all
					</Button>
				)}
			</Box>

			{errorHotGames && <CustomAlert>{errorHotGames.response.data.message}</CustomAlert>}

			{isLoadingHotGames && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccessHotGames && (
				<Grid container spacing={2}>
					{hotGamesList.slice(0, 6).map((data) => (
						<Grid key={data.bggId} item xs={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<HotGameCard data={data} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}

			<Box
				display="flex"
				alignItems="center"
				width="100%"
				bgcolor="primary.main"
				color="primary.contrastText"
				fontWeight="fontWeightMedium"
				fontSize={14}
				p={1}
				borderRadius="4px"
				my={4}
			>
				<Box>Popular kickstarters</Box>
			</Box>

			{errorKs && <CustomAlert>{errorKs.response.data.message}</CustomAlert>}

			{isLoadingKs && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccessKs && (
				<Grid container spacing={2}>
					{ksList.map((data) => (
						<Grid key={data.ksId} item xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<KsCard data={data} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default HomeScreen
