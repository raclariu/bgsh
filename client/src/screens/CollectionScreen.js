// @ Libraries
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

// @ Components
import GameCard from '../components/GameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import GameCardSkeletons from '../components/Skeletons/GameCardSkeletons'
import Message from '../components/Message'
import Paginate from '../components/Paginate'

// @ Others
import { dbGetCollection } from '../actions/collectionActions'
import { addToSaleList, removeFromSaleList } from '../actions/gameActions'
import { DB_COLLECTION_LIST_RESET } from '../constants/collectionConstants'
import { saleListLimit } from '../constants/gameConstants'

// @ Styles
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

// @ Main
const CollectionScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const dbCollection = useSelector((state) => state.dbCollection)
	const { loading: dbLoading, error: dbError, success: dbSuccess, collection, pagination } = dbCollection

	const saleList = useSelector((state) => state.saleList)

	useEffect(
		() => {
			dispatch(dbGetCollection(search, page))

			return () => {
				dispatch({ type: DB_COLLECTION_LIST_RESET })
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

	const saleListHandler = (e, id) => {
		if (e.target.checked) {
			const { bggId, title, year, thumbnail, _id } = collection.find((el) => el.bggId === id)
			dispatch(addToSaleList({ bggId, title, year, thumbnail, _id }))
		} else {
			dispatch(removeFromSaleList(id))
		}
	}

	return (
		<div className={cls.root}>
			<Grid container justify="center" spacing={2}>
				<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
					<SearchBox placeholder="Search collection" handleFilters={handleFilters} />
				</Grid>
			</Grid>

			{search && (
				<Box display="flex" alignItems="center" width="100%">
					<BackButton />
					{pagination && <Box fontSize={12}>Found {pagination.totalItems} games</Box>}
				</Box>
			)}
			{dbError && (
				<div className={cls.error}>
					<Message>{dbError}</Message>
				</div>
			)}
			{dbLoading && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					<GameCardSkeletons num={24} height={58} />
				</Grid>
			)}
			{dbSuccess && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{collection.map((game) => (
						<Grid item key={game._id} xl={4} lg={4} md={4} sm={6} xs={12}>
							<LazyLoad offset={200} once placeholder={<GameCardSkeletons num={1} height={58} />}>
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
			{dbSuccess &&
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

export default CollectionScreen
