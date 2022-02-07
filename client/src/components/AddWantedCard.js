// @ Libraries
import React from 'react'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'

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
import Chip from '@mui/material/Chip'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'

// @ Components
import Input from './Input'

// @ Icons
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

// @ Main
const AddWantedCard = ({ game, removeFromSaleListHandler, handleGameInfo, data }) => {
	const matches = useMediaQuery((theme) => theme.breakpoints.up('md'))

	const displayImageHandler = (image, thumbnail) => {
		if (matches) {
			return image ? image : '/images/gameImgPlaceholder.jpg'
		} else {
			return thumbnail ? thumbnail : '/images/gameImgPlaceholder.jpg'
		}
	}

	const prefModeError = !data.prefMode.buy && !data.prefMode.trade

	return (
		<Card elevation={2}>
			<CardHeader
				title={game.title}
				subheader={`${game.subtype} • ${game.year}`}
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

						{prefModeError && <FormHelperText error>Select at least one shipping method</FormHelperText>}
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
			</CardContent>
		</Card>
	)
}

export default AddWantedCard
