import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Pagination from '@material-ui/lab/Pagination'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import CollectionGameCard from '../components/collection/CollectionGameCard'
import CollectionSearchBox from '../components/collection/CollectionSearchBox'
import CollectionGameSkeleton from '../components/collection/CollectionGameSkeleton'
import { dbGetCollection } from '../actions/collectionActions'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'

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

	const [ saleList, setSaleList ] = useState([])

	console.log(saleList)

	const { search: searchKeyword = '', page: pageNumber = 1 } = queryString.parse(location.search)

	const dbCollection = useSelector((state) => state.dbCollection)
	const { loading: dbLoading, success: dbSuccess, collection, pagination } = dbCollection

	const bggCollection = useSelector((state) => state.bggCollection)
	const { loading: bggLoading } = bggCollection

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

	const addToSaleListHandler = (e, id) => {
		if (e.target.checked) {
			const { bggId, title, year, thumbnail, _id } = collection.find((game) => game.bggId === id)
			setSaleList([ ...saleList, { bggId, title, year, thumbnail, _id } ])
		} else {
			setSaleList(saleList.filter((game) => game.bggId !== id))
		}
	}

	const removeFromSaleListHandler = (id) => {
		setSaleList(saleList.filter((game) => game.bggId !== id))
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
			{console.count('render')}
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

			{(dbLoading || bggLoading) && (
				<Grid container className={classes.gridContainer} spacing={3} direction="row">
					{renderSkeletonsHandler().map((skeleton) => skeleton)}
				</Grid>
			)}

			{saleList && (
				<Grid container>
					<ListSubheader>My Sale List</ListSubheader>
					{saleList.map((game) => (
						<Grid key={game._id} item xs={12} md={12}>
							<List disablePadding dense={true}>
								<ListItem divider>
									<ListItemAvatar>
										<Avatar variant="rounded" src={game.thumbnail} alt={game.title} />
									</ListItemAvatar>
									<ListItemText primary={`${game.title} (${game.year})`} />
									<ListItemSecondaryAction>
										<IconButton
											edge="end"
											color="secondary"
											onClick={() => removeFromSaleListHandler(game.bggId)}
										>
											<DeleteOutlinedIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							</List>
						</Grid>
					))}
					{saleList.length > 0 && (
						<Button
							color="primary"
							variant="outlined"
							component={RouterLink}
							to={{ pathname: '/sell', state: saleList }}
						>
							Sell
						</Button>
					)}
				</Grid>
			)}

			{dbSuccess && (
				<Fragment>
					<Grid container className={classes.gridContainer} spacing={3} direction="row">
						{collection.map((game) => (
							<Grid item key={game._id} xl={4} lg={4} md={4} sm={6} xs={12}>
								<LazyLoad height={200} offset={200} once placeholder={<CollectionGameSkeleton />}>
									<CollectionGameCard
										game={game}
										addToSaleList={addToSaleListHandler}
										id={game.bggId}
										isChecked={saleList.some((obj) => obj.bggId === game.bggId)}
										isDisabled={
											saleList.length > 4 ? saleList.some((obj) => obj.bggId === game.bggId) ? (
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
				</Fragment>
			)}

			{dbSuccess && (
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
			)}
		</div>
	)
}

export default CollectionScreen
