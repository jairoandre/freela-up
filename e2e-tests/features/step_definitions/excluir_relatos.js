var chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
var expect = chai.expect;

module.exports = function () {
  this.World = require('../support/world').World;

  var confirmTextEl;
  var buttonConfirm = element(by.css('button[ng-click="confirm()"]'));

  var deleteButton = function () {
    return element.all(by.css('a[ng-click="deleteReport(report)"]')).get(0).click();
  };

  var showConfirmText = function () {
    return Promise.resolve(
      expect(element(by.model('confirmText')).isPresent()).to.eventually.be.ok
    ).then(function () {
        confirmTextEl = element(by.model('confirmText'));
      }
    );
  };

  // TODO: Arrumar clique inválido na passagem do cenário "Confirmação de exclusão mal sucedida"
  this.When(/^clicar no ícone de exclusão$/, deleteButton);

  this.When(/^aparecer a confirmação de exclusão$/, showConfirmText);

  this.When(/^digito a palavra deletar$/, function () {
    return confirmTextEl.sendKeys('deletar');
  });

  this.When(/^clicar no botão remover$/, function () {
    return buttonConfirm.click();
  });

  this.Then(/^o sistema deve retornar uma mensagem de sucesso$/, function () {
      return expect(element(by.css('.message-status.success p')).isDisplayed()).to.eventually.ok;
  });

  // TODO: Ver como ocorre este evento
  this.Then(/^atualizar a listagem de relatos$/, function (next) {
    next();
  });

  this.When(/^digito qualquer palavra que não seja deletar$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^o sistema não deve ativar o botão remover$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^eu não conseguirei clicar no botão para excluir o relato$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^escolho o relato com protocolo \#(\d+)$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^clicar no ícone de exclusão deste relato$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^leio a fraseologia de atenção$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^confirmo que a fraseologia cita o protocolo \#(\d+)$/, function (arg1, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^escolho o relato com protocolo localizado na R\. Leonel Guarnieri$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Given(/^confirmo que a fraseologia cita o endereço R\. Leonel Guarnieri$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });
};
