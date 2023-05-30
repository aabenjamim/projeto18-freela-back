import { Router } from "express";
import { getHospedagemById, getHospedagens, postHospedagens } from "../controllers/hospedagens.controllers.js";
import { validate } from "../middlewares/validateSchema.middlewares.js";
import { hospedagemSchema } from "../schemas/hospedagens.schemas.js";

const hospedagemRouter = Router()

hospedagemRouter.post('/hospedagens', validate(hospedagemSchema), postHospedagens)
hospedagemRouter.get('/hospedagens', getHospedagens)
hospedagemRouter.get('/hospedagens/:id', getHospedagemById)

export default hospedagemRouter