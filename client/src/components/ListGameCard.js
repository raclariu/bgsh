// @ Modules
import React, { Fragment } from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
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
import CloseIcon from '@mui/icons-material/Close'
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone'

// @ Others
import { useNotiSnackbar, useUploadListedGameImageMutation, useDeleteUploadedGameImageMutation } from '../hooks/hooks'

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

	const [ showSnackbar ] = useNotiSnackbar()

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const uploadImageMutation = useUploadListedGameImageMutation({ title: data.title, handleGameInfo })

	const removeImageMutation = useDeleteUploadedGameImageMutation({ handleGameInfo })

	const handleImages = (e) => {
		const uploadedImg = e.target.files[0]
		if (!uploadedImg) return

		if (uploadedImg.type !== 'image/jpeg' && uploadedImg.type !== 'image/png') {
			showSnackbar.error({ text: 'Only .jpg and .png images are allowed' })

			return
		}

		if (uploadedImg.size > 7 * 1024 * 1024) {
			showSnackbar.error({ text: 'Image too large. Maximum size is 7MB' })

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

	const prefModeError = mode === 'want' && !data.prefMode.buy && !data.prefMode.trade

	return (
		<Card elevation={2}>
			<CardHeader
				title={game.title}
				subheader={`${game.subtype} • ${game.year}`}
				action={
					<CustomIconBtn
						onClick={() => removeFromListHandler(game.bggId, game.title)}
						color="error"
						size="large"
					>
						<CloseIcon />
					</CustomIconBtn>
				}
				titleTypographyProps={{
					color   : 'primary',
					variant : 'subtitle2'
				}}
				subheaderTypographyProps={{
					color   : 'text.secondary',
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
						<FormControl required error={prefModeError} sx={{ mb: 2 }}>
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
							options={game.versions}
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
						sx={{ mb: 2 }}
						value={data.otherUsername}
						onChange={(inputVal) => handleGameInfo(inputVal, game.bggId, 'otherUsername')}
						inputProps={{
							minLength : 4,
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
						options={game.versions}
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

				{mode !== 'buy' &&
				mode !== 'want' && (
					<Autocomplete
						sx={{ mt: 2 }}
						value={data.condition}
						isOptionEqualToValue={(option, value) => option === value}
						onChange={(e, selected) => handleGameInfo(selected, game.bggId, 'condition')}
						// if options change, don't forget to also change the arr on the server validator
						options={[ 'New', 'Opened, not played', 'Like new', 'Very Good', 'Good', 'Acceptable', 'Poor' ]}
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

				<Input
					sx={{ my: 2 }}
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

				{mode !== 'want' && (
					<Grid container>
						<Grid item xs={5}>
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
							<Grid item xs={7}>
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
						<CustomDivider textAlign="left" sx={{ mt: 2 }}>
							<Box fontSize="caption.fontSize">ADD IMAGE</Box>
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
										<StyledImg src={data.userImage.thumbnail} alt={data.title} title={data.title} />

										<CustomIconBtn
											sx={{
												position : 'absolute',
												right    : '-5px',
												top      : '-5px'
											}}
											size="small"
											color="error"
											onClick={removeImage}
										>
											<CloseIcon />
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
