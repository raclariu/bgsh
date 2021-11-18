// @ Libraries
import React from 'react'

// @ Mui
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import RadioGroup from '@material-ui/core/RadioGroup'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import Radio from '@material-ui/core/Radio'
import FormHelperText from '@material-ui/core/FormHelperText'

// @ Others
import citiesArr from '../../constants/cities'

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
						<TextField
							{...params}
							required
							inputProps={{
								...params.inputProps,
								required : shipCities.length === 0
							}}
							label="Cities"
							placeholder={shipCities.length > 0 ? 'Cities' : 'Select cities'}
							name="cities"
							variant="outlined"
							size="small"
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
