// @ Libraries
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { format, formatDistance, parseISO } from 'date-fns'
import LazyLoad from 'react-lazyload'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Skeleton from '@material-ui/lab/Skeleton'

// @ Components
import UserProfileGameCard from '../components/UserProfileScreen/UserProfileGameCard'
import CustomTooltip from '../components/CustomTooltip'
import CustomAlert from '../components/CustomAlert'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'

// @ Others
import { getUserProfileData } from '../actions/userActions'

// @ Styles
const useStyles = makeStyles((theme) => ({
	card  : {
		position : 'relative'
	},
	media : {
		margin    : theme.spacing(1, 0, 1, 0),
		padding   : theme.spacing(0, 1, 0, 1),
		objectFit : 'contain',
		height    : '140px'
	},
	title : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden',
		width           : '100%',
		textAlign       : 'center'
	}
}))

// @ Wanted game card
const WantedGameCard = ({ gameId }) => {
	const cls = useStyles()

	const data = useSelector((state) => state.userProfileData.wantedGames.find((obj) => obj._id === gameId))

	return (
		<Card className={cls.card} elevation={2}>
			<CardMedia
				className={cls.media}
				component="img"
				image={data.thumbnail ? data.thumbnail : '/images/gameImgPlaceholder.jpg'}
				alt={data.title}
				title={data.title}
			/>

			<Divider />

			<CardContent>
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					fontWeight="fontWeightMedium"
					minHeight="3rem"
				>
					{data.title.length > 50 ? (
						<CustomTooltip title={data.title}>
							<Box className={cls.title}>{data.title}</Box>
						</CustomTooltip>
					) : (
						<Box className={cls.title}>{data.title}</Box>
					)}
				</Box>
			</CardContent>

			<Divider />

			<CardActions>
				<Box display="flex" justifyContent="flex-end" width="100%">
					<CustomTooltip title="See on BGG">
						<Button
							color="primary"
							href={`https://boardgamegeek.com/boardgame/${data.bggId}`}
							target="_blank"
							rel="noopener"
						>
							BGG
						</Button>
					</CustomTooltip>
				</Box>
			</CardActions>
		</Card>
	)
}

// @ Main
const UserProfileScreen = () => {
	const dispatch = useDispatch()
	const { username } = useParams()

	const [ tab, setTab ] = useState('sale')

	const userProfileData = useSelector((state) => state.userProfileData)
	const { loading, success, error, saleGames, tradeGames, wantedGames } = userProfileData

	useEffect(
		() => {
			dispatch(getUserProfileData(username))
		},
		[ dispatch, username ]
	)

	const handleChange = (e, val) => {
		setTab(val)
	}

	return (
		<Fragment>
			{error && <Box>{error}</Box>}

			<Box borderRadius={4} boxShadow={2} my={2} bgcolor="background.paper">
				<Tabs value={tab} centered indicatorColor="primary" textColor="primary" onChange={handleChange}>
					<Tab value="sale" label="For sale" />
					<Tab value="trade" label="For trade" />
					<Tab value="wanted" label="Wanted" />
				</Tabs>
			</Box>

			{loading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{tab === 'sale' && (
				<Fragment>
					{success && saleGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{success &&
							saleGames.map((listedGame) => (
								<Grid item key={listedGame._id} md={4} sm={6} xs={12}>
									<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
										<UserProfileGameCard gameId={listedGame._id} type="sale" />
									</LazyLoad>
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'trade' && (
				<Fragment>
					{success && tradeGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}
					<Grid container spacing={3}>
						{success &&
							tradeGames.map((listedGame) => (
								<Grid item key={listedGame._id} md={4} sm={6} xs={12}>
									<UserProfileGameCard gameId={listedGame._id} type="trade" />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}

			{tab === 'wanted' && (
				<Fragment>
					{success &&
					wantedGames.length === 0 && <CustomAlert severity="warning">No games found</CustomAlert>}

					<Grid container spacing={3}>
						{success &&
							wantedGames.map((listedGame) => (
								<Grid item key={listedGame._id} md={4} sm={6} xs={12}>
									<WantedGameCard gameId={listedGame._id} />
								</Grid>
							))}
					</Grid>
				</Fragment>
			)}
		</Fragment>
	)
}

export default UserProfileScreen
