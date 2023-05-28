import { Router } from "express"
import hospedagemRouter from "./hospedagem.routes.js"
import passagemRouter from "./passagem.routes.js"

const router = Router()

router.use(hospedagemRouter)
router.use(passagemRouter)

export default router