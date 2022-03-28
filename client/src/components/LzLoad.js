// @ Modules
import React from 'react'
import LazyLoad from 'react-lazyload'

const LzLoad = ({ children, ...other }) => {
	return <LazyLoad {...other}>{children}</LazyLoad>
}

// @ Default Props
LzLoad.defaultProps = {
	offset : 120,
	once   : true
}

export default LzLoad
