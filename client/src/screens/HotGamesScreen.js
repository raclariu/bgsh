// @ Libraries
import React, { Fragment, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'

// @ Components
import HotGameCard from '../components/HotGameCard'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'

// @ Others
import { apiFetchHotGames } from '../api/api'

// @ Main
const HotGamesScreen = () => {
	const { isFetching, error, data, isSuccess } = useQuery([ 'hotGames' ], apiFetchHotGames, {
		staleTime : 1000 * 60 * 60
	})

	return (
		<Fragment>
			{isFetching && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid item key={k} xs={12} sm={6} md={4}>
							<GeneralCardSkeleton />
						</Grid>
					))}
				</Grid>
			)}

			{error && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{isSuccess && (
				<Grid container spacing={3}>
					{data.map((data) => (
						<Grid key={data.bggId} item xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GeneralCardSkeleton />}>
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
