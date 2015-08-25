var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;

module.exports = function () {
  this.World = require('../support/world').World;

  var buttonConfirm = element.all(by.css('button[ng-click="confirm()"]')).get(0);
  var innerHtmlBefore;
  var reportNumber;
  var address;
  var confirmationText = function (txt) {
    return element(by.model('confirmText')).sendKeys(txt)
  };

  this.When(/^clicar no ícone de exclusão$/, function () {
    innerHtmlBefore = element(by.css('#reports-listing-table')).getInnerHtml();
    return element.all(by.css('a[ng-click="deleteReport(report)"]')).get(0).click();
  });

  this.When(/^aparecer a confirmação de exclusão$/, function () {
    browser.sleep(1000);
    return expect(element(by.model('confirmText')).isDisplayed()).to.eventually.be.true
  });

  this.When(/^digito a palavra deletar$/, function () {
    return confirmationText('deletar');
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
    return confirmationText('I\'m alive');
  });

  this.Then(/^o sistema não deve ativar o botão remover$/, function () {
    return Promise.all([
        expect(buttonConfirm.isEnabled()).to.eventually.be.false,
        element.all(by.css('button[ng-click="close()"]')).get(0).click()
      ]
    )
  });

  this.Given(/^escolho o relato com protocolo \#(\d+)$/, function () {
    return element(by.css('#reports-listing-table tbody td:first-of-type a')).getText().then(function(thisText) {
      reportNumber = '#' + thisText;
    });
  });

  this.When(/^clicar no ícone de exclusão deste relato$/, function () {
    return element.all(by.css('a[ng-click="deleteReport(report)"]')).get(0).click();
  });

  this.When(/^leio a fraseologia de atenção$/, function () {
    browser.sleep(5000);
    return expect(element(by.css('.removeModal .modal-body p:first-of-type')).getInnerHtml()).to.not.empty;
  });

  this.Then(/^confirmo que a fraseologia cita o protocolo \#(\d+)$/, function () {
    return Promise.all([
      expect(element(by.css('.removeModal .modal-body p:first-of-type b:first-of-type')).getText()).to.eventually.equal(reportNumber),
      confirmationText('deletar'),
      buttonConfirm.click()
    ])
  });

  this.Given(/^escolho o relato com protocolo localizado na R\. Leonel Guarnieri$/, function () {
    return element(by.css('#reports-listing-table tbody td:nth-child(2)')).getText().then(function (thisText) {
      address = thisText;
    });
  });

  this.Then(/^confirmo que a fraseologia cita o endereço R\. Leonel Guarnieri$/, function () {
    return Promise.all([
      expect(element(by.css('.removeModal .modal-body p:first-of-type b:nth-child(2)')).getText()).to.eventually.equal(address),
      confirmationText('deletar'),
      buttonConfirm.click()
    ]);
  });
};
