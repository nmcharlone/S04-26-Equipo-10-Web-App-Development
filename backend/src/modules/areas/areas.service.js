import { ConflictError, NotFoundError } from "../../errors/errors.js"
import { parseIdParam, validateCatalogName } from "./areas.validations.js"

function mapDbError(err) {
	const msg = err?.message || String(err)
	if (msg.includes("SQLITE_CONSTRAINT")) {
		if (msg.includes("UNIQUE")) {
			return new ConflictError("Ya existe un registro con ese nombre")
		}
		return new ConflictError(
			"No se puede completar la operación: el registro está en uso",
		)
	}
	return err
}

export default class AreasService {
	constructor(repo) {
		this.repo = repo
	}

	async listAreas() {
		return this.repo.listAreas()
	}

	async createArea(body) {
		const name = validateCatalogName(body)
		try {
			return await this.repo.insertArea(name)
		} catch (e) {
			throw mapDbError(e)
		}
	}

	async updateArea(idParam, body) {
		const id = parseIdParam(idParam)
		const name = validateCatalogName(body)
		try {
			const { changes } = await this.repo.updateArea(id, name)
			if (!changes) throw new NotFoundError("Área no encontrada")
			return { id, name }
		} catch (e) {
			throw mapDbError(e)
		}
	}

	async deleteArea(idParam) {
		const id = parseIdParam(idParam)
		try {
			const { changes } = await this.repo.deleteArea(id)
			if (!changes) throw new NotFoundError("Área no encontrada")
		} catch (e) {
			throw mapDbError(e)
		}
	}
}
