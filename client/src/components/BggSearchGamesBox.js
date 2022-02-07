// @ Libraries
import React, { Fragment, useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// @ Mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'

// @ Components
import CustomButton from './CustomButton'
import Loader from './Loader'
import Input from './Input'

// @ Others
import { addToSaleList } from '../actions/saleListActions'
import { apiBggSearchGames } from '../api/api'
import { useAddToListMutation } from '../hooks/hooks'

// @ Main
const BggSearchGamesBox = () => {
	const dispatch = useDispatch()
	const queryClient = useQueryClient()

	const [ inputText, setInputText ] = useState('')
	const [ debKeyword ] = useDebounce(inputText.trim(), 1500)
	const [ options, setOptions ] = useState([])
	const [ selectedOption, setSelectedOption ] = useState(null)

	const mutation = useMutation((debKeyword) => apiBggSearchGames(debKeyword), {
		onSuccess : (data) => {
			setOptions(data.filter((v, i, a) => a.findIndex((t) => t.bggId === v.bggId) === i))
		}
	})

	const { mutate, reset } = mutation

	const addToListMutation = useAddToListMutation()

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
		[ dispatch, debKeyword, mutate, reset ]
	)

	const handleInput = (e) => {
		if (options.length === 0) {
			setInputText(e.target.value)
		}
	}

	const resetHandler = () => {
		setOptions([])
		setSelectedOption(null)
		mutation.reset()
	}

	console.log('selected option', selectedOption)

	const addToSaleListHandler = () => {
		if (selectedOption) {
			addToListMutation.mutate(selectedOption)
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
				renderOption={(props, option) => {
					return (
						<li {...props} key={option.bggId}>
							{option.title}
						</li>
					)
				}}
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

			<Box display="flex" alignItems="center" justifyContent="flex-end" mt={2} gap={1}>
				<CustomButton
					variant="contained"
					onClick={resetHandler}
					disabled={options.length === 0}
					color="secondary"
				>
					Reset
				</CustomButton>
				<CustomButton variant="contained" onClick={addToSaleListHandler} disabled={!selectedOption}>
					Add to my list
				</CustomButton>
			</Box>
		</Fragment>
	)
}

export default BggSearchGamesBox
