import React, { Fragment, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Loader from '../components/Loader'
import Message from '../components/Message'
import WishlistGameCard from '../components/collection/WishlistGameCard'
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

	return (
		<Fragment>
			{loading && <Loader />}
			{error && <Message>{error}</Message>}
			{success && (
				<Grid container className={cls.gridContainer} spacing={3} direction="row">
					{wishlist.map((game) => (
						<Grid item key={game._id} xl={4} lg={4} md={4} sm={6} xs={12}>
							<WishlistGameCard game={game} />
						</Grid>
					))}
				</Grid>
			)}
		</Fragment>
	)
}

export default WishlistSection
