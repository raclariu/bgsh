// @ Modules
import React, { Fragment } from 'react'

// @ Mui
import Grid from '@mui/material/Grid'

// @ Components
import CrowdfundingCard from '../components/CrowdfundingCard'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'
import CrowdfundingCardSkeleton from '../components/Skeletons/CrowdfundingCardSkeleton'
import Helmet from '../components/Helmet'

// @ Others
import { useGetBggCrowdfundingQuery } from '../hooks/hooks'
import { dateDiff } from '../helpers/helpers'

// @ Main
const CrowdfundingScreen = () => {
	const { isLoading, error, data, isSuccess } = useGetBggCrowdfundingQuery({ enabled: true })

	return (
		<Fragment>
			<Helmet title="Crowdfunding countdown" />

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid item key={k} xs={12} sm={6} md={4}>
							<CrowdfundingCardSkeleton />
						</Grid>
					))}
				</Grid>
			)}

			{error && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{isSuccess && (
				<Grid container spacing={3}>
					{data.map(
						(data) =>
							dateDiff(data.deadline, 'm') > 0 && (
								<Grid key={data.bggId} item xs={12} sm={6} md={4}>
									<LzLoad placeholder={<CrowdfundingCardSkeleton />}>
										<CrowdfundingCard data={data} />
									</LzLoad>
								</Grid>
							)
					)}
				</Grid>
			)}
		</Fragment>
	)
}

export default CrowdfundingScreen
