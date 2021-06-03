import React, { useEffect } from 'react'
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Pagination from '@material-ui/lab/Pagination'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import GameCard from '../components/GameCard'
import SearchBox from '../components/SearchBox'
import GameCardSkeleton from '../components/GameCardSkeleton'
import Message from '../components/Message'
import { dbGetCollection } from '../actions/collectionActions'
import { addToSaleList, removeFromSaleList } from '../actions/gameActions'
import { DB_COLLECTION_LIST_RESET } from '../constants/collectionConstants'
import { saleListLimit } from '../constants/gameConstants'

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

const CollectionScreen = () => {
	const cls = useStyles()
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()

	const { search: searchKeyword = '', page: pageNumber = 1 } = queryString.parse(location.search)

	const dbCollection = useSelector((state) => state.dbCollection)
	const { loading: dbLoading, error: dbError, success: dbSuccess, collection, pagination } = dbCollection

	const bggCollection = useSelector((state) => state.bggCollection)
	const { loading: bggLoading } = bggCollection

	const saleList = useSelector((state) => state.saleList)

	useEffect(
		() => {
			dispatch(dbGetCollection(searchKeyword, pageNumber))

			return () => {
				dispatch({ type: DB_COLLECTION_LIST_RESET })
			}
		},
		[ dispatch, searchKeyword, pageNumber ]
	)

	const onPageChangeHandler = (e, page) => {
		window.scrollTo(75, 75)

		if (searchKeyword) {
			history.push(`/collection?search=${searchKeyword}&page=${page}`)
		} else {
			history.push(`/collection?page=${page}`)
		}
	}

	const saleListHandler = (e, id) => {
		if (e.target.checked) {
			const { bggId, title, year, thumbnail, _id } = collection.find((el) => el.bggId === id)
			dispatch(addToSaleList({ bggId, title, year, thumbnail, _id }))
		} else {
			dispatch(removeFromSaleList(id))
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
				<Grid container spacing={3} justify="center" alignItems="center">
					<Grid item xl={5} lg={4} md={4} sm={6} xs={12}>
						<Button component={RouterLink} to="/collection" color="primary" size="large">
							Back to Collection
						</Button>
					</Grid>
				</Grid>
			)}

			{dbError && (
				<div className={cls.error}>
					<Message>{dbError}</Message>
				</div>
			)}

			{(dbLoading || bggLoading) && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{renderSkeletons().map((skeleton) => skeleton)}
				</Grid>
			)}

			{dbSuccess && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{collection.map((game) => (
						<Grid item key={game._id} xl={4} lg={4} md={4} sm={6} xs={12}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeleton />}>
								<GameCard
									game={game}
									saleListHandler={saleListHandler}
									isChecked={saleList.some((el) => el.bggId === game.bggId)}
									isDisabled={
										saleList.length === saleListLimit ? saleList.some(
											(el) => el.bggId === game.bggId
										) ? (
											false
										) : (
											true
										) : (
											false
										)
									}
								/>
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
					{dbSuccess && (
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

export default CollectionScreen
