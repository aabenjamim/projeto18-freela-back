import joi from 'joi'

export const hospedagemSchema = joi.object({
    nome: joi.string().required(), 
    diaria: joi.number().required(), 
    descricao: joi.string().required(), 
    cidade: joi.string().required(), 
    estado: joi.string().required(), 
    imagens: joi.array().items(joi.string().uri()).required(), 
    imgPrincipal: joi.string().uri().required()
})