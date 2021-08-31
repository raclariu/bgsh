// @ Libraries
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

// @ Components
import ActiveGameCard from '../components/ActiveGameCard'
import BackButton from '../components/BackButton'
import SearchBox from '../components/SearchBox'
import GameCardSkeletons from '../components/Skeletons/GameCardSkeletons'
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'

// @ Others
import { HISTORY_ADD_RESET } from '../constants/historyConstants'
import { getUserActiveGames } from '../actions/gameActions'

// @ Styles
const useStyles = makeStyles((theme) => ({
	root          : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	}
}))

// @ Main
const ActiveGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const userGames = useSelector((state) => state.userActiveGames)
	const { loading, error, success, pagination, activeGames } = userGames

	const { success: successAdd, loading: loadingAdd } = useSelector((state) => state.addToHistory)
	const { success: successDelete } = useSelector((state) => state.deleteGame)
	const { success: successReactivate } = useSelector((state) => state.reactivateGame)

	useEffect(
		() => {
			dispatch(getUserActiveGames(search, page))
		},
		[ dispatch, search, page, successDelete, successReactivate ]
	)

	useEffect(
		() => {
			if (loadingAdd === false && successAdd) {
				dispatch(getUserActiveGames(search, page))
				dispatch({ type: HISTORY_ADD_RESET })
			}
		},
		[ dispatch, search, page, successAdd, loadingAdd ]
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

			{loading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					<GameCardSkeletons num={24} />
				</Grid>
			)}

			{search && (
				<Box display="flex" alignItems="center" width="100%">
					<BackButton />
					{pagination && <Box fontSize={12}>Found {pagination.totalItems} games</Box>}
				</Box>
			)}

			{error && (
				<Box mt={2}>
					<CustomAlert>{error}</CustomAlert>
				</Box>
			)}

			{success && (
				<Grid container className={cls.gridContainer} spacing={3}>
					{activeGames.map((data) => (
						<Grid key={data._id} item xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeletons num={1} />}>
								<ActiveGameCard data={data} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}

			{success &&
				(pagination.totalPages > 1 && (
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						height={60}
						width="100%"
						borderRadius={4}
						mt={4}
					>
						<Paginate pagination={pagination} handleFilters={handleFilters} />
					</Box>
				))}
		</div>
	)
}

export default ActiveGamesScreen
