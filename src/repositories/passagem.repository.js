
export async function busca(atributo, tabela){
    return db.query(`
    SELECT ${atributo} FROM ${tabela}
    `)
}

export async function buscaIdCidade(cidade, tipo, estado){
    return db.query(`
    SELECT id FROM ${tipo} WHERE nome = $1 AND "idEstado"=$2
    `, [cidade, estado])
}

export async function insereCompanhia(nome){
    return db.query(`
    INSERT INTO companhia (nome) VALUES nome=$1
    RETURNING id;
    `, [nome])
}

export async function inserePassagem(idOrigem, idDestino, partida, chegada, preco, idCompanhia){
    return db.query(`
    INSERT INTO passagens (idOrigem, idDestino, partida, chegada, preco, idCompanhia)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
    `, [idOrigem, idDestino, partida, chegada, preco, idCompanhia])
}

export async function buscaPassagem(){
    return db.query(`
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
    INNER JOIN origem AS o ON p."idOrigem" = o.id
    INNER JOIN destino AS d ON p."idDestino" = d.id
    INNER JOIN companhia AS c ON p."idCompanhia" = c.id
    `)
}