var path  = require('path');

function Form() {}

Form.prototype = {
  fillCategory: function (categoryName) {
    var select = element(by.model('selectedCategory'));
    var dropdown = select.element(by.css('.dropdown'));
    var category = element(by.repeater('subcategory in category.subcategories').row(0));

    return select.element(by.tagName('button')).click().then(function () {
      return dropdown.element(by.model('q')).sendKeys(categoryName).then(function () {
        return category.click();
      });
    });
  },

  fillAddress: function (street, num) {
    var form = element(by.css('[ng-show="selectedCategory"]'));
    var getField = function (name) { return form.element(by.model('address.' + name)); }
    var k = protractor.Key;
    var typeInAddress = function (text) {
      return getField('address').sendKeys(text);
    };

    var setAddressWithAutoComplete = typeInAddress('R. Julieta vila jordanopolis').then(function () {
      return typeInAddress(k.ARROW_DOWN).then(function () {
        return typeInAddress(k.ENTER)
      })
    });

    return setAddressWithAutoComplete.then(function () {
      return getField('number').sendKeys('167');
    });
  },

  linkUser: function (userName) {
    var linkOpenModal = element(by.css('button[ng-click="selectUser()"]'));
    var modal = element(by.css('.modal-reports-select-user'));
    var searchUsers = modal.element(by.css('input[keyboard-poster="search"]'));
    var firstUser = modal.element(by.repeater('user in users').row(0));
    var select = firstUser.element(by.css('button[ng-click="setUser(user)"]'));

    return linkOpenModal.click().then(function () {
      return modal.isDisplayed().then(function () {
        return searchUsers.sendKeys(userName).then(function () {
          browser.wait(function () {
            return firstUser.isDisplayed();
          }, 9000);
          return select.click();
        });
      });
    });
  },
  
  uploadImage:function(){
    var fileToUpload = '../assets/images/9666941.png';
    var absolutePath = path.resolve(__dirname, fileToUpload);

    return element(by.css('.upload input[type="file"]')).sendKeys(absolutePath);    
  },
  
  saveReport:function(){
    return element(by.css('button[ng-click="send()"]')).click();
  },
  
  statusMesssage:function(){
    return element(by.css('.glyphicon.glyphicon-ok')).getText();
  },
  
  abaIsDisplayed : function(texto){
    var menu = element(by.css('.report-menu'));
    return menu.element(by.linkText(texto)).isDisplayed();
  },
  
  imageAreaIsDisplayed:function(){
    return element(by.id('report-images')).isDisplayed();
  }
};

module.exports = Form;