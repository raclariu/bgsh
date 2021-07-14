import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import GameCard from '../components/GameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import GameCardSkeletons from '../components/GameCardSkeletons'
import { getWishlist } from '../actions/collectionActions'
import { WISHLIST_LIST_RESET } from '../constants/collectionConstants'

const useStyles = makeStyles((theme) => ({
	root          : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	},
	error         : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

const WishlistSection = () => {
	const cls = useStyles()
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const { loading, success, error, wishlist, pagination } = useSelector((state) => state.wishlist)

	useEffect(
		() => {
			dispatch(getWishlist(search, page))

			return () => {
				dispatch({ type: WISHLIST_LIST_RESET })
			}
		},
		[ dispatch, search, page ]
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
			{search && (
				<Grid container>
					<Box display="flex" alignItems="center" width="100%">
						<BackButton />
						{pagination && <Box fontSize={12}>Found {pagination.totalItems} games</Box>}
					</Box>
				</Grid>
			)}

			<Grid container justify="center" spacing={2}>
				<Grid item xl={4} lg={4} md={4} sm={5} xs={11}>
					<SearchBox placeholder="Search wishlist" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			{error && (
				<div className={cls.error}>
					<Message>{error}</Message>
				</div>
			)}

			{loading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					<GameCardSkeletons num={24} />
				</Grid>
			)}

			{success && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{wishlist.map((game) => (
						<Grid item key={game._id} xl={4} lg={4} md={4} sm={6} xs={12}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeletons num={1} />}>
								<GameCard game={game} />
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

export default WishlistSection
