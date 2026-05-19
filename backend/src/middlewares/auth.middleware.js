import jwt from "jsonwebtoken"
export function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization
	console.log(req.headers)

	if (!authHeader) {
		return res.status(401).json({ error: "No autorizado" })
	}

	const parts = authHeader.split(" ")

	if (parts.length !== 2 || parts[0] !== "Bearer") {
		return res.status(401).json({ error: "Formato de token inválido" })
	}

	const token = parts[1]

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded
		next()
	} catch (err) {
		return res.status(401).json({ error: "Token inválido o expirado" })
	}
}

export function requireRole(...roles) {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({ error: "No autenticado" })
		}
		if (!roles.includes(req.user.role_id)) {
			return res.status(403).json({ error: "No autorizado" })
		}
		next()
	}
}
