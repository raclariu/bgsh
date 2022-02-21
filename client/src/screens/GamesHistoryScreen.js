// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useHistory, useLocation } from 'react-router'
import queryString from 'query-string'

// @ Mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// @ Components
import HistoryGameCard from '../components/HistoryGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import GeneralCardSkeleton from '../components/Skeletons/GeneralCardSkeleton'
import Paginate from '../components/Paginate'
import CustomAlert from '../components/CustomAlert'
import LzLoad from '../components/LzLoad'

// @ Others
import { useGetGamesHistoryListQuery } from '../hooks/hooks'

// @ Main
const GamesHistoryScreen = () => {
	const history = useHistory()
	const location = useLocation()
	const currLoc =
		location.pathname === '/user/history/sold'
			? 'sell'
			: location.pathname === '/user/history/traded' ? 'trade' : 'buy'

	const { search, page = 1 } = queryString.parse(location.search)

	const { isFetching, data, isSuccess } = useGetGamesHistoryListQuery({ search, page, mode: currLoc })

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
					<Grid item md={4} sm={5} xs={12}>
						<SearchBox placeholder="Search boardgames" handleFilters={handleFilters} />
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
			data.historyList.length === 0 &&
			!search && <CustomAlert severity="warning">{`Your ${currLoc} history list is empty`}</CustomAlert>}

			{isFetching && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<GeneralCardSkeleton />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.historyList.length > 0 && (
				<Grid container spacing={3}>
					{data.historyList.map((data) => (
						<Grid item key={data._id} xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GeneralCardSkeleton />}>
								<HistoryGameCard data={data} />
							</LzLoad>
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
				data.pagination &&
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

export default GamesHistoryScreen
