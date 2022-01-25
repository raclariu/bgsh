// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useQuery } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import SavedGameCard from '../components/SavedGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import Paginate from '../components/Paginate'
import CustomAlert from '../components/CustomAlert'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import Hero from '../components/Hero'
import LzLoad from '../components/LzLoad'

// @ Others
import { apiFetchSavedGames } from '../api/api'
import { useNotiSnackbar } from '../hooks/hooks'

// @ Main
const SavedGamesScreen = () => {
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const [ showSnackbar ] = useNotiSnackbar()

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'savedGames', { search, page } ],
		() => apiFetchSavedGames(search, page),
		{
			staleTime : 1000 * 60 * 60,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching saved games'
				showSnackbar.error({ text })
			},
			onSuccess : (data) => {
				data.list.length === 0 && showSnackbar.warning({ text: 'No saved games found' })
			}
		}
	)

	console.log(data && data)

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
			<Hero>
				<Grid container justifyContent="center" spacing={2}>
					<Grid item xl={4} lg={4} md={4} sm={5} xs={12}>
						<SearchBox placeholder="Enter game title or designer" handleFilters={handleFilters} />
					</Grid>
				</Grid>
				{search && (
					<Box display="flex" alignItems="center" width="100%">
						<BackButton />
						{isSuccess && <Box fontSize={12}>Found {data.pagination.totalItems} games</Box>}
					</Box>
				)}
			</Hero>

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{isSuccess && (
				<Grid container spacing={3}>
					{data.list.map((data) => (
						<Grid item key={data._id} xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GameCardSkeleton />}>
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
