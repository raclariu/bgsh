import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Pagination from '@material-ui/lab/Pagination'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import CollectionGameCard from '../components/collection/CollectionGameCard'
import CollectionSearchBox from '../components/collection/CollectionSearchBox'
import CollectionGameSkeleton from '../components/collection/CollectionGameSkeleton'
import { dbGetCollection } from '../actions/collectionActions'
import { addToSaleList, removeFromSaleList } from '../actions/gameActions'

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

	const saleList = useSelector((state) => state.saleList)

	useEffect(
		() => {
			dispatch(dbGetCollection(searchKeyword, pageNumber))
		},
		[ dispatch, history, pageNumber, searchKeyword ]
	)

	const onPageChangeHandler = (e, page) => {
		window.scrollTo(75, 75)

		if (searchKeyword) {
			history.push(`/collection?search=${searchKeyword.trim()}&page=${page}`)
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

	const renderSkeletonsHandler = () => {
		let skeletonsArr = []
		for (let i = 0; i < 24; i++) {
			skeletonsArr.push(
				<Grid key={i} item xl={4} lg={4} md={4} sm={6} xs={12}>
					<CollectionGameSkeleton />
				</Grid>
			)
		}
		return skeletonsArr
	}

	return (
		<div className={classes.root}>
			<Grid container spacing={3} justify="center">
				<Grid item xl={5} lg={4} md={4} sm={6} xs={11}>
					<CollectionSearchBox />
				</Grid>
			</Grid>

			{searchKeyword && (
				<Fragment>
					<Button component={RouterLink} to="/collection" variant="outlined" color="primary" size="large">
						Back to Collection
					</Button>
				</Fragment>
			)}

			<Grid container>
				<Box
					display="flex"
					height={60}
					width="100%"
					boxShadow={2}
					borderRadius={4}
					mt={4}
					alignItems="center"
					justifyContent="center"
				>
					{dbSuccess && (
						<Grid item>
							<Pagination
								page={pagination.page}
								onChange={(e, page) => onPageChangeHandler(e, page)}
								count={pagination.totalPages}
								size="large"
								color="primary"
								variant="outlined"
								shape="rounded"
							/>
						</Grid>
					)}
				</Box>
			</Grid>

			{(dbLoading || bggLoading) && (
				<Grid container className={classes.gridContainer} spacing={3} direction="row">
					{renderSkeletonsHandler().map((skeleton) => skeleton)}
				</Grid>
			)}

			{dbSuccess && (
				<Grid container className={classes.gridContainer} spacing={3} direction="row">
					{collection.map((game) => (
						<Grid item key={game._id} xl={4} lg={4} md={4} sm={6} xs={12}>
							<LazyLoad height={200} offset={200} once placeholder={<CollectionGameSkeleton />}>
								<CollectionGameCard
									game={game}
									saleListHandler={saleListHandler}
									id={game.bggId}
									isChecked={saleList.some((el) => el.bggId === game.bggId)}
									isDisabled={
										saleList.length > 4 ? saleList.some((el) => el.bggId === game.bggId) ? (
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

			{/* {dbSuccess && (
				<Grid container justify="center">
					<Pagination
						page={pagination.page}
						onChange={(e, page) => onPageChangeHandler(e, page)}
						count={pagination.totalPages}
						size="large"
						color="primary"
						variant="outlined"
						shape="rounded"
					/>
				</Grid>
			)} */}
		</div>
	)
}

export default CollectionScreen
