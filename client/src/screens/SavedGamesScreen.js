// @ Libraries
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

// @ Components
import SavedGameCard from '../components/SavedGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import Paginate from '../components/Paginate'
import CustomAlert from '../components/CustomAlert'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'

// @ Others
import { getSavedGames } from '../actions/gameActions'
import { SAVED_GAMES_RESET } from '../constants/gameConstants'
import { apiFetchSavedGames } from '../api/api'
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
const SavedGamesScreen = () => {
	const cls = useStyles()
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const [ showSnackbar ] = useNotification()

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'savedGames', { search, page } ],
		() => apiFetchSavedGames(search, page),
		{
			staleTime : 1000 * 60 * 60,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured when fetching saved games'
				showSnackbar.error({ text })
			},
			onSuccess : (data) => {
				data.list.length === 0 && showSnackbar.warning({ text: 'No saved games found' })
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
					<SearchBox placeholder="Enter game title or designer" handleFilters={handleFilters} />
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
					{isSuccess && <Box fontSize={12}>Found {data.pagination.totalItems} games</Box>}
				</Box>
			)}

			{isSuccess && (
				<Grid container className={cls.gridContainer} spacing={3}>
					{data.list.map((data) => (
						<Grid item key={data._id} xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<SavedGameCard data={data} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
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

export default SavedGamesScreen
