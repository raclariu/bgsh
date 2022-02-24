// @ Libraries
import React, { Fragment } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import SavedGameCard from '../components/SavedGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import Paginate from '../components/Paginate'
import CustomAlert from '../components/CustomAlert'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'
import LzLoad from '../components/LzLoad'

// @ Others
import { useGetSavedGamesListQuery } from '../hooks/hooks'

// @ Main
const SavedGamesScreen = () => {
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const { isFetching, data, isSuccess } = useGetSavedGamesListQuery(search, page)

	const handleFilters = (filter, type) => {
		const options = { sort: false, skipEmptyString: true, skipNull: true }

		let query
		if (type === 'search') {
			query = queryString.stringify({ search: filter, page: 1 }, options)
		}

		if (type === 'page') {
			query = queryString.stringify({ search, page: filter }, options)
		}

		history.push(`${location.pathname}?${query}`)
	}

	return (
		<Fragment>
			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item md={4} sm={6} xs={12}>
						<SearchBox placeholder="Search saved games" handleFilters={handleFilters} />
					</Grid>
				</Grid>
			</Box>

			{isSuccess &&
			search && (
				<Box display="flex" alignItems="center" width="100%" gap={1} mb={2}>
					<BackButton />
					<Box fontSize={14} color="grey.500" fontWeight="fontWeightMedium">
						Found {data.pagination.totalItems || 0} game(s)
					</Box>
				</Box>
			)}

			{isSuccess &&
			data.list.length === 0 && (
				<CustomAlert severity="warning">
					{search ? 'No results found' : 'Your saved games list is empty'}
				</CustomAlert>
			)}

			{isFetching && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid item key={k} xs={12} sm={6} md={4}>
							<GeneralCardSkeleton />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.list.length > 0 && (
				<Grid container spacing={3}>
					{data.list.map((data) => (
						<Grid item key={data._id} xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GeneralCardSkeleton />}>
								<SavedGameCard data={data} />
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
				(data.pagination.totalPages > 1 && (
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
				))}
		</Fragment>
	)
}

export default SavedGamesScreen
