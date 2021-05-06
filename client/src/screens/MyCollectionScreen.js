import React, { useEffect } from 'react'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Pagination from '@material-ui/lab/Pagination'
import Typography from '@material-ui/core/Typography'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded'
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined'
import GetCollectionBox from '../components/GetCollectionBox'
import CollectionSearchBox from '../components/CollectionSearchBox'
import CollectionGameSkeleton from '../components/skeletons/CollectionGameSkeleton'
import { getCollectionFromDB } from '../actions/collectionActions'

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
		'& img'        : {
			margin : theme.spacing(2, 0, 2, 0),
			height : '150px'
		},
		'& p'          : {
			margin : theme.spacing(2, 0, 2, 0)
		}
	},
	buttonGroup   : {
		maxWidth : '90%'
	}
}))

const MyCollectionScreen = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const { search: searchKeyword = '', page: pageNumber = 1 } = queryString.parse(location.search)

	const userCollectionDB = useSelector((state) => state.userCollectionDB)
	const { loading: loadingCollDB, success: successCollDB, dbCollection, pagination } = userCollectionDB

	const userCollectionBGG = useSelector((state) => state.userCollectionBGG)
	const { loading: loadingCollBGG, reset: resetCollBGG } = userCollectionBGG

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	useEffect(
		() => {
			if (userInfo) {
				dispatch(getCollectionFromDB(searchKeyword, pageNumber))
			} else {
				history.push('/signin')
			}
		},
		[ history, userInfo, dispatch, resetCollBGG, searchKeyword, pageNumber ]
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
					<Button component={RouterLink} to="/collection" variant="outlined" color="primary" size="large">
						Go Back
					</Button>
				</div>
			) : (
				<Grid container spacing={3} justify="center">
					<Grid item xl={5} lg={4} md={4} sm={6} xs={11}>
						<GetCollectionBox />
					</Grid>
					<Grid item xl={5} lg={4} md={4} sm={6} xs={11}>
						<CollectionSearchBox />
					</Grid>
				</Grid>
			)}

			{loadingCollDB || loadingCollBGG ? (
				<Grid container className={classes.gridContainer} spacing={3} direction="row">
					{renderSkeletons().map((skeleton) => skeleton)}
				</Grid>
			) : (
				successCollDB && (
					<Grid container className={classes.gridContainer} spacing={2} direction="row">
						{dbCollection.map((game) => (
							<Grid item key={game._id} xl={3} lg={3} md={4} sm={6} xs={12}>
								<LazyLoad height={200} offset={200} once placeholder={<CollectionGameSkeleton />}>
									<Paper className={classes.paper} variant="outlined">
										<img
											src={'../images/collection-placeholder-image.jpg' && game.thumbnail}
											alt={game.title}
										/>

										<ButtonGroup className={classes.buttonGroup} color="primary" fullWidth>
											<Button
												startIcon={<ExitToAppRoundedIcon />}
												href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
												target="_blank"
											>
												BGG
											</Button>
											<Button startIcon={<MonetizationOnOutlinedIcon />}>Sell</Button>
										</ButtonGroup>

										<Typography align="center" variant="body2">
											{game.title}
										</Typography>
									</Paper>
								</LazyLoad>
							</Grid>
						))}
					</Grid>
				)
			)}

			<Grid container justify="center">
				{successCollDB && (
					<Pagination
						page={pagination.page}
						onChange={(e, page) => onPageChange(e, page)}
						count={pagination.totalPages}
						size="large"
						color="primary"
						variant="outlined"
						shape="rounded"
					/>
				)}
			</Grid>
		</div>
	)
}

export default MyCollectionScreen
