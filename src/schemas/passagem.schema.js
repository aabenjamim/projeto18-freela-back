import joi from 'joi'
import dayjs from 'dayjs'

export const passagemSchema = joi.object({
    estadoOrig: joi.string().required(),
    estadoDest:joi.string().required(), 
    origem: joi.string().required(), 
    destino: joi.string().required(), 
    partida: joi.date().iso().required(),
    chegada: joi.date().iso().required(), 
    companhia: joi.string().required(), 
    preco: joi.number().required()
})