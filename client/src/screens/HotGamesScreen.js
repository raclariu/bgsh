// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import LazyLoad from 'react-lazyload'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'

// @ Components
import HotGameCard from '../components/HotGameCard'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { apiFetchHotGames } from '../api/api'

const PREFIX = 'HotGamesScreen'

const classes = {
	grid : `${PREFIX}-grid`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
	[`& .${classes.grid}`]: {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	}
}))

// @ Main
const HotGamesScreen = () => {
	const dispatch = useDispatch()

	const { isLoading, error, data, isSuccess } = useQuery([ 'hotGames' ], apiFetchHotGames, {
		staleTime : 1000 * 60 * 60
	})

	return (
		<Root>
			{isLoading && (
				<Grid container className={classes.grid} spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{error && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{isSuccess && (
				<Grid container className={classes.grid} spacing={2}>
					{data.map((data) => (
						<Grid key={data.bggId} item xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<HotGameCard data={data} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}
		</Root>
	)
}

export default HotGamesScreen
