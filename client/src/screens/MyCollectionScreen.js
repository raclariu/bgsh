import React, { Fragment, useEffect } from 'react'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Pagination from '@material-ui/lab/Pagination'
import LinkIcon from '@material-ui/icons/Link'
import GradeIcon from '@material-ui/icons/Grade'
import Loader from '../components/Loader'
import GetCollectionBox from '../components/GetCollectionBox'
import CollectionSearchBox from '../components/CollectionSearchBox'
import CollectionGameSkeleton from '../components/skeletons/CollectionGameSkeleton'
import { getCollectionFromDB } from '../actions/collectionActions'

const useStyles = makeStyles((theme) => ({
	gridContainer    : {
		marginTop : theme.spacing(4)
	},
	pagination       : {
		marginTop : theme.spacing(4)
	},
	input            : {
		marginTop : theme.spacing(1),
		width     : 400
	},
	collectionButton : {
		marginTop : theme.spacing(1),
		width     : 400
	},
	paper            : {
		padding   : theme.spacing(1),
		textAlign : 'center'
	},
	paperButtons     : {
		margin : theme.spacing(1)
	},
	thumbnail        : {
		margin : theme.spacing(2, 0, 2, 0)
	},
	test             : {
		flexGrow : 1
	}
}))

const MyCollectionScreen = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const searchKeyword = new URLSearchParams(location.search).get('search') || ''
	const pageNumber = Number(new URLSearchParams(location.search).get('page')) || 1

	const userCollectionDB = useSelector((state) => state.userCollectionDB)
	const {
		loading      : loadingCollDB,
		success      : successCollDB,

		dbCollection,
		pagination
	} = userCollectionDB

	const userCollectionBGG = useSelector((state) => state.userCollectionBGG)
	const { loading: loadingCollBGG, reset: resetCollBGG } = userCollectionBGG

	const userSignIn = useSelector((state) => state.userSignIn)
	const { userInfo } = userSignIn

	useEffect(
		() => {
			if (!userInfo) {
				history.push('/signin')
			}
		},
		[ history, userInfo ]
	)

	useEffect(
		() => {
			dispatch(getCollectionFromDB(searchKeyword, pageNumber))
		},
		[ dispatch, resetCollBGG, searchKeyword, pageNumber ]
	)

	const onPageChange = (e, page) => {
		window.scrollTo({
			top      : 100,
			left     : 100,
			behavior : 'smooth'
		})

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
				<Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={i}>
					<CollectionGameSkeleton />
				</Grid>
			)
		}
		return skeletonsArr
	}

	return (
		<Fragment>
			{searchKeyword ? (
				<Button component={RouterLink} to="/collection" variant="contained" color="primary" size="large">
					Go Back
				</Button>
			) : (
				<Grid container className={classes.gridContainer} spacing={3} justify="center">
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
					<Grid container className={classes.gridContainer} spacing={3} direction="row">
						{dbCollection.map((game) => (
							<Grid item xl={3} lg={3} md={4} sm={6} xs={12} key={game._id}>
								<LazyLoad height={200} offset={150} once placeholder={<CollectionGameSkeleton />}>
									<Paper variant="outlined" className={classes.paper}>
										<img
											className={classes.thumbnail}
											src={'../images/collection-placeholder-image.jpg' && game.thumbnail}
											alt={game.title}
										/>

										<Divider variant="middle" />

										<Typography align="center" variant="body1" paragraph>
											{game.title}
										</Typography>

										<Button
											href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
											target="_blank"
											startIcon={<LinkIcon />}
											className={classes.paperButtons}
											variant="contained"
											color="primary"
										>
											BGG
										</Button>

										<Button
											startIcon={<GradeIcon />}
											className={classes.paperButtons}
											variant="contained"
											color="secondary"
										>
											Sell
										</Button>
									</Paper>
								</LazyLoad>
							</Grid>
						))}
					</Grid>
				)
			)}

			<Grid container className={classes.gridContainer} justify="center">
				{successCollDB ? (
					<Pagination
						page={pagination.page}
						onChange={(e, page) => onPageChange(e, page)}
						count={pagination.totalPages}
						size="large"
						color="secondary"
						variant="outlined"
						shape="rounded"
					/>
				) : (
					<Loader />
				)}
			</Grid>
		</Fragment>
	)
}

export default MyCollectionScreen
