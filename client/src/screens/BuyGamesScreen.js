// @ Libraries
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
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
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Input from '../components/Input'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiAddGameToHistory } from '../api/api'

// @ Main
const BuyGamesScreen = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const history = useHistory()
	const queryClient = useQueryClient()

	let { pack: isPack = false } = queryString.parse(location.search)
	isPack = !!isPack

	const saleList = useSelector((state) => state.saleList)

	const [ extraInfoPack, setExtraInfoPack ] = useState('')
	const [ finalPrice, setFinalPrice ] = useState('')
	const [ otherUsername, setOtherUsername ] = useState('')
	const [ values, setValues ] = useState([])

	console.log(values)

	if (isPack !== false && isPack !== true) {
		history.push('/sell')
	}

	if (saleList.length === 1 && isPack) {
		history.push('/sell')
	}

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(saleList.map((el) => el.bggId)),
		{
			staleTime : Infinity,
			enabled   : !!saleList.length,
			onSuccess : (data) => {
				setValues(
					data.map((game) => {
						return {
							...game,
							isSleeved     : false,
							version       : null,
							extraInfo     : '',
							price         : '',
							otherUsername : ''
						}
					})
				)
			}
		}
	)

	const mutation = useMutation((gamesData) => apiAddGameToHistory(gamesData))

	useEffect(
		() => {
			return () => {
				queryClient.invalidateQueries([ 'bggGamesDetails' ])
			}
		},
		[ queryClient ]
	)

	// When saleList changes, usually as a result of removing a saleList item, set values accordingly to the new saleList
	useEffect(
		() => {
			setValues((val) => val.filter(({ bggId }) => saleList.find((el) => el.bggId === bggId)))
		},
		[ saleList ]
	)

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleGameInfo = (value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const handleExtraInfoPack = (e) => {
		setExtraInfoPack(e.target.value)
	}

	const handleFinalPrice = (e) => {
		setFinalPrice(e.target.value)
	}

	const handleOtherUsername = (e) => {
		setOtherUsername(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (saleList.length === 0) return

		const verifiedGames = values.map((val) => {
			if (isPack) {
				return {
					...val,
					price         : null,
					otherUsername : null
				}
			} else {
				return {
					...val
				}
			}
		})

		const gamesData = {
			games         : verifiedGames,
			isPack,
			mode          : 'buy',
			extraInfoPack : extraInfoPack.trim() ? extraInfoPack.trim() : null,
			finalPrice    : finalPrice ? finalPrice : null,
			otherUsername : otherUsername ? otherUsername : null
		}

		console.log(gamesData)

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}

			{mutation.isError &&
				Object.values(mutation.error.response.data.message).map((err, i) => (
					<CustomAlert key={i}>{err}</CustomAlert>
				))}

			{isLoading && <Loader />}

			{isSuccess &&
			saleList.length > 0 && (
				<Fragment>
					<Grid container spacing={3}>
						{values.map((game) => (
							<Grid item key={game.bggId} xs={12} sm={6} md={4}>
								<SellGameCard
									game={game}
									isPack={isPack}
									mode="buy"
									data={values.find((val) => val.bggId === game.bggId)}
									removeFromSaleListHandler={removeFromSaleListHandler}
									handleGameInfo={handleGameInfo}
								/>
							</Grid>
						))}
					</Grid>

					<Divider />

					<Grid item sm={6} xs={12}>
						<Grid container direction="column">
							{isPack && (
								<Fragment>
									<Input
										value={data.otherUsername}
										onChange={handleOtherUsername}
										inputProps={{
											maxLength : 20
										}}
										id="username"
										name="username"
										label="Username"
										type="text"
										placeholder="Username of the person who sold you this game"
										fullWidth
									/>
									<Grid item>
										<Input
											type="number"
											value={finalPrice}
											onChange={handleFinalPrice}
											label="Price"
											name="final-price"
											InputProps={{
												startAdornment : <InputAdornment position="start">RON</InputAdornment>
											}}
											required
											fullWidth
										/>
									</Grid>
									<Grid item>
										<Input
											onChange={handleExtraInfoPack}
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

							<Grid item>
								<Button type="submit" variant="contained" color="primary" fullWidth>
									Buy
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Fragment>
			)}
		</form>
	)
}

export default BuyGamesScreen
