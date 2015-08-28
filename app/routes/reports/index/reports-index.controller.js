'use strict';

angular
  .module('ReportsIndexControllerModule', [
    'ReportsDestroyModalControllerModule',
    'OnFocusComponentModule',
    'OnBlurComponentModule',
    'AdvancedFiltersServiceModule',
    'ReportsItemsServiceModule'
  ])

  .controller('ReportsIndexController', function ($rootScope, $scope, Restangular, $modal, $q, AdvancedFilters, $location, $window, $cookies, ReportsItemsService, $state, $log) {

    $log.info('ReportsIndexController created.');

    $scope.loading = true;
    $rootScope.uiHasScroll = true;

    $scope.loadingPagination = false;
    $scope.filtersHash = null;
    $scope.categories = {};
    $scope.categoriesStatuses = {};

    // Basic filters
    var resetFilters = function () {
      $scope.selectedCategories = [];
      $scope.selectedStatuses = [];
      $scope.selectedUsers = [];
      $scope.selectedReporters = [];
      $scope.beginDate = null;
      $scope.endDate = null;
      $scope.searchText = null;
      $scope.overdueOnly = null;
      $scope.assignedToMyGroup = null;
      $scope.assignedToMe = null;
      $scope.minimumNotificationNumber = null;
      $scope.daysSinceLastNotification = null;
      $scope.daysForLastNotificationDeadline = null;
      $scope.daysForOverdueNotification = null;

      // map options
      $scope.position = null;
      $scope.selectedAreas = [];
    };

    resetFilters();

    // Advanced filters
    $scope.availableFilters = [
      {name: 'Protocolo ou endereço contém...', action: 'query'},
      {name: 'Com as categorias...', action: 'category'},
      {name: 'Com os estados...', action: 'status'},
      {name: 'Criado pelos munícipes...', action: 'author'},
      {name: 'Relatados por...', action: 'reporter'},
      {name: 'Por período...', action: 'date'},
      {name: 'Por perímetro...', action: 'area'},
      {name: 'Apenas relatos atrasados...', action: 'overdueOnly'},
      {name: 'Associados ao meu grupo...', action: 'assignedToMyGroup'},
      {name: 'Associados à mim...', action: 'assignedToMe'},
      {name: 'Quantidade de notificações emitidas...', action: 'minimumNotificationNumber'},
      {name: 'Dias desde a última notificação emitida...', action: 'daysSinceLastNotification'},
      {name: 'Dias para o vencimento da última notificação emitida...', action: 'daysForLastNotificationDeadline'},
      {name: 'Dias em atraso para notificações vencidas...',action: 'daysForOverdueNotification'}
    ];

    $scope.activeAdvancedFilters = [];

    if (angular.isDefined($cookies.reportsFiltersHash)) {
      $scope.activeAdvancedFilters = JSON.parse($window.atob($cookies.reportsFiltersHash));
    }

    if (angular.isDefined($location.search().filters)) {
      $scope.filtersHash = $location.search().filters;
      $scope.activeAdvancedFilters = JSON.parse($window.atob($scope.filtersHash));
    }

    var pushUnique = function (arr, val) {
      if (arr.indexOf(val) === -1) {
        arr.push(val)
      }
    };

    // Entrypoint / Fires initial load
    $scope.$watch('activeAdvancedFilters', function () {
      resetFilters();

      // save filters into hash
      if ($scope.activeAdvancedFilters.length !== 0) {
        $scope.filtersHash = $window.btoa(JSON.stringify($scope.activeAdvancedFilters));

        $location.search('filters', $scope.filtersHash);

        $cookies.reportsFiltersHash = $scope.filtersHash;
      } else {
        $scope.filtersHash = null;

        $location.search('filters', null);

        delete $cookies.reportsFiltersHash;
      }

      for (var i = $scope.activeAdvancedFilters.length - 1; i >= 0; i--) {
        var filter = $scope.activeAdvancedFilters[i];

        if (filter.type === 'query') {
          $scope.searchText = filter.value;
        }

        if (filter.type === 'categories') {
          pushUnique($scope.selectedCategories, filter.value);
        }

        if (filter.type === 'statuses') {
          pushUnique($scope.selectedStatuses, filter.value);
        }

        if (filter.type === 'authors') {
          pushUnique($scope.selectedUsers, filter.value);
        }

        if (filter.type === 'reporters') {
          pushUnique($scope.selectedReporters, filter.value);
        }

        if (filter.type === 'beginDate') {
          $scope.beginDate = filter.value;
        }

        if (filter.type === 'endDate') {
          $scope.endDate = filter.value;
        }

        if (filter.type === 'area') {
          pushUnique($scope.selectedAreas, filter.value);
        }

        if (filter.type === 'overdueOnly') {
          $scope.overdueOnly = true;
        }

        if (filter.type === 'assignedToMyGroup') {
          $scope.assignedToMyGroup = true;
        }

        if (filter.type === 'assignedToMe') {
          $scope.assignedToMe = true;
        }

        if (filter.type === 'minimumNotificationNumber') {
          $scope.minimumNotificationNumber = filter.value;
        }

        if (filter.type === 'daysSinceLastNotification') {
          $scope.daysSinceLastNotification = filter.value;
        }

        if (filter.type === 'daysForLastNotificationDeadline') {
          $scope.daysForLastNotificationDeadline = filter.value;
        }

        if (filter.type === 'daysForOverdueNotification') {
          $scope.daysForOverdueNotification = filter.value;
        }
      }

      loadFilters();
    }, true);

    // Return right promise
    $scope.generateReportsFetchingOptions = function () {
      var options = {};

      // if we searching, hit search/users
      if ($scope.searchText !== null) {
        options.query = $scope.searchText;
      }

      // check if we have categories selected
      if ($scope.selectedCategories.length !== 0) {
        options.reports_categories_ids = $scope.selectedCategories.join(); // jshint ignore:line
      }

      // check if we have statuses selected
      if ($scope.selectedStatuses.length !== 0) {
        options.statuses_ids = $scope.selectedStatuses.join(); // jshint ignore:line
      }

      // check if we have users selected
      if ($scope.selectedUsers.length !== 0) {
        options.users_ids = $scope.selectedUsers.join(); // jshint ignore:line
      }

      // check if we have reporters
      if ($scope.selectedReporters.length !== 0) {
        options.reporters_ids = $scope.selectedReporters.join(); // jshint ignore:line
      }

      if ($scope.beginDate !== null) {
        options.begin_date = $scope.beginDate; // jshint ignore:line
      }

      if ($scope.endDate !== null) {
        options.end_date = $scope.endDate; // jshint ignore:line
      }

      // map options
      if ($scope.selectedAreas.length === 0 && $scope.position !== null) {
        options['position[latitude]'] = $scope.position.latitude;
        options['position[longitude]'] = $scope.position.longitude;
        options['position[distance]'] = $scope.position.distance;
      } else if ($scope.selectedAreas.length !== 0) {
        for (var i = $scope.selectedAreas.length - 1; i >= 0; i--) {
          var latKey = 'position[' + i + '][latitude]';
          var lngKey = 'position[' + i + '][longitude]';
          var disKey = 'position[' + i + '][distance]';

          options[latKey] = $scope.selectedAreas[i].latitude;
          options[lngKey] = $scope.selectedAreas[i].longitude;
          options[disKey] = $scope.selectedAreas[i].distance;
        }
      }

      if ($scope.overdueOnly !== null) {
        options.overdue = $scope.overdueOnly;
      }

      if ($scope.assignedToMyGroup !== null) {
        options.assigned_to_my_group = $scope.assignedToMyGroup;
      }

      if ($scope.assignedToMe !== null) {
        options.assigned_to_me = $scope.assignedToMe;
      }

      if ($scope.minimumNotificationNumber !== null) {
        options.minimum_notification_number = $scope.minimumNotificationNumber;
      }

      if ($scope.daysSinceLastNotification !== null) {
        options['days_since_last_notification[begin]'] = $scope.daysSinceLastNotification.begin;
        options['days_since_last_notification[end]'] = $scope.daysSinceLastNotification.end;
      }

      if ($scope.daysForLastNotificationDeadline !== null) {
        options['days_for_last_notification_deadline[begin]'] = $scope.daysForLastNotificationDeadline.begin;
        options['days_for_last_notification_deadline[end]'] = $scope.daysForLastNotificationDeadline.end;
      }

      if ($scope.daysForOverdueNotification !== null) {
        options['days_for_overdue_notification[begin]'] = $scope.daysForOverdueNotification.begin;
        options['days_for_overdue_notification[end]'] = $scope.daysForOverdueNotification.end;
      }

      return options;
    };

    var loadFilters = $scope.reload = function (reloading) {
      $scope.$broadcast('loadFilters', reloading);
    };

    $scope.removeFilter = function (filter) {
      $scope.activeAdvancedFilters.splice($scope.activeAdvancedFilters.indexOf(filter), 1);
    };

    $scope.resetFilters = function () {
      $scope.activeAdvancedFilters = [];
      $scope.$broadcast('resetFilters');
    };

    $scope.loadFilter = function (status) {
      if (status === 'query') {
        AdvancedFilters.query($scope.activeAdvancedFilters);
      }

      if (status === 'category') {
        AdvancedFilters.category($scope.activeAdvancedFilters, 'reports');
      }

      if (status === 'status') {
        AdvancedFilters.status($scope.activeAdvancedFilters, 'reports');
      }

      if (status === 'author') {
        AdvancedFilters.author($scope.activeAdvancedFilters);
      }

      if (status === 'reporter') {
        AdvancedFilters.reporter($scope.activeAdvancedFilters);
      }

      if (status === 'date') {
        AdvancedFilters.period($scope.activeAdvancedFilters);
      }

      if (status === 'area') {
        AdvancedFilters.area($scope.activeAdvancedFilters);
      }

      if (status === 'overdueOnly') {
        $scope.activeAdvancedFilters.push({
          title: 'Atraso',
          type: 'overdueOnly',
          desc: 'Apenas relatos atrasados'
        });
      }

      if (status === 'assignedToMyGroup') {
        $scope.activeAdvancedFilters.push({
          title: 'Relatos associados',
          type: 'assignedToMyGroup',
          desc: 'Ao meu grupo'
        });
      }

      if (status === 'assignedToMe') {
        $scope.activeAdvancedFilters.push({
          title: 'Relatos associados',
          type: 'assignedToMe',
          desc: 'À mim'
        });
      }

      if (status === 'minimumNotificationNumber') {
        AdvancedFilters.notificationMinimumNumber($scope.activeAdvancedFilters);
      }

      if (status === 'daysSinceLastNotification') {
        AdvancedFilters.notificationSinceLast($scope.activeAdvancedFilters);
      }

      if (status === 'daysForLastNotificationDeadline') {
        AdvancedFilters.notificationDeadline($scope.activeAdvancedFilters);
      }

      if (status === 'daysForOverdueNotification') {
        AdvancedFilters.notificationOverdue($scope.activeAdvancedFilters);
      }
    };

    $scope.openReport = function (report_id, event) {
      if (!$rootScope.loading
        && event.target.parentNode.tagName.toLowerCase() != 'a'
        && event.target.tagName.toLowerCase() != 'a'
      ) {
        $state.go('reports.show', {id: report_id});
      }
    };

    // Search function
    $scope.search = function (text) {
      $scope.searchText = text;
      loadFilters();
    };

    $scope.share = function () {
      AdvancedFilters.share();
    };

    var $handleDestroy = $scope.$on('$destroy', function () {
      $log.info('ReportsIndexController destroyed.');
    });
  });
