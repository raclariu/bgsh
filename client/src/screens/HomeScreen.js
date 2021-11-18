// @ Libraries
import React, { useEffect, Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LazyLoad from 'react-lazyload'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

// @ Components
import HotGameCard from '../components/HotGameCard'
import KsCard from '../components/KsCard'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'

// @ Others
import { bggGetHotGames } from '../actions/gameActions'
import { getKickstarters } from '../actions/miscActions'

// @ Main
const HomeScreen = () => {
	const dispatch = useDispatch()

	const hotGames = useSelector((state) => state.bggHotGames)
	const { loading, success, error, hotList } = hotGames

	const kickstarters = useSelector((state) => state.kickstartersList)
	const { loading: loadingKs, success: successKs, error: errorKs, ksList } = kickstarters

	useEffect(
		() => {
			dispatch(bggGetHotGames())
			dispatch(getKickstarters())
		},
		[ dispatch ]
	)

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
				p={2}
				borderRadius={4}
				boxShadow={2}
				my={4}
			>
				<Box>BGG Hot games</Box>
				<Button component={RouterLink} to="/hot" variant="outlined" color="inherit">
					See all
				</Button>
			</Box>

			{loading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{success && (
				<Grid container spacing={2}>
					{hotList.slice(0, 6).map((game) => (
						<Grid key={game.bggId} item xs={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<HotGameCard bggId={game.bggId} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}

			{successKs && (
				<Grid container spacing={2}>
					{ksList.map((ks) => (
						<Grid key={ks.bggId} item xs={12} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<KsCard ksId={ks.ksId} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default HomeScreen
