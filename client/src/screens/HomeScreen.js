// @ Libraries
import React, { useEffect, Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

// @ Components
import HotGameCard from '../components/HotGameCard'

// @ Others
import { bggGetHotGames } from '../actions/gameActions'

// @ Main
const HomeScreen = () => {
	const dispatch = useDispatch()

	const hotGames = useSelector((state) => state.bggHotGames)
	const { loading, success, error, hotList } = hotGames

	useEffect(
		() => {
			dispatch(bggGetHotGames())
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

			{success && (
				<Grid container spacing={2}>
					{hotList.slice(0, 6).map((game) => (
						<Grid key={game.bggId} item xs={12} sm={6} md={4}>
							<HotGameCard bggId={game.bggId} />
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default HomeScreen
