#language: pt
  
  Funcionalidade: Permitir que um usuário previamente cadastrado possa reporte um relato
    Como um usuário responsável por reportar novos relatos diretamente no painel do sistema
    Quero ser capaz de reportar um relato
    Para que outras usuários possam realizar as tratativas necessárias para a resolução do problema

    Contexto: 
      Dado que sou um usuário cadastrado no sistema
      E que o grupo que estou contido tenha a permissão "Criar relatos" em uma ou mais categorias de relato
      E o sistema deve exibir o botão + Novo Relato na listagem de relatos
      E que estou na listagem de relatos
      E clico no botão Novo Relato
    
    Cenário: Criar um relatos com imagens
      Dado que preencho os campos obrigatórios do relato
      E faço um upload de uma imagem  
      Quando clico no botão criar relato
      Então o sistema deve retornar uma mensagem de sucesso
      E devo visualizar uma aba "Imagem"
      E devo visualizar as imagens que fiz upload 
    
    Cenário: Criar um relatos sem imagens
      Dado que preencho os campos obrigatórios do relato
      Quando clico no botão criar relato
      Então o sistema deve retornar uma mensagem de sucesso
      E não devo visualizar uma aba "Imagem"
      E não devo visualizar a área de imagens 

    Cenário: Criar um relato preenchendo os campos obrigatórios e visualizar seus dados
      Dado escolho a categoria "fios e cabos"
      E preencho o endereço com "R. julieta, 167" 
      E descrevo a situação com texto: "acidente de carro derrubou  os fios do poste" 
      E seleciono o usuário "Leide Santos" como solicitante
      Quando clico no botão criar relato
      Então o sistema deve retornar uma mensagem de sucesso
      E devo visualizar o texto "Fios e cabos caídos"
      E devo visualizar o texto "R. Julieta, 167, 09891190, Vila Alvinopolis- SP, Brasil"
      E devo visualizar o texto "acidente de carro derrubou  os fios do poste"
      E devo visualizar o texto "Leide Santos"

    Cenário: Criar um relato e visualizar o histórico vinculado ao usuário atual 
      Dado que preencho os campos obrigatórios do relato
      Quando clico no botão criar relato
      Então devo visualizar uma aba "Histórico"
      E devo visualizar o nome do usuário atual na area de Histórico

    Cenário: Criar um relato e cadastrar um novo solicitante
      Dado que preencho os campos obrigatórios do relato
      E clico no botão + Cadastro novo usuário
      E preencho os campos obrigatórios do usuário "Solicitante da Silva"
      Quando clico no botão criar usuário
      Então o sistema retorna a tela de criação do relato e exibe o nome do solicitante vinculado ao relato
      E clico no botão criar relato
      Quando for redirecionado para a exibição dos dados do relato 
      Então devo visualizar o texto "Solicitante da Silva"
