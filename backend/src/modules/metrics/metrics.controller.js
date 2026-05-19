export default class MetricsController {
	constructor(service) {
		this.service = service
	}

	async getSummary(req, res) {
		const { from, to } = req.query

		const summary = await this.service.getSummary({ from, to })

		res.json({ summary })
	}
}