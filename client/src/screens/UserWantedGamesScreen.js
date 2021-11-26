// @ Libraries
import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from 'react-query'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'

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
import UserWantedGameCard from '../components/UserWantedGameCard'

// @ Other
import { getUserWantedGames } from '../actions/gameActions'
import { apiFetchUserWantedGames } from '../api/api'

// @ Styles
const useStyles = makeStyles((theme) => ({
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	}
}))

// @ Main
const UserWantedGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	const { search, page = 1 } = queryString.parse(location.search)

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'myWantedGames', { search, page } ],
		() => apiFetchUserWantedGames(search, page),
		{
			staleTime : 1000 * 60 * 60
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
		<Fragment>
			<Grid container justifyContent="center" spacing={2}>
				<Grid item md={4} sm={5} xs={12}>
					<SearchBox placeholder="Enter game title or designer" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			{search && (
				<Box display="flex" alignItems="center" width="100%">
					<BackButton />
					{isSuccess && <Box fontSize={12}>Found {data.pagination.totalItems} games</Box>}
				</Box>
			)}

			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{isLoading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccess && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{data.wantedGames.map((data) => (
						<Grid item key={data._id} xs={12} sm={6} md={4}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<UserWantedGameCard data={data} />
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
		</Fragment>
	)
}

export default UserWantedGamesScreen
