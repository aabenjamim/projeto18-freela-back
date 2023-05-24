import { Router } from "express";
import { postHospedagens } from "../controllers/hospedagens.controllers.js";
import { validate } from "../middlewares/validateSchema.middlewares.js";
import { hospedagemSchema } from "../schemas/hospedagens.schemas.js";

const hospedagemRouter = Router()

hospedagemRouter.post('/hospedagens', validate(hospedagemSchema), postHospedagens)

export default hospedagemRouter