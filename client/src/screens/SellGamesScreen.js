// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import queryString from 'query-string'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

// @ Components
import SellGameCard from '../components/SellGamesScreen/SellGameCard'
import ShippingSection from '../components/SellGamesScreen/ShippingSection'
import PackInfoTextarea from '../components/SellGamesScreen/PackInfoTextarea'
import PackTotalPriceInput from '../components/SellGamesScreen/PackTotalPriceInput'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'

// @ Others
import { bggGetGamesDetails, removeFromSaleList, sellGames } from '../actions/gameActions'
import { BGG_GAMES_DETAILS_RESET } from '../constants/gameConstants'
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

	console.log(isPack)

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

	console.log(slRef.current)

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
			staleTime : 1000 * 60 * 60
		}
	)

	const mutation = useMutation((gamesData) => apiListGamesForSale(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries('saleGames')
			queryClient.invalidateQueries('myListedGames')
		}
	})

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

	const handleGameInfo = (e, value, id, key) => {
		const index = values.findIndex((el) => el.bggId === id)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const handleExtraInfoPack = (text) => {
		setExtraInfoPack(text)
	}

	const handleTotalPrice = (price) => {
		setTotalPrice(price)
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

		const gamesCopy = data.filter(({ bggId }) => values.find((val) => val.bggId === bggId))
		for (let val of values) {
			const index = gamesCopy.findIndex((el) => el.bggId === val.bggId)
			if (index !== -1) {
				gamesCopy[index] = {
					...gamesCopy[index],
					version   : val.version,
					price     : !isPack ? +val.price : null,
					condition : val.condition,
					extraInfo : val.extraInfo.trim().length > 0 ? val.extraInfo.trim() : '',
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
			extraInfoPack    : isPack ? extraInfoPack.trim() : '',
			totalPrice       : isPack ? +totalPrice : null
		}

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cls.error}>
				{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

				{mutation.isError &&
					mutation.error.response.data.map((err, i) => <CustomAlert key={i}>{err}</CustomAlert>)}

				{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}
			</div>

			{console.count('Renders')}

			{isLoading && <Loader />}

			{isSuccess && (
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
											<PackTotalPriceInput
												totalPrice={totalPrice}
												handleTotalPrice={handleTotalPrice}
											/>
										</Grid>
										<Grid item>
											<PackInfoTextarea
												extraInfoPack={extraInfoPack}
												handleExtraInfoPack={handleExtraInfoPack}
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
