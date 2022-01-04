// @ Libraries
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from 'react-query'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import ListedGameCard from '../components/ListedGameCard'
import BackButton from '../components/BackButton'
import SearchBox from '../components/SearchBox'
import GameCardSkeleton from '../components/Skeletons/GameCardSkeleton'
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import Hero from '../components/Hero'
import LzLoad from '../components/LzLoad'

// @ Others
import { apiFetchListedGames } from '../api/api'
import { useNotification } from '../hooks/hooks'

// @ Main
const UserListedGamesScreen = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const [ showSnackbar ] = useNotification()

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'myListedGames', { search, page } ],
		() => apiFetchListedGames(search, page),
		{
			staleTime : 1000 * 60 * 60,
			onError   : (err) => {
				const text = err.response.data.message || 'Error occured while fetching listed games'
				showSnackbar.error({ text })
			}
		}
	)

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
						{data && <Box fontSize={12}>Found {data.pagination.totalItems} games</Box>}
					</Box>
				)}
			</Hero>

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => <GameCardSkeleton key={k} />)}
				</Grid>
			)}

			{data && (
				<Grid container spacing={3}>
					{data.listedGames.map((data) => (
						<Grid key={data._id} item xs={12} sm={6} md={4}>
							<LzLoad placeholder={<GameCardSkeleton />}>
								<ListedGameCard data={data} />
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

export default UserListedGamesScreen
