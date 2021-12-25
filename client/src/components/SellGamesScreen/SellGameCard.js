// @ Libraries
import React from 'react'
import { styled } from '@mui/material/styles'

// @ Mui
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
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

// @ Components
import Input from '../Input'

// @ Icons
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

const PREFIX = 'SellGameCard'

const classes = {
	media        : `${PREFIX}-media`,
	autocomplete : `${PREFIX}-autocomplete`,
	extraInfo    : `${PREFIX}-extraInfo`,
	error        : `${PREFIX}-error`
}

const StyledCard = styled(Card)(({ theme }) => ({
	[`& .${classes.media}`]: {
		objectFit      : 'cover',
		height         : '180px',
		objectPosition : 'center 10%'
	},

	[`& .${classes.autocomplete}`]: {
		marginTop : theme.spacing(2)
	},

	[`& .${classes.extraInfo}`]: {
		margin : theme.spacing(2, 0, 2, 0)
	},

	[`& .${classes.error}`]: {
		margin : theme.spacing(2, 0, 2, 0)
	}
}))

// @ Main
const SellGameCard = ({ game, isPack, mode, data, removeFromSaleListHandler, handleGameInfo }) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	return (
		<StyledCard elevation={1}>
			<CardHeader
				title={game.title}
				subheader={`${game.type} • ${game.year}`}
				action={
					<IconButton onClick={() => removeFromSaleListHandler(game.bggId)} size="large">
						<HighlightOffIcon color="error" />
					</IconButton>
				}
				titleTypographyProps={{
					color   : 'primary',
					variant : 'subtitle2'
				}}
				subheaderTypographyProps={{
					variant : 'caption'
				}}
			/>
			<CardMedia
				className={classes.media}
				component="img"
				image={displayImageHandler(game.image, game.thumbnail)}
				alt={game.title}
				title={game.title}
			/>
			<CardContent>
				{mode === 'buy' &&
				!isPack && (
					<Input
						value={data.otherUsername}
						onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'otherUsername')}
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

				{mode !== 'buy' && (
					<Autocomplete
						className={classes.autocomplete}
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

				<Input
					className={classes.extraInfo}
					value={data.extraInfo}
					onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'extraInfo')}
					inputProps={{
						maxLength   : 500,
						placeholder : 'Any other info goes in here (500 characters limit)'
					}}
					name="extra-info-txt"
					type="text"
					size="medium"
					multiline
					minRows={3}
					maxRows={10}
					fullWidth
				/>

				<Grid container>
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
								onChange={(e) => handleGameInfo(e.target.value, game.bggId, 'price')}
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
			</CardContent>
		</StyledCard>
	)
}

export default SellGameCard
