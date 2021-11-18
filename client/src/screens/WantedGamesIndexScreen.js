// @ Libraries
import React, { useEffect, useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import { format, formatDistance, parseISO } from 'date-fns'

// @ Mui
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

// @ Components
import Paginate from '../components/Paginate'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import CustomAlert from '../components/CustomAlert'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import WantedGameCard from '../components/WantedGameCard'

// @ Others
import { getWantedGames } from '../actions/gameActions'
import { WANTED_GAMES_INDEX_RESET } from '../constants/gameConstants'

// @ Styles
const useStyles = makeStyles((theme) => ({
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	}
}))

// @ Main
const WantedGamesIndexScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	const { search, page = 1 } = queryString.parse(location.search)

	const wantedGamesIndex = useSelector((state) => state.wantedGamesIndex)
	const { loading, error, success, gamesData, pagination } = wantedGamesIndex

	useEffect(
		() => {
			dispatch(getWantedGames(page, search))

			return () => {
				dispatch({ type: WANTED_GAMES_INDEX_RESET })
			}
		},
		[ dispatch, page, search ]
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
		<Fragment>
			<Grid container justifyContent="center" spacing={2}>
				<Grid item md={4} sm={5} xs={12}>
					<SearchBox placeholder="Enter game title or designer" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			{search && (
				<Box display="flex" alignItems="center" width="100%">
					<BackButton />
					{pagination && <Box fontSize={12}>Found {pagination.totalItems} games</Box>}
				</Box>
			)}

			{error && <CustomAlert>{error}</CustomAlert>}

			{loading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{[ ...Array(16).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{success && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{gamesData.map((game) => (
						<Grid item key={game._id} xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<WantedGameCard gameId={game._id} />
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
		</Fragment>
	)
}

export default WantedGamesIndexScreen
