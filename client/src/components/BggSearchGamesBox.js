// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useDebounce } from 'use-debounce'

// @ Mui
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete'

// @ Components
import Loader from './Loader'

// @ Others
import { bggSearchGames, addToSaleList } from '../actions/gameActions'
import { BGG_GAMES_SEARCH_RESET } from '../constants/gameConstants'

// @ Styles
const useStyles = makeStyles((theme) => ({
	button : {
		marginLeft : theme.spacing(1)
	}
}))

// @ Main
const BggSearchGamesBox = () => {
	const cls = useStyles()
	const dispatch = useDispatch()

	const [ inputText, setInputText ] = useState('')
	const [ debKeyword ] = useDebounce(inputText.trim(), 1500)
	const [ options, setOptions ] = useState([])
	const [ selectedOption, setSelectedOption ] = useState(null)

	const bggSearch = useSelector((state) => state.bggSearchGames)
	const { loading, error, success, games } = bggSearch

	useEffect(
		() => {
			if (debKeyword.length > 2) {
				dispatch(bggSearchGames(debKeyword))
			}

			return () => {
				setOptions([])
				setSelectedOption(null)
				dispatch({ type: BGG_GAMES_SEARCH_RESET })
			}
		},
		[ dispatch, debKeyword ]
	)

	useEffect(
		() => {
			if (success) {
				setOptions(games)
			}
		},
		[ games, success, dispatch ]
	)

	const changeInputHandler = (e) => {
		if (options.length === 0) {
			setInputText(e.target.value)
		}
	}

	const resetHandler = () => {
		setOptions([])
		dispatch({ type: BGG_GAMES_SEARCH_RESET })
		setSelectedOption(null)
	}

	const submitHandler = () => {
		if (selectedOption) {
			dispatch(addToSaleList(selectedOption))
			resetHandler()
		}
	}

	return (
		<Fragment>
			<Box mb={2} fontWeight="fontWeightMedium">
				Search BoardGameGeek by game title
			</Box>

			<Autocomplete
				fullWidth
				value={selectedOption}
				loading={loading}
				noOptionsText={error ? error : 'Board games will show up here'}
				onChange={(e, value) => setSelectedOption(value)}
				getOptionLabel={(option) => `${option.title} (${option.year})`}
				options={options}
				renderInput={(params) => (
					<TextField
						{...params}
						onChange={(e) => changeInputHandler(e)}
						label="Search for board game"
						error={error ? true : false}
						helperText={error ? error : false}
						placeholder="Enter game title"
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment : (
								<Fragment>
									{loading ? <Loader color="secondary" size={20} /> : null}
									{params.InputProps.endAdornment}
								</Fragment>
							)
						}}
					/>
				)}
			/>

			<Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
				<Button variant="contained" onClick={resetHandler} disabled={options.length === 0} color="secondary">
					Reset
				</Button>
				<Button
					className={cls.button}
					variant="contained"
					onClick={submitHandler}
					disabled={!selectedOption}
					color="secondary"
				>
					Add to my list
				</Button>
			</Box>
		</Fragment>
	)
}

export default BggSearchGamesBox
