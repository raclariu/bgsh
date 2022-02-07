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
import ListGameCard from '../components/ListGameCard'
import CustomAlert from '../components/CustomAlert'
import Loader from '../components/Loader'
import Input from '../components/Input'
import LoadingBtn from '../components/LoadingBtn'

// @ Others
import { removeFromSaleList } from '../actions/saleListActions'
import { apiFetchGameDetails, apiAddWantedGames } from '../api/api'
import { useGetBggGamesDetailsQuery, useGetListQuery, useDeleteFromListMutation } from '../hooks/hooks'

// @ Main
const AddWantedGamesScreen = () => {
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const [ shipPreffered, setShipPreffered ] = useState([])
	const [ values, setValues ] = useState([])

	const userList = useGetListQuery((listData) =>
		setValues((val) => val.filter(({ bggId }) => listData.list.find((el) => el.bggId === bggId)))
	)

	const {
		isError,
		error,
		data,
		isFetching,
		isSuccess  : isSuccessDetails,
		status
	} = useGetBggGamesDetailsQuery((data) => {
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
	})

	const deleteMutation = useDeleteFromListMutation()

	const listMutation = useMutation((gamesData) => apiAddWantedGames(gamesData), {
		onSuccess : () => {
			queryClient.invalidateQueries([ 'index', 'want' ])
			queryClient.invalidateQueries([ 'myListedGames' ])
		}
	})

	const handleGameInfo = (value, id, key) => {
		setValues((vals) => vals.map((val) => (val.bggId === id ? { ...val, [key]: value } : val)))
	}

	const removeFromListHandler = (bggId, title) => {
		deleteMutation.mutate({ bggId, title })
	}

	console.log(values)

	const handleSubmit = (e) => {
		e.preventDefault()

		if (userList.data.list.length === 0) return

		const verifiedGames = values.map((val) => {
			return {
				...val
			}
		})

		const gamesData = {
			games         : verifiedGames,
			shipPreffered
		}

		listMutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit} autoComplete="off">
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
							loading={listMutation.isLoading}
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
