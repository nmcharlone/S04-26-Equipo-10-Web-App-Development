export default class RootCausesController {
	constructor(rootCausesService) {
		this.rootCausesService = rootCausesService
	}

	async getRootCauses(req, res) {
		const rootCauses =
			await this.rootCausesService.getRootCauses()

		res.json({ rootCauses })
	}
}