require('dotenv').load({ silent: true });
var baseUrl = process.env.PAINEL_URL || 'http://zup.cognita.ntxdev.com.br';

exports.config = {
  allScriptsTimeout: 30000,
  onPrepare: function () {
    return browser.driver.manage().window().setSize(1600, 800);
  },

  baseUrl: baseUrl,
  directConnect : process.env.DEBUG_TESTS || false,
  seleniumAddress: process.env.DEBUG_TESTS ? 'http://localhost:4444/wd/hub':undefined,

  framework: 'cucumber',

  specs: [
    'features/cases/**/*.feature'
  ],
  capabilities: {
    'browserName': 'chrome',
    'version': 'ANY'
  },
  cucumberOpts: {
    require: 'features/step_definitions/*.js',
    tags: '~@notimplemented',
    format: 'pretty'
  }
};
