/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.dialog.add("zupplaceholder", function (a) {
  var b = a.lang.zupplaceholder, a = a.lang.common.generalTab;
  return {
    title: b.title,
    minWidth: 300,
    minHeight: 80,
    contents: [{
      id: "info",
      label: a,
      title: a,
      elements: [{
        id: "name",
        type: "select",
        items: [
          [ 'Número de protocolo' ],
          [ 'Nome do munícipe' ],
          [ 'Endereço do munícipe' ],
          [ 'Telefone do munícipe' ],
          [ 'Documento do munícipe' ],
          [ 'Imagem do relato' ],
          [ 'Nome da categoria do relato' ],
          [ 'Endereço'],
          [ 'Referência' ],
          [ 'Descrição' ],
          [ 'Data de cadastro' ],
          [ 'Estado do relato' ]
        ],
        label: b.name,
        'default': 'numero_protocolo',
        commit: function (a) {
          a.setData("name", this.getValue())
        }
      }]
    }]
  }
});
