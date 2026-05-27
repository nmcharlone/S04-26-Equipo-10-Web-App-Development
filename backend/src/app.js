// Importamos express
import express from "express"

// Importamos el router principal (todas las rutas)
import routes from "./index.js"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"

const app = express()

//middlewares
app.use(express.json())

//prefijo global de api
app.use("/api", routes)

app.use(errorHandler)
export default app
