import React, { useEffect } from 'react'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Pagination from '@material-ui/lab/Pagination'
import Button from '@material-ui/core/Button'
import CollectionGameCard from '../components/collection/CollectionGameCard'
import CollectionSearchBox from '../components/collection/CollectionSearchBox'
import CollectionGameSkeleton from '../components/collection/CollectionGameSkeleton'
import { dbGetCollection } from '../actions/collectionActions'

const useStyles = makeStyles((theme) => ({
	root          : {
		marginTop    : theme.spacing(8),
		marginBottom : theme.spacing(8)
	},
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	},
	paper         : {
		display        : 'flex',
		flexDirection  : 'column',
		alignItems     : 'center',
		justifyContent : 'center',
		height         : '300px',
		'& img'        : {
			margin : theme.spacing(2, 0, 2, 0),
			height : '150px'
		},
		'& p'          : {
			margin : theme.spacing(2, 0, 2, 0)
		}
	}
}))

const CollectionScreen = () => {
	const classes = useStyles()
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()

	const { search: searchKeyword = '', page: pageNumber = 1 } = queryString.parse(location.search)

	const dbCollection = useSelector((state) => state.dbCollection)
	const { loading: dbLoading, success: dbSuccess, collection, pagination } = dbCollection

	const bggCollection = useSelector((state) => state.bggCollection)
	const { loading: bggLoading } = bggCollection

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	useEffect(
		() => {
			if (userInfo) {
				dispatch(dbGetCollection(searchKeyword, pageNumber))
			} else {
				history.push('/signin')
			}
		},
		[ dispatch, history, userInfo, pageNumber, searchKeyword ]
	)

	const onPageChange = (e, page) => {
		window.scrollTo(100, 100)

		if (searchKeyword) {
			history.push(`/collection?search=${searchKeyword}&page=${page}`)
		} else {
			history.push(`/collection?page=${page}`)
		}
	}

	const renderSkeletons = () => {
		let skeletonsArr = []
		for (let i = 0; i < 24; i++) {
			skeletonsArr.push(
				<Grid key={i} item xl={3} lg={3} md={4} sm={6} xs={12}>
					<CollectionGameSkeleton />
				</Grid>
			)
		}
		return skeletonsArr
	}

	return (
		<div className={classes.root}>
			{searchKeyword ? (
				<div>
					<CollectionSearchBox />
					<Button onClick={() => history.go(-1)} variant="outlined" color="primary" size="large">
						Go Back
					</Button>
				</div>
			) : (
				<Grid container spacing={3} justify="center">
					<Grid item xl={5} lg={4} md={4} sm={6} xs={11}>
						<CollectionSearchBox />
					</Grid>
				</Grid>
			)}

			{(dbLoading || bggLoading) && (
				<Grid container className={classes.gridContainer} spacing={3} direction="row">
					{renderSkeletons().map((skeleton) => skeleton)}
				</Grid>
			)}

			{dbSuccess && (
				<Grid container className={classes.gridContainer} spacing={3} direction="row">
					{collection.map((game) => (
						<Grid item key={game._id} xl={3} lg={3} md={4} sm={6} xs={12}>
							<LazyLoad height={200} offset={200} once placeholder={<CollectionGameSkeleton />}>
								<CollectionGameCard game={game} />
							</LazyLoad>
						</Grid>
					))}
				</Grid>
			)}

			{dbSuccess && (
				<Grid container justify="center">
					<Pagination
						page={pagination.page}
						onChange={(e, page) => onPageChange(e, page)}
						count={pagination.totalPages}
						size="large"
						color="primary"
						variant="outlined"
						shape="rounded"
					/>
				</Grid>
			)}
		</div>
	)
}

export default CollectionScreen
