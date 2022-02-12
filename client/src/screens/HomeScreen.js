// @ Libraries
import React, { useEffect, Fragment } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import { useInView } from 'react-intersection-observer'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// @ Components
import CustomButton from '../components/CustomButton'
import HotGameCard from '../components/HotGameCard'
import KsCard from '../components/KsCard'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'

// @ Others
import { apiFetchHotGames, apiFetchKickstarters, apiFetchRedditPosts } from '../api/api'

// @ Main
const HomeScreen = () => {
	const dispatch = useDispatch()

	const { ref: redditRef, inView: redditInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const { ref: ksRef, inView: ksInView } = useInView({
		threshold   : 0,
		triggerOnce : true
	})

	const {
		isLoading : isLoadingHotGames,
		error     : errorHotGames,
		data      : hotGamesList,
		isSuccess : isSuccessHotGames
	} = useQuery([ 'hotGames' ], apiFetchHotGames, {
		staleTime      : 1000 * 60 * 60,
		refetchOnMount : false
	})

	const { isLoading: isLoadingKs, error: errorKs, data: ksList, isSuccess: isSuccessKs } = useQuery(
		[ 'kickstarters' ],
		apiFetchKickstarters,
		{
			enabled        : ksInView,
			staleTime      : 1000 * 60 * 60,
			refetchOnMount : false
		}
	)

	const {
		isLoading : isLoadingRedditPosts,
		error     : errorRedditPosts,
		data      : redditPosts,
		isSuccess : isSuccessRedditPosts
	} = useQuery([ 'redditPosts' ], apiFetchRedditPosts, {
		enabled        : redditInView,
		staleTime      : 1000 * 60 * 60,
		refetchOnMount : false
	})

	if (errorHotGames) {
		console.log(errorHotGames.response)
	}

	return (
		<Fragment>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				width="100%"
				bgcolor="primary.main"
				color="primary.contrastText"
				fontWeight="fontWeightMedium"
				fontSize={14}
				p={1}
				borderRadius="4px"
				mb={3}
			>
				<Box>BGG Hot games</Box>
				{!errorHotGames && (
					<CustomButton component={RouterLink} to="/hot" variant="outlined" size="small" color="inherit">
						See all
					</CustomButton>
				)}
			</Box>

			{errorHotGames && <CustomAlert>{errorHotGames.response.data.message}</CustomAlert>}

			{isLoadingHotGames && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccessHotGames && (
				<Grid container spacing={3}>
					{hotGamesList.slice(0, 6).map((data) => (
						<Grid key={data.bggId} item xs={6} md={4}>
							<LzLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<HotGameCard data={data} />
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}

			<Box
				ref={ksRef}
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				width="100%"
				bgcolor="primary.main"
				color="primary.contrastText"
				fontWeight="fontWeightMedium"
				fontSize={14}
				p={1}
				borderRadius="4px"
				my={4}
			>
				<Box>Popular kickstarters</Box>
				<CustomButton
					href={`https://www.kickstarter.com/discover/advanced?category_id=34&sort=popularity`}
					target="_blank"
					rel="noreferrer"
					variant="outlined"
					size="small"
					color="inherit"
				>
					See more
				</CustomButton>
			</Box>

			{errorKs && <CustomAlert>{errorKs.response.data.message}</CustomAlert>}

			{isLoadingKs && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(6).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccessKs && (
				<Grid container spacing={3}>
					{ksList.map((data) => (
						<Grid key={data.ksId} item xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GameCardSkeleton />}>
								<KsCard data={data} />
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}

			<Box
				ref={redditRef}
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				width="100%"
				bgcolor="primary.main"
				color="primary.contrastText"
				fontWeight="fontWeightMedium"
				fontSize={14}
				p={1}
				borderRadius="4px"
				my={4}
			>
				<Box>Latest r/boardgames posts</Box>
				<CustomButton
					href={`https://reddit.com/r/boardgames`}
					target="_blank"
					rel="noreferrer"
					variant="outlined"
					size="small"
					color="inherit"
				>
					See more
				</CustomButton>
			</Box>

			{isSuccessRedditPosts && (
				<Box display="flex" flexDirection="column" gap={1}>
					{redditPosts.map(
						({ data }) =>
							!data.stickied && (
								<Box
									key={data.id}
									display="flex"
									bgcolor="background.paper"
									boxShadow={1}
									borderRadius={2}
									p={1}
									width="100%"
								>
									{data.thumbnail !== 'self' && (
										<Box
											sx={{
												width  : {
													xs : 100,
													sm : 140
												},
												height : {
													xs : 80,
													sm : 100
												},
												mr     : 2
											}}
										>
											<img
												style={{
													width     : '100%',
													height    : '100%',
													objectFit : 'cover'
												}}
												src={data.thumbnail}
												alt={data.title}
											/>
										</Box>
									)}
									<Box
										display="flex"
										flexDirection="column"
										justifyContent="space-between"
										width="100%"
									>
										<Box sx={{ wordBreak: 'break-word' }}>{data.title}</Box>
										<Box display="flex" justifyContent="space-between" alignItems="center">
											<Box fontSize="0.75rem" color="grey.500" fontStyle="italic">
												by {data.author}
											</Box>
											<CustomButton
												href={`https://reddit.com/${data.permalink}`}
												target="_blank"
												rel="noreferrer"
												size="small"
											>
												See on Reddit
											</CustomButton>
										</Box>
									</Box>
								</Box>
							)
					)}
				</Box>
			)}
		</Fragment>
	)
}

export default HomeScreen
