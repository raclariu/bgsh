// @ Modules
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'

// @ Mui
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// @ Components
import CustomBtn from '../components/CustomBtn'
import CustomSkeleton from '../components/Skeletons/CustomSkeleton'
import Helmet from '../components/Helmet'
import LzLoad from '../components/LzLoad'
import CustomDivider from '../components/CustomDivider'

// @ Icons
import PageviewIcon from '@mui/icons-material/Pageview'
import EmailIcon from '@mui/icons-material/Email'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'
import FavoriteIcon from '@mui/icons-material/Favorite'

// @ Others
import { useGetNewListingsQuery } from '../hooks/hooks'
import { calculateTimeAgo } from '../helpers/helpers'

// @ Styles
const StyledThumb = styled('img')({
    verticalAlign: 'bottom',
    objectPosition: 'center 10%',
    objectFit: 'cover',
    height: 64,
    width: 64,
    borderRadius: '4px',
    imageRendering: '-webkit-optimize-contrast'
})

// @ Skeleton
const NewListingsSkeleton = () => {
    return (
        <Box component={Paper} borderRadius='4px' boxShadow={2} p={1} height={72} width='100%'>
            <Box display='flex' alignItems='flex-start' gap={2} height='100%'>
                <CustomSkeleton sx={{ borderRadius: '4px' }} variant='square' height={56} width={56} />
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='flex-start'
                    height='100%'
                    justifyContent='space-between'
                >
                    <CustomSkeleton variant='text' width={220} />
                    <CustomSkeleton variant='square' width={75} height={24} sx={{ borderRadius: 4 }} />
                </Box>
            </Box>
        </Box>
    )
}

// @ Main
const HomeScreen = () => {
    const { success: successUserData } = useSelector((state) => state.userData)

    const { isLoading, data, isSuccess } = useGetNewListingsQuery()

    return (
        <Fragment>
            <Helmet title='Meeples.ro' />

            <Box
                sx={{ flex: 1 }}
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                height='100%'
                py={10}
            >
                <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    sx={{ lineHeight: 1 }}
                    width='100%'
                    textAlign='center'
                    pb={8}
                >
                    <Box fontSize='h3.fontSize' fontWeight='fontWeightBold'>
                        Sell
                    </Box>
                    <Box fontSize='h3.fontSize' fontWeight='fontWeightBold'>
                        Trade
                    </Box>
                    <Box fontSize='h3.fontSize' fontWeight='fontWeightBold'>
                        Buy
                    </Box>
                    <Box fontSize='h3.fontSize' fontWeight='fontWeightBold'>
                        Board games
                    </Box>
                </Box>

                {!successUserData && (
                    <Box display='flex' alignItems='center' justifyContent='center' gap={2} pb={10}>
                        <CustomBtn
                            component={RouterLink}
                            to='/create-account'
                            sx={{ width: 160 }}
                            variant='contained'
                            color='primary'
                        >
                            New account
                        </CustomBtn>
                        <CustomBtn
                            component={RouterLink}
                            to='/login'
                            sx={{ width: 160 }}
                            variant='contained'
                            color='secondary'
                        >
                            Login
                        </CustomBtn>
                    </Box>
                )}

                {successUserData && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr 1fr'
                            },
                            width: {
                                xs: '100%',
                                sm: '75%',
                                md: '50%'
                            },
                            columnGap: 3,
                            rowGap: 2
                        }}
                        pb={10}
                    >
                        <CustomBtn component={RouterLink} to='/dashboard' fullWidth variant='outlined' color='primary'>
                            Dashboard
                        </CustomBtn>
                        <CustomBtn component={RouterLink} to='/wanted' fullWidth variant='outlined' color='primary'>
                            Wanted
                        </CustomBtn>
                        <CustomBtn component={RouterLink} to='/sales' fullWidth variant='outlined' color='primary'>
                            Listed for sale
                        </CustomBtn>
                        <CustomBtn component={RouterLink} to='/trades' fullWidth variant='outlined' color='primary'>
                            Listed for trade
                        </CustomBtn>
                    </Box>
                )}

                <Box fontSize='h4.fontSize' fontWeight='fontWeightBold' pb={8}>
                    New listings
                </Box>

                {isLoading && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '100%',
                                md: '1fr 1fr' // auto min-content sau auto-auto sau auto 1fr
                            },
                            columnGap: 3,
                            rowGap: 2
                        }}
                        width='100%'
                    >
                        {[...Array(12).keys()].map((i, k) => (
                            <NewListingsSkeleton key={k} />
                        ))}
                    </Box>
                )}

                {isSuccess && (
                    <Box
                        pb={10}
                        id='new'
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '100%',
                                md: '1fr 1fr' // auto min-content sau auto-auto sau auto 1fr
                            },
                            columnGap: 3,
                            rowGap: 2
                        }}
                        width='100%'
                    >
                        {data.map((item) => (
                            <LzLoad key={item._id} placeholder={<NewListingsSkeleton />}>
                                <Box component={Paper} borderRadius='4px' boxShadow={2} p={1}>
                                    <Box display='flex' alignItems='flex-start' gap={2}>
                                        <Box component={RouterLink} to={item.slug}>
                                            <StyledThumb
                                                src={item.games[0].thumbnail}
                                                alt={item.games[0].title}
                                                title={item.games[0].title}
                                            />
                                        </Box>

                                        <Box
                                            display='flex'
                                            alignSelf='stretch'
                                            flexDirection='column'
                                            alignItems='flex-start'
                                            justifyContent='space-between'
                                        >
                                            {item.isPack ? (
                                                <Box fontSize='body2.fontSize' fontWeight='fontWeightMedium'>
                                                    Pack of {item.games.length} board games listed{' '}
                                                    {calculateTimeAgo(item.createdAt)}
                                                </Box>
                                            ) : (
                                                <Box fontSize='body2.fontSize' fontWeight='fontWeightMedium'>
                                                    {item.games[0].title} listed {calculateTimeAgo(item.createdAt)}
                                                </Box>
                                            )}

                                            <Box display='flex' alignItems='center' gap={1}>
                                                {item.mode === 'sell' && (
                                                    <Chip
                                                        size='small'
                                                        color='success'
                                                        label={
                                                            <Box fontWeight='fontWeightMedium'>{item.totalPrice} RON</Box>
                                                        }
                                                    />
                                                )}

                                                <Chip
                                                    size='small'
                                                    variant='contained'
                                                    color='primary'
                                                    label={
                                                        item.mode === 'sell'
                                                            ? 'sale'
                                                            : item.mode === 'trade'
                                                            ? 'trade'
                                                            : 'wanted'
                                                    }
                                                />

                                                {item.isPack && (
                                                    <Chip
                                                        size='small'
                                                        color='secondary'
                                                        label={`${item.games.length} pack`}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </LzLoad>
                        ))}
                    </Box>
                )}

                <CustomDivider flexItem />

                <Box fontSize='h4.fontSize' fontWeight='fontWeightBold' py={8}>
                    Features
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '100%',
                            sm: '1fr 1fr',
                            md: '1fr 1fr 1fr' // auto min-content sau auto-auto sau auto 1fr
                        },
                        gap: 3
                    }}
                >
                    <Box
                        component={Paper}
                        display='flex'
                        borderRadius='4px'
                        flexDirection='column'
                        alignItems='center'
                        boxShadow={2}
                        p={4}
                        height='100%'
                    >
                        <EmailIcon sx={{ fontSize: '45px', mb: 5 }} color='secondary' />
                        <Box textAlign='center' fontWeight='fontWeightMedium'>
                            Messaging system between users with search capabilities
                        </Box>
                    </Box>

                    <Box
                        component={Paper}
                        display='flex'
                        borderRadius='4px'
                        flexDirection='column'
                        alignItems='center'
                        boxShadow={2}
                        p={4}
                        height='100%'
                    >
                        <PageviewIcon sx={{ fontSize: '45px', mb: 5 }} color='secondary' />
                        <Box textAlign='center' fontWeight='fontWeightMedium'>
                            Search by designer, title, BGG id or type. Fuzzy search included
                        </Box>
                    </Box>

                    <Box
                        component={Paper}
                        display='flex'
                        borderRadius='4px'
                        flexDirection='column'
                        alignItems='center'
                        boxShadow={2}
                        p={4}
                        height='100%'
                    >
                        <SortByAlphaIcon sx={{ fontSize: '45px', mb: 5 }} color='secondary' />
                        <Box textAlign='center' fontWeight='fontWeightMedium'>
                            Sort listed board games by multiple attributes like rank, release date, price and many more
                        </Box>
                    </Box>

                    <Box
                        component={Paper}
                        display='flex'
                        borderRadius='4px'
                        flexDirection='column'
                        alignItems='center'
                        boxShadow={2}
                        p={4}
                        height='100%'
                    >
                        <SettingsBackupRestoreIcon sx={{ fontSize: '45px', mb: 5 }} color='secondary' />
                        <Box textAlign='center' fontWeight='fontWeightMedium'>
                            History tracking of sold, traded and bought board games
                        </Box>
                    </Box>

                    <Box
                        component={Paper}
                        display='flex'
                        borderRadius='4px'
                        flexDirection='column'
                        alignItems='center'
                        boxShadow={2}
                        p={4}
                        height='100%'
                    >
                        <CircleNotificationsIcon sx={{ fontSize: '45px', mb: 5 }} color='secondary' />
                        <Box textAlign='center' fontWeight='fontWeightMedium'>
                            Notification system for various alerts in regards to your listings, saved games and more
                        </Box>
                    </Box>

                    <Box
                        component={Paper}
                        display='flex'
                        borderRadius='4px'
                        flexDirection='column'
                        alignItems='center'
                        boxShadow={2}
                        p={4}
                        height='100%'
                    >
                        <FavoriteIcon sx={{ fontSize: '45px', mb: 5 }} color='secondary' />
                        <Box textAlign='center' fontWeight='fontWeightMedium'>
                            Wishlist system so you can save your favorite listings for later
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Fragment>
    )
}

export default HomeScreen
