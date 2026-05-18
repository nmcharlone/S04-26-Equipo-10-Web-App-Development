export default class AuthController {
	constructor(AuthService) {
		this.AuthService = AuthService
	}
	async login(req, res) {
		const { name, lastname, password } = req.body
		const user = await this.AuthService.validateUser(name, lastname, password)
		const token = this.AuthService.createToken(user)
		res.json({ token })
	}
	async me(req, res) {
		const user = req.user
		res.json({ user })
	}
}
