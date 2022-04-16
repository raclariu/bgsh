// @ Modules
import React, { useState, Fragment } from 'react'

// @ Mui
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

// @ Components
import Input from './Input'
import LoadingBtn from './LoadingBtn'

// @ Others
import { useUpdateSocialsMutation, useGetSocialsQuery } from '../hooks/hooks'

const SocialsForm = () => {
	const [ bggUsername, setBggUsername ] = useState('')
	const [ fbgUsername, setFbgUsername ] = useState('')
	const [ isChecked, setIsChecked ] = useState(false)

	const updateSocialsOnSuccess = (data) => {
		setBggUsername(data.socials.bggUsername ? data.socials.bggUsername : '')
		setFbgUsername(data.socials.fbgUsername ? data.socials.fbgUsername : '')
		setIsChecked(data.socials.show)
	}

	const { isLoading, data, isSuccess } = useGetSocialsQuery({ updateSocialsOnSuccess })

	const mutation = useUpdateSocialsMutation()

	const handleSocialsCheckbox = (e) => {
		setIsChecked(e.target.checked)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		mutation.mutate({ bggUsername, fbgUsername, show: isChecked })
	}

	let bggUsernameError =
		mutation.isError && mutation.error.response.data.message.bggUsernameError
			? mutation.error.response.data.message.bggUsernameError
			: false
	let fbgUsernameError =
		mutation.isError && mutation.error.response.data.message.fbgUsernameError
			? mutation.error.response.data.message.fbgUsernameError
			: false

	return (
		<Fragment>
			<Box width="100%">
				<form onSubmit={handleSubmit} autoComplete="off">
					<Box display="flex" flexDirection="column">
						{console.count('renders')}
						<Input
							sx={{ minHeight: '90px' }}
							disabled={isLoading}
							error={!!bggUsernameError}
							helperText={bggUsernameError}
							onChange={(inputVal) => setBggUsername(inputVal)}
							value={bggUsername}
							size="medium"
							id="bggUsername"
							name="bggUsername"
							label="BGG Username"
							placeholder="Your BoardGameGeek username"
							type="text"
							fullWidth
						/>

						<Input
							sx={{ minHeight: '90px' }}
							disabled={isLoading}
							error={!!fbgUsernameError}
							helperText={fbgUsernameError}
							onChange={(inputVal) => setFbgUsername(inputVal)}
							value={fbgUsername}
							size="medium"
							id="fbgUsername"
							name="fbgUsername"
							label="FBG Username"
							placeholder="Your ForumBoardGames username"
							type="text"
							fullWidth
						/>

						<FormControlLabel
							label="Display on my profile page?"
							disabled={isLoading}
							control={
								<Checkbox
									sx={{ height: 48, width: 48, mr: 1 }}
									checked={isChecked}
									onChange={(e) => handleSocialsCheckbox(e)}
								/>
							}
						/>

						<Box alignSelf="flex-end">
							<LoadingBtn
								disabled={
									isSuccess &&
									bggUsername === data.socials.bggUsername &&
									fbgUsername === data.socials.fbgUsername &&
									isChecked === data.socials.show
								}
								loading={mutation.isLoading || isLoading}
								type="submit"
								variant="contained"
							>
								Update
							</LoadingBtn>
						</Box>
					</Box>
				</form>
			</Box>
		</Fragment>
	)
}

export default SocialsForm
