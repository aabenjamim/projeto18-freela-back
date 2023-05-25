import { Router } from "express"
import hospedagemRouter from "./hospedagem.routes"
import passagemRouter from "./passagem.routes"

const router = Router()

router.use(hospedagemRouter)
router.use(passagemRouter)

export default router