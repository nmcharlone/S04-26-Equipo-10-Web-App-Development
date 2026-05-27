export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500

	// logging en desarrollo
	if (process.env.NODE_ENV !== "production") {
		console.error(err.stack)
	}

	res.status(statusCode).json({
		status: "error",
		message: err.message || "Internal server error",
		code: err.code || "INTERNAL_SERVER_ERROR",
	})
}
