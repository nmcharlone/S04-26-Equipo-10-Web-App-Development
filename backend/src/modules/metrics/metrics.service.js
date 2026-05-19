import { BadRequestError } from "../../errors/errors.js"

export default class MetricsService {
  constructor(repository) {
    this.repository = repository;
  }

    async getSummary({ from, to }) {

        const endDate = to || new Date().toISOString().split("T")[0]
        const start = new Date()
        start.setMonth(start.getMonth() - 1)
        const startDate = from || start.toISOString().split("T")[0]
        
        const fromDate = new Date(startDate)
        const toDateObj = new Date(endDate) 

        if (isNaN(fromDate) || isNaN(toDateObj)) {
            throw new BadRequestError("Invalid date format")
        }

        if (fromDate > toDateObj) {
            throw new BadRequestError(
              "'from' date cannot be greater than 'to'",
            )
        }

        const incidents = await this.repository.getIncidentCounts(startDate,endDate)
        const resolutionRate = incidents.created > 0 ? (incidents.resolved / incidents.created) * 100 : 0
        const avgResolution = await this.repository.getAverageResolutionTime(startDate,endDate)
        const topAreas = await this.repository.getTopAreas(startDate,endDate)
        const topRootCauses = await this.repository.getTopRootCauses(startDate,endDate)


        return {
            from: startDate,
            to: endDate,
            incidents,
            average_resolution_hours:	Number(avgResolution.avg_resolution_hours?.toFixed(2)) || 0,
            resolution_rate: Number(resolutionRate.toFixed(2)),
            top_areas: topAreas,
            top_root_causes: topRootCauses
        }
    }
}
