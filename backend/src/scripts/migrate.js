import fs from "fs"
import path from "path"
import Database from "better-sqlite3"

import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_FILE = path.join(__dirname, "../../database.sqlite")
// const DB_FILE = "./database.sqlite"
const MIGRATIONS_DIR = path.join(__dirname, "../migrations")
const SEED_FILE = path.join(__dirname, "../seeds/seed_base.sql")

// Crear conexión
const db = new Database(DB_FILE)

// Activar FK
db.pragma("foreign_keys = ON")

// Leer migraciones ordenadas
const migrationFiles = fs
	.readdirSync(MIGRATIONS_DIR)
	.filter((file) => file.endsWith(".sql"))
	.sort()

console.log("🚀 Running migrations...")

for (const file of migrationFiles) {
	const filePath = path.join(MIGRATIONS_DIR, file)
	const sql = fs.readFileSync(filePath, "utf-8")

	console.log(`➡️ Executing ${file}`)
	db.exec(sql)
}

console.log("🌱 Running seed...")
const seedSQL = fs.readFileSync(SEED_FILE, "utf-8")
db.exec(seedSQL)

console.log("✅ Done.")

// Cerrar conexión
db.close()
