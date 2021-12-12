// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import LazyLoad from 'react-lazyload'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'

// @ Mui
import Grid from '@material-ui/core/Grid'

// @ Components
import HotGameCard from '../components/HotGameCard'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { apiFetchHotGames } from '../api/api'

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

	const { isLoading, error, data, isSuccess } = useQuery([ 'hotGames' ], apiFetchHotGames, {
		staleTime : 1000 * 60 * 60
	})

	return (
		<Fragment>
			{isLoading && (
				<Grid container className={cls.grid} spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{error && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{isSuccess && (
				<Grid container className={cls.grid} spacing={2}>
					{data.map((data) => (
						<Grid key={data.bggId} item xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<HotGameCard data={data} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default HotGamesScreen
