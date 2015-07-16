'use strict';

/**
 * Provides an API client for the business reports from ZUP API
 * @module BusinessReportsServiceModule
 */
angular
  .module('BusinessReportsServiceModule', [])
  .factory('BusinessReportsService', function ($q, FullResponseRestangular) {
    /**
     * Fetches the business reports list
     * @param {Object} options - API options for the search report endpoint
     * @returns {Object} promise
     */
    self.fetchAll = function (options) {
      options = options || {};

      var url = FullResponseRestangular.all('business_reports');

      options.display_type = 'full';
      options.return_fields = [
        'id', 'title', 'summary', 'begin_date', 'end_date'
      ].join();

      var promise = url.customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (response) {
        var reports = response.data;

        deferred.resolve(reports.map(denormalizeReport));
      }, function (response) {
        deferred.reject(response);
      });

      return deferred.promise;
    };

    /**
     * Remove a single business report
     * @param {Number} id The business report ID
     * @returns {Object} promise
     */
    self.remove = function (id) {
      var promise = FullResponseRestangular.one('business_reports', id).remove(), deferred = $q.defer();

      promise.then(function (response) {
        deferred.resolve(response);
      }, function (response) {
        deferred.reject(response);
      });

      return deferred.promise;
    };

    /**
     * Fetches a single business report
     * @param {Number} id The business report ID
     * @returns {Object} promise
     */
    self.find = function (id) {
      var options = {};

      var url = FullResponseRestangular.one('business_reports', id);

      options.display_type = 'full';
      options.return_fields = [
        'id', 'title', 'summary', 'begin_date', 'end_date', 'charts'
      ].join();

      var promise = url.customGET(null, options);

      var deferred = $q.defer();

      promise.then(function (response) {
        var report = denormalizeReport(FullResponseRestangular.stripRestangular(response.data));
        report._original = angular.copy(report);

        deferred.resolve(report);
      }, function (response) {
        deferred.reject(response);
      });

      return deferred.promise;
    };

    /**
     * Create, update or remove charts for a single business report
     * @param {Object} report The business report
     * @returns {Object} promise
     */
    self.saveCharts = function (report) {
      var validCharts, chartsToCreate, chartsToUpdate, chartsToRemove, promises = [];

      validCharts = _.reject(report.charts, function (c) {
        if (!self.isValid(report)) return true;
      });

      chartsToCreate = _.reject(validCharts, function (c) {
        if (c.id) return true;
      });

      _.each(chartsToCreate, function (chart) {
        promises.push(FullResponseRestangular.one('business_reports', report.id).one('charts').customPOST(normalizeChart(chart)));
      });

      chartsToUpdate = _.select(validCharts, function (c) {
        if (c.id) return true;
      });

      _.each(chartsToUpdate, function (chart) {
        promises.push(FullResponseRestangular.one('business_reports', report.id).one('charts', chart.id).customPUT(normalizeChart(chart)));
      });

      if(report._original && report._original.charts.length > 0) {
        chartsToRemove = _.select(report._original.charts, function(c){
          return !_.findWhere(report.charts, { id: c.id });
        });

        _.each(chartsToRemove, function(c){
          promises.push(FullResponseRestangular.one('business_reports', report.id).one('charts', c.id).remove());
        });
      }

      return promises;
    };

    /**
     * Saves or creates a single business report
     * @param {Object} report The business report
     * @returns {Object} promise
     */
    self.save = function (report) {
      var options = {}, deferred = $q.defer();

      options.return_fields = ['id', 'title', 'summary', 'begin_date', 'end_date', 'charts'].join();

      var reportSavePromise, reportData = normalizeReport(report);

      if (report.id) {
        reportData.id = report.id;
        reportSavePromise = FullResponseRestangular.one('business_reports', report.id).customPUT(reportData);
        $q.all([reportSavePromise].concat(self.saveCharts(report))).then(function (responses) {
          var report = denormalizeReport(responses[0].data);
          deferred.resolve(report);
        }, function (response) {
          deferred.reject(response);
        });
      } else {
        reportSavePromise = FullResponseRestangular.one('business_reports').customPOST(reportData);
        reportSavePromise.then(function(response){
          var newReport = response.data;
          report.id = newReport.id;
          $q.all(self.saveCharts(report)).then(function(){
            deferred.resolve(report);
          }, function(response){
            deferred.reject(response);
          });
        })
      }

      return deferred.promise;
    };

    /**
     * Returns true if the fields in the report are considered to be valid
     * @param {Object} report
     * @returns {bool}
     */
    self.isValid = function(report){
        return !!(report.title &&
                  report.title.length > 0 &&
                  report.charts.length > 0 &&
        _.all(report.charts, function(c){
          return !!(c.title && c.categories.length > 0 && c.period.begin_date && c.period.end_date)
        }));
    };

    // Transforms a chart's attributes to the format used on the client-side
    var denormalizeChart = function (chart) {
      return {
        id: chart.id,
        metric: chart.metric,
        type: chart.chart_type.replace(/\w\S*/g, function(t){return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();}) + "Chart",
        title: chart.title,
        processed: chart.processed,
        description: chart.description,
        period: {
          begin_date: new Date(chart.begin_date),
          end_date: new Date(chart.end_date)
        },
        categories: chart.categories,
        data: {
          cols: _.map(chart.data.subtitles, function(k, v){ return { type: k, label: v}}),
          rows: _.map(chart.data.content, function(row){
            return { c: _.map(row, function(v){ return { v: v }; })}
          })
        }
      };
    };

    // Transforms a chart's attributes to the format used on the server
    var normalizeChart = function(chart){
      return {
        id: chart.id,
        metric: chart.metric,
        chart_type: chart.type.toLowerCase().replace(/chart$/, ''),
        title: chart.title,
        description: chart.description,
        begin_date: chart.period.begin_date,
        end_date: chart.period.end_date,
        categories_ids: _.map(chart.categories, function (c) {
          return c.id;
        })
      }
    };

    // Transforms a report's attributes to the format used on the client-side
    var denormalizeReport = function (report) {
      if(report.begin_date && report.end_date) {
        report.begin_date = new Date(report.begin_date);
        report.end_date = new Date(report.end_date);
      }
      if (!report.charts) {
        report.charts = [];
      } else {
        report.charts = _.map(report.charts, denormalizeChart);
      }
      return report;
    };

    // Transforms a report's attributes to the format used on the server
    var normalizeReport = function(report) {
      return {
        title: report.title,
        begin_date: report.begin_date,
        end_date: report.end_date,
        summary: report.summary
      };
    };

    return self;
  });
