import { Router } from "express";
import { validate } from "../middlewares/validateSchema.middlewares.js";
import { getDestinos, getEstados, getOrigens, postPassagem } from "../controllers/passagens.controllers.js";
import { passagemSchema } from "../schemas/passagem.schema.js";

const passagemRouter = Router()

passagemRouter.get('/estados', getEstados)
passagemRouter.get('/origens', getOrigens)
passagemRouter.get('/destinos', getDestinos)
passagemRouter.post('/passagem', validate(passagemSchema), postPassagem)

export default passagemRouter