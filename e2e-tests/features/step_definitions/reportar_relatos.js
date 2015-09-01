var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
 
module.exports = function () {
  var page;
  var form
  this.World = require('../support/world').World;
  
  this.Before(function(callback){
    page= this.pages.report;
    callback();
  });
  
  this.Given(/^clico no botão Novo Relato$/, function () {
    return page.newReport().then(function(){
      form = page.editForm;
    });
  });

  this.When(/^que preencho os campos obrigatórios do relato$/, function () {
    return form.fillCategory("fios e cabos")
		 .then(form.fillAddress.bind(form, "R. Julieta vila jordanopolis", "167"))
		 .then(form.linkUser.bind(form, "Leide Santos"))
  });

  this.When(/^apos selecionar um usuário$/, function () {
    return form.linkUser("Leide Santos");
  });

  this.When(/^clico no botão para criar o relato$/, function () {
    return form.saveReport();
  });

  this.Then(/^o sistema mostra uma mensagem de sucesso$/, function () {
    return expect(form.statusMessage()).to.eventually.equal('O relato foi criado com sucesso.');
  });

  this.Given(/^faço um upload de uma imagem$/, function () {
    return form.uploadImage();
  });
  
  this.Given(/^devo visualizar uma aba "(.*)"$/, function (texto) {
    return expect(form.abaIsDisplayed(texto)).to.eventually.true;
  });
  
  this.Given(/^devo visualizar as imagens que fiz upload$/, function () {
    return expect(form.imageAreaIsDisplayed()).to.eventually.be.true;
  });
  
  this.Given(/^não devo visualizar uma aba "([^"]*)"$/, function (texto) {
    return expect(form.abaIsDisplayed(texto)).to.eventually.false;
  });
  
  this.Given(/^não devo visualizar a área de imagens$/, function () {
    return expect(form.imageAreaIsDisplayed()).to.eventually.be.false;
  });
  
  this.Given(/^escolho a categoria "([^"]*)"$/, function (categoria) {
    return form.fillCategory(categoria);
  });
  
  this.Given(/^preencho o endereço com "([^"]*)"$/, function (texto) {
    var rua = texto.split(', ')[0];
    var numero = texto.split(', ')[1]; 
    
    return form.fillAddress(rua, numero); 
  });
  
  this.Given(/^descrevo a situação com texto: "([^"]*)"$/, function (situacao) {
    return element(by.model('description')).sendKeys(situacao);
  });
  
  this.Given(/^seleciono o usuário "([^"]*)" como solicitante$/, function (userName) {
    return form.linkUser(userName);
  });
  
  this.Then(/^devo visualizar o texto "([^"]*)"$/, function (texto) {
    return expect(element(by.cssContainingText('.report-data', texto)).isDisplayed()).to.eventually.be.true;
  });
  
  this.Then(/^devo visualizar o nome do usuário atual na area de Histórico$/, function () {
    return expect(element(by.binding('log.user.name')).isDisplayed()).to.eventually.be.true;
  });
  
  this.Given(/^preencho os campos obrigatórios do usuário "([^"]*)"$/, function (userName) {
    var nome      = element(by.model('user.name'));
    var email     = element(by.model('user.email'));
    var endereco  = element(by.model('user.address'));
    var bairro    = element(by.model('user.district'));
    var cidade    = element(by.model('user.city'));
    var cep       = element(by.model('user.postal_code'));
    var telefone  = element(by.model('user.phone'));
    var cpf       = element(by.model('user.document'));
    
    return Promise.all([
      nome.sendKeys(userName),
      email.sendKeys('teste.zup@gmail.com'),    
      endereco.sendKeys('R. Julieta, 167'), 
      bairro.sendKeys('vila jordanopolis'),   
      cidade.sendKeys('São Bernardo do Campo'),   
      cep.sendKeys('09891-190'),      
      telefone.sendKeys('11981710184'), 
      cpf.sendKeys('46141383220')      
    ]);    
  });
  
  this.When(/^for redirecionado para a exibição dos dados do relato$/, function () {
    return expect(this.currentUrl()).to.eventually.match(/reports\/\d+/);
  });
  
  this.Then(/^o sistema deve retornar uma mensagem de sucesso$/, function(){
    return expect(element(by.css('.message-status.success')).isDisplayed()).to.eventually.true;
  });
};
