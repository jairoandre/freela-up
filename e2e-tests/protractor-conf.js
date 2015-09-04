var features = process.argv[3];
if (features && features.split('=')[0] == '--features') {
  features = [features.split('=')[1]];
}

exports.config = {
  allScriptsTimeout: 20000,
  onPrepare: function () {
    return browser.driver.manage().window().setSize(1600, 800);
  },
  directConnect : process.env.DEBUG_TESTS || false,
  seleniumAddress: process.env.DEBUG_TESTS ? 'http://localhost:4444/wd/hub':undefined,
  framework: 'cucumber',
  specs: features || [
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
