// @ Libraries
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from 'react-query'

// @ Mui
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'

// @ Icons
import SendIcon from '@material-ui/icons/Send'

import Loader from '../components/Loader'

// @ Others
import { apiGetConversations, apiSendConvMessage, apiGetSingleConv } from '../api/api'
import { calculateTimeAgo } from '../helpers/helpers'

// @ Styles
const useStyles = makeStyles((theme) => ({
	grid      : {
		marginTop : theme.spacing(4),
		position  : 'relative'
	},
	chatInput : {
		position : 'absolute',
		bottom   : 10
	},
	chatBox   : {
		overflowY : 'auto',
		maxHeight : '70vh',
		minHeight : '70vh',
		padding   : theme.spacing(1)
	}
}))

// @ Main
const NewInboxScreen = () => {
	const cls = useStyles()
	const queryClient = useQueryClient()

	const containerRef = useRef(window.document.querySelector('#chatBox'))
	const targetRef = useRef(null)

	const { _id: currentUserId, username: currentUsername } = useSelector((state) => state.userAuth.userData)

	const [ text, setText ] = useState('')
	const [ convIndex, setConvIndex ] = useState(0)
	const [ isVisible, setIsVisible ] = useState(false)

	// * Query conversations
	const { isLoading, isError, error, data, isSuccess } = useQuery([ 'conversations' ], apiGetConversations)

	const currentConvId = data && data[convIndex]._id

	const fetchConvs = ({ pageParam = 1 }) => {
		return apiGetSingleConv(pageParam, currentConvId)
	}

	// * Query infinite messages
	const {
		isSuccess          : infIsSuccess,
		data               : infMessages,
		isFetching,
		isFetchingNextPage,
		fetchNextPage      : fetchOlder,
		hasNextPage        : hasOlder
	} = useInfiniteQuery([ 'messages', { convId: currentConvId } ], fetchConvs, {
		getNextPageParam : (lastPage, pages) => {
			if (lastPage.pagination.page < lastPage.pagination.totalPages) {
				return lastPage.pagination.page + 1
			}
		},
		enabled          : !!currentConvId
	})

	const mutation = useMutation(({ id, text }) => apiSendConvMessage(id, text), {
		onSuccess : () => {
			// queryClient.invalidateQueries('conversations')
			queryClient.invalidateQueries([ 'messages', { convId: currentConvId } ])
			setText('')
		}
	})

	const { mutate, isSuccess: isSuccessMutate, status } = mutation

	const callback = (entries, observer) => {
		const [ entry ] = entries
		setIsVisible(entry.isIntersecting)
	}

	useEffect(
		() => {
			let observer = new IntersectionObserver(callback, {
				root       : containerRef.current,
				rootMargin : '0px',
				threshold  : 1.0
			})

			if (targetRef.current && infIsSuccess) {
				observer.observe(targetRef.current)
			}

			return () => {
				observer.disconnect()
			}
		},
		[ targetRef, infIsSuccess ]
	)

	useEffect(
		() => {
			if (isVisible && hasOlder) {
				fetchOlder()
			}
		},
		[ isVisible, fetchOlder, hasOlder ]
	)

	useEffect(
		() => {
			let cbx = window.document.querySelector('#chatbox')
			cbx.scrollTo(0, window.document.querySelector('#chatbox').scrollHeight)
		},
		[ isSuccess ]
	)

	const handleText = (e) => {
		setText(e.target.value)
	}

	const handleConvIndex = (i) => {
		setConvIndex(i)
	}

	const handleSendMessage = () => {
		mutation.mutate({ id: currentConvId, text })
	}

	return (
		<Fragment>
			<Grid container spacing={2}>
				<Grid item xs={3}>
					{isSuccess &&
						data.map((conv, i) => (
							<Box
								key={conv._id}
								height={50}
								boxShadow={2}
								borderRadius={4}
								width="100%"
								display="flex"
								flexDirection="column"
								justifyContent="center"
								alignItems="center"
								bgcolor="background.paper"
								onClick={() => handleConvIndex(i)}
							>
								<Box>{conv.participants.find((el) => el._id !== currentUserId).username}</Box>
								<Box>{conv.unreadCount} unread messages</Box>
							</Box>
						))}
				</Grid>
				<Grid item xs={9}>
					<Box
						className={cls.chatBox}
						width="100%"
						display="flex"
						flexDirection="column-reverse"
						borderRadius={4}
						boxShadow={2}
						id="chatbox"
						bgcolor="background.paper"
					>
						{infIsSuccess &&
							infMessages.pages.map((group, i) => (
								<Fragment key={i}>
									{group.messages.map((msg, i) => (
										<Box key={msg._id} display="flex" flexDirection="column">
											<Box
												maxWidth="80%"
												alignSelf={msg.sender === currentUserId ? 'flex-end' : 'flex-start'}
												display="flex"
												alignItems="center"
												justifyContent="center"
												borderRadius={12}
												px={2}
												py={1}
												mt={1}
												style={{ wordBreak: 'break-word' }}
												bgcolor={
													msg.sender === currentUserId ? 'primary.light' : 'secondary.main'
												}
												color="primary.contrastText"
											>
												{msg.message}
											</Box>
											<Box
												fontSize={10}
												color="grey.600"
												alignSelf={msg.sender === currentUserId ? 'flex-end' : 'flex-start'}
												mx={1}
											>
												{calculateTimeAgo(msg.createdAt)}
											</Box>
										</Box>
									))}
								</Fragment>
							))}
						<div ref={targetRef} />
					</Box>
					<Box mt={2} display="flex" alignItems="center">
						<TextField
							placeholder="Type your message"
							value={text}
							fullWidth
							variant="outlined"
							size="small"
							onChange={handleText}
						/>
						<IconButton disabled={text.trim().length < 2} onClick={handleSendMessage}>
							<SendIcon />
						</IconButton>
						<IconButton onClick={() => queryClient.invalidateQueries([ 'conversations' ])}>
							<SendIcon />
						</IconButton>
					</Box>
				</Grid>
			</Grid>
		</Fragment>
	)
}

export default NewInboxScreen
