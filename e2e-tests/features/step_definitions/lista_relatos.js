var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
var expect = chai.expect;

module.exports = function () {
  var page;
  var $SEARCH_TERM = 'Avenida';
  var $SEARCH_EXP = /^Avenida/;
  var hasReports = function () {
    return Promise.all([
      expect(element(by.css('#reports-listing-table')).isPresent()).to.eventually.be.ok,
      expect(page.reports().count()).to.eventually.greaterThan(0)
    ]);
  };
  var goToReports = function(){
    page = this.pages.report;
    return this.visit('/#/reports');
  };
  
  this.World = require('../support/world').World;
  
  this.Given(/^que estou na tela de relatos$/, goToReports);
  this.Given(/^que estou na listagem de relatos$/, goToReports);
  
  this.Given(/^que existem relatos cadastrados$/, hasReports);
  this.Given(/^que estou visualizando todos os relatos$/, hasReports);

  this.Then(/^todas colunas devem estar devidamente preenchidas$/, function () {
    return page.getAllItems().map(function (coluna) {
      return expect(coluna.getText()).to.eventually.not.empty;
    });
  });

  this.Given(/^clico no campo para filtrar items$/, function () {
    return page.activeFilter().then(function () {
      return expect(page.avaliableFilters().isDisplayed()).to.eventually.ok;
    });
  });

  this.When(/^escolho um filtro$/, function () {
    return page.avaliableFilters().element(by.css('a[ng-click]')).click();
  });

  this.When(/^preencho todos dados necessarios para realizar a busca$/, function () {
    return page.fillFilter($SEARCH_TERM);
  });

  this.When(/^clico no botão criar filtro$/, function () {
    return page.submitFilter();
  });

  this.Then(/^devo visualizar somente os relatos que contem o mesmo valor enserido no filtro$/, function () {
    return page.getAllItems(2).each(function (colunaEndereco) {
      return expect(colunaEndereco.getText()).to.eventually.match($SEARCH_EXP);
    });
  });

  this.Given(/^que eu desejo visualizar um relato$/, function () {
    //TODO: saber o que realmente deve ser feito aqui alem de checar a url
    
    //deve acabar com a url /#/reports/:num
    return expect(this.currentUrl()).to.eventually.match(/\#\/reports/);
  });

  this.Given(/^que pretendo editar um relato$/, function () {
    //TODO: saber o que realmente deve ser feito aqui alem de checar a url
  
    //deve acabar com a url /#/reports/:num
    return expect(this.currentUrl()).to.eventually.match(/\#\/reports/);
  });

  this.Then(/^eu clico em cima do relato desejado$/, function () {
    browser.wait(function () {
      return page.reports().isDisplayed();
    }, 9000);

    return page.reports().first().click();
  });

  this.Then(/^assim devo ser capaz de visualizar todos os dados do relato$/, function () {
    //deve acabar com a url /#/reports/:num
    return expect(this.currentUrl()).to.eventually.match(/\#\/reports/);
  });

  this.Then(/^assim devo ser capaz de visualizar o botões de editar e alterar$/, function () {
    return Promise.all([
      expect(element.all(by.linkText('Alterar')).count()).to.eventually.greaterThan(0),
      expect(element.all(by.linkText('Editar')).count()).to.eventually.greaterThan(0)
    ]);
  });

  this.Given(/^que escolhi (\d+) para o filtro de número de notificações$/, function (numero, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^existem relatos que já possuem uma notificação emitida$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^carrego a lista de relatos$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^a lista trás relatos que possuem ao menos (\d+) notificação$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^nenhum outro relato$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^ordena por data de criação mais recente$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^que escolhi de (\d+) a (\d+) dias no filtro de dias desde emissão da última notificação$/, function (num1, num2, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^existem relatos com notificações emitidas entre (\d+) a (\d+) dias atrás$/, function (num1, num2, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^a lista trás apenas relatos que possuem notificações emitidas entre (\d+) a (\d+) dias atrás$/, function (num1, num2, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^que escolhi de (\d+) a (\d+) dias o filtro de notificações a vencer$/, function (num1, num2, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^existem relatos com notificações a vencer entre (\d+) e (\d+) dias$/, function (arg1, arg2, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^a lista trás apenas relatos que possuem notificações a vencer entre (\d+) e (\d+) dias$/, function (arg1, arg2, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^que escolhi em (\d+) dias o filtro de notificações vencidas$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^existem relatos com notificações vencidas a mais de (\d+) dias$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^a lista trás apenas relatos que possuem notificações vencidas a mais pelo menos (\d+) dias$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });
};
