import { buscaIdCidade, busca, inserePassagem, insereCompanhia, buscaPassagem } from "../repositories/passagem.repository.js"
import { verificaCidade, verificaEstado } from "../repositories/hospedagem.repository.js"


//pegar os estados
export async function getEstados(req, res){
    try{
        const estados = await busca('nome', 'estado')
        
        res.status(200).send(estados.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}

//pegar as cidades de origem
export async function getOrigens(req, res){
    try{
        const cidades = await busca('nome', 'origem')

        res.status(200).send(cidades.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}

//pegar as cidades de destino
export async function getDestinos(req, res){
    try{
        const cidades = await busca('nome', 'destino')

        res.status(200).send(cidades.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}

export async function postPassagem(req, res){
    const {estadoOrig, estadoDest, origem, destino, partida,
    chegada, companhia, preco} = req.body
    
    try{
        const resultEstadoOrigem = verificaEstado(estadoOrig)
        if(resultEstadoOrigem.rowCount===0){
            await insereEstado(estado)
        }

        const resultEstadoDestino = verificaEstado(estadoDest)
        if(resultEstadoDestino.rowCount===0){
            await insereEstado(estado)
        }

        const resultOrigem = await verificaCidade(origem, 'origem', resultEstado.rows[0].id)
        if(resultOrigem.rowCount===0){
            await insereCidade(cidade, 'origem', resultEstado.rows[0].id)
        }
        const resultIdOrig = await buscaIdCidade(cidade, 'origem', estadoOrig)
        const idOrig = resultIdOrig.rows[0].id

        const resultDestino = await verificaCidade(destino, 'destino', resultEstado.rows[0].id)
        if(resultDestino.rowCount===0){
            await insereCidade(cidade, 'destino', resultEstado.rows[0].id)
        }
        const resultIdDest = await buscaIdCidade(cidade, 'destino', estadoDest)
        const idDest = resultIdDest.rows[0].id

        const resultCompanhia = await busca(nome, companhia)
        if(resultCompanhia.rowCount===0){
            await insereCompanhia(companhia)
        }
        const idComp = resultCompanhia.rows[0].id

        await inserePassagem(idOrig, idDest, partida, chegada, preco, idComp)
        


    } catch(err){
        res.status(500).send(err.message)
    }

}

export async function getPassagem(req, res){
    try{
        const passagem = await buscaPassagem

        res.status(201).send(passagem.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}