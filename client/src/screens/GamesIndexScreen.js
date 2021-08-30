// @ Libraries
import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

// @ Components
import GamesIndexCard from '../components/GameIndexCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import SortGames from '../components/Filters/SortGames'
import Paginate from '../components/Paginate'
import GameIndexCardSkeletons from '../components/Skeletons/GameIndexCardSkeletons'
import Message from '../components/Message'

// @ Others
import { getGames } from '../actions/gameActions'
import { GAMES_INDEX_RESET } from '../constants/gameConstants'

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
const GamesIndexScreen = () => {
	const cls = useStyles()
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()

	const { search, sort = 'new', page = 1 } = queryString.parse(location.search)

	const gamesIndex = useSelector((state) => state.gamesIndex)
	const { loading, error, success, gamesData, pagination } = gamesIndex

	useEffect(
		() => {
			const mode = location.pathname === '/games' ? 'sell' : 'trade'
			dispatch(getGames(search, page, sort, mode))

			return () => {
				dispatch({ type: GAMES_INDEX_RESET })
			}
		},
		[ dispatch, search, page, sort, location ]
	)

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query
		if (type === 'search') {
			query = queryString.stringify({ search: filter, sort, page: 1 }, options)
		}

		if (type === 'sort') {
			query = queryString.stringify({ search, sort: filter, page: 1 }, options)
		}

		if (type === 'page') {
			query = queryString.stringify({ search, sort, page: filter }, options)
		}

		history.push(`${location.pathname}?${query}`)
	}

	return (
		<div className={cls.root}>
			<Grid container justify="center" spacing={2}>
				<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
					<SearchBox placeholder="Search games" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			<Box display="flex" width="100%" alignItems="center">
				<Box display="flex" justifyContent="flex-start" alignItems="center" width="100%">
					<BackButton />
				</Box>
				<SortGames handleFilters={handleFilters} />
			</Box>

			{error && <Message severity="warning">{error}</Message>}

			{loading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					<GameIndexCardSkeletons num={24} />
				</Grid>
			)}

			<Grid container spacing={3} className={cls.gridContainer}>
				{success &&
					gamesData.map((data) => (
						<Grid item key={data._id} xl={4} lg={4} md={4} sm={6} xs={12}>
							<LazyLoad offset={200} once placeholder={<GameIndexCardSkeletons num={1} />}>
								<GamesIndexCard gameId={data._id} />
							</LazyLoad>
						</Grid>
					))}
			</Grid>

			{success && (
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
			)}
		</div>
	)
}

export default GamesIndexScreen
