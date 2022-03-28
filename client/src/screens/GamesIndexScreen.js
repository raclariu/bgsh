// @ Modules
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import queryString from 'query-string'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// @ Components
import GamesIndexCard from '../components/GameIndexCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import SortGames from '../components/Filters/SortGames'
import Paginate from '../components/Paginate'
import GameIndexCardSkeleton from '../components/Skeletons/GameIndexCardSkeleton'
import DrawerFilter from '../components/Filters/DrawerFilter'
import LzLoad from '../components/LzLoad'
import CustomAlert from '../components/CustomAlert'
import Helmet from '../components/Helmet'

// @ Others
import { useGetGamesIndexQuery } from '../hooks/hooks'

// @ Main
const GamesIndexScreen = () => {
	const history = useHistory()
	const dispatch = useDispatch()
	const location = useLocation()
	const currLoc = location.pathname === '/sales' ? 'sell' : location.pathname === '/trades' ? 'trade' : 'want'
	const qryKey = currLoc === 'sell' ? 'saleGames' : currLoc === 'trade' ? 'tradeGames' : 'wantedGames'

	const { search, sort = 'new', page = 1 } = queryString.parse(location.search)

	const { isLoading, data, isSuccess } = useGetGamesIndexQuery({ sort, search, page, mode: currLoc })

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query
		if (type === 'search') {
			query = queryString.stringify({ search: filter, sort, page: 1 }, options)
		}

		if (type === 'sort') {
			query = queryString.stringify({ search, sort: filter, page: 1 }, options)
		}

		if (type === 'page') {
			query = queryString.stringify({ search, sort, page: filter }, options)
		}

		history.push(`${location.pathname}?${query}`)
	}

	return (
		<Fragment>
			<Helmet
				title={
					currLoc === 'sell' ? (
						'Boardgames for sale'
					) : currLoc === 'trade' ? (
						'Boardgames for trade'
					) : (
						'Wanted boardgames'
					)
				}
			/>

			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item md={4} sm={6} xs={12}>
						<SearchBox placeholder="Search boardgames" handleFilters={handleFilters} />
					</Grid>
				</Grid>
			</Box>

			<Box
				display="flex"
				width="100%"
				justifyContent="space-between"
				alignItems="flex-end"
				mb={2}
				flexWrap="wrap"
			>
				<Box>
					{isSuccess &&
					search && (
						<Box display="flex" alignItems="center" width="100%" gap={1}>
							<BackButton />
							<Box fontSize={14} color="grey.500" fontWeight="fontWeightMedium">
								Found {data.pagination.totalItems || 0} game(s)
							</Box>
						</Box>
					)}
				</Box>

				<SortGames mode={currLoc} handleFilters={handleFilters} />
			</Box>
			{/* <Box>
				<DrawerFilter />
			</Box> */}
			{isSuccess &&
			data.gamesData.length === 0 && (
				<CustomAlert severity="warning">{search ? 'No results found' : 'No games listed yet'}</CustomAlert>
			)}
			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<GameIndexCardSkeleton mode={currLoc} />
						</Grid>
					))}
				</Grid>
			)}
			{isSuccess &&
			data.gamesData.length > 0 && (
				<Grid container spacing={3} direction="row">
					{data.gamesData.map((data) => (
						<Grid item key={data._id} xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GameIndexCardSkeleton />}>
								<GamesIndexCard data={data} sort={sort} />
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}
			{isSuccess &&
			data.pagination && (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					height={60}
					width="100%"
					borderRadius="4px"
					mt={4}
				>
					<Paginate pagination={data.pagination} handleFilters={handleFilters} />
				</Box>
			)}
		</Fragment>
	)
}

export default GamesIndexScreen
