//adicionar hospedagens

export async function postHospedagens(req, res){
    const {nome, diaria, descricao, cidade, estado, imagens, imgPrincipal} = req.body

    try{
        //verificar o estado
        const buscaEstado = await db.query(`
            SELECT * FROM estado WHERE nome = $1
        `, [estado])
        if(buscaEstado.rows.length===0){
            return res.status(404).send('Nome de estado inválido!')
        }

        //verifica a cidade
        const buscaCidade = await db.query(`
            SELECT * FROM destino WHERE nome = $1 AND "idEstado"=$2
        `, [cidade, buscaEstado.rows[0].id])
        if(buscaCidade.rows.length===0){
            return res.status(404).send('Nome de cidade inválida')
        }

        //inserir no banco
        const idHospedagem = await db.query(`
        INSERT INTO estado (nome, diaria, descricao, "idCidade")
            VALUES ($1, $2, $3, $4) RETURNING id
        `, [nome, diaria, descricao, buscaCidade.rows[0].id])

        function convertDriveLink(link) {
            const fileId = extractFileId(link)
            if (fileId) {
              return `https://drive.google.com/uc?id=${fileId}`
            }
            return link
          }
      
          function extractFileId(link) {
            const regex = /\/file\/d\/([^/]+)\//;
            const match = link.match(regex);
            if (match && match[1]) {
              return match[1]
            }
            return null
          }

    // Inserir imagens
    for (let i = 0; i < imagens.length; i++) {
        const convertedLink = convertDriveLink(imagens[i]);
        await db.query('INSERT INTO imagem (url, "idHospedagem") VALUES ($1, $2)', [
          convertedLink,
          idHospedagem.rows[0].id,
        ])
      }
  
      // Inserir imagem principal
      const convertedPrincipal = convertDriveLink(imgPrincipal);
      await db.query(
        'INSERT INTO imagem (url, "idHospedagem", principal) VALUES ($1, $2, true)',
        [convertedPrincipal, idHospedagem.rows[0].id]
      )

        res.status(201).send("Hospedagem inserida com sucesso!")
    } catch(err){
        res.status(500).send(err.message)
    }
}

//listar hospedagens
export async function getHospedagens(req, res){
    
}