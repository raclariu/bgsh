// @ Modules
import React, { Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import MyListedGameCard from '../components/MyListedGameCard'
import BackButton from '../components/BackButton'
import SearchBox from '../components/SearchBox'
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import LzLoad from '../components/LzLoad'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'
import Helmet from '../components/Helmet'

// @ Others
import { useGetMyListedGames } from '../hooks/hooks'

// @ Main
const MyListedGamesScreen = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const { isLoading, data, isSuccess } = useGetMyListedGames(search, page)

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query
		if (type === 'search') {
			query = queryString.stringify({ search: filter, page: 1 }, options)
		}

		if (type === 'page') {
			query = queryString.stringify({ search, page: filter }, options)
		}

		navigate(`${location.pathname}?${query}`)
	}

	return (
		<Fragment>
			<Helmet title="My listed games" />

			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item md={4} sm={6} xs={12}>
						<SearchBox placeholder="Search your listed games" handleFilters={handleFilters} />
					</Grid>
				</Grid>
			</Box>

			{isSuccess &&
			search && (
				<Box display="flex" alignItems="center" width="100%" mb={2}>
					<BackButton />
					<Box fontSize="body2.fontSize" color="text.secondary">
						Found {data.pagination.totalItems || 0} result(s)
					</Box>
				</Box>
			)}

			{isSuccess &&
			data.listedGames.length === 0 &&
			!search && <CustomAlert severity="warning">You have no listed games</CustomAlert>}

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<GeneralCardSkeleton />
						</Grid>
					))}
				</Grid>
			)}

			{data &&
			data.listedGames.length > 0 && (
				<Grid container spacing={3}>
					{data.listedGames.map((data) => (
						<Grid key={data._id} item xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GeneralCardSkeleton />}>
								<MyListedGameCard data={data} />
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

export default MyListedGamesScreen
