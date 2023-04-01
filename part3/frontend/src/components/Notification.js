const Notification = ({ message, isError }) => {
	if (message === null) {
	  return null
	}

	const className = `notification ${isError ? 'error' : null}`
  
	return (
	  <div className={className}>
		{message}
	  </div>
	)
}

export default Notification