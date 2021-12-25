// @ Libraries
import React, { useEffect, useState, useRef, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import makeStyles from '@mui/styles/makeStyles';
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

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiAddWantedGames } from '../api/api'

// @ Styles
const useStyles = makeStyles((theme) => ({
	section : {
		marginTop    : theme.spacing(4),
		marginBottom : theme.spacing(2)
	}
}))

// @ Main
const AddWantedGamesScreen = () => {
	const cls = useStyles()
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const saleList = useSelector((state) => state.saleList)

	const slRef = useRef(
		saleList.map((game) => {
			return {
				...game,
				prefVersion : null,
				prefMode    : {
					buy   : false,
					trade : false
				}
			}
		})
	)

	const [ values, setValues ] = useState(slRef.current)
	const [ shipPreffered, setShipPreffered ] = useState([])

	const mapped = slRef.current.map((el) => el.bggId)

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(mapped),
		{
			staleTime : 1000 * 60 * 60
		}
	)

	console.log(data && data)

	const mutation = useMutation((gamesData) => apiAddWantedGames(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries('wantedGames')
			queryClient.invalidateQueries('myWantedGames')
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

	const handleGameInfo = (value, id, key) => {
		const index = values.findIndex((el) => el.bggId === id)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		const gamesCopy = data.filter(({ bggId }) => values.find((val) => val.bggId === bggId))
		for (let val of values) {
			const index = gamesCopy.findIndex((el) => el.bggId === val.bggId)
			if (index !== -1) {
				gamesCopy[index] = {
					...gamesCopy[index],
					prefVersion : val.prefVersion,
					prefMode    : val.prefMode
				}
			}
		}

		const gamesData = {
			games         : gamesCopy,
			shipPreffered
		}

		console.log(gamesData)
		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{mutation.isError &&
				Object.values(mutation.error.response.data.message).map((err, i) => (
					<CustomAlert key={i}>{err}</CustomAlert>
				))}

			{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}

			{isLoading && <Loader />}

			{isSuccess && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
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

					<Grid container>
						<Autocomplete
							multiple
							filterSelectedOptions
							value={data.shipPreffered}
							onChange={(e, selected) => setShipPreffered(selected)}
							limitTags={2}
							options={[ 'Romanian Post', 'Courier', 'Personal' ]}
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
					</Grid>

					<Box display="flex">
						<Button type="submit" variant="contained" color="primary">
							Add games
						</Button>
					</Box>
				</Fragment>
			)}
		</form>
	)
}

export default AddWantedGamesScreen
