"use strict";

angular.module("ecsService", [])

  .service("ecsService", ["$q", "$http", "$rootScope", "$filter",
	  function ($q, $http, $rootScope, $filter) {

		  var self = this;

		  self.ecs = {};
		  self.ecs.initialized = false;

		  self.getSessions = function () {

			  var deferred = $q.defer();

			  $http({
				  method: "GET",
				  url: "https://sessionize.com/api/v2/57c0xuih/view/sessions"
			  }).then(function (response) {

				  self.ecs.sessions = response.data[0].sessions;

				  deferred.resolve();

			  });

			  return deferred.promise;
		  };

		  self.getSpeakers = function () {

			  var deferred = $q.defer();

			  $http({
				  method: "GET",
				  url: "https://sessionize.com/api/v2/57c0xuih/view/speakers"
			  }).then(function (response) {

				  self.ecs.speakers = response.data[0].speakers;

				  deferred.resolve();

			  });

			  return deferred.promise;
		  };

		  self.initEcs = function () {

			  var deferred = $q.defer();

			  var p = [];

			  p.push(self.getSessions());
			  p.push(self.getSpeakers());

			  $q.all(p).then(function () {

				  deferred.resolve();

			  });

			  return deferred.promise;

		  };

	  }
  ]);