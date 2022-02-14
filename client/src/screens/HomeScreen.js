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
import Paper from '@mui/material/Paper'

// @ Icons
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

// @ Components
import RedditSkeleton from '../components/Skeletons/RedditSkeleton'
import CustomTooltip from '../components/CustomTooltip'
import CustomIconBtn from '../components/CustomIconBtn'
import CustomButton from '../components/CustomButton'
import HotGameCard from '../components/HotGameCard'
import KsCard from '../components/KsCard'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'
import ExtLinkIconBtn from '../components/ExtLinkIconBtn'

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
		isFetching : isFetchingHotGames,
		error      : errorHotGames,
		data       : hotGamesList,
		isSuccess  : isSuccessHotGames
	} = useQuery([ 'hotGames' ], apiFetchHotGames, {
		staleTime      : 1000 * 60 * 60,
		refetchOnMount : false
	})

	const { isFetching: isFetchingKs, error: errorKs, data: ksList, isSuccess: isSuccessKs } = useQuery(
		[ 'kickstarters' ],
		apiFetchKickstarters,
		{
			enabled        : ksInView,
			staleTime      : 1000 * 60 * 60,
			refetchOnMount : false
		}
	)

	const {
		isFetching : isFetchingRedditPosts,
		error      : errorRedditPosts,
		data       : redditPosts,
		isSuccess  : isSuccessRedditPosts
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
			<Box id="hot-games">
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					bgcolor="background.paper"
					fontWeight="fontWeightMedium"
					p={1}
					borderRadius={1}
					my={4}
					boxShadow={1}
				>
					<Box>BGG Hot games</Box>
					{!errorHotGames && (
						<CustomTooltip title="See more hot games">
							<CustomIconBtn component={RouterLink} to="/hot" color="primary" size="large">
								<LocalFireDepartmentIcon fontSize="small" />
							</CustomIconBtn>
						</CustomTooltip>
					)}
				</Box>

				{errorHotGames && <CustomAlert>{errorHotGames.response.data.message}</CustomAlert>}

				{isFetchingHotGames && (
					<Grid container spacing={3} direction="row">
						{[ ...Array(12).keys() ].map((i, k) => (
							<Grid item key={k} xs={12} sm={6} md={4}>
								<GeneralCardSkeleton fontSize="small" />
							</Grid>
						))}
					</Grid>
				)}

				{isSuccessHotGames && (
					<Grid container spacing={3}>
						{hotGamesList.slice(0, 6).map((data) => (
							<Grid key={data.bggId} item xs={6} md={4}>
								<LzLoad offset={200} once placeholder={<GeneralCardSkeleton />}>
									<HotGameCard data={data} />
								</LzLoad>
							</Grid>
						))}
					</Grid>
				)}
			</Box>

			<Box ref={ksRef} id="kickstarters">
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					bgcolor="background.paper"
					fontWeight="fontWeightMedium"
					p={1}
					borderRadius={1}
					my={4}
					boxShadow={1}
				>
					<Box>Popular kickstarters</Box>
					<ExtLinkIconBtn
						url={`https://www.kickstarter.com/discover/advanced?category_id=34&sort=popularity`}
						tooltip="See more kickstarters"
					/>
				</Box>

				{errorKs && <CustomAlert>{errorKs.response.data.message}</CustomAlert>}

				{isFetchingKs && (
					<Grid container spacing={3} direction="row">
						{[ ...Array(6).keys() ].map((i, k) => (
							<Grid item key={k} xs={12} sm={6} md={4}>
								<GeneralCardSkeleton />
							</Grid>
						))}
					</Grid>
				)}

				{isSuccessKs && (
					<Grid container spacing={3}>
						{ksList.map((data) => (
							<Grid key={data.ksId} item xs={12} sm={6} md={4}>
								<LzLoad placeholder={<GeneralCardSkeleton />}>
									<KsCard data={data} />
								</LzLoad>
							</Grid>
						))}
					</Grid>
				)}
			</Box>

			<Box ref={redditRef} id="reddit-posts">
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					width="100%"
					bgcolor="background.paper"
					fontWeight="fontWeightMedium"
					p={1}
					borderRadius={1}
					my={4}
					boxShadow={1}
				>
					<Box>Latest r/boardgames posts</Box>
					<ExtLinkIconBtn url={`https://reddit.com/r/boardgames`} tooltip="See more reddit posts" />
				</Box>

				{isFetchingRedditPosts && (
					<Box display="flex" flexDirection="column" gap={1}>
						{[ ...Array(10).keys() ].map((i, k) => <RedditSkeleton key={k} />)}
					</Box>
				)}

				{isSuccessRedditPosts && (
					<Box display="flex" flexDirection="column" gap={1}>
						{redditPosts.map(
							({ data }) =>
								!data.stickied && (
									<Paper
										key={data.id}
										sx={{
											display      : 'flex',
											boxShadow    : 1,
											borderRadius : 1,
											p            : 1,
											gap          : 2,
											width        : '100%'
										}}
									>
										{data.thumbnail !== 'self' && (
											<Box
												sx={{
													width  : {
														xs : 150,
														sm : 180
													},
													height : {
														xs : 85,
														sm : 100
													}
												}}
											>
												<Box
													component="img"
													sx={{
														width        : '100%',
														height       : '100%',
														objectFit    : 'cover',
														borderRadius : 1
													}}
													src={data.thumbnail}
													alt={data.title}
												/>
											</Box>
										)}
										<Box
											display="flex"
											flexDirection="column"
											width="100%"
											justifyContent="space-between"
										>
											<Box sx={{ wordBreak: 'break-word' }}>{data.title}</Box>
											<Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
												<Box fontSize="0.75rem" color="grey.500" fontStyle="italic">
													by {data.author}
												</Box>
												<ExtLinkIconBtn
													url={`https://reddit.com${data.permalink}`}
													tooltip="See on Reddit"
												/>
											</Box>
										</Box>
									</Paper>
								)
						)}
					</Box>
				)}
			</Box>
		</Fragment>
	)
}

export default HomeScreen
