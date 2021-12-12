// @ Libraries
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import { useQuery } from 'react-query'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

// @ Components
import HistoryGameCard from '../components/HistoryGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import Paginate from '../components/Paginate'
import CustomAlert from '../components/CustomAlert'

// @ Others
import { apiFetchGamesHistory } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Styles
const useStyles = makeStyles((theme) => ({
	root          : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	},
	title         : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden'
	}
}))

// @ Main
const GamesHistoryScreen = () => {
	const cls = useStyles()
	const history = useHistory()
	const location = useLocation()
	const currLoc =
		location.pathname === '/user/history/sold'
			? 'sell'
			: location.pathname === '/user/history/traded' ? 'trade' : 'want'
	const qryKey = currLoc === 'sell' ? 'soldHistory' : currLoc === 'trade' ? 'tradedHistory' : 'wantedHistory'

	const { search, page = 1 } = queryString.parse(location.search)

	const [ showSnackbar ] = useNotification()

	const { isLoading, data, isSuccess } = useQuery(
		[ qryKey, { search, page } ],
		() => apiFetchGamesHistory({ search, page, mode: currLoc }),
		{
			staleTime : 1000 * 60 * 60,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching history'
				showSnackbar.error({ text })
			},
			onSuccess : (data) => {
				data.historyList.length === 0 && showSnackbar.warning({ text: 'No games found' })
			}
		}
	)

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query
		if (type === 'search') {
			query = queryString.stringify({ search: filter, page: 1 }, options)
		}

		if (type === 'page') {
			query = queryString.stringify({ search, page: filter }, options)
		}

		history.push(`${location.pathname}?${query}`)
	}

	return (
		<div className={cls.root}>
			<Grid container justifyContent="center" spacing={2}>
				<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
					<SearchBox placeholder="Enter game title" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			{isLoading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{search && (
				<Box display="flex" alignItems="center" width="100%">
					<BackButton />
					{isSuccess && <Box fontSize={12}>Found {data.historyList.length} games</Box>}
				</Box>
			)}

			{isSuccess && (
				<Grid container className={cls.gridContainer} spacing={3}>
					{data.historyList.map((data) => (
						<Grid item key={data._id} xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<HistoryGameCard data={data} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
				data.pagination &&
				(data.pagination.totalPages > 1 && (
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						height={60}
						width="100%"
						borderRadius={4}
						mt={4}
					>
						<Paginate pagination={data.pagination} handleFilters={handleFilters} />
					</Box>
				))}
		</div>
	)
}

export default GamesHistoryScreen
