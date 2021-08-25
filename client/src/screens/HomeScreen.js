// @ Libraries
import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

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
			{success && (
				<Grid container spacing={2}>
					{hotList.map((item) => (
						<Grid item key={item.bggId} xs={12} md={4}>
							<Box
								bgcolor="background.paper"
								height="100%"
								p={1}
								boxShadow={2}
								borderRadius={4}
								display="flex"
								flexDirection="column"
								justifyContent="center"
								alignItems="center"
							>
								<img src={item.thumbnail} alt={item.title} />
								<Box>{item.title}</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default HomeScreen
