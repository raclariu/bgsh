// @ Modules
import React, { useState, Fragment } from 'react'

// @ Mui
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'

// @ Icons
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// @ Components
import Input from './Input'
import CustomTooltip from './CustomTooltip'
import CustomIconBtn from './CustomIconBtn'
import CustomBtn from './CustomBtn'
import LoadingBtn from './LoadingBtn'
import CustomAlert from './CustomAlert'
import CustomDivider from './CustomDivider'

// @ Others
import { useEditListingMutation } from '../hooks/hooks'

// @ Styles
const StyledImg = styled('img')({
	verticalAlign  : 'bottom',
	objectFit      : 'cover',
	width          : 48,
	height         : 48,
	borderRadius   : '4px',
	imageRendering : '-webkit-optimize-contrast'
})

// @ Main
const EditListedGameBtn = ({ data }) => {
	const [ index, setIndex ] = useState(0)
	const [ open, setOpen ] = useState(false)
	const [ price, setPrice ] = useState(data.totalPrice || '')
	const [ extraInfoPack, setExtraInfoPack ] = useState(data.extraInfoPack || '')
	const [ values, setValues ] = useState(
		data.games.map((game) => {
			return {
				bggId     : game.bggId,
				extraInfo : game.extraInfo || '',
				title     : game.title
			}
		})
	)

	const mutation = useEditListingMutation({ mode: data.mode, cleanUp: () => setOpen(false) })

	const handleGameInfo = (value, bggId, key) =>
		setValues((vals) => vals.map((val) => (val.bggId === bggId ? { ...val, [key]: value } : val)))

	const handleIndex = (type) => {
		if (type === 'minus') {
			if (index > 0) {
				setIndex(index - 1)
			}
		}
		if (type === 'plus') {
			if (data.games.length > index + 1) {
				setIndex(index + 1)
			}
		}
	}

	const handleDialogOpen = () => {
		setOpen(true)
	}

	const handleDialogClose = () => {
		setOpen(false)
	}

	const handlePriceInput = (inputVal) => {
		setPrice(inputVal)
	}

	const handleExtraInfoPackInput = (inputVal) => {
		setExtraInfoPack(inputVal)
	}

	const submitHandler = (e) => {
		e.preventDefault()
		const verifiedIndividualUpdates = values.map((val) => {
			return {
				...val,
				extraInfo : val.extraInfo.trim() ? val.extraInfo.trim() : null
			}
		})

		const update = {
			games         : verifiedIndividualUpdates,
			price         : data.mode === 'sell' ? price : null,
			extraInfoPack : data.isPack && extraInfoPack.trim() ? extraInfoPack.trim() : null,
			isPack        : data.isPack
		}

		mutation.mutate({ update, id: data._id })
	}

	return (
		<Fragment>
			<CustomTooltip title="Edit">
				<CustomIconBtn onClick={handleDialogOpen} size="large" color="primary">
					<EditTwoToneIcon />
				</CustomIconBtn>
			</CustomTooltip>

			<Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
				<form onSubmit={submitHandler} autoComplete="off">
					{mutation.isError && (
						<DialogContent>
							<Box display="flex" flexDirection="column" gap={1}>
								{Object.values(mutation.error.response.data.message).map((err, i) => (
									<CustomAlert key={i}>{err}</CustomAlert>
								))}
							</Box>
						</DialogContent>
					)}

					<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<Box display="flex" alignItems="flex-start" gap={2}>
							<StyledImg
								src={data.games[index].thumbnail}
								alt={data.games[index].title}
								title={data.games[index].title}
							/>
							<Box fontWeight="fontWeightMedium">{`Editing ${data.games[index].title}`}</Box>
						</Box>

						<Input
							value={values.find((el) => el.bggId === data.games[index].bggId).extraInfo}
							onChange={(inputVal) => handleGameInfo(inputVal, data.games[index].bggId, 'extraInfo')}
							inputProps={{
								maxLength   : 500,
								placeholder : 'Any other info goes in here (500 characters limit)'
							}}
							label={`Extra info ${values.find((el) => el.bggId === data.games[index].bggId).extraInfo
								.length}/500`}
							name="extra-info-txt"
							type="text"
							size="medium"
							multiline
							minRows={3}
							maxRows={10}
							fullWidth
						/>

						{data.mode === 'sell' &&
						!data.isPack && (
							<Input
								onChange={(inputVal) => handlePriceInput(inputVal)}
								value={price}
								name="price"
								label="Price"
								type="number"
								fullWidth
								required
								InputProps={{
									startAdornment : <InputAdornment position="start">RON</InputAdornment>
								}}
							/>
						)}

						{data.isPack && (
							<Fragment>
								<CustomDivider />
								<Box fontWeight="fontWeightMedium">{`Editing pack data`}</Box>

								<Input
									onChange={handleExtraInfoPackInput}
									value={extraInfoPack}
									name="extra-info-pack"
									label={`Extra pack info ${extraInfoPack.length}/500`}
									size="medium"
									multiline
									minRows={3}
									maxRows={10}
									type="text"
									inputProps={{
										maxLength   : 500,
										placeholder :
											'Any other info regarding the pack goes in here (500 characters limit)'
									}}
									fullWidth
								/>

								{data.mode === 'sell' && (
									<Input
										onChange={(inputVal) => handlePriceInput(inputVal)}
										value={price}
										name="pack-price"
										label="Pack price"
										type="number"
										fullWidth
										required
										InputProps={{
											startAdornment : <InputAdornment position="start">RON</InputAdornment>
										}}
									/>
								)}
							</Fragment>
						)}
					</DialogContent>

					<CustomDivider />

					<DialogActions>
						<Box
							display="flex"
							alignItems="center"
							justifyContent={data.isPack ? 'space-between' : 'flex-end'}
							width="100%"
						>
							{data.isPack && (
								<Box display="flex" alignItems="center" gap={1}>
									<CustomIconBtn
										color="primary"
										disabled={index === 0}
										onClick={() => handleIndex('minus')}
									>
										<ArrowBackIcon />
									</CustomIconBtn>

									<CustomIconBtn
										color="primary"
										disabled={data.games.length === index + 1}
										onClick={() => handleIndex('plus')}
									>
										<ArrowForwardIcon />
									</CustomIconBtn>
								</Box>
							)}

							<Box display="flex" alignItems="center" gap={1}>
								<CustomBtn onClick={handleDialogClose}>Cancel</CustomBtn>
								<LoadingBtn
									type="submit"
									variant="contained"
									color="primary"
									loading={mutation.isLoading}
								>
									Update
								</LoadingBtn>
							</Box>
						</Box>
					</DialogActions>
				</form>
			</Dialog>
		</Fragment>
	)
}

export default EditListedGameBtn
