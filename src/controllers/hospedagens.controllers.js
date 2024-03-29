import { buscaComodidade, verificaCidade, verificaEstado, 
    buscaHospedagem, cadastraHospedagem, insereComodHosped, 
    insereComodidade, insereImagens, buscaHospedagemById } from "../repositories/hospedagem.repository.js"

//adicionar hospedagens
export async function postHospedagens(req, res){
    const {nome, diaria, descricao, cidade, 
        estado, imagens, imgPrincipal, comodidades} = req.body

    try{
        let resultEstado = await verificaEstado(estado)
        if(resultEstado.rowCount===0){
           resultEstado = await insereEstado(estado)   
        }

        let resultDestino = await verificaCidade(cidade, 'destino', resultEstado.rows[0].id)
        if(resultDestino.rowCount===0){
           resultDestino = await insereCidade(cidade, 'destino', resultEstado.rows[0].id)
        }

        //inserir no banco
        const idHospedagem = await cadastraHospedagem(
            nome, diaria, descricao, resultDestino.rows[0].id)

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

          const idHospedagemFormat = idHospedagem.rows[0].id

        // Inserir imagens
        for (let i = 0; i < imagens.length; i++) {
            const convertedLink = convertDriveLink(imagens[i]);
            await insereImagens(convertedLink, idHospedagemFormat, false)
        }
    
        // Inserir imagem principal
        const convertedPrincipal = convertDriveLink(imgPrincipal);
        await insereImagens(convertedPrincipal, idHospedagemFormat, true)

        // Inserir comodidades
        let comodidadeId
        for (let i = 0; i < comodidades.length; i++) {
            const comodidade = comodidades[i]

            const resultComodidade = await buscaComodidade(comodidade)
    
            if (resultComodidade.rowCount > 0) {
                comodidadeId = buscaComodidade.rows[0].id
            } else {
                const novaComodidade = await insereComodidade(comodidade)
                comodidadeId = novaComodidade.rows[0].id
            }
        }

        // Relacionar a comodidade com a hospedagem
        const comodidadesIds = [];

        for (let i = 0; i < comodidades.length; i++) {
        const comodidade = comodidades[i];
        const resultComodidade = await buscaComodidade(comodidade);

        if (resultComodidade.rowCount > 0) {
            comodidadesIds.push(resultComodidade.rows[0].id);
        } else {
            const novaComodidade = await insereComodidade(comodidade);
            comodidadesIds.push(novaComodidade.rows[0].id);
        }
        }

        await insereComodHosped(comodidadesIds, idHospedagem.rows[0].id);


        res.status(201).send("Hospedagem inserida com sucesso!")
    } catch(err){
        res.status(500).send(err.message)
    }
}

//listar hospedagens
export async function getHospedagens(req, res) {
    try {
      const { estado, cidade, valorMaximo } = req.query
  
      const hospedagem = await buscaHospedagem(estado, cidade, valorMaximo);
  
      res.status(201).send(hospedagem.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
}

export async function getHospedagemById(req, res) {
    const { id } = req.params;

    try {
      const hospedagem = await buscaHospedagemById(id);
  
      if (!hospedagem) {
        return res.status(404).send('Hospedagem não encontrada');
      }
  
      const hospedagemObj = {
        nome: hospedagem.nome,
        diaria: hospedagem.diaria,
        descricao: hospedagem.descricao,
        cidade: hospedagem.cidade,
        estado: hospedagem.estado,
        imgPrincipal: hospedagem.imgPrincipal,
        imagens: hospedagem.imagens.filter((imagem, index, self) => self.indexOf(imagem) === index),
        comodidades: hospedagem.comodidades.filter((comodidade, index, self) => self.indexOf(comodidade) === index)
      };
  
      res.status(200).send(hospedagemObj);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
