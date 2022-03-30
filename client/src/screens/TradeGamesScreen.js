// @ Modules
import React, { Fragment, useEffect, useState, useRef } from 'react'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import queryString from 'query-string'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import RadioGroup from '@mui/material/RadioGroup'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Radio from '@mui/material/Radio'
import FormHelperText from '@mui/material/FormHelperText'
import Backdrop from '@mui/material/Backdrop'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ListGameCard from '../components/ListGameCard'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import { apiFetchGameDetails, apiListGamesForTrade } from '../api/api'
import {
	useGetListQuery,
	useDeleteFromListMutation,
	useGetBggGamesDetailsQuery,
	useListGamesMutation
} from '../hooks/hooks'
import citiesArr from '../constants/cities'

// @ Main
const TradeGamesScreen = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const navigate = useNavigate()

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
		navigate('/sell')
	}

	if (userList.isSuccess && userList.data.list.length === 1 && isPack) {
		listMutation.reset()
		navigate('/sell')
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
			<Helmet title="Trade your boardgames" />

			<Box display="flex" alignItems="center" gap={2} mb={2}>
				{isFetching && <Loader size={20} />}

				<Box fontSize="h6.fontSize">List games for trading</Box>
			</Box>

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

					<CustomDivider sx={{ my: 2 }} />

					{/* Shipping Area */}
					<Box
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						gap={3}
						sx={{
							width : {
								xs : '100%',
								md : '50%'
							}
						}}
					>
						<FormControl required error={shipError} fullWidth>
							{/* Post shipping */}

							<FormLabel>Preffered trading method</FormLabel>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											checked={shipPost}
											onChange={(e) => handleShippingInfo(e.target.checked, 'post')}
										/>
									}
									label="Romanian Post"
								/>
								{/* Courier shipping */}
								<FormControlLabel
									control={
										<Checkbox
											checked={shipCourier}
											onChange={(e) => handleShippingInfo(e.target.checked, 'courier')}
										/>
									}
									label="Courier"
								/>
								{/* Personal delivery */}
								<FormControlLabel
									control={
										<Checkbox
											checked={shipPersonal}
											onChange={(e) => {
												handleShippingInfo(e.target.checked, 'personal')
											}}
										/>
									}
									label="Personal"
								/>
								<Autocomplete
									disabled={!shipPersonal}
									multiple
									filterSelectedOptions
									value={shipCities}
									onChange={(e, cities) => handleShippingInfo(cities, 'cities')}
									limitTags={2}
									options={citiesArr}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											<Chip size="small" label={option} {...getTagProps({ index })} />
										))}
									renderInput={(params) => (
										<Input
											{...params}
											inputProps={{
												...params.inputProps,
												required : shipCities.length === 0
											}}
											label="Cities"
											placeholder={shipCities.length > 0 ? 'Cities' : 'Select cities'}
											name="cities"
										/>
									)}
								/>
								{shipError && (
									<FormHelperText error>Choose at least one preffered shipping method</FormHelperText>
								)}
							</FormGroup>
						</FormControl>

						{isPack && (
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
						)}

						<LoadingBtn
							type="submit"
							size="large"
							disabled={shipError || isFetching || listMutation.isSuccess}
							variant="contained"
							color="primary"
							loading={listMutation.isLoading}
							fullWidth
						>
							Trade
						</LoadingBtn>
					</Box>
				</Fragment>
			)}

			<Backdrop sx={{ zIndex: 1000 }} open={listMutation.isLoading}>
				<Loader />
			</Backdrop>
		</form>
	)
}

export default TradeGamesScreen
