// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
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
import Message from '../components/Message'
import Loader from '../components/Loader'

// @ Others
import { bggGetGamesDetails, removeFromSaleList, sellGames } from '../actions/gameActions'
import { BGG_GAMES_DETAILS_RESET } from '../constants/gameConstants'

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

	const { type = 'individual' } = queryString.parse(location.search)

	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPostPayer, setShipPostPayer ] = useState('seller')
	const [ shipCourierPayer, setShipCourierPayer ] = useState(null)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ totalPrice, setTotalPrice ] = useState('')

	const ms = useRef(0)

	const saleList = useSelector((state) => state.saleList)

	if (type !== 'individual' && type !== 'pack') {
		history.push('/sell')
	}

	if (saleList.length === 1 && type === 'pack') {
		history.push('/sell')
	}

	const [ values, setValues ] = useState(
		saleList.map((el) => {
			return {
				bggId     : el.bggId,
				isSleeved : false,
				version   : null,
				condition : null,
				extraInfo : '',
				price     : ''
			}
		})
	)

	const bggGamesDetails = useSelector((state) => state.bggGamesDetails)
	const { loading: detailsLoading, error: detailsError, success: detailsSuccess, games } = bggGamesDetails

	const sell = useSelector((state) => state.sellGames)
	const { loading: sellLoading, error: sellError, success: sellSuccess } = sell

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	useEffect(
		() => {
			const mapped = saleList.map((el) => el.bggId)
			const timer = setTimeout(() => {
				if (mapped.length > 0) {
					dispatch(bggGetGamesDetails(mapped))
				}
			}, ms.current)
			ms.current = 750
			return () => {
				dispatch({ type: BGG_GAMES_DETAILS_RESET })
				clearTimeout(timer)
			}
		},
		[ dispatch, saleList ]
	)

	const removeFromSaleListHandler = (id) => {
		ms.current = 0
		dispatch(removeFromSaleList(id))
	}

	const handleGameInfo = (e, value, game, key) => {
		const index = values.findIndex((el) => el.bggId === game.bggId)
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

		const gamesCopy = [ ...games ]
		for (let val of values) {
			const index = gamesCopy.findIndex((el) => el.bggId === val.bggId)
			if (index !== -1) {
				gamesCopy[index] = {
					...gamesCopy[index],
					version   : val.version,
					price     : type === 'individual' ? +val.price : null,
					condition : val.condition,
					extraInfo : val.extraInfo.trim().length > 0 ? val.extraInfo.trim() : '',
					isSleeved : val.isSleeved
				}
			}
		}

		const gamesData = {
			games            : gamesCopy,
			type,
			shipPost,
			shipPostPayer,
			shipCourier,
			shipCourierPayer,
			shipPersonal,
			shipCities,
			extraInfoPack    : type === 'pack' ? extraInfoPack.trim() : '',
			totalPrice       : type === 'pack' ? totalPrice : null
		}

		dispatch(sellGames(gamesData))
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className={cls.error}>
				{detailsError && <Message>{detailsError}</Message>}

				{sellError && sellError.map((err, i) => <Message key={i}>{err}</Message>)}

				{saleList.length === 0 && <Message severity="warning">Your sale list is empty</Message>}
			</div>

			{detailsLoading && <Loader />}

			{detailsSuccess && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{games.map((game) => (
							<Grid item key={game.bggId} md={6} xs={12}>
								<SellGameCard
									game={game}
									type={type}
									mode="sell"
									data={values.find((val) => val.bggId === game.bggId)}
									removeFromSaleListHandler={removeFromSaleListHandler}
									handleGameInfo={handleGameInfo}
								/>
							</Grid>
						))}
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
								{type === 'pack' && (
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
