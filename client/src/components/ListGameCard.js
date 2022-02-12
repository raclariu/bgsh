// @ Libraries
import React, { useEffect, useState, Fragment } from 'react'
import { styled } from '@mui/material/styles'
import { useMutation } from 'react-query'

// @ Mui
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'

// @ Components
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import Input from './Input'
import Loader from './Loader'

// @ Icons
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone'

// @ Others
import { apiUploadImage, apiDeleteImage } from '../api/api'
import { useNotiSnackbar } from '../hooks/hooks'
import { useQueryClient } from 'react-query'

// @ Styles
const StyledImg = styled('img')({
	objectFit    : 'cover',
	width        : '100%',
	height       : '100%',
	borderRadius : '8px'
})

// @ Main
const ListGameCard = ({ game, isPack, mode, data, removeFromListHandler, handleGameInfo }) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))
	const queryClient = useQueryClient()

	const [ showSnackbar ] = useNotiSnackbar()

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const uploadImageMutation = useMutation((formData) => apiUploadImage(formData), {
		onSuccess : (userImageObj, vars) => {
			const bggId = vars.get('bggId')
			handleGameInfo(userImageObj, bggId, 'userImage')
			queryClient.setQueryData([ 'list' ], (oldUserListObj) => {
				const copyUserListObj = { ...oldUserListObj }
				const idx = copyUserListObj.list.findIndex((obj) => obj.bggId === bggId)
				copyUserListObj.list[idx].userImage = userImageObj
				return copyUserListObj
			})
			showSnackbar.success({ text: `Image for "${data.title}" uploaded successfully` })
		},
		onError   : (error) => {
			showSnackbar.error({ text: error.response.data.message || 'Error occured while uploading image' })
		}
	})

	const removeImageMutation = useMutation(({ fileName, bggId }) => apiDeleteImage(fileName, bggId), {
		onSuccess : (data, vars) => {
			handleGameInfo(null, vars.bggId, 'userImage')
			queryClient.setQueryData([ 'list' ], (oldUserListObj) => {
				const copyUserListObj = { ...oldUserListObj }
				const idx = copyUserListObj.list.findIndex((obj) => obj.bggId === vars.bggId)
				copyUserListObj.list[idx].userImage = null
				return copyUserListObj
			})
			showSnackbar.info({ text: `Image for "${vars.title}" deleted successfully` })
		},
		onError   : (error) => {
			showSnackbar.error({ text: error.response.data.message || 'Error occured while removing uploaded image' })
		}
	})

	const handleImages = (e) => {
		const uploadedImg = e.target.files[0]
		if (!uploadedImg) return

		if (uploadedImg.type !== 'image/jpeg' && uploadedImg.type !== 'image/png') {
			showSnackbar.error({ text: 'Only .jpg and .png images are allowed' })

			return
		}

		if (uploadedImg.size > 5 * 1024 * 1024) {
			showSnackbar.error({ text: 'Image too large. Maximum size is 5MB' })

			return
		}

		const fd = new FormData()
		fd.append('userImage', uploadedImg, uploadedImg.name)
		fd.append('bggId', game.bggId)
		uploadImageMutation.mutate(fd)
	}

	const removeImage = (e) => {
		removeImageMutation.mutate({ fileName: data.userImage.name, bggId: game.bggId, title: game.title })
	}

	const handleImgLoad = (e) => {
		console.log('here')
	}

	const prefModeError = mode === 'want' && !data.prefMode.buy && !data.prefMode.trade

	return (
		<Card elevation={2}>
			<CardHeader
				title={game.title}
				subheader={`${game.subtype} • ${game.year}`}
				action={
					<CustomIconBtn onClick={() => removeFromListHandler(game.bggId, game.title)} size="large">
						<HighlightOffIcon color="error" />
					</CustomIconBtn>
				}
				titleTypographyProps={{
					color   : 'primary',
					variant : 'subtitle2'
				}}
				subheaderTypographyProps={{
					color   : 'grey.400',
					variant : 'caption'
				}}
			/>
			<CardMedia
				sx={{
					objectFit      : 'cover',
					height         : '180px',
					objectPosition : 'center 10%'
				}}
				component="img"
				image={displayImageHandler(game.image, game.thumbnail)}
				alt={game.title}
				title={game.title}
			/>

			<CardContent>
				{mode === 'want' && (
					<Fragment>
						<FormControl required error={prefModeError}>
							<FormLabel>Prefer buying or trading for this game?</FormLabel>
							<FormGroup row>
								<FormControlLabel
									control={
										<Checkbox
											onChange={(e) =>
												handleGameInfo(
													{ ...data.prefMode, buy: e.target.checked },
													game.bggId,
													'prefMode'
												)}
											checked={data.prefMode.buy}
										/>
									}
									label="Buy"
								/>
								<FormControlLabel
									control={
										<Checkbox
											onChange={(e) =>
												handleGameInfo(
													{ ...data.prefMode, trade: e.target.checked },
													game.bggId,
													'prefMode'
												)}
											checked={data.prefMode.trade}
										/>
									}
									label="Trade"
								/>

								{prefModeError && (
									<FormHelperText error>Select at least one shipping method</FormHelperText>
								)}
							</FormGroup>
						</FormControl>

						<Autocomplete
							value={data.version}
							isOptionEqualToValue={(option, value) => option.title === value.title}
							onChange={(e, selected) => handleGameInfo(selected, game.bggId, 'prefVersion')}
							options={[ ...game.versions, { title: 'TEST FOR ERROR', year: 1999 } ]}
							getOptionLabel={(option) => `${option.title} (${option.year})`}
							renderInput={(params) => (
								<Input
									{...params}
									name={`version-${game.bggId}`}
									label="Preferred version"
									placeholder="Select preferred version"
									required
								/>
							)}
						/>
					</Fragment>
				)}

				{mode === 'buy' &&
				!isPack && (
					<Input
						value={data.otherUsername}
						onChange={(inputVal) => handleGameInfo(inputVal, game.bggId, 'otherUsername')}
						inputProps={{
							maxLength : 20
						}}
						id="username"
						name="username"
						label="Username"
						type="text"
						placeholder="Username of the person who sold you this game"
						fullWidth
					/>
				)}

				{mode !== 'want' && (
					<Autocomplete
						value={data.version}
						isOptionEqualToValue={(option, value) => option.title === value.title}
						onChange={(e, selected) => handleGameInfo(selected, game.bggId, 'version')}
						options={[ ...game.versions, { title: 'TEST FOR ERROR', year: 1999 } ]}
						getOptionLabel={(option) => `${option.title} (${option.year})`}
						renderInput={(params) => (
							<Input
								{...params}
								name={`version-${game.bggId}`}
								label="Version"
								placeholder="Select game version"
								required
							/>
						)}
					/>
				)}

				{mode !== 'buy' && (
					<Autocomplete
						sx={{ mt: 2 }}
						value={data.condition}
						isOptionEqualToValue={(option, value) => option === value}
						onChange={(e, selected) => handleGameInfo(selected, game.bggId, 'condition')}
						// if options change, don't forget to also change the arr on the server validator
						options={[
							'New',
							'asd',
							'Opened, not played',
							'Like new',
							'Very Good',
							'Good',
							'Acceptable',
							'Poor'
						]}
						renderInput={(params) => (
							<Input
								{...params}
								name={`condition-${game.bggId}`}
								label="Condition"
								placeholder="Select condition"
								required
							/>
						)}
					/>
				)}

				{mode !== 'want' && (
					<Input
						sx={{ margin: (theme) => theme.spacing(2, 0, 2, 0) }}
						value={data.extraInfo}
						onChange={(inputVal) => handleGameInfo(inputVal, game.bggId, 'extraInfo')}
						inputProps={{
							maxLength   : 500,
							placeholder : 'Any other info goes in here (500 characters limit)'
						}}
						label={`Extra info ${data.extraInfo.length}/500`}
						name="extra-info-txt"
						type="text"
						size="medium"
						multiline
						minRows={3}
						maxRows={10}
						fullWidth
					/>
				)}

				{mode !== 'want' && (
					<Grid container sx={{ marginBottom: 2 }}>
						<Grid item xs={6}>
							<FormControlLabel
								control={
									<Switch
										checked={data.isSleeved}
										onChange={(e) => handleGameInfo(e.target.checked, game.bggId, 'isSleeved')}
									/>
								}
								label={<Typography variant="body2">Sleeved?</Typography>}
							/>
						</Grid>

						{(mode === 'sell' || mode === 'buy') &&
						!isPack && (
							<Grid item xs={6}>
								<Input
									onChange={(inputVal) => handleGameInfo(inputVal, game.bggId, 'price')}
									value={data.price}
									name={`price-${game.bggId}`}
									label="Price"
									type="number"
									fullWidth
									required
									InputProps={{
										startAdornment : <InputAdornment position="start">RON</InputAdornment>
									}}
								/>
							</Grid>
						)}
					</Grid>
				)}

				{(mode === 'sell' || mode === 'trade') && (
					<Fragment>
						<CustomDivider textAlign="left">
							<Box fontSize={'0.75rem'}>ADD IMAGE</Box>
						</CustomDivider>

						<Box mt={2}>
							{uploadImageMutation.isLoading || removeImageMutation.isLoading ? (
								<Box
									sx={{
										borderStyle    : 'dashed',
										borderColor    : 'primary.main',
										cursor         : 'pointer',
										width          : 150,
										height         : 100,
										display        : 'flex',
										justifyContent : 'center',
										alignItems     : 'center',
										borderRadius   : '8px'
									}}
								>
									<Loader size={30} />
								</Box>
							) : (
								data.userImage && (
									<Box
										sx={{
											width    : 150,
											height   : 100,
											position : 'relative'
										}}
									>
										<StyledImg
											src={data.userImage.thumbnail}
											alt={data.title}
											title={data.title}
											onLoad={handleImgLoad}
										/>

										<CustomIconBtn
											sx={{
												position : 'absolute',

												right    : '-5px',
												top      : '-5px'
											}}
											color="error"
											onClick={removeImage}
										>
											<HighlightOffIcon />
										</CustomIconBtn>
									</Box>
								)
							)}

							{!data.userImage &&
							!uploadImageMutation.isLoading &&
							!removeImageMutation.isLoading && (
								<label htmlFor={`${data.bggId}-image`}>
									<input
										accept="image/jpeg, image/png"
										id={`${data.bggId}-image`}
										name="image"
										type="file"
										hidden
										onChange={handleImages}
										onClick={(e) => (e.target.value = null)}
									/>

									<ButtonBase component="div">
										<Box
											sx={{
												borderStyle    : 'dashed',
												borderColor    : 'primary.main',
												cursor         : 'pointer',
												width          : 150,
												height         : 100,
												display        : 'flex',
												justifyContent : 'center',
												alignItems     : 'center',
												borderRadius   : '8px'
											}}
										>
											<AddPhotoAlternateTwoToneIcon fontSize="large" color="primary" />
										</Box>
									</ButtonBase>
								</label>
							)}
						</Box>
					</Fragment>
				)}
			</CardContent>
		</Card>
	)
}

export default ListGameCard
