function Reports() {}

Reports.prototype = {
	activeFilter: function () {
		//browser.driver not support focus and blur events on tests background
		//But we can set value that control show/hide of filter throuhg focus and blur event
		var script  = 'setTimeout(function(done){'+
  			'var $s = angular.element(\'[ng-model="filterQuery"]\').scope(); '+
  			'$s.show_availableFilters = true; '+
        	'$s.$digest(); '+
  			'done(); '+
      '}.bind({}, arguments[arguments.length - 1]), 800);';

		return browser.executeAsyncScript(script);
	},

	avaliableFilters:function(){
		return element(by.css('.availableFilters[ng-show]'));
	},

	fillFilter:function(query){
		return element(by.css('.modal-dialog')).element(by.model('input.query')).sendKeys(query);
	},

	submitFilter:function(){
		return element(by.css('.modal-dialog')).element(by.css('button[ng-click="save()"]')).click();
	},

	reports: function () {
		return element.all(by.css('#reports-listing-table tbody tr'));
	},

	getAllItems:function(byColumn){
		var selectorItems = byColumn ? ':nth-child(' + byColumn + ')':':not(:last-child)';

		return element.all(by.css('#reports-listing-table tbody tr td' + selectorItems));
	},

  confirmProtocol: function () {
    return element(by.css('.removeModal .modal-body p:first-of-type b:first-of-type'));
  },

  confirmAddress: function () {
    return element(by.css('.removeModal .modal-body p:first-of-type b:nth-child(2)'));
  },

  getProtocol: function () {
    return element(by.css('#reports-listing-table tbody td:first-of-type a'));
  },

  getAdress: function () {
    return element(by.css('#reports-listing-table tbody td:nth-child(2)'));
  },

  getSuccessMsg: function () {
    return element(by.css('.message-status.success p'));
  },

  reportDeleteButton: function () {
    return element.all(by.css('a[ng-click="deleteReport(report)"]')).get(0).click();
  },

  closeButton: function () {
    return element.all(by.css('button[ng-click="close()"]')).get(0).click();
  },

  getPhrase: function () {
    return element(by.css('.removeModal .modal-body p:first-of-type'));
  },

  excludeIcon: function () {
    return element.all(by.css('a[ng-click="deleteReport(report)"]')).get(0).click();
  }
};

module.exports = Reports;
