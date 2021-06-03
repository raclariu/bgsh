import React, { Fragment, useEffect } from 'react'
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Pagination from '@material-ui/lab/Pagination'
import Message from '../components/Message'
import GameCard from '../components/GameCard'
import SearchBox from '../components/SearchBox'
import GameCardSkeleton from '../components/GameCardSkeleton'
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

	const { search: searchKeyword = '', page: pageNumber = 1 } = queryString.parse(location.search)

	const { loading, success, error, wishlist, pagination } = useSelector((state) => state.wishlist)

	useEffect(
		() => {
			dispatch(getWishlist(searchKeyword, pageNumber))

			return () => {
				dispatch({ type: WISHLIST_LIST_RESET })
			}
		},
		[ dispatch, searchKeyword, pageNumber ]
	)

	const onPageChangeHandler = (e, page) => {
		window.scrollTo(75, 75)

		if (searchKeyword) {
			history.push(`/wishlist?search=${searchKeyword}&page=${page}`)
		} else {
			history.push(`/wishlist?page=${page}`)
		}
	}

	const renderSkeletons = () => {
		let skeletonsArr = []
		for (let i = 0; i < 24; i++) {
			skeletonsArr.push(
				<Grid key={i} item xl={4} lg={4} md={4} sm={6} xs={12}>
					<GameCardSkeleton />
				</Grid>
			)
		}
		return skeletonsArr
	}

	return (
		<div className={cls.root}>
			<Grid container spacing={3} justify="center">
				<Grid item xl={5} lg={4} md={4} sm={6} xs={11}>
					<SearchBox />
				</Grid>
			</Grid>

			{searchKeyword && (
				<Button component={RouterLink} to="/wishlist" variant="outlined" color="primary" size="large">
					Back to Wishlist
				</Button>
			)}

			{error && (
				<div className={cls.error}>
					<Message>{error}</Message>
				</div>
			)}

			{loading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{renderSkeletons().map((skeleton) => skeleton)}
				</Grid>
			)}
			{success && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{wishlist.map((game) => (
						<Grid item key={game._id} xl={4} lg={4} md={4} sm={6} xs={12}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<GameCard game={game} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}
			<Grid container>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					height={60}
					width="100%"
					borderRadius={4}
					mt={4}
				>
					{success && (
						<div>
							{pagination.totalPages > 1 && (
								<Grid item>
									<Pagination
										page={pagination.page}
										onChange={(e, page) => onPageChangeHandler(e, page)}
										count={pagination.totalPages}
										color="primary"
									/>
								</Grid>
							)}
						</div>
					)}
				</Box>
			</Grid>
		</div>
	)
}

export default WishlistSection
