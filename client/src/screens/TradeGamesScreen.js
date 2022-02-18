// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ListGameCard from '../components/ListGameCard'
import ShippingSection from '../components/ShippingSection'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiListGamesForTrade } from '../api/api'
import {
	useGetListQuery,
	useDeleteFromListMutation,
	useGetBggGamesDetailsQuery,
	useListGamesMutation
} from '../hooks/hooks'

// @ Main
const TradeGamesScreen = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ values, setValues ] = useState([])

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const { isError, error, data, isFetching, isSuccess: isSuccessDetails } = useGetBggGamesDetailsQuery((data) =>
		setValues(
			data.map((game) => {
				return {
					...game,
					isSleeved : false,
					version   : userList.data.list.find((el) => el.bggId === game.bggId).version,
					condition : null,
					extraInfo : '',
					userImage : userList.data.list.find((el) => el.bggId === game.bggId).userImage
				}
			})
		)
	)

	const deleteMutation = useDeleteFromListMutation()
	const listMutation = useListGamesMutation('trade')

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

	const handleGameInfo = (value, bggId, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === bggId ? { ...val, [key]: value } : val)))
	}

	const handleShippingInfo = (data, type) => {
		if (type === 'post') {
			setShipPost(data)
		}

		if (type === 'courier') {
			setShipCourier(data)
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
			return {
				...val,
				extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
			}
		})

		const gamesData = {
			games         : verifiedGames,
			isPack,
			shipPost,
			shipCourier,
			shipPersonal,
			shipCities,
			extraInfoPack : isPack ? extraInfoPack.trim() : null
		}

		listMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
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
			isSuccessDetails && (
				<Fragment>
					<Grid container spacing={3}>
						{data.map(
							(game) =>
								values.find((val) => val.bggId === game.bggId) && (
									<Grid item key={game.bggId} md={6} xs={12}>
										<ListGameCard
											game={game}
											isPack={isPack}
											mode="trade"
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
						<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
							<ShippingSection
								handleShippingInfo={handleShippingInfo}
								mode="trade"
								shipError={shipError}
								shipData={{ shipPost, shipCourier, shipPersonal, shipCities }}
							/>
						</Grid>
						<Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
							{isPack && (
								<Fragment>
									<Grid item>
										<Input
											onChange={(inputVal) => setExtraInfoPack(inputVal)}
											value={extraInfoPack}
											name="extra-info-pack"
											label={`Extra info ${extraInfoPack.length}/500`}
											type="text"
											size="medium"
											multiline
											minRows={3}
											maxRows={10}
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

							<Grid container direction="column">
								<Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
									<LoadingBtn
										type="submit"
										disabled={shipError}
										variant="contained"
										color="primary"
										loading={listMutation.isLoading}
										fullWidth
									>
										Trade
									</LoadingBtn>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Fragment>
			)}
		</form>
	)
}

export default TradeGamesScreen
