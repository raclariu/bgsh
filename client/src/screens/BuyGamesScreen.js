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
import { apiFetchGameDetails, apiAddBoughtGamesToHistory } from '../api/api'

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

	const mutation = useMutation((gamesData) => apiAddBoughtGamesToHistory(gamesData))

	if (isPack !== false && isPack !== true) {
		mutation.reset()
		history.push('/buy')
	}

	if (saleList.length === 1 && isPack) {
		mutation.reset()
		history.push('/buy')
	}

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
					otherUsername : null,
					extraInfo     : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			} else {
				return {
					...val,
					extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
				}
			}
		})

		const gamesData = {
			games         : verifiedGames,
			isPack,
			extraInfoPack : extraInfoPack.trim() ? extraInfoPack.trim() : null,
			finalPrice    : finalPrice,
			otherUsername : otherUsername.trim() ? otherUsername.trim().toLowerCase() : null
		}

		const testIndividual = {
			games         : [
				{
					type               : 'boardgame',
					bggId              : '299960',
					thumbnail          :
						'https://cf.geekdo-images.com/TYaY5oUlCIOCwDYJkjgKWg__thumb/img/bj66Z9SfSDy3futFwlY-HAJM1fo=/fit-in/200x150/filters:strip_icc()/pic5199243.jpg',
					image              :
						'https://cf.geekdo-images.com/TYaY5oUlCIOCwDYJkjgKWg__original/img/HJD7_FeLkRx9BDSsFYp8GTC3jsM=/0x0/filters:format(jpeg)/pic5199243.jpg',
					title              : 'Alma Mater',
					year               : 2020,
					designers          : [
						'Acchittocca',
						'Flaminia Brasini',
						'Virginio Gigli',
						'Stefano Luperto',
						'Antonio Tinto'
					],
					minPlayers         : 2,
					maxPlayers         : 4,
					suggestedPlayers   : 4,
					languageDependence : null,
					playTime           : '90 - 150',
					minAge             : 12,
					categories         : [
						{
							id   : 1070,
							name : 'Renaissance'
						}
					],
					mechanics          : [
						{
							id   : 2984,
							name : 'Drafting'
						},
						{
							id   : 2875,
							name : 'End Game Bonuses'
						},
						{
							id   : 2040,
							name : 'Hand Management'
						},
						{
							id   : 2002,
							name : 'Tile Placement'
						},
						{
							id   : 2082,
							name : 'Worker Placement'
						}
					],
					versions           : [
						{
							title : 'Chinese edition',
							year  : 2020
						},
						{
							title : 'English edition',
							year  : 2020
						},
						{
							title : 'English/German edition',
							year  : 2020
						},
						{
							title : 'French edition',
							year  : 2021
						},
						{
							title : 'Japanese edition',
							year  : 2021
						},
						{
							title : 'Korean edition',
							year  : 2020
						},
						{
							title : 'Spanish edition',
							year  : 2021
						}
					],
					stats              : {
						ratings   : 1585,
						avgRating : 7.55,
						rank      : 1132
					},
					complexity         : {
						weight : 3.78,
						votes  : 104
					},
					isSleeved          : true,
					version            : {
						title : 'Chinese edition',
						year  : 2020
					},
					extraInfo          : { a: 1 },
					price              : '12313',
					otherUsername      : 'claudiu'
				},
				{
					type               : 'boardgame',
					bggId              : '234487',
					thumbnail          :
						'https://cf.geekdo-images.com/hgUDu_oG0uhnOWX4WM2vXA__thumb/img/KlzN2TK2WVHgCimiLG_aoEZXVQA=/fit-in/200x150/filters:strip_icc()/pic4070329.jpg',
					image              :
						'https://cf.geekdo-images.com/hgUDu_oG0uhnOWX4WM2vXA__original/img/S0BVejCX4yDWZv934q6BS7gAF9M=/0x0/filters:format(jpeg)/pic4070329.jpg',
					title              : 'Altiplano',
					year               : 2017,
					designers          : [ 'Reiner Stockhausen' ],
					minPlayers         : 2,
					maxPlayers         : 5,
					suggestedPlayers   : 3,
					languageDependence : 'No necessary in-game text',
					playTime           : '60 - 120',
					minAge             : 12,
					categories         : [
						{
							id   : 1021,
							name : 'Economic'
						}
					],
					mechanics          : [
						{
							id   : 2001,
							name : 'Action Points'
						},
						{
							id   : 2912,
							name : 'Contracts'
						},
						{
							id   : 2664,
							name : 'Deck, Bag, and Pool Building'
						},
						{
							id   : 2015,
							name : 'Variable Player Powers'
						}
					],
					versions           : [
						{
							title : 'Chinese edition',
							year  : 2018
						},
						{
							title : 'Dutch edition',
							year  : 2018
						},
						{
							title : 'English-only edition',
							year  : 2018
						},
						{
							title : 'English/German edition',
							year  : 2017
						},
						{
							title : 'French edition',
							year  : 2018
						},
						{
							title : 'Hungarian edition',
							year  : 2018
						},
						{
							title : 'Italian edition',
							year  : 2018
						},
						{
							title : 'Japanese edition',
							year  : 2018
						},
						{
							title : 'Polish edition',
							year  : 2018
						},
						{
							title : 'Portuguese edition',
							year  : 2018
						},
						{
							title : 'Russian edition',
							year  : 2018
						},
						{
							title : 'Spanish edition',
							year  : 2017
						}
					],
					stats              : {
						ratings   : 7652,
						avgRating : 7.52,
						rank      : 307
					},
					complexity         : {
						weight : 3.33,
						votes  : 256
					},
					isSleeved          : false,
					version            : {
						title : 'Dutch edition',
						year  : 2018
					},
					extraInfo          : {},
					price              : '12313',
					otherUsername      : 'claudiu'
				}
			],
			isPack        : false,
			extraInfoPack : null,
			finalPrice    : '',
			otherUsername : null
		}
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
