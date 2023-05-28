import { buscaIdCidade, busca, inserePassagem, insereCompanhia,
  buscaPassagem, verificaCompanhia } from "../repositories/passagem.repository.js";
import { verificaCidade, verificaEstado, insereEstado,
  insereCidade } from "../repositories/hospedagem.repository.js";

export async function getEstados(req, res) {
  try {
    const estados = await busca('nome', 'estado');
    res.status(200).send(estados.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getOrigens(req, res) {
  try {
    const cidades = await busca('nome', 'origem');
    res.status(200).send(cidades.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getDestinos(req, res) {
  try {
    const cidades = await busca('nome', 'destino');
    res.status(200).send(cidades.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postPassagem(req, res) {
  const {
    estadoOrig,
    estadoDest,
    origem,
    destino,
    partida,
    chegada,
    companhia,
    preco
  } = req.body;

  try {
    let resultEstadoOrig = await verificaEstado(estadoOrig)
    if(resultEstadoOrig.rowCount===0){
        resultEstadoOrig = await insereEstado(estadoOrig)
    }

    let resultEstadoDest = await verificaEstado(estadoDest)
    if(resultEstadoDest.rowCount===0){
        resultEstadoDest = await insereEstado(estadoDest)
    }

    let resultCidadeOrig = await verificaCidade(origem, 'origem', resultEstadoOrig.rows[0].id)
    if(resultCidadeOrig.rowCount===0){
        resultCidadeOrig = await insereCidade(origem, 'origem', resultEstadoOrig.rows[0].id)
    }

    let resultCidadeDest = await verificaCidade(destino, 'destino', resultEstadoDest.rows[0].id)
    if(resultCidadeDest.rowCount===0){
        resultCidadeDest = await insereCidade(destino, 'destino', resultEstadoDest.rows[0].id)
    }

    let resultCompanhia = await verificaCompanhia(companhia)
    if(resultCompanhia.rowCount===0){
        resultCompanhia = await insereCompanhia(companhia)
    }

    await inserePassagem(
        resultCidadeOrig.rows[0].id,
        resultCidadeDest.rows[0].id,
        partida,
        chegada,
        preco,
        resultCompanhia.rows[0].id
    )    

    res.status(201).send('Passagem adicionada');
  } catch (err) {
    res.status(500).send(err.message);
  }
}



export async function getPassagem(req, res){
    try{
        const passagem = await buscaPassagem()

        res.status(201).send(passagem.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}