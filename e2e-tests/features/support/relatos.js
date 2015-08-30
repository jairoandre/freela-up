var ReportForm = require('./form_relato');

function Reports() {
	this.editForm = new ReportForm();
}

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
	
	newReport:function(){
		return element(by.css('[href="#/reports/add"]')).click()
	},
	
	fillRequiredFieldsInEditForm : function(){
		var form  = this.editForm;
		
		return form.fillCategory("fios e cabos")
			.then(form.fillAddress.bind(form, "R. Julieta vila jordanopolis", "167"))
			.then(form.linkUser.bind(form, "Leide Santos"))
	}
};

module.exports = Reports;
