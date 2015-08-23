var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;

module.exports = function () {
  this.World = require('../support/world').World;

  var buttonConfirm = element.all(by.css('button[ng-click="confirm()"]')).get(0);
  var innerHtmlBefore;

  this.When(/^clicar no ícone de exclusão$/, function () {
    innerHtmlBefore = element(by.css('#reports-listing-table')).getInnerHtml();
    return element.all(by.css('a[ng-click="deleteReport(report)"]')).get(0).click();
  });

  this.When(/^aparecer a confirmação de exclusão$/, function () {
    browser.sleep(1000);
    return expect(element(by.model('confirmText')).isDisplayed()).to.eventually.be.true
  });

  this.When(/^digito a palavra deletar$/, function () {
    return element(by.model('confirmText')).sendKeys('deletar');
  });

  this.When(/^clicar no botão remover$/, function () {
    buttonConfirm.click()
  });

  this.Then(/^o sistema deve retornar uma mensagem de remoção bem sucedida$/, function () {
    return expect(element(by.css('.message-status.success p')).isPresent()).to.eventually.be.true
  });

  this.Then(/^atualizar a listagem de relatos$/, function () {
    return expect(element(by.css('#reports-listing-table')).getInnerHtml()).to.not.equal(innerHtmlBefore);
  });

  this.When(/^digito qualquer palavra que não seja deletar$/, function () {
    return element(by.model('confirmText')).sendKeys('I\'m alive');
  });

  this.Then(/^o sistema não deve ativar o botão remover$/, function (next) {
    return Promise.all([
        expect(buttonConfirm.isEnabled()).to.eventually.be.false,
        element.all(by.css('button[ng-click="close()"]')).get(0).click()
      ]
    )
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
