// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Grid from '@material-ui/core/Grid'

// @ Components
import HotGameCard from '../components/HotGameCard'

// @ Others
import { bggGetHotGames } from '../actions/gameActions'

// @ Styles
const useStyles = makeStyles((theme) => ({
	grid : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	}
}))

// @ Main
const HotGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const hotGames = useSelector((state) => state.bggHotGames)
	const { loading, success, error, hotList } = hotGames

	useEffect(
		() => {
			if (!hotList) {
				dispatch(bggGetHotGames())
			}
		},
		[ hotList, dispatch ]
	)

	return (
		<Fragment>
			{success && (
				<Grid container className={cls.grid} spacing={2}>
					{hotList.map((game) => (
						<Grid key={game.bggId} item xs={12} sm={6} md={4}>
							<HotGameCard bggId={game.bggId} />
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default HotGamesScreen
