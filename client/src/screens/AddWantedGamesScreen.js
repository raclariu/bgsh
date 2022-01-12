// @ Libraries
import React, { useEffect, useState, useRef, Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, useQueryClient, useMutation } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// @ Components
import CustomAlert from '../components/CustomAlert'
import AddWantedCard from '../components/AddWantedCard'
import Loader from '../components/Loader'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiAddWantedGames } from '../api/api'

// @ Main
const AddWantedGamesScreen = () => {
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const saleList = useSelector((state) => state.saleList)

	const [ shipPreffered, setShipPreffered ] = useState([])
	const [ values, setValues ] = useState([])

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(saleList.map((el) => el.bggId)),
		{
			staleTime : 1000 * 60 * 60,
			enabled   : !!saleList.length,
			onSuccess : (data) => {
				setValues(
					data.map((game) => {
						return {
							...game,
							prefVersion : null,
							prefMode    : {
								buy   : true,
								trade : false
							}
						}
					})
				)
			}
		}
	)

	const mutation = useMutation((gamesData) => apiAddWantedGames(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries('wantedGames')
			queryClient.invalidateQueries('myWantedGames')
		}
	})

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

	const handleGameInfo = (value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	console.log(values)

	const handleSubmit = (e) => {
		e.preventDefault()

		if (saleList.length === 0) return

		const verifiedGames = values.map((val) => {
			return {
				...val
			}
		})

		const gamesData = {
			games         : verifiedGames,
			shipPreffered
		}

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{mutation.isError &&
				Object.values(mutation.error.response.data.message).map((err, i) => (
					<CustomAlert key={i}>{err}</CustomAlert>
				))}

			{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}

			{isLoading && <Loader />}

			{isSuccess && (
				<Fragment>
					<Grid container spacing={3}>
						{data.map(
							(game) =>
								// Because we may have 6 fetched games, but values could have only 3 because
								// user deleted 3, we need to only render a list of the ones that are in values
								values.find((val) => val.bggId === game.bggId) && (
									<Grid item xs={12} md={6} key={game.bggId}>
										<AddWantedCard
											game={game}
											removeFromSaleListHandler={removeFromSaleListHandler}
											handleGameInfo={handleGameInfo}
											data={values.find((val) => val.bggId === game.bggId)}
										/>
									</Grid>
								)
						)}
					</Grid>

					<Autocomplete
						multiple
						filterSelectedOptions
						value={data.shipPreffered}
						onChange={(e, selected) => setShipPreffered(selected)}
						limitTags={2}
						options={[ 'Romanian Post', 'Courier', 'Personal', 'Fake' ]}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip size="small" label={option} {...getTagProps({ index })} />
							))}
						renderInput={(params) => (
							<Input
								{...params}
								inputProps={{
									...params.inputProps,
									required : shipPreffered.length === 0
								}}
								label="Preferred shipping methods"
								placeholder={'Select prefered shipping methods'}
								name="pref-shipping"
							/>
						)}
					/>

					<Box display="flex">
						<LoadingBtn
							type="submit"
							variant="contained"
							color="primary"
							loading={mutation.isLoading}
							fullWidth
						>
							Add wanted games
						</LoadingBtn>
					</Box>
				</Fragment>
			)}
		</form>
	)
}

export default AddWantedGamesScreen
