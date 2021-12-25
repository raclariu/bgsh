// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import makeStyles from '@mui/styles/makeStyles';
import { useDebounce } from 'use-debounce'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// @ Mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'

// @ Components
import Loader from './Loader'
import Input from './Input'

// @ Others
import { addToSaleList } from '../actions/saleListActions'
import { apiBggSearchGames } from '../api/api'

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
	const queryClient = useQueryClient()

	const [ inputText, setInputText ] = useState('')
	const [ debKeyword ] = useDebounce(inputText.trim(), 1500)
	const [ options, setOptions ] = useState([])
	const [ selectedOption, setSelectedOption ] = useState(null)

	const mutation = useMutation((debKeyword) => apiBggSearchGames(debKeyword))
	const { mutate } = mutation

	useEffect(
		() => {
			if (debKeyword.length > 2) {
				mutate(debKeyword)
			}

			return () => {
				setOptions([])
				setSelectedOption(null)
			}
		},
		[ dispatch, debKeyword, mutate ]
	)

	useEffect(
		() => {
			if (mutation.isSuccess) {
				setOptions(mutation.data)
			}
		},
		[ mutation ]
	)

	const handleInput = (e) => {
		if (options.length === 0) {
			setInputText(e.target.input)
		}
	}

	const resetHandler = () => {
		setOptions([])
		setSelectedOption(null)
		mutation.reset()
	}

	const addToSaleListHandler = () => {
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
				loading={mutation.isLoading}
				noOptionsText={
					mutation.isError ? mutation.error.response.data.message : 'Board games will show up here'
				}
				onChange={(e, value) => setSelectedOption(value)}
				getOptionLabel={(option) => `${option.title} (${option.year})`}
				options={options}
				renderInput={(params) => (
					<Input
						{...params}
						onChange={handleInput}
						label="Enter board game title"
						size="medium"
						error={mutation.isError || (mutation.data && mutation.data.length === 0) ? true : false}
						helperText={
							mutation.isError ? (
								mutation.error.response.data.message
							) : mutation.data && mutation.data.length === 0 ? (
								'No results found'
							) : (
								false
							)
						}
						placeholder="Title"
						variant="outlined"
						InputProps={{
							...params.InputProps,
							endAdornment : (
								<Fragment>
									{mutation.isLoading ? <Loader color="secondary" size={20} /> : null}
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
					onClick={addToSaleListHandler}
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
