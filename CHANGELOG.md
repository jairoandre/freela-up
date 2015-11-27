# Changelog

## 1.1.1 - 27/11/2015
### Correções
- [Relatos] Corrigido exibição da lista de categorias

## 1.1.0
### Adicionado
- Campos extras em usuários
- Filtro "Por perímetro de encaminhamento.." na busca de relatos
- Adicionado campo "Perímetro" na exibição do relato
- Incluído pesquisa por nome na listagem de perímetros
- Incluído caixa de seleção de grupo solucionador padrão para o perímetro

### Corrigido
- Incluído scroll infinito na listagem de grupos por perímetros na edição da categoria
- Removido scroll infinito da listagem de grupos por perímetros e aplicado novo formato de renderização
- Ajustado resolução das imagens do relato
- Corrigido back do browser na edição da categoria de itens de inventário
- Melhoria no feedback ao usuário quando na alteração da referência do relato
- Modificado label "Comentário ao munícipe" para "Resposta ao solicitante" (modal de alteração do status do relato)
- Atualização do componente panzoom e ajuste em sua configuração para permitir o deslocamento da imagem no modal de visualização
- Ajustes visuais na tabela de listagem de notificações (header e texto prazo)
- Ajustes visuais na caixa drag-n-drop de upload de imagens do relato
- Ajustes na listagem de perímetros (shapefiles) e comportamento de consulta
- Corrigido posicionamento z-index da caixa de sugestão auto-complete do componente de escolha de endereço
- Corrigido posicionamento z-index do filtro "Por campos..." para os itens de inventários
- Corrigido exibição da lista de categorias na criação do relato

## 1.0.4
### Corrigido
- Corrigido atualização das informações de grupo responsável e histórico do relato quando há atualização do endereço
- Corrigido formatação de data na lista de shapefiles cadastrados
- Ajustado filtro de transformação da resposta da API do google maps para endereço (bairro)
- Ajustado ordenamento dos registros de log para os itens de inventário

## 1.0.3
### Adicionado
- Adicionado cadastro de shapefiles para configuração das categorias
- Diretiva de seleção em linha de permissões de grupos de usuário
### Corrigido
- Corrigido comportamento incorreto do posicionamento dos popovers.
- Variáveis de ambiente que estavam faltando no build.
- Permissões das notificações
- Correção nas cores das categorias
- Não exibe área de notificações se a categoria de relato não tem notificações
- Revertida mudança de merge que omitiu as permissões de relatórios na edição de grupos
- Ajustado atributo z-index do pickcolor na edição da categoria de inventário
- Corrigido bug de z-index no componente de autocomplete
- Alterado todos os rótulos de "munícipe" para "solicitante"

## 1.0.2
### Adicionado
- Nova funcionalidade de notificações
- Correções nas dependências
- Campo para inserir legendas em imagens de relato

## 1.0.1
### Corrigido
- Correções na seção de histórico de alterações do relato.
- Correção na listagem dinâmica de usuários do grupo

### Adicionado
- Alteração do tema do painel através de variáveis de ambiente

## 1.0.0

Versão estável inicial
