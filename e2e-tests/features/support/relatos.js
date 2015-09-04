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
	
  chooseFilter: function(filterName){
    var input = element(by.model('filterQuery'));
		
    return this.activeFilter()
      .then(function(){
        return input.clear()
      }).then(function(){
        return input.sendKeys(filterName)
      }).then(function(){
        return this.avaliableFilters().element(by.css('a[ng-click]')).click();
      }.bind(this));
  },
	
  avaliableFilters:function(){
    return element(by.css('.availableFilters[ng-show]'));
  },

  fillFilter:function(model, query){
    return element(by.css('.modal-dialog')).element(by.model(model)).sendKeys(query);
  },

  submitFilter:function(){
    return element(by.css('.modal-dialog')).element(by.css('button[ng-click="save()"]')).click();
  },

  reports: function () {
    return element.all(by.css('#reports-listing-table tbody tr'));
  },

  getAllItems:function(byColumn){
    var selectorItems = byColumn ? ':nth-child(' + byColumn + ')':':not(.status_color):not(:last-child)';

    return element.all(by.css('#reports-listing-table tbody tr td' + selectorItems));
  },
  
  applyFilter:function(filter, value){
    var page = this;
	  if(!Array.isArray(value))
      value = [{model:'input.value', value:value}];
      
    return page.chooseFilter(filter)
      .then(function(){
        return Promise.all(value.map(function(v){
          return page.fillFilter(v.model, v.value);  
        }))
      }).then(function(){
        return page.submitFilter();
      });      
  }
};

module.exports = Reports;