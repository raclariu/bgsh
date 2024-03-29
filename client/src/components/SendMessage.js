// @ Modules
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// @ Mui Icons
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone'

// @ Components
import CustomBtn from './CustomBtn'
import CustomIconBtn from './CustomIconBtn'
import CustomDivider from './CustomDivider'
import CustomTooltip from './CustomTooltip'
import Input from './Input'
import LoadingBtn from './LoadingBtn'

// @ Others
import { useSendNewMessageMutation } from '../hooks/hooks'

// @Main
const SendMessage = ({ recipientUsername = '', ...other }) => {
    const currUsername = useSelector((state) => state.userData.username)

    const [open, setOpen] = useState(false)
    const [recipient, setRecipient] = useState(recipientUsername ? recipientUsername : '')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const handleOpenDialog = () => {
        setOpen(true)
    }

    const handleCloseDialog = () => {
        setOpen(false)
    }

    const resetForm = () => {
        if (recipientUsername) {
            setOpen(false)
            setSubject('')
            setMessage('')
        } else {
            setOpen(false)
            setRecipient('')
            setSubject('')
            setMessage('')
        }
    }

    const mutation = useSendNewMessageMutation({ resetForm })

    const submitHandler = (e) => {
        e.preventDefault()

        mutation.mutate({ subject, message, recipient })
    }

    return (
        <Fragment>
            <CustomTooltip title='Send message'>
                <CustomIconBtn
                    // disabled={currUsername === recipientUsername}
                    color='primary'
                    onClick={handleOpenDialog}
                    size='large'
                    {...other}
                >
                    <MailTwoToneIcon />
                </CustomIconBtn>
            </CustomTooltip>

            {currUsername ? (
                <Dialog fullWidth maxWidth='sm' open={open} onClose={handleCloseDialog}>
                    <form onSubmit={submitHandler} autoComplete='off'>
                        <DialogContent>
                            <Input
                                sx={{ minHeight: '90px' }}
                                error={
                                    mutation.isError && mutation.error.response.data.message.recipientError ? true : false
                                }
                                helperText={mutation.isError ? mutation.error.response.data.message.recipientError : false}
                                onChange={(inputVal) => setRecipient(inputVal)}
                                value={recipient}
                                inputProps={{
                                    minLength: 4,
                                    maxLength: 20
                                }}
                                size='medium'
                                id='recipient'
                                name='recipient'
                                label='Username of recipient'
                                type='text'
                                disabled={!!recipientUsername}
                                fullWidth
                                required
                            />

                            <Input
                                sx={{ minHeight: '90px' }}
                                error={mutation.isError && mutation.error.response.data.message.subjectError ? true : false}
                                helperText={mutation.isError ? mutation.error.response.data.message.subjectError : false}
                                onChange={(inputVal) => setSubject(inputVal)}
                                value={subject}
                                inputProps={{
                                    minLength: 1,
                                    maxLength: 60
                                }}
                                size='medium'
                                id='subject'
                                name='subject'
                                label={`Subject (${subject.length}/60)`}
                                type='text'
                                // disabled={currUsername === recipientUsername}
                                fullWidth
                                required
                            />

                            <Input
                                error={mutation.isError && mutation.error.response.data.message.messageError ? true : false}
                                helperText={mutation.isError ? mutation.error.response.data.message.messageError : false}
                                onChange={(inputVal) => setMessage(inputVal)}
                                value={message}
                                inputProps={{
                                    minLength: 1,
                                    maxLength: 500
                                }}
                                id='message'
                                name='message'
                                label={`Message (${message.length}/500)`}
                                type='text'
                                size='medium'
                                multiline
                                minRows={3}
                                maxRows={10}
                                // disabled={currUsername === recipientUsername}
                                fullWidth
                                required
                            />
                        </DialogContent>

                        <CustomDivider />

                        <DialogActions>
                            <CustomBtn onClick={handleCloseDialog}>Cancel</CustomBtn>
                            <LoadingBtn
                                // disabled={currUsername.trim().toLowerCase() === recipient.trim().toLowerCase()}
                                type='submit'
                                variant='contained'
                                color='primary'
                                loading={mutation.isLoading}
                            >
                                Send
                            </LoadingBtn>
                        </DialogActions>
                    </form>
                </Dialog>
            ) : (
                <Dialog open={open} onClose={handleCloseDialog} maxWidth='xs'>
                    <DialogContent sx={{ textAlign: 'center' }}>To send a message, you need to be logged in</DialogContent>
                    <CustomDivider />
                    <DialogActions>
                        <CustomBtn component={RouterLink} to='/create-account' variant='outlined' color='primary'>
                            New account
                        </CustomBtn>
                        <CustomBtn component={RouterLink} to='/login' variant='outlined' color='secondary'>
                            Login
                        </CustomBtn>
                    </DialogActions>
                </Dialog>
            )}
        </Fragment>
    )
}

export default SendMessage
