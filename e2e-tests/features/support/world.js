var Auth = require('./autenticacao');
var Report = require('./relatos');

require('dotenv').load({ silent: true });
var baseUrl = process.env.PAINEL_URL || 'http://zup.cognita.ntxdev.com.br'

function WorldFactory(callback) {
  callback({
    pages: {
      auth: new Auth(),
      report: new Report()
    },
    visit: function (url) {
      return browser.get(baseUrl + url);
    },
    currentUrl: function () {
      return browser.getCurrentUrl();
    },
    getInnerHtmlState: function (el) {
      return element(by.css(el)).getInnerHtml();
    }
  });
}

module.exports.World = WorldFactory;
