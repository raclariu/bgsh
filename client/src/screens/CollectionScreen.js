import React, { Fragment, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
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
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(8)
	},
	gridContainer : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
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
		window.scrollTo(75, 75)

		if (searchKeyword) {
			history.push(`/collection?search=${searchKeyword.trim()}&page=${page}`)
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
			{console.log('rendered')}
			<Grid container spacing={3} justify="center">
				<Grid item xl={5} lg={4} md={4} sm={6} xs={11}>
					<CollectionSearchBox />
				</Grid>
			</Grid>

			{searchKeyword && (
				<Fragment>
					<Button onClick={() => history.push('/collection')} variant="outlined" color="primary" size="large">
						Back to Collection
					</Button>
				</Fragment>
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
