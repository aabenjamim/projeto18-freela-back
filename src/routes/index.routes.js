import { Router } from "express"
import hospedagemRouter from "./hospedagem.routes"

const router = Router()

router.use(hospedagemRouter)

export default router