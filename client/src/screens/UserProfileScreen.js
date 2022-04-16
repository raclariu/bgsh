// @ Modules
import React, { useState, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { calculateTimeAgoStrict, formatDateSimple } from '../helpers/helpers'

// @ Mui
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// @ Icons
import InterestsTwoToneIcon from '@mui/icons-material/InterestsTwoTone'

// @ Components
import CustomSkeleton from '../components/Skeletons/CustomSkeleton'
import CustomAvatar from '../components/CustomAvatar'
import UserProfileGameCard from '../components/UserProfileGameCard'
import CustomAlert from '../components/CustomAlert'
import CustomIconBtn from '../components/CustomIconBtn'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'
import LzLoad from '../components/LzLoad'
import SendMessage from '../components/SendMessage'
import ReportForm from '../components/ReportForm'
import Helmet from '../components/Helmet'

// @ Others
import { useGetUserProfileDataQuery, useGetUserProfileListingsDataQuery } from '../hooks/hooks'

// @ Main
const UserProfileScreen = () => {
	const { username } = useParams()

	const {
		isFetching : isFetchingUserData,
		data       : userData,
		isSuccess  : isSuccessUserData
	} = useGetUserProfileDataQuery({ username })
	const { isFetching, isError, error, data, isSuccess } = useGetUserProfileListingsDataQuery({ username })

	const [ tab, setTab ] = useState('sale')

	const handleChange = (e, val) => {
		setTab(val)
	}

	return (
		<Fragment>
			{isFetchingUserData && (
				<Box display="flex" width="100%" mb={4} flexDirection="column" alignItems="center" gap={1}>
					<CustomSkeleton width={96} height={96} variant="circular" />
					<CustomSkeleton width={220} height={51} variant="text" />
					<CustomSkeleton width={75} height={44} variant="text" />
					<CustomSkeleton width={180} variant="text" />
					<CustomSkeleton width={320} variant="text" />
				</Box>
			)}

			{isSuccessUserData && <Helmet title={`${userData.user.username}'s profile`} />}

			{isSuccessUserData && (
				<Box display="flex" width="100%" mb={4} flexDirection="column" alignItems="center" gap={1}>
					<CustomAvatar noClick size={12} username={userData.user.username} src={userData.user.avatar} />
					<Box fontSize="h4.fontSize" fontWeight="fontWeightBold">
						{`${userData.user.username}'s profile`}
					</Box>
					<Box display="flex" alignItems="center" gap={1}>
						<SendMessage recipientUsername={username} />
						<ReportForm type="user" username={userData.user.username} />
					</Box>

					<Chip
						color="primary"
						size="small"
						variant="outlined"
						label={`Last seen ~${calculateTimeAgoStrict(userData.user.lastSeen)}`}
					/>
					<Chip
						color="primary"
						size="small"
						variant="outlined"
						label={`Account created on ${formatDateSimple(userData.user.createdAt)}`}
					/>

					{userData.user.socials.show && (
						<Box display="flex" alignItems="center" gap={1}>
							{userData.user.socials.bggUsername && (
								<Chip
									color="primary"
									size="small"
									variant="outlined"
									label={`${userData.user.socials.bggUsername} @ bgg`}
								/>
							)}

							{userData.user.socials.fbgUsername && (
								<Chip
									color="primary"
									size="small"
									variant="outlined"
									label={`${userData.user.socials.fbgUsername} @ fbg`}
								/>
							)}
						</Box>
					)}
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
					{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}
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
