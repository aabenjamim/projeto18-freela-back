import {db} from '../database/database.connection.js'

export async function verificaEstado(estado){
    return db.query(`
        SELECT * FROM estado WHERE nome = $1
    `, [estado])
}

export async function verificaCidade(cidade, tipo, estado){
    return db.query(`
    SELECT * FROM ${tipo} WHERE nome = $1 AND "idEstado"=$2
    `, [cidade, estado])
}

export async function insereEstado(estado){
    return db.query(`
        INSERT INTO estado (nome) VALUES ($1)
        RETURNING id;
    `, [estado])
}

export async function insereCidade(cidade, tipo, estado){
    return db.query(`
    INSERT INTO ${tipo} (nome, "idEstado") VALUES
        ($1, $2)
    RETURNING id;
    `, [cidade, estado])
}

export async function cadastraHospedagem(nome, diaria, descricao, cidade){
    return db.query(`
    INSERT INTO hospedagem (nome, diaria, descricao, "idCidade")
        VALUES ($1, $2, $3, $4) RETURNING id
    `, [nome, diaria, descricao, cidade])
}

export async function insereImagens(link, hospedagem, valor){
    return db.query(`INSERT INTO imagem (url, "idHospedagem", principal) VALUES ($1, $2, $3)`, [
        link, hospedagem, valor])
}

export async function buscaComodidade(comodidade){
    return db.query(`
    SELECT id FROM comodidade WHERE nome = $1
    `, [comodidade])
}

export async function insereComodidade(comodidade){
    return db.query(`
    INSERT INTO comodidade (nome) VALUES ($1) RETURNING id
    `, [comodidade])
}

export async function insereComodHosped(comodidades, hospedagem) {
    const values = comodidades.map(comodidade => `(${comodidade}, ${hospedagem})`).join(',');
    return db.query(`
      INSERT INTO comod_hosped ("idComodidade", "idHospedagem")
      VALUES ${values}
    `);
  }
  
export async function buscaHospedagem(estado, cidade, valorMaximo) {
    let query = `
    SELECT
      h.id AS id,
      h.nome AS nome, 
      h.diaria AS diaria, 
      h.descricao AS descricao, 
      d.nome AS cidade,
      e.nome AS estado,
      ip.url AS "imgPrincipal",
      array_agg(DISTINCT i.url) AS imagens,
      array_agg(DISTINCT c.nome) AS comodidades
    FROM
      hospedagem AS h
      JOIN destino AS d ON h."idCidade" = d.id
      JOIN estado AS e ON d."idEstado" = e.id
      LEFT JOIN imagem AS ip ON h.id = ip."idHospedagem" AND ip.principal = true
      LEFT JOIN imagem AS i ON h.id = i."idHospedagem" AND i.principal = false
      LEFT JOIN comod_hosped AS ch ON h.id = ch."idHospedagem"
      LEFT JOIN comodidade AS c ON ch."idComodidade" = c.id
    WHERE
      e.nome = $1 AND d.nome = $2`;

  const params = [estado, cidade];

  if (valorMaximo) {
    query += ' AND h.diaria <= $3';
    params.push(valorMaximo);
  }

  query += `
    GROUP BY
      h.id,
      h.nome,
      h.diaria,
      h.descricao,
      d.nome,
      e.nome,
      ip.url`;

  return db.query(query, params) 
}

export async function buscaHospedagemById(id) {
    const query = `
      SELECT 
      h.nome AS nome, 
      h.diaria AS diaria, 
      h.descricao AS descricao, 
      d.nome AS cidade,
      e.nome AS estado,
      ip.url AS "imgPrincipal",
      array_agg(DISTINCT i.url) AS imagens,
      array_agg(DISTINCT c.nome) AS comodidades
      FROM
      hospedagem AS h
      JOIN destino AS d ON h."idCidade" = d.id
      JOIN estado AS e ON d."idEstado" = e.id
      LEFT JOIN imagem AS ip ON h.id = ip."idHospedagem" AND ip.principal = true
      LEFT JOIN imagem AS i ON h.id = i."idHospedagem" AND i.principal = false
      LEFT JOIN comod_hosped AS ch ON h.id = ch."idHospedagem"
      LEFT JOIN comodidade AS c ON ch."idComodidade" = c.id
      WHERE h.id = $1
      GROUP BY
      h.nome,
      h.diaria,
      h.descricao,
      d.nome,
      e.nome,
      ip.url`;
  
    const result = await db.query(query, [id]);
  
    if (result.rows.length === 0) {
      return null;
    }
  
    return result.rows[0];
}
