// @ Libraries
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

// @ Mui
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

// @ Styles
const useStyles = makeStyles((theme) => ({
	ml : {
		marginLeft : theme.spacing(4)
	}
}))

// @ Main
const UserSocialsForm = () => {
	const cls = useStyles()

	const [ bggUsername, setBggUsername ] = useState('')
	const [ forumUsername, setForumUsername ] = useState('')

	const handleSubmit = (e) => {
		e.preventDefault()
		if (bggUsername.trim() && forumUsername.trim()) {
			console.log(bggUsername, forumUsername)
		}

		if (bggUsername.trim().length > 3) {
			console.log('is bgg ok')
		}

		if (forumUsername.trim()) {
			console.log('is forum ok')
		}
	}

	// forum > 5 && bgg >4

	return (
		<form autoComplete="off" onSubmit={handleSubmit}>
			<Box fontWeight="fontWeightMedium">
				Add your ForumBoardGames & BoardGameGeek username so that other users can easily reach you, check your
				wishlist, collection of owned board games or forum posts
			</Box>
			<Box color="grey.500" mb={2} fontStyle="italic" fontSize="caption.fontSize">
				Note: These usernames will be displayed on your profile page
			</Box>

			<Box display="flex">
				<TextField
					//error={error && error.emailError ? true : false}
					//helperText={error ? error.emailError : false}
					onChange={(e) => setBggUsername(e.target.value)}
					value={bggUsername}
					fullWidth
					id="bggUsername"
					name="bggUsername"
					label="BGG username"
					type="text"
				/>

				<TextField
					//error={error && error.emailError ? true : false}
					//helperText={error ? error.emailError : false}
					onChange={(e) => setForumUsername(e.target.value)}
					value={forumUsername}
					className={cls.ml}
					fullWidth
					id="forumUsername"
					name="forumUsername"
					label="FBG username"
					type="text"
				/>
			</Box>

			<Box display="flex" justifyContent="flex-end" mt={2}>
				<Button type="submit" color="primary" variant="contained">
					Submit
				</Button>
			</Box>
		</form>
	)
}

export default UserSocialsForm
