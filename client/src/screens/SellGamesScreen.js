// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ListGameCard from '../components/ListGameCard'
import ShippingSection from '../components/ShippingSection'
import Input from '../components/Input'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import LoadingBtn from '../components/LoadingBtn'

// @ Others
import { apiFetchGameDetails, apiListGamesForSale, apiGetList } from '../api/api'
import { useDeleteFromListMutation, useGetListQuery, useGetBggGamesDetailsQuery } from '../hooks/hooks'

// @ Main
const SellGamesScreen = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()
	const queryClient = useQueryClient()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')
	const [ shipCourierPayer, setShipCourierPayer ] = useState(null)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ totalPrice, setTotalPrice ] = useState('')
	const [ values, setValues ] = useState([])

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const {
		isError,
		error,
		data,
		isFetching,
		isSuccess  : isSuccessDetails,
		status
	} = useGetBggGamesDetailsQuery((data) =>
		setValues(
			data.map((game) => {
				return {
					...game,
					isSleeved : false,
					version   : userList.data.list.find((el) => el.bggId === game.bggId).version,
					condition : null,
					extraInfo : '',
					price     : '',
					userImage : userList.data.list.find((el) => el.bggId === game.bggId).userImage
				}
			})
		)
	)

	const deleteMutation = useDeleteFromListMutation()

	const listMutation = useMutation((gamesData) => apiListGamesForSale(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries([ 'index', 'sell' ])
			queryClient.invalidateQueries([ 'myListedGames' ])
		}
	})

	if (isPack !== false && isPack !== true) {
		listMutation.reset()
		history.push('/sell')
	}

	if (userList.isSuccess && userList.data.list.length === 1 && isPack) {
		listMutation.reset()
		history.push('/sell')
	}

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	const removeFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
	}

	const handleGameInfo = (value, bggId, key) =>
		setValues((vals) => vals.map((val) => (val.bggId === bggId ? { ...val, [key]: value } : val)))

	const handleShippingInfo = (data, type) => {
		if (type === 'post') {
			setShipPost(data)
			if (data === false) {
				setShipPostPayer(null)
			} else {
				setShipPostPayer('seller')
			}
		}

		if (type === 'postPayer') {
			setShipPostPayer(data)
		}

		if (type === 'courier') {
			setShipCourier(data)
			if (data === false) {
				setShipCourierPayer(null)
			} else {
				setShipCourierPayer('buyer')
			}
		}

		if (type === 'courierPayer') {
			setShipCourierPayer(data)
		}

		if (type === 'personal') {
			setShipPersonal(data)
			setShipCities([])
		}

		if (type === 'cities') {
			setShipCities(data)
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (userList.data.list.length === 0) return

		const verifiedGames = values.map((val) => {
			if (isPack) {
				return {
					...val,
					price     : null,
					extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			} else {
				return {
					...val,
					extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			}
		})

		const gamesData = {
			games            : verifiedGames,
			isPack,
			shipPost,
			shipPostPayer,
			shipCourier,
			shipCourierPayer,
			shipPersonal,
			shipCities,
			extraInfoPack    : isPack && extraInfoPack.trim() ? extraInfoPack.trim() : null,
			totalPrice       : isPack ? totalPrice : null
		}

		listMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{listMutation.isError && (
				<Box display="flex" flexDirection="column" gap={1} my={2}>
					{Object.values(listMutation.error.response.data.message).map((err, i) => (
						<CustomAlert key={i}>{err}</CustomAlert>
					))}
				</Box>
			)}

			{userList.isSuccess &&
			userList.data.list.length === 0 && (
				<Box my={2}>
					<CustomAlert severity="warning">Your list is empty</CustomAlert>
				</Box>
			)}

			{isFetching && <Loader />}

			{userList.isSuccess &&
				userList.data.list.length > 0 &&
				(isSuccessDetails && (
					<Fragment>
						<Grid container spacing={3}>
							{data.map(
								(game) =>
									// Because we may have 6 fetched games, but values could have only 3 because
									// user deleted 3, we need to only render a list of the ones that are in values
									values.find((val) => val.bggId === game.bggId) && (
										<Grid item key={game.bggId} md={6} xs={12}>
											<ListGameCard
												game={game}
												isPack={isPack}
												mode="sell"
												data={values.find((val) => val.bggId === game.bggId)}
												removeFromListHandler={removeFromListHandler}
												handleGameInfo={handleGameInfo}
											/>
										</Grid>
									)
							)}
						</Grid>

						<CustomDivider />

						{/* Shipping Area */}
						<Grid container direction="row" spacing={2}>
							<Grid item sm={6} xs={12}>
								<ShippingSection
									handleShippingInfo={handleShippingInfo}
									mode="sell"
									shipError={shipError}
									shipData={{
										shipPost,
										shipCourier,
										shipPersonal,
										shipPostPayer,
										shipCourierPayer,
										shipCities
									}}
								/>
							</Grid>

							<Grid item sm={6} xs={12}>
								<Grid container direction="column">
									{isPack && (
										<Fragment>
											<Grid item>
												<Input
													onChange={(inputVal) => setTotalPrice(inputVal)}
													value={totalPrice}
													error={
														listMutation.isError &&
														listMutation.error.response.data.message.totalPrice
													}
													helperText={
														listMutation.isError &&
														listMutation.error.response.data.message.totalPrice
													}
													name="total-price"
													label="Pack price"
													type="number"
													InputProps={{
														startAdornment : (
															<InputAdornment position="start">RON</InputAdornment>
														)
													}}
													fullWidth
													required
												/>
											</Grid>
											<Grid item>
												<Input
													onChange={(inputVal) => setExtraInfoPack(inputVal)}
													value={extraInfoPack}
													name="extra-info-pack"
													label={`Extra info ${extraInfoPack.length}/500`}
													size="medium"
													multiline
													minRows={3}
													maxRows={10}
													type="text"
													inputProps={{
														maxLength   : 500,
														placeholder :
															'Any other info regarding the pack goes in here (500 characters limit)'
													}}
													fullWidth
												/>
											</Grid>
										</Fragment>
									)}

									<Grid item>
										<LoadingBtn
											type="submit"
											disabled={shipError}
											variant="contained"
											color="primary"
											loading={listMutation.isLoading}
											fullWidth
										>
											Sell
										</LoadingBtn>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Fragment>
				))}
		</form>
	)
}

export default SellGamesScreen
