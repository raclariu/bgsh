// @ Libraries
import React, { useEffect, useState, useRef, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useQueryClient, useMutation } from 'react-query'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

// @ Components
import CustomAlert from '../components/CustomAlert'
import AddWantedCard from '../components/AddWantedCard'
import Loader from '../components/Loader'

// @ Others
import { bggGetGamesDetails, removeFromSaleList, addWantedGames } from '../actions/gameActions'
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
				prefVersion  : null,
				prefShipping : []
			}
		})
	)

	const [ values, setValues ] = useState(slRef.current)

	const mapped = slRef.current.map((el) => el.bggId)

	const { isLoading, isError, error, data, isSuccess } = useQuery(
		[ 'bggGamesDetails' ],
		() => apiFetchGameDetails(mapped),
		{
			staleTime : 1000 * 60 * 60
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

	const handleGameInfo = (e, value, id, key) => {
		const index = values.findIndex((el) => el.bggId === id)
		console.log(index)
		const copy = [ ...values ]
		copy[index] = { ...copy[index], [key]: value }
		setValues(copy)
	}

	const removeFromSaleListHandler = (id) => {
		dispatch(removeFromSaleList(id))
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		const gamesData = []
		const valuesCopy = [ ...values ]
		for (let val of valuesCopy) {
			const [ { thumbnail, image, designers, type } ] = data.filter((game) => game.bggId === val.bggId)

			gamesData.push({
				...val,
				type,
				thumbnail,
				image,
				designers
			})
		}

		console.log(gamesData)

		mutation.mutate(gamesData)
	}

	return (
		<form onSubmit={handleSubmit}>
			{isError && <CustomAlert>{error.response.data.message}</CustomAlert>}

			{mutation.isError && mutation.error.response.data.map((err, i) => <CustomAlert key={i}>{err}</CustomAlert>)}

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
