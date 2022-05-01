// @ Modules
import React, { useState, Fragment } from 'react'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Backdrop from '@mui/material/Backdrop'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'

// @ Icons
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone'

// @ Components
import CustomDivider from '../components/CustomDivider'
import ListGameCard from '../components/ListGameCard'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'
import Helmet from '../components/Helmet'

// @ Others
import {
	useGetBggGamesDetailsQuery,
	useGetListQuery,
	useDeleteFromListMutation,
	useListGamesMutation
} from '../hooks/hooks'
import citiesArr from '../constants/cities'

// @ Main
const AddWantedGamesScreen = () => {
	const [ shipPost, setShipPost ] = useState(true)
	const [ shipCourier, setShipCourier ] = useState(false)
	const [ shipPersonal, setShipPersonal ] = useState(false)
	const [ shipCities, setShipCities ] = useState([])
	const [ values, setValues ] = useState([])

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const { isError, error, data, isFetching, isSuccess: isSuccessDetails } = useGetBggGamesDetailsQuery((data) => {
		setValues(
			data.map((game) => {
				return {
					...game,
					prefVersion : null,
					prefMode    : {
						buy   : true,
						trade : false
					},
					extraInfo   : ''
				}
			})
		)
	})

	const deleteMutation = useDeleteFromListMutation()
	const listMutation = useListGamesMutation('want')

	const shipError = [ shipPost, shipCourier, shipPersonal ].filter((checkbox) => checkbox).length < 1

	const handleGameInfo = (value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const removeFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
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
			games        : verifiedGames,
			shipPost,
			shipCourier,
			shipPersonal,
			shipCities
		}

		listMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			<Helmet title="Add wanted boardgames" />

			<Box display="flex" alignItems="center" gap={2}>
				{isFetching ? <Loader size={24} /> : <AddCircleTwoToneIcon color="primary" />}

				<Box fontSize="h5.fontSize">List wanted games</Box>
			</Box>

			<CustomDivider sx={{ my: 4 }} />

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
								// Because we may have 6 fetched games, but values could have only 3 because
								// user deleted 3, we need to only render a list of the ones that are in values
								values.find((val) => val.bggId === game.bggId) && (
									<Grid item xs={12} md={6} key={game.bggId}>
										<ListGameCard
											game={game}
											mode="want"
											removeFromListHandler={removeFromListHandler}
											handleGameInfo={handleGameInfo}
											data={values.find((val) => val.bggId === game.bggId)}
										/>
									</Grid>
								)
						)}
					</Grid>

					<CustomDivider sx={{ my: 4 }} />

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
							<FormLabel>Preferred shipping method</FormLabel>
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
									<FormHelperText error>Choose at least one preferred shipping method</FormHelperText>
								)}
							</FormGroup>
						</FormControl>

						<LoadingBtn
							type="submit"
							size="large"
							disabled={isFetching || listMutation.isSuccess}
							variant="contained"
							color="primary"
							loading={listMutation.isLoading}
							fullWidth
						>
							List wanted games
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

export default AddWantedGamesScreen
