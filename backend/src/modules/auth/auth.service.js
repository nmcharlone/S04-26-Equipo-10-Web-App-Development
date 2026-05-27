import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { NotFoundError, UnauthorizedError } from "../../errors/errors.js"

export default class AuthService {
	constructor(AuthRepository) {
		this.AuthRepository = AuthRepository
	}

	async validateUser(name, lastname, password) {
		// console.log(await bcrypt.hash(password, 10))
		const user = await this.AuthRepository.findUser(name, lastname)
		console.log(user)

		if (!user) {
			throw new NotFoundError("User not found")
		}

		const isValid = await bcrypt.compare(password, user.password)

		if (!isValid) {
			throw new UnauthorizedError("Invalid credentials")
		}

		return user
	}
	createToken(user) {
		const token = jwt.sign(
			{
				id: user.id,
				name: user.name,
				lastname: user.lastname,
				role_id: user.role_id,
				area_id: user.area_id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "8h" },
		)
		return token
	}
}
