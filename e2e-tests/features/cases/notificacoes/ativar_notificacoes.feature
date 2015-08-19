#language: pt

Funcionalidade: Permitir que um usuário previamente cadastrado possa ativar as notificações de categoria de relato
  Como um usuário responsável pelas notificações
  Quero ser capaz de editar as categorias de relatos
  Pois desta estarei apto para ativar a funcionalidade de notificações

  Contexto:
    Dado que sou um usuário cadastrado
    E estou autenticado no sistema
    Então o sistema deve me retornar a listagem de relatos das categorias

  Cenário: Ativar notificação de relato
    Dado que eu selecione a opção para editar categoria de relato
    Quando eu selecionar um relato
    Então o sistema deve exibir a seção de configurar notificaões
    E clico em exibir notificações
    E seleciono a opção para atualizar a categoria
    Então devo receber uma mensagem de sucesso
