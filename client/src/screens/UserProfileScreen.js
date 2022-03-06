// @ Modules
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { calculateTimeAgo, formatDate } from '../helpers/helpers'

// @ Mui
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// @ Components
import CustomSkeleton from '../components/Skeletons/CustomSkeleton'
import CustomAvatar from '../components/CustomAvatar'
import UserProfileGameCard from '../components/UserProfileGameCard'
import CustomAlert from '../components/CustomAlert'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'
import LzLoad from '../components/LzLoad'
import SendMessage from '../components/SendMessage'
import Helmet from '../components/Helmet'

// @ Others
import { useGetUserProfileDataQuery } from '../hooks/hooks'

// @ Main
const UserProfileScreen = () => {
	const dispatch = useDispatch()
	const { username } = useParams()

	const { isFetching, isError, error, data, isSuccess } = useGetUserProfileDataQuery({ username })

	const [ tab, setTab ] = useState('sale')

	const handleChange = (e, val) => {
		setTab(val)
	}

	return (
		<Fragment>
			{isFetching && (
				<Box
					display="flex"
					width="100%"
					mb={4}
					// justifyContent="space-between"
					flexDirection="column"
					alignItems="center"
					gap={1}
				>
					<CustomSkeleton width={96} height={96} variant="circular" />
					<CustomSkeleton width={220} height={51} variant="text" />
					<CustomSkeleton width={180} variant="text" />
					<CustomSkeleton width={320} variant="text" />
				</Box>
			)}

			{isSuccess && <Helmet title={`${data.user.username}'s profile`} />}

			{isSuccess && (
				<Box
					display="flex"
					width="100%"
					mb={4}
					// justifyContent="space-between"
					flexDirection="column"
					alignItems="center"
					gap={1}
				>
					<CustomAvatar noClick size={12} username={data.user.username} src={data.user.avatar} />
					<Box fontSize="h4.fontSize" fontWeight="fontWeightBold">
						{`${data.user.username}'s profile`}
					</Box>
					<SendMessage recipientUsername={username} />

					<Chip
						color="primary"
						size="small"
						variant="outlined"
						label={`Last seen ${calculateTimeAgo(data.user.lastSeen)}`}
					/>
					<Chip
						color="primary"
						size="small"
						variant="outlined"
						label={`Account created on ${formatDate(data.user.createdAt)}`}
					/>
				</Box>
			)}

			<Paper
				elevation={2}
				sx={{
					borderRadius : '4px',
					mb           : 3
				}}
			>
				<Tabs value={tab} centered indicatorColor="primary" textColor="primary" onChange={handleChange}>
					<Tab value="sale" label="For sale" />
					<Tab value="trade" label="For trade" />
					<Tab value="wanted" label="Wanted" />
				</Tabs>
			</Paper>

			{isFetching && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => (
						<Grid item key={k} md={4} sm={6} xs={12}>
							<GeneralCardSkeleton key={k} />
						</Grid>
					))}
				</Grid>
			)}

			{tab === 'sale' && (
				<Fragment>
					{isSuccess &&
					data.saleGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{isSuccess &&
							data.saleGames.map((data) => (
								<Grid item key={data._id} md={4} sm={6} xs={12}>
									<LzLoad placeholder={<GeneralCardSkeleton />}>
										<UserProfileGameCard data={data} />
									</LzLoad>
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'trade' && (
				<Fragment>
					{isSuccess &&
					data.tradeGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{isSuccess &&
							data.tradeGames.map((data) => (
								<Grid item key={data._id} md={4} sm={6} xs={12}>
									<UserProfileGameCard data={data} />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'wanted' && (
				<Fragment>
					{isSuccess &&
					data.wantedGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}

					<Grid container spacing={3}>
						{isSuccess &&
							data.wantedGames.map((data) => (
								<Grid item key={data._id} md={4} sm={6} xs={12}>
									<UserProfileGameCard data={data} />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}
		</Fragment>
	)
}

export default UserProfileScreen
