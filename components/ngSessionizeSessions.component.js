"use strict";

angular.module("ngSessionize")
	.component("ngSessionizeSessions", {
		template: require("./ngSessionizeSessions.tmpl.html"),
		controller: "ngSessionizeSessionsController",
		controllerAs: "vm"
	})
	.controller("ngSessionizeSessionsController", ["$sce", "$q", "$filter", "$location", "ngSessionizeService",
		function ($sce, $q, $filter, $location, ngSessionizeService) {
			var vm = this;
			vm.data = ngSessionizeService.ngSessionize;
			// TODO: The order of these properties determines the order of the refiners
			vm.filters = {
				"Audience": []
			};
			vm.filterCount = 0;
			vm.filteredSessions = [];
			vm.showModal = false;
			vm.selectedSpeaker = {};
			vm.initialized = false;

			vm.getSpeakerPhoto = function (speakerId) {
				return $filter("filter")(vm.data.speakers, { id: speakerId })[0].profilePicture;
			};

			vm.getTags = function (type) {
				var list = [];

				for (var i = 0; i < vm.data.sessions.length; i++) {
					var session = vm.data.sessions[i];
					var thisCategory = $filter("filter")(session.categories, { name: type })[0];
					for (var j = 0; j < thisCategory.categoryItems.length; j++) {
						var thisItem = thisCategory.categoryItems[j];
						var thisListItem = $filter("filter")(list, { name: thisItem.name })[0];
						if (!thisListItem) {
							var newItem = thisItem;
							newItem.selected = false;
							newItem.count = 0;
							list.push(newItem);
						}
					}
				}
				return list;
			};

			vm.countTags = function (prop) {
				// Clear the filter counts
				for (var f in vm.filters) {
					if (vm.filters.hasOwnProperty(f)) {
						for (var i = 0; i < vm.filters[f].length; i++) {
							vm.filters[f][i][prop] = 0;
						}
					}
				}
				// Count 'em
				for (var i = 0; i < vm.filteredSessions.length; i++) {
					var session = vm.filteredSessions[i];

					for (var f in vm.filters) {
						if (vm.filters.hasOwnProperty(f)) {
							var thisCategory = $filter("filter")(session.categories, { name: f })[0];
							for (var j = 0; j < thisCategory.categoryItems.length; j++) {
								var thisItem = thisCategory.categoryItems[j];
								var thisListItem = $filter("filter")(vm.filters[f], { name: thisItem.name })[0];
								if (thisListItem) {
									thisListItem[prop]++;
								}
							}
						}
					}
				}
			};

			vm.filterSessions = function () {
				var showSessions = [];

				for (var s = 0; s < vm.data.sessions.length; s++) {
					var matches = 0;
					var thisSession = vm.data.sessions[s];

					for (var f in vm.filters) {
						if (vm.filters.hasOwnProperty(f)) {

							var filterVals = vm.filters[f].filter(function (item) {
								return item.selected;
							}).map(function (item) {
								return item.id;
							});

							for (var i = 0; i < filterVals.length; i++) {
								var thisCategoryItems = $filter("filter")(thisSession.categories, { name: f })[0].categoryItems.map(function (item) {
									return item.id;
								});
								if (thisCategoryItems.indexOf(filterVals[i]) !== -1) {
									matches++;
								}
							}
						}
					}

					if (matches === vm.filterCount) {
						showSessions.push(thisSession);
					}
				}

				vm.filteredSessions = showSessions;
			};

			vm.toggle = function (item) {
				if (item.selected) {
					vm.filterCount--;
					item.selected = false;
				} else {
					vm.filterCount++;
					item.selected = true;
				}

				if (vm.filterCount > 0) {
					vm.filterSessions();
				} else {
					vm.filteredSessions = vm.data.sessions;
				}
				vm.countTags("countFiltered");
			};

			vm.clearAll = function () {
				// Clear the filter values
				for (var f in vm.filters) {
					if (vm.filters.hasOwnProperty(f)) {
						for (var i = 0; i < vm.filters[f].length; i++) {
							vm.filters[f][i].selected = false;
						}
					}
				}
				vm.filterCount = 0;
				vm.filteredSessions = vm.data.sessions;
				vm.countTags("countFiltered");
			};

			vm.speakerModal = function (speaker) {
				vm.showModal = true;
				vm.selectedSpeaker = $filter("filter")(vm.data.speakers, { id: speaker.id })[0];
			};

			vm.$onInit = function () {
				vm.statusMessage = "Loading sessions...";
				ngSessionizeService.initNgSessionize().then(function () {
					vm.filteredSessions = vm.data.sessions;
					// Get the filter values and counts
					for (var f in vm.filters) {
						if (vm.filters.hasOwnProperty(f)) {
							vm.filters[f] = vm.getTags(f);
							vm.countTags("count");
							vm.countTags("countFiltered");
						}
					}
					vm.initialized = true;
				});
			};
		}
	]);

require("./ngSessionizeSessionsRefiner.component");
require("./ngSessionizeSpeakerModal.component");