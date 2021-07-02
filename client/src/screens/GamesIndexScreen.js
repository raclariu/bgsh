import React, { useState, useEffect, Fragment } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import GamesIndexCard from '../components/GameIndexCard'
import GamesIndexCardPack from '../components/GameIndexCardPack'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import SortFilterSelect from '../components/Filters/SortFilterSelect'
import Paginate from '../components/Paginate'
import { getGames } from '../actions/gameActions'

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

const GamesIndexScreen = () => {
	const cls = useStyles()
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()

	const { search, sort = 'new', page = 1 } = queryString.parse(location.search)

	const gamesIndex = useSelector((state) => state.gamesIndex)
	const { loading, error, success, saleData, pagination } = gamesIndex

	useEffect(
		() => {
			dispatch(getGames(search, page, sort))
		},
		[ dispatch, search, page, sort ]
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
				<SortFilterSelect handleFilters={handleFilters} />
			</Box>

			<Grid container spacing={3} className={cls.gridContainer}>
				{success &&
					saleData.map(
						(data) =>
							data.sellType === 'individual' ? (
								<Fragment key={data._id}>
									<Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
										<GamesIndexCard data={data} />
									</Grid>
								</Fragment>
							) : (
								<Fragment key={data._id}>
									<Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
										<GamesIndexCardPack data={data} />
									</Grid>
								</Fragment>
							)
					)}
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
