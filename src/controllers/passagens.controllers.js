import { buscaIdCidade, busca, inserePassagem, insereCompanhia,
  buscaPassagem, verificaCompanhia } from "../repositories/passagem.repository.js";
import { verificaCidade, verificaEstado, insereEstado,
  insereCidade } from "../repositories/hospedagem.repository.js";
import {db} from '../database/database.connection.js'

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
  const { estadoOrigem, estadoDestino, cidadeOrigem,
    cidadeDestino, dia, mes, ano, valorMaximo} = req.query;

  try {
    let query = `
      SELECT 
        p.id,
        o.nome AS origem,
        d.nome AS destino,
        p.partida,
        p.chegada,
        p.preco,
        c.nome AS companhia
      FROM
        passagem AS p
      INNER JOIN origem AS o ON p."idOrigem" = (SELECT id FROM origem WHERE nome = $1)
      INNER JOIN destino AS d ON p."idDestino" = (SELECT id FROM destino WHERE nome = $2)
      INNER JOIN companhia AS c ON p."idCompanhia" = c.id
      WHERE 1 = 1
    `;

    const queryParams = [];

    // Verificar e adicionar os critérios de busca na consulta
    if (estadoOrigem) {
      queryParams.push(estadoOrigem);
    }
    if (estadoDestino) {
      queryParams.push(estadoDestino);
    }
    if (cidadeOrigem) {
      queryParams.push(cidadeOrigem);
    }
    if (cidadeDestino) {
      queryParams.push(cidadeDestino);
    }
    if (dia && mes && ano) {
      const data = new Date(ano, mes - 1, dia);
      query += ' AND p.partida::date = $3';
      queryParams.push(data);
    }
    if (valorMaximo) {
      query += ' AND p.preco <= $4';
      queryParams.push(valorMaximo);
    }

    const result = await db.query(query, queryParams);

    // Construir o objeto de resposta
    const passagens = result.rows.map((row) => ({
      id: row.id,
      origem: row.origem,
      destino: row.destino,
      dataPartida: row.partida.toISOString().slice(0, 10),
      horarioPartida: row.partida.toISOString().slice(11, 16), 
      dataChegada: row.chegada.toISOString().slice(0, 10),
      horarioChegada: row.chegada.toISOString().slice(11, 16), 
      preco: row.preco,
      companhia: row.companhia,
    }));

    res.status(200).send(passagens);
  } catch (err) {
    res.status(500).send(err.message);
  }
}