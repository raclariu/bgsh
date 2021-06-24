import React, { Fragment, useEffect } from 'react'
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import GameCard from '../components/GameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
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
			<Grid container justify="center">
				{searchKeyword && (
					<Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
						<BackButton />
					</Grid>
				)}
				<Grid item xl={4} lg={4} md={4} sm={5} xs={11}>
					<SearchBox placeholder="Search wishlist" />
				</Grid>
			</Grid>

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
						<Paginate pagination={pagination} searchKeyword={searchKeyword} />
					</Box>
				))}
		</div>
	)
}

export default WishlistSection
