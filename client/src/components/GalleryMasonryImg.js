// @ Modules
import React, { useState, Fragment } from 'react'

// @ Mui
import { styled } from '@mui/material/styles'

// @ Components
import CustomSkeleton from './Skeletons/CustomSkeleton'

// @ Styles
const StyledMasonryImg = styled('img')({
    verticalAlign: 'middle',
    maxHeight: '100%',
    width: '100%',
    objectFit: 'contain',
    cursor: 'zoom-in',
    borderRadius: '4px',
    imageRendering: '-webkit-optimize-contrast'
})

const GalleryMasonryImg = ({ src, alt, handleIdx, i }) => {
    const [imgLoaded, setImgLoaded] = useState(false)

    const onImgLoad = () => {
        setImgLoaded(true)
    }

    return (
        <Fragment>
            <StyledMasonryImg onClick={() => handleIdx(i)} src={src} alt={alt} hidden={!imgLoaded} onLoad={onImgLoad} />
            {!imgLoaded && (
                <CustomSkeleton
                    variant='rectangular'
                    width='100%'
                    height={Math.floor(Math.random() * (270 - 100 + 1) + 100)}
                    sx={{ borderRadius: '4px' }}
                />
            )}
        </Fragment>
    )
}

export default GalleryMasonryImg
