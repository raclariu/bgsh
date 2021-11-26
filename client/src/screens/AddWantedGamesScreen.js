// @ Libraries
import React, { useEffect, useState, useRef, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'

// @ Components
import CustomAlert from '../components/CustomAlert'
import AddWantedCard from '../components/AddWantedCard'

// @ Others
import { bggGetGamesDetails, removeFromSaleList, addWantedGames } from '../actions/gameActions'

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

	const saleList = useSelector((state) => state.saleList)

	const slRef = useRef(
		saleList.map((game) => {
			delete game._id
			return {
				...game,
				prefVersion  : null,
				prefShipping : []
			}
		})
	)

	const [ values, setValues ] = useState(slRef.current)

	const bggGamesDetails = useSelector((state) => state.bggGamesDetails)
	const { loading: detailsLoading, error: detailsError, success: detailsSuccess, games } = bggGamesDetails

	const addWanted = useSelector((state) => state.addWantedGames)
	const { loading: loadingAdd, error: errorAdd, success: successAdd } = addWanted

	useEffect(
		() => {
			const mapped = slRef.current.map((el) => el.bggId)

			if (mapped.length > 0) {
				dispatch(bggGetGamesDetails(mapped))
			}
		},
		[ dispatch ]
	)

	useEffect(
		() => {
			if (slRef.current.length !== saleList.length) {
				setValues((val) => val.filter(({ bggId }) => saleList.find((el) => el.bggId === bggId)))
			}
		},
		[ saleList ]
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
			const [ { thumbnail, image, designers, type } ] = games.filter((game) => game.bggId === val.bggId)

			gamesData.push({
				...val,
				type,
				thumbnail,
				image,
				designers
			})
		}

		console.log(gamesData)

		dispatch(addWantedGames(gamesData))
	}

	return (
		<form onSubmit={handleSubmit}>
			{detailsError && <CustomAlert>{detailsError}</CustomAlert>}

			{errorAdd && errorAdd.map((err, i) => <CustomAlert key={i}>{err}</CustomAlert>)}

			{saleList.length === 0 && <CustomAlert severity="warning">Your sale list is empty</CustomAlert>}

			{detailsSuccess && (
				<Fragment>
					<Grid container spacing={3} className={cls.section}>
						{games.map(
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
