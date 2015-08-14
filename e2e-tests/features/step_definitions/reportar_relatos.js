
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;

module.exports = function () {
  this.World = require('../support/world').World;

  this.Given(/^clico no botão Novo Relato$/, function () {
    return element(by.css('[href="#/reports/add"]')).click();
  });

  this.When(/^escolho uma categoria$/, function () {
    var select = element(by.model('selectedCategory'));
    var dropdown = select.element(by.css('.dropdown'));
    var category = element(by.repeater('subcategory in category.subcategories').row(0));

    return select.element(by.tagName('button')).click().then(function () {
      return dropdown.element(by.model('q')).sendKeys('fios e cabos').then(function () {
        return category.click();
      });
    });
  });

  this.When(/^preencho todos dados do formulario$/, function (callback) {
    var form = element(by.css('[ng-show="selectedCategory"]'))
    var getField = function (name) { return form.element(by.model('address.' + name)); }

    var k = protractor.Key;
    var typeInAddress = function (text) {
      return getField('address').sendKeys(text);
    }
    var setAddressWithAutoComplete = typeInAddress('R. Julieta vila jordanopolis').then(function () {
      return typeInAddress(k.ARROW_DOWN).then(function () {
        return typeInAddress(k.ENTER)
      })
    });

    return setAddressWithAutoComplete.then(function () {
      return getField('number').sendKeys('167');
    });
  });

  this.When(/^apos selecionar um usuário$/, function () {
    var linkOpenModal = element(by.css('button[ng-click="selectUser()"]'));
    var modal = element(by.css('.modal-reports-select-user'));
    var searchUsers = modal.element(by.css('input[keyboard-poster="search"]'));
    var firstUser = modal.element(by.repeater('user in users').row(0));
    var select = firstUser.element(by.css('button[ng-click="setUser(user)"]'));


    return linkOpenModal.click().then(function () {
      return modal.isDisplayed().then(function () {
        return searchUsers.sendKeys('Leide Santos').then(function () {
          browser.wait(function () {
            return firstUser.isDisplayed();
          }, 9000);
          return select.click();
        });
      });
    });
  });

  this.When(/^clico no botão para criar o relato$/, function () {
    return element(by.css('button[ng-click="send()"]')).click();
  });

  this.Then(/^o sistema mostra uma mensagem de sucesso$/, function (callback) {
    return expect(this.currentUrl()).to.eventually.match(/\/#\/reports\/\d+/);
  });

  this.Given(/^clico na listagem de categorias$/, function () {
    var select = element(by.model('selectedCategory'));
    return select.element(by.tagName('button')).click();
  });

  this.Given(/^o sistema deve listar as categorias de relato que possuo permissão$/, function (callback) {
    var select = element(by.model('selectedCategory'));
    var dropdown = select.element(by.css('.dropdown'));

    return expect(dropdown.element(by.css('ul li')).count()).to.eventually.greaterThan(0);
  });

  this.Given(/^preencho o campo endereço, adiciono uma ou mais imagens, descrevo a situação$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^clico no botão \+ Cadastro novo usuário$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^o sistema apresenta todos os campos para cadastrar um novo usuário$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^preencho os campos obrigatórios$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^clico no botão criar usuário$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^o sistema retorna a tela de criação do relato e exibe o nome do solicitante vinculado ao relato$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^clico no botão criar relao$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^o sistema deve retornar uma mensagem de sucesso$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^exibe o autor do relato no histórico do relato$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^que sou um usuário cadastrado no sistema$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^que o grupo que estou contido tenha a permissão "([^"]*)" em uma ou mais categorias de relato$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^o sistema deve exibir o botão \+ Novo Relato na listagem de relatos$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^seleciono um usuário existente no sistema como solicitante$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^clico no botão criar relato$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });
};
