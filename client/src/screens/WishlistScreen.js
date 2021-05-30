import React, { Fragment, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import LazyLoad from 'react-lazyload'
import Grid from '@material-ui/core/Grid'
import Message from '../components/Message'
import GameCard from '../components/GameCard'
import GameCardSkeleton from '../components/GameCardSkeleton'
import { getWishlist } from '../actions/collectionActions'

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

const WishlistSection = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const { loading, success, error, wishlist } = useSelector((state) => state.wishlist)

	useEffect(
		() => {
			dispatch(getWishlist())
		},
		[ dispatch ]
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
		<Fragment>
			{error && <Message>{error}</Message>}

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
		</Fragment>
	)
}

export default WishlistSection
