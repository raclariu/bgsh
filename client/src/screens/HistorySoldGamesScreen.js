import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import HistorySoldGameCard from '../components/HistorySoldGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Message from '../components/Message'

import { getSoldGamesHistory } from '../actions/historyActions'

const useStyles = makeStyles((theme) => ({
	root          : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	},
	media         : {
		margin    : theme.spacing(2, 0, 2, 0),
		objectFit : 'contain',
		height    : '150px'
	},
	cardContent   : {
		padding : '0px'
	},
	title         : {
		display         : '-webkit-box',
		WebkitLineClamp : '2',
		WebkitBoxOrient : 'vertical',
		overflow        : 'hidden'
	}
}))

const HistorySoldGames = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const soldHistory = useSelector((state) => state.soldHistory)
	const { loading, success, error, soldList, pagination } = soldHistory

	useEffect(
		() => {
			dispatch(getSoldGamesHistory(page, search))
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
		<div className={cls.root}>
			<Grid container justify="center" spacing={2}>
				<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
					<SearchBox placeholder="Enter game title" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			{loading && (
				<Box mt={2}>
					<Loader />
				</Box>
			)}

			{error && (
				<Box mt={2}>
					<Message>{error}</Message>
				</Box>
			)}

			{search && (
				<Box display="flex" alignItems="center" width="100%">
					<BackButton />
					{pagination && <Box fontSize={12}>Found {pagination.totalItems} games</Box>}
				</Box>
			)}

			{success && (
				<Grid container className={cls.gridContainer} spacing={3}>
					{soldList.map((data) => (
						<Grid item xs={12} sm={6} md={4}>
							<HistorySoldGameCard data={data} />
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

export default HistorySoldGames
