#language: pt

  Funcionalidade: Permitir que um usuário previamente cadastrado possa reporte um relato
    Como um usuário responsável por reportar novos relatos diretamente no painel do sistema
    Quero ser capaz de reportar um relato
    Para que outras usuários possam realizar as tratativas necessárias para a resolução do problema

    Contexto: 
      Dado que sou um usuário cadastrado no sistema
      E que o grupo que estou contido tenha a permissão "Criar relatos" em uma ou mais categorias de relato
      E o sistema deve exibir o botão + Novo Relato na listagem de relatos
    
    Cenário: Criar um relato e vincular a um solicitante existente
      Dado que estou na listagem de relatos
      E clico no botão Novo Relato
      E clico na listagem de categorias
      Então o sistema deve listar as categorias de relato que possuo permissão
      Quando escolho uma categoria
      E preencho o campo endereço, adiciono uma ou mais imagens, descrevo a situação
      E seleciono um usuário existente no sistema como solicitante
      E clico no botão criar relato
      Então o sistema deve retornar uma mensagem de sucesso
      E exibe o autor do relato no histórico do relato
    
    Cenário: Criar um relato e cadastrar um novo solicitante
      Dado que estou na listagem de relatos
      E clico no botão Novo Relato
      E clico na listagem de categorias
      Então o sistema deve listar as categorias de relato que possuo permissão
      Quando escolho uma categoria
      E preencho o campo endereço, adiciono uma ou mais imagens, descrevo a situação
      E clico no botão + Cadastro novo usuário
      Então o sistema apresenta todos os campos para cadastrar um novo usuário
      E preencho os campos obrigatórios
      E clico no botão criar usuário
      Então o sistema retorna a tela de criação do relato e exibe o nome do solicitante vinculado ao relato
      E clico no botão criar relao
      Então o sistema deve retornar uma mensagem de sucesso
      E exibe o autor do relato no histórico do relato
    
    