// @ Modules
import React, { Fragment } from 'react'

// @ Mui
import Grid from '@mui/material/Grid'

// @ Components
import HotGameCard from '../components/HotGameCard'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'
import Helmet from '../components/Helmet'

// @ Others
import { useGetHotGamesQuery } from '../hooks/hooks'

// @ Main
const HotGamesScreen = () => {
	const { isLoading, error, data, isSuccess } = useGetHotGamesQuery()

	return (
		<Fragment>
			<Helmet title="BGG hot games" />

			{isLoading && (
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
