import joi from 'joi'
import dayjs from 'dayjs'

export const passagemSchema = joi.object({
    estadoOrig: joi.string().required(),
    estadoDest:joi.string().required(), 
    origem: joi.string().required(), 
    destino: joi.string().required(), 
    partida: joi.string()
    .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .iso().required(),
    chegada: joi.string()
    .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .iso().required(), 
    companhia: joi.string().required(), 
    preco: joi.number().required()
})