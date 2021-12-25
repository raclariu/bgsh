// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import makeStyles from '@mui/styles/makeStyles';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'

// @ Components
import SellGameCard from '../components/SellGamesScreen/SellGameCard'
import ShippingSection from '../components/SellGamesScreen/ShippingSection'
import Input from '../components/Input'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiListGamesForSale } from '../api/api'

// @ Styles
const useStyles = makeStyles((theme) => ({
	section : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(4)
	},
	error   : {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

// @ Main
const SellGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()
	const queryClient = useQueryClient()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const saleList = useSelector((state) => state.saleList)

	const slRef = useRef(
		saleList.map((game) => {
			return {
				...game,
				isSleeved : false,
				version   : null,
				condition : null,
				extraInfo : '',
				price     : ''
			}
		})
	)

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')
	const [ shipCourierPayer, setShipCourierPayer ] = useState(null)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ totalPrice, setTotalPrice ] = useState('')
	const [ values, setValues ] = useState(slRef.current)

	if (isPack !== false && isPack !== true) {
		history.push('/sell')
	}

	if (saleList.length === 1 && isPack) {
		history.push('/sell')
	}

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1
	const mapped = slRef.current.map((el) => el.bggId)

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(mapped),
		{
			staleTime : Infinity,
			enabled   : saleList.length > 0
		}
	)

	const mutation = useMutation((gamesData) => apiListGamesForSale(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries('saleGames')
			queryClient.invalidateQueries('myListedGames')
		}
	})

	console.log(mutation.isError && mutation.error.response)

	useEffect(
		() => {
			if (slRef.current.length !== saleList.length) {
				setValues((val) => val.filter(({ bggId }) => saleList.find((el) => el.bggId === bggId)))
			}
		},
		[ saleList ]
	)

	useEffect(
		() => {
			return () => {
				queryClient.invalidateQueries('bggGamesDetails')
			}
		},
		[ queryClient ]
	)

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleGameInfo = (value, id, key) => {
		const index = values.findIndex((el) => el.bggId === id)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const handleExtraInfoPack = (e) => {
		setExtraInfoPack(e.target.value)
	}

	const handleTotalPrice = (e) => {
		setTotalPrice(e.target.value)
	}

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

		if (saleList.length === 0) return

		const gamesCopy = data.filter(({ bggId }) => values.find((val) => val.bggId === bggId))
		for (let val of values) {
			const index = gamesCopy.findIndex((el) => el.bggId === val.bggId)
			if (index !== -1) {
				gamesCopy[index] = {
					...gamesCopy[index],
					version   : val.version,
					price     : !isPack ? val.price : null,
					condition : val.condition,
					extraInfo : val.extraInfo.trim().length > 0 ? val.extraInfo.trim() : null,
					isSleeved : val.isSleeved
				}
			}
		}

		const gamesData = {
			games            : gamesCopy,
			isPack,
			shipPost,
			shipPostPayer,
			shipCourier,
			shipCourierPayer,
			shipPersonal,
			shipCities,
			extraInfoPack    : isPack ? extraInfoPack.trim() : null,
			totalPrice       : isPack ? totalPrice : null
		}

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cls.error}>
				{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

				{mutation.isError &&
					Object.values(mutation.error.response.data.message).map((err, i) => (
						<CustomAlert key={i}>{err}</CustomAlert>
					))}

				{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}
			</div>

			{isLoading && <Loader />}

			{isSuccess &&
			saleList.length > 0 && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{data.map(
							(game) =>
								// Because we may have 6 fetched games, but values could have only 3 because
								// user deleted 3, we need to only render a list of the ones that are in values
								values.find((val) => val.bggId === game.bggId) && (
									<Grid item key={game.bggId} md={6} xs={12}>
										<SellGameCard
											game={game}
											isPack={isPack}
											mode="sell"
											data={values.find((val) => val.bggId === game.bggId)}
											removeFromSaleListHandler={removeFromSaleListHandler}
											handleGameInfo={handleGameInfo}
										/>
									</Grid>
								)
						)}
					</Grid>

					<Divider />

					{/* Shipping Area */}
					<Grid container className={cls.section} direction="row" spacing={2}>
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
												onChange={handleTotalPrice}
												value={totalPrice}
												error={
													mutation.isError && mutation.error.response.data.message.totalPrice
												}
												helperText={
													mutation.isError && mutation.error.response.data.message.totalPrice
												}
												name="total-price"
												label="Total price"
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
												onChange={handleExtraInfoPack}
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
									<Button
										type="submit"
										disabled={shipError}
										variant="contained"
										color="primary"
										fullWidth
									>
										Sell
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Fragment>
			)}
		</form>
	)
}

export default SellGamesScreen
