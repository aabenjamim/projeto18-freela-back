import { Router } from "express";
import { validate } from "../middlewares/validateSchema.middlewares.js";
import { getDestinos, getEstados, getOrigens, getPassagem, postPassagem } from "../controllers/passagens.controllers.js";
import { passagemSchema } from "../schemas/passagem.schema.js";

const passagemRouter = Router()

passagemRouter.get('/estados', getEstados)
passagemRouter.get('/origens', getOrigens)
passagemRouter.get('/destinos', getDestinos)
passagemRouter.post('/passagem', validate(passagemSchema), postPassagem)
passagemRouter.get('/passagens', getPassagem)

export default passagemRouter