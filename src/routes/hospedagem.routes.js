import { Router } from "express";
import { getHospedagens, postHospedagens } from "../controllers/hospedagens.controllers.js";
import { validate } from "../middlewares/validateSchema.middlewares.js";
import { hospedagemSchema } from "../schemas/hospedagens.schemas.js";

const hospedagemRouter = Router()

hospedagemRouter.post('/hospedagens', validate(hospedagemSchema), postHospedagens)
hospedagemRouter.get('/hospedagens', getHospedagens)

export default hospedagemRouter