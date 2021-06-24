import React, { useEffect, Fragment } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import queryString from 'query-string'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import SingleSellGameCard from '../components/SingleSellGameCard'
import SearchBox from '../components/SearchBox'
import Paginate from '../components/Paginate'
import { getGames } from '../actions/gameActions'

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

const GamesScreen = () => {
	const cls = useStyles()
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()

	const { search: searchKeyword = '', page: pageNumber = 1 } = queryString.parse(location.search)

	const gamesIndex = useSelector((state) => state.gamesIndex)
	const { loading, error, success, saleData, pagination } = gamesIndex

	console.log(gamesIndex)

	console.log(saleData)

	useEffect(
		() => {
			dispatch(getGames(searchKeyword, pageNumber))
		},
		[ dispatch, searchKeyword, pageNumber ]
	)

	return (
		<div className={cls.root}>
			<Grid container justify="center">
				<Grid item xl={4} lg={4} md={4} sm={5} xs={11}>
					<SearchBox placeholder="Search games" />
				</Grid>
			</Grid>

			<Grid container spacing={3} className={cls.gridContainer}>
				{success &&
					saleData.map((data) => (
						<Fragment>
							<Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
								<SingleSellGameCard data={data} />
							</Grid>
						</Fragment>
					))}
			</Grid>

			{success && (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					height={60}
					width="100%"
					borderRadius={4}
					mt={4}
				>
					<Paginate pagination={pagination} searchKeyword={searchKeyword} />
				</Box>
			)}
		</div>
	)
}

export default GamesScreen
