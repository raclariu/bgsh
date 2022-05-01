// @ Modules
import React, { Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// @ Components
import GameIndexCard from '../components/GameIndexCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import SortGames from '../components/Filters/SortGames'
import Paginate from '../components/Paginate'
import GameIndexCardSkeleton from '../components/Skeletons/GameIndexCardSkeleton'
import LzLoad from '../components/LzLoad'
import CustomAlert from '../components/CustomAlert'
import Helmet from '../components/Helmet'

// @ Others
import { useGetGamesIndexQuery } from '../hooks/hooks'

// @ Main
const GamesIndexScreen = ({ mode }) => {
	const navigate = useNavigate()
	const location = useLocation()

	const { search, sort = 'updated', page = 1 } = queryString.parse(location.search)

	const { isLoading, data, isSuccess } = useGetGamesIndexQuery({ sort, search, page, mode })

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

		navigate(`${location.pathname}?${query}`)
	}

	return (
		<Fragment>
			<Helmet
				title={
					mode === 'sell' ? (
						'Boardgames for sale'
					) : mode === 'trade' ? (
						'Boardgames for trade'
					) : (
						'Wanted boardgames'
					)
				}
			/>

			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item md={4} sm={6} xs={12}>
						<SearchBox
							placeholder={
								mode === 'sell' ? (
									'Search sales'
								) : mode === 'trade' ? (
									'Search trades'
								) : (
									'Search wanted games'
								)
							}
							handleFilters={handleFilters}
						/>
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
						<Box display="flex" alignItems="center" width="100%">
							<BackButton />
							<Box fontSize="body2.fontSize" color="text.secondary">
								Found {data.pagination.totalItems || 0} result(s)
							</Box>
						</Box>
					)}
				</Box>

				<SortGames mode={mode} handleFilters={handleFilters} />
			</Box>

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<GameIndexCardSkeleton mode={mode} />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.gamesData.length === 0 && (
				<CustomAlert severity="warning">{search ? 'No results found' : 'No games listed'}</CustomAlert>
			)}

			{isSuccess &&
			data.gamesData.length > 0 && (
				<Grid container spacing={3} direction="row">
					{data.gamesData.map((data) => (
						<Grid item key={data.altId} xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GameIndexCardSkeleton />}>
								<GameIndexCard data={data} />
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.pagination.totalPages > 1 && <Paginate pagination={data.pagination} handleFilters={handleFilters} />}
		</Fragment>
	)
}

export default GamesIndexScreen
