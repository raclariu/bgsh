// @ Modules
import React, { Fragment } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

// @ Components
import CustomDivider from '../components/CustomDivider'
import CollectionGameCard from '../components/CollectionGameCard'
import SearchBox from '../components/SearchBox'
import BackButton from '../components/BackButton'
import CollectionCardSkeleton from '../components/Skeletons/CollectionCardSkeleton'
import CustomAlert from '../components/CustomAlert'
import Paginate from '../components/Paginate'
import LzLoad from '../components/LzLoad'
import Helmet from '../components/Helmet'

// @ Others
import { useGetListQuery, useGetCollectionQuery, useDeleteFromListMutation, useAddToListMutation } from '../hooks/hooks'

// @ Main
const CollectionScreen = ({ type }) => {
	const navigate = useNavigate()
	const location = useLocation()

	const { search, page = 1 } = queryString.parse(location.search)

	const userList = useGetListQuery()

	const { isLoading, isSuccess, data } = useGetCollectionQuery(search, page, type)

	const addMutation = useAddToListMutation()

	const deleteMutation = useDeleteFromListMutation()

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

	const listHandler = (e, game) => {
		const { bggId, title, year, thumbnail, image, version = null } = game
		if (e.target.checked) {
			addMutation.mutate({ bggId, title, year, thumbnail, image, version })
		} else {
			deleteMutation.mutate({ bggId, title })
		}
	}

	return (
		<Fragment>
			{type === 'owned' && <Helmet title="Owned collection" />}
			{type === 'forTrade' && <Helmet title="For trade collection" />}
			{type === 'wantInTrade' && <Helmet title="Want in trade collection" />}
			{type === 'wantToBuy' && <Helmet title="Want to buy collection" />}
			{type === 'wantToPlay' && <Helmet title="Want to play collection" />}
			{type === 'wishlist' && <Helmet title="Wishlist collection" />}

			<Box display="flex" width="100%" mb={3} justifyContent="center" alignItems="center">
				<Grid container justifyContent="center" spacing={2}>
					<Grid item xs={12} sm={6} md={4}>
						<SearchBox placeholder="Search collection" handleFilters={handleFilters} />
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
			data.collection.length === 0 && (
				<CustomAlert severity="warning">{search ? 'No results found' : 'Your collection is empty'}</CustomAlert>
			)}

			{isLoading && (
				<Grid container spacing={3} direction="row">
					{[ ...Array(12).keys() ].map((i, k) => (
						<Grid key={k} item xs={12} sm={6} md={4}>
							<CollectionCardSkeleton page="collection" />
						</Grid>
					))}
				</Grid>
			)}

			{isSuccess &&
			data.collection.length > 0 && (
				<Grid container spacing={3} direction="row">
					{data.collection.map((item) => (
						<Grid item key={item.modified} xs={12} sm={6} md={4}>
							<LzLoad placeholder={<CollectionCardSkeleton />}>
								<CollectionGameCard
									data={item}
									type={type}
									listHandler={listHandler}
									isChecked={userList.data.list.some((el) => el.bggId === item.bggId)}
									isDisabled={
										userList.data.list.length === 8 ? userList.data.list.some(
											(el) => el.bggId === item.bggId
										) ? (
											false
										) : (
											true
										) : (
											false
										)
									}
								/>
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

export default CollectionScreen
