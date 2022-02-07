// @ Libraries
import React from 'react'

// @ Mui
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import RadioGroup from '@mui/material/RadioGroup'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Radio from '@mui/material/Radio'
import FormHelperText from '@mui/material/FormHelperText'

// @ Components
import Input from './Input'

// @ Others
import citiesArr from '../constants/cities'

// @ Main
const ShippingSection = ({
	handleShippingInfo,
	mode,
	shipError,
	shipData           : { shipPost, shipCourier, shipPersonal, shipPostPayer, shipCourierPayer, shipCities }
}) => {
	return (
		<FormControl required error={shipError} fullWidth>
			{/* Post shipping */}
			{mode === 'sell' && <FormLabel>Shipping method</FormLabel>}
			{mode === 'trade' && <FormLabel>Preffered trading method</FormLabel>}
			<FormGroup>
				<FormControlLabel
					control={
						<Checkbox checked={shipPost} onChange={(e) => handleShippingInfo(e.target.checked, 'post')} />
					}
					label="Romanian Post"
				/>

				{mode === 'sell' && (
					<FormControl disabled={!shipPost}>
						<FormLabel>Who pays shipping?</FormLabel>
						<RadioGroup
							row
							value={shipPostPayer}
							onChange={(e) => handleShippingInfo(e.target.value, 'postPayer')}
						>
							<FormControlLabel value="seller" control={<Radio />} label="Seller" />
							<FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
						</RadioGroup>
					</FormControl>
				)}

				{/* Courier shipping */}
				<FormControlLabel
					control={
						<Checkbox
							checked={shipCourier}
							onChange={(e) => handleShippingInfo(e.target.checked, 'courier')}
						/>
					}
					label="Courier"
				/>

				{mode === 'sell' && (
					<FormControl disabled={!shipCourier}>
						<FormLabel>Who pays shipping?</FormLabel>
						<RadioGroup
							row
							value={shipCourierPayer}
							onChange={(e) => handleShippingInfo(e.target.value, 'courierPayer')}
						>
							<FormControlLabel value="seller" control={<Radio />} label="Seller" />
							<FormControlLabel value="buyer" control={<Radio />} label="Buyer" />
						</RadioGroup>
					</FormControl>
				)}

				{/* Personal delivery */}
				<FormControlLabel
					control={
						<Checkbox
							checked={shipPersonal}
							onChange={(e) => {
								handleShippingInfo(e.target.checked, 'personal')
							}}
						/>
					}
					label="Personal"
				/>

				<Autocomplete
					disabled={!shipPersonal}
					multiple
					filterSelectedOptions
					value={shipCities}
					onChange={(e, cities) => handleShippingInfo(cities, 'cities')}
					limitTags={2}
					options={citiesArr}
					renderTags={(value, getTagProps) =>
						value.map((option, index) => <Chip size="small" label={option} {...getTagProps({ index })} />)}
					renderInput={(params) => (
						<Input
							{...params}
							inputProps={{
								...params.inputProps,
								required : shipCities.length === 0
							}}
							label="Cities"
							placeholder={shipCities.length > 0 ? 'Cities' : 'Select cities'}
							name="cities"
						/>
					)}
				/>

				{shipError &&
				mode === 'sell' && <FormHelperText error>Select at least one shipping method</FormHelperText>}

				{shipError &&
				mode === 'trade' && (
					<FormHelperText error>Select at least one preffered shipping method</FormHelperText>
				)}
			</FormGroup>
		</FormControl>
	)
}

export default ShippingSection
