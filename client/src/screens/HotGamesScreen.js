// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import HotGameCard from '../components/HotGameCard'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'

// @ Others
import { apiFetchHotGames } from '../api/api'

// @ Main
const HotGamesScreen = () => {
	const dispatch = useDispatch()

	const { isLoading, error, data, isSuccess } = useQuery([ 'hotGames' ], apiFetchHotGames, {
		staleTime : 1000 * 60 * 60
	})

	return (
		<Fragment>
			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{error && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{isSuccess && (
				<Grid container spacing={2}>
					{data.map((data) => (
						<Grid key={data.bggId} item xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GameCardSkeleton />}>
								<HotGameCard data={data} />
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default HotGamesScreen
