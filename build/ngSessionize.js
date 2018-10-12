/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./ngSessionize.app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./components/index.js":
/*!*****************************!*\
  !*** ./components/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./ngSessionizeSessions.component */ "./components/ngSessionizeSessions.component.js");
__webpack_require__(/*! ./ngSessionizeSessionsRefiner.component */ "./components/ngSessionizeSessionsRefiner.component.js");
__webpack_require__(/*! ./ngSessionizeSpeakerModal.component */ "./components/ngSessionizeSpeakerModal.component.js");

/***/ }),

/***/ "./components/ngSessionizeSessions.component.js":
/*!******************************************************!*\
  !*** ./components/ngSessionizeSessions.component.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module("ngSessionize")
	.component("ngSessionizeSessions", {
		template: __webpack_require__(/*! ./ngSessionizeSessions.tmpl.html */ "./components/ngSessionizeSessions.tmpl.html"),
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

__webpack_require__(/*! ./ngSessionizeSessionsRefiner.component */ "./components/ngSessionizeSessionsRefiner.component.js");
__webpack_require__(/*! ./ngSessionizeSpeakerModal.component */ "./components/ngSessionizeSpeakerModal.component.js");

/***/ }),

/***/ "./components/ngSessionizeSessions.tmpl.html":
/*!***************************************************!*\
  !*** ./components/ngSessionizeSessions.tmpl.html ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"sessionize\" ng-cloak>\r\n\r\n    <div class=\"sz-spinner\" ng-show=\"!vm.initialized\"></div>\r\n\r\n    <div class=\"ngs-sessions-container\" ng-if=\"vm.initialized\">\r\n\r\n\r\n        <div class=\"ngs-refiners\">\r\n\r\n            <h5>Refine results</h5>\r\n\r\n            <div ng-repeat=\"(key, value) in vm.filters\">\r\n\r\n                <ng-sessionize-sessions-refiner vm=\"vm\" refinertype=\"key\" items=\"value\"></ng-sessionize-sessions-refiner>\r\n\r\n            </div>\r\n\r\n        </div>\r\n\r\n\r\n        <div class=\"ngs-sessions\">\r\n\r\n            <div class=\"applied-filters\">\r\n\r\n                <div ng-repeat=\"(key, value) in vm.filters\">\r\n\r\n                    <div ng-repeat=\"item in value | filter:{ selected: true} \" ng-click=\"vm.toggle(item)\">\r\n                        <span ng-bind=\"item.name\"></span>\r\n                        <i class=\"fas fa-times fa-sm\"></i>\r\n                    </div>\r\n\r\n                </div>\r\n                <div class=\"ngs-clear\" ng-show=\"vm.filterCount > 0\" ng-click=\"vm.clearAll()\">Clear all</div>\r\n\r\n            </div>\r\n            <div class=\"clear\"></div>\r\n\r\n            <div class=\"ngs-session-count\">\r\n                <span ng-bind=\"vm.filteredSessions.length\"></span> sessions\r\n            </div>\r\n\r\n            <div class=\"sz-session sz-session--full\" ng-class-even=\"'ngs-even'\" ng-repeat=\"session in vm.filteredSessions\">\r\n\r\n                <h3 class=\"sz-session__title\" ng-bind=\"session.title\"></h3>\r\n\r\n                <div>\r\n                    <ul class=\"sz-session__speakers\">\r\n                        <li class=\"sz-session__speaker\" ng-repeat=\"speaker in session.speakers\">\r\n                            <a href=\"#\" ng-click=\"vm.speakerModal(speaker)\">\r\n                                <img ng-src=\"{{ vm.getSpeakerPhoto(speaker.id) }}\" class=\"sz-speaker-photo\"/>\r\n                                <span class=\"sz-session__speaker-name\" ng-bind=\"speaker.name\"></span>\r\n                            </a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"clear\"></div>\r\n\r\n                <div>\r\n                    <p class=\"sz-session__description\" ng-bind=\"session.description\"></p>\r\n                </div>\r\n\r\n                <div class=\"ngs-session-tags-container\">\r\n                    <div class=\"ngs-session-tags\" ng-repeat=\"category in session.categories\">\r\n                        <div class=\"ngs-session-tag\" ng-repeat=\"item in category.categoryItems\" ng-bind=\"item.name\"></div>\r\n                    </div>\r\n                    <div class=\"clear\"></div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n            <ng-sessionize-speaker-modal showmodal=\"vm.showModal\" speaker=\"vm.selectedSpeaker\"></ng-sessionize-speaker-modal>\r\n\r\n\r\n        </div>\r\n\r\n    </div>\r\n\r\n\r\n</div>";

/***/ }),

/***/ "./components/ngSessionizeSessionsRefiner.component.js":
/*!*************************************************************!*\
  !*** ./components/ngSessionizeSessionsRefiner.component.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module("ngSessionize")
	.component("ngSessionizeSessionsRefiner", {

		template: __webpack_require__(/*! ./ngSessionizeSessionsRefiner.tmpl.html */ "./components/ngSessionizeSessionsRefiner.tmpl.html"),
		restrict: "E",
		bindings: {
			vm: "=",
			refinertype: "=",
			items: "="
		},

		controller: function () {
			var self = this;
			self.$onInit = function () {
			};
		}
});

/***/ }),

/***/ "./components/ngSessionizeSessionsRefiner.tmpl.html":
/*!**********************************************************!*\
  !*** ./components/ngSessionizeSessionsRefiner.tmpl.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 ng-bind=\"$ctrl.refinertype\"></h2>\r\n\r\n<ul class=\"ngs-refiner-group\">\r\n\r\n    <li ng-class=\"{ 'selected': item.selected }\" ng-repeat=\"item in $ctrl.items | orderBy: '-count'\">\r\n\r\n        <div class=\"clickable\" ng-if=\"item.countFiltered > 0\"  ng-click=\"$ctrl.vm.toggle(item)\">\r\n\r\n            <div ng-bind=\"item.name\"></div>\r\n            <div ng-if=\"!item.selected\" ng-bind=\"item.countFiltered\"></div>\r\n            <div ng-if=\"item.selected\">\r\n                <i class=\"fas fa-times fa-sm\"></i>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div ng-if=\"item.countFiltered === 0\">\r\n\r\n            <div ng-bind=\"item.name\"></div>\r\n            <div ng-if=\"!item.selected\" ng-bind=\"item.countFiltered\"></div>\r\n            <div ng-if=\"item.selected\">\r\n                <i class=\"fas fa-times fa-sm\"></i>\r\n            </div>\r\n\r\n        </div>\r\n\r\n    </li>\r\n\r\n</ul>\r\n";

/***/ }),

/***/ "./components/ngSessionizeSpeakerModal.component.js":
/*!**********************************************************!*\
  !*** ./components/ngSessionizeSpeakerModal.component.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module("ngSessionize")
	.component("ngSessionizeSpeakerModal", {

		template: __webpack_require__(/*! ./ngSessionizeSpeakerModal.tmpl.html */ "./components/ngSessionizeSpeakerModal.tmpl.html"),
		restrict: "E",
		bindings: {
			showmodal: "=",
			speaker: "<"
		},
		controller: function () {
			var self = this;

			self.closeModal = function () {
				self.showmodal = false;
			};

			self.$onInit = function () {
				console.log(self.speaker);
			};

			self.$doCheck = function () {
				console.log(self.speaker);
			}
		}
});

/***/ }),

/***/ "./components/ngSessionizeSpeakerModal.tmpl.html":
/*!*******************************************************!*\
  !*** ./components/ngSessionizeSpeakerModal.tmpl.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"overlay\" ng-class=\"{'active': $ctrl.showmodal}\" ng-click=\"$ctrl.closeModal()\"></div>\r\n\r\n\r\n<div class=\"modal\" ng-class=\"{'active': $ctrl.showmodal}\">\r\n\r\n    <div class=\"modal-header\" ng-click=\"$ctrl.closeModal()\">\r\n        <i class=\"far fa-window-close\"></i>\r\n    </div>\r\n\r\n    <div class=\"speaker\">\r\n\r\n        <div>\r\n            <img ng-src=\"{{ $ctrl.speaker.profilePicture }}\"/>\r\n        </div>\r\n\r\n        <div class=\"speaker-details\">\r\n            <div>\r\n                <div class=\"speaker-name\" ng-bind=\"$ctrl.speaker.fullName\"></div>\r\n                <div class=\"speaker-tagline\" ng-bind=\"$ctrl.speaker.tagLine\"></div>\r\n            </div>\r\n            <div class=\"social\">\r\n                <ul class=\"links\" ng-repeat=\"link in $ctrl.speaker.links\">\r\n                    <li>\r\n                        <a href=\"{{ link.url }}\" title=\"{{link.linkType}}\" target=\"_blank\">\r\n                            <i ng-if=\"link.linkType === 'Twitter'\" class=\"fab fa-twitter\"></i>\r\n                            <i ng-if=\"link.linkType === 'Blog'\" class=\"fas fa-pencil-alt\"></i>\r\n                        </a>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"clear\"></div>\r\n\r\n    <div ng-bind=\"$ctrl.speaker.bio\"></div>\r\n\r\n    <ul>\r\n        <li class=\"session\" ng-repeat=\"session in $ctrl.speaker.sessions\" ng-bind=\"session.name\"></li>\r\n    </ul>\r\n\r\n</div>";

/***/ }),

/***/ "./ngSessionize.app.js":
/*!*****************************!*\
  !*** ./ngSessionize.app.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scss */ "./scss/index.js");
/* harmony import */ var _scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services */ "./services/index.js");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_services__WEBPACK_IMPORTED_MODULE_1__);


// Branding


// Services


var ngSessionize = angular.module("ngSessionize", [
	"angular.filter",
	"ngSessionizeService"
])

  .config(function ($locationProvider) {


  });/**/

__webpack_require__(/*! ./components */ "./components/index.js");

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./scss/1cvo9d7r.scss":
/*!***********************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./scss/1cvo9d7r.scss ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#sz-color-main {\n  color: #428bca; }\n\n#sz-color-accent {\n  color: #428bca; }\n\n#sz-color-text {\n  color: #111; }\n\n#sz-color-background {\n  color: #FFF; }\n\n#sz-color-main-text {\n  color: #EEE; }\n\n#sz-color-accent-text {\n  color: #EEE; }\n\n#sessionize.sessionize-wrapper {\n  font-family: sans-serif;\n  font-size: 16px;\n  line-height: 1.5;\n  color: #111; }\n\n#sessionize.sessionize-wrapper * {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0; }\n\n#sessionize.sessionize-wrapper *:before, #sessionize.sessionize-wrapper *:after, #sessionize.sessionize-wrapper ul li:before, #sessionize.sessionize-wrapper ul li:after {\n  content: none; }\n\n#sessionize.sessionize-wrapper ul {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n#sessionize.sessionize-wrapper a {\n  color: inherit;\n  text-decoration: none;\n  border-bottom: none;\n  transition: all .15s ease-in; }\n\n#sessionize.sessionize-wrapper a:hover, #sessionize.sessionize-wrapper a:focus, #sessionize.sessionize-wrapper a:active {\n  opacity: .9;\n  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.5); }\n\n#sessionize .sz-session__card {\n  height: 100%;\n  display: flex;\n  justify-content: top;\n  flex-direction: column;\n  transition: all .15s ease-in;\n  overflow: hidden; }\n\n#sessionize .sz-session__title {\n  font-size: 16px;\n  line-height: 1.5;\n  font-weight: bold;\n  transition: all .15s ease-in; }\n\n.sz-session--grid #sessionize .sz-session__title {\n  font-size: 14px;\n  line-height: 20px;\n  max-height: 60px;\n  overflow: hidden; }\n\n#sessionize .sz-session__speakers {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n#sessionize .sz-session__speakers:after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n#sessionize .sz-session__speakers li {\n  display: inline-block;\n  margin-right: .5em;\n  font-size: 12px;\n  line-height: 1.5;\n  font-weight: bold; }\n\n#sessionize .sz-session__speakers li .sz-speaker-photo {\n  width: 200px; }\n\n#sessionize .sz-session__tags {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n#sessionize .sz-session__tags:empty {\n  display: none; }\n\n#sessionize .sz-session__tags li {\n  display: inline-block;\n  margin-right: .125em;\n  font-size: 12px;\n  line-height: 1.5;\n  font-weight: bold;\n  padding: 0 .5em;\n  background-color: rgba(17, 17, 17, 0.1);\n  border-radius: 2px; }\n\n#sessionize .sz-group-tags ~ .sz-group-tags {\n  display: none; }\n\n#sessionize .sz-session__room {\n  display: inline-block;\n  padding: 4px 8px;\n  font-size: 12px;\n  font-weight: bold;\n  text-transform: uppercase;\n  color: #111;\n  background-color: #fff;\n  border-radius: 2px;\n  transition: all .15s ease-in; }\n\n#sessionize .sz-session__time {\n  display: inline-block;\n  font-size: 12px;\n  line-height: 1.5;\n  text-transform: uppercase;\n  opacity: .6; }\n\n#sessionize .sz-session__meta-group {\n  margin-bottom: 4px; }\n\n#sessionize .sz-session--plenum .sz-session__card {\n  justify-content: center; }\n\n#sessionize .sz-day__title {\n  padding: 12px 4px;\n  font-size: 32px;\n  text-align: center; }\n\n#sessionize .sz-grid .sz-day__container {\n  position: relative;\n  padding-left: 64px;\n  padding-right: 64px;\n  padding-top: 48px;\n  padding-bottom: 48px;\n  display: flex;\n  flex-direction: row;\n  overflow-x: auto;\n  overflow-y: hidden; }\n\n@media (min-width: 48em) {\n  #sessionize .sz-grid .sz-day__container {\n    min-width: 900px; } }\n\n#sessionize .sz-grid .sz-time {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  margin-top: 48px; }\n\n#sessionize .sz-grid .sz-time ol {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n#sessionize .sz-grid .sz-time li {\n  border-top: 1px dotted rgba(17, 17, 17, 0.2);\n  height: 96px;\n  font-size: 12px;\n  line-height: 1.5;\n  text-transform: uppercase;\n  text-align: left; }\n\n#sessionize .sz-grid .sz-time__value {\n  padding: 4px 0;\n  display: block; }\n\n#sessionize .sz-grid .sz-track {\n  position: relative;\n  flex-grow: 1;\n  width: 20%;\n  min-width: 240px; }\n\n#sessionize .sz-grid .sz-track__title {\n  position: absolute;\n  bottom: 100%;\n  left: 0;\n  width: 100%;\n  padding: 12px 4px;\n  font-size: 18px;\n  line-height: 24px;\n  font-weight: bold;\n  text-align: center;\n  display: inline-block;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-wrap: normal; }\n\n#sessionize .sz-grid .sz-track__container {\n  padding: 0 4px;\n  position: relative; }\n\n#sessionize .sz-grid .sz-session--grid {\n  border-right: 2px solid #fff;\n  border-bottom: 2px solid #fff;\n  position: absolute;\n  left: 0;\n  width: 100%;\n  z-index: 200;\n  border-radius: 2px; }\n\n#sessionize .sz-grid .sz-session--grid:hover {\n  z-index: 300;\n  background-color: #fff; }\n\n#sessionize .sz-grid .sz-session__card {\n  padding: 12px;\n  border-top: 3px solid transparent;\n  border-top-color: #428bca;\n  color: #EEE;\n  background: #428bca;\n  border-radius: 2px;\n  overflow: hidden; }\n\n#sessionize .sz-grid .sz-session__card .sz-session__tags {\n  margin-top: 4px;\n  height: 18px;\n  overflow: hidden; }\n\n#sessionize .sz-grid .sz-session__card .sz-session__tags li {\n  vertical-align: top; }\n\n#sessionize .sz-grid .sz-session__card:hover {\n  background: #9b4141;\n  border-top-color: #652b2b;\n  box-shadow: 0 0.5em 2.5em 0 rgba(0, 0, 0, 0.75); }\n\n#sessionize .sz-grid .sz-session__card a:hover, #sessionize .sz-grid .sz-session__card a:focus, #sessionize .sz-grid .sz-session__card a:active {\n  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.5); }\n\n#sessionize .sz-grid .sz-session--service {\n  z-index: 100; }\n\n#sessionize .sz-grid .sz-session--service .sz-session__card {\n  border-top-color: #428bca;\n  background: #428bca; }\n\n#sessionize .sz-grid .sz-session--service .sz-session__card:hover {\n  background: #703535;\n  border-top-color: #3c1c1c; }\n\n#sessionize .sz-grid .sz-session--plenum .sz-session__card {\n  text-align: center; }\n\n#sessionize .sz-grid .sz-session--plenum .sz-session__title {\n  overflow: visible;\n  font-size: 24px;\n  line-height: 32px;\n  margin: auto; }\n\n#sessionize .sz-sessions--list {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n#sessionize .sz-sessions--list .sz-session.sz-session--full {\n  margin-top: 8px;\n  padding: 16px;\n  border: 1px solid rgba(17, 17, 17, 0.1);\n  border-radius: 4px; }\n\n@media (min-width: 37.5em) {\n  #sessionize .sz-sessions--list .sz-session.sz-session--full {\n    padding: 24px; } }\n\n@media (min-width: 37.5em) {\n  #sessionize .sz-sessions--list .sz-session.sz-session--full {\n    margin-top: 16px; } }\n\n#sessionize .sz-sessions--list .sz-session.sz-session--full:first-child {\n  margin-top: 0; }\n\n#sessionize .sz-session.sz-session--full {\n  text-align: left; }\n\n#sessionize .sz-session.sz-session--full .sz-session__speakers {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  margin-bottom: 4px; }\n\n#sessionize .sz-session.sz-session--full .sz-session__speakers li {\n  display: inline-block;\n  margin-right: 8px;\n  font-size: 14px;\n  line-height: 1.5;\n  font-weight: bold;\n  color: #428bca; }\n\n#sessionize .sz-session.sz-session--full .sz-session__title {\n  margin-top: 0;\n  margin-bottom: 4px;\n  font-size: 20px;\n  line-height: 1.5;\n  color: #111; }\n\n#sessionize .sz-session.sz-session--full .sz-session__description {\n  margin-top: 0;\n  margin-bottom: 16px;\n  font-size: 16px;\n  line-height: 1.5; }\n\n#sessionize .sz-session.sz-session--full .sz-session__room {\n  display: inline-block;\n  padding: 2px 8px;\n  font-size: 14px;\n  line-height: 1.5;\n  color: #EEE;\n  background-color: #428bca;\n  border-radius: 2px; }\n\n#sessionize .sz-session.sz-session--full .sz-session__time {\n  display: inline-block;\n  padding: 2px 8px;\n  font-size: 14px;\n  line-height: 1.5;\n  text-transform: none;\n  opacity: 1;\n  color: #EEE;\n  background-color: #428bca;\n  border-radius: 2px; }\n\n#sessionize .sz-session.sz-session--full .sz-session__tags {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  margin-top: 8px; }\n\n#sessionize .sz-session.sz-session--full .sz-session__tags li {\n  display: inline-block;\n  margin-right: .5em;\n  font-size: 12px;\n  line-height: 1.5;\n  font-weight: bold; }\n\n#sessionize .sz-session.sz-session--full .sz-session__questions {\n  margin-top: 8px;\n  font-size: 13px;\n  line-height: 1.5; }\n\n#sessionize .sz-session.sz-session--full .sz-session__questions:empty {\n  display: none; }\n\n#sessionize .sz-session.sz-session--full .sz-session__questions dt, #sessionize .sz-session.sz-session--full .sz-session__questions dd {\n  display: inline-block; }\n\n#sessionize .sz-session.sz-session--full .sz-session__questions dt {\n  color: #111; }\n\n#sessionize .sz-session.sz-session--full .sz-session__questions dd {\n  margin-right: 4px;\n  padding-right: 8px;\n  border-right: 1px solid rgba(17, 17, 17, 0.2);\n  color: rgba(17, 17, 17, 0.6); }\n\n#sessionize .sz-session.sz-session--full .sz-session__questions dd:last-child {\n  border-right: none; }\n\n#sessionize .sz-speakers--wall {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-flow: row wrap; }\n\n#sessionize .sz-speakers--wall .sz-speaker {\n  display: inline-block;\n  flex-grow: 1;\n  width: 256px;\n  padding: 8px;\n  margin-bottom: 16px;\n  text-align: center; }\n\n#sessionize .sz-speakers--list {\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n\n#sessionize .sz-speakers--list .sz-speaker {\n  padding: 16px;\n  border: 1px solid rgba(17, 17, 17, 0.1);\n  border-radius: 4px;\n  margin-top: 8px; }\n\n@media (min-width: 37.5em) {\n  #sessionize .sz-speakers--list .sz-speaker {\n    padding: 24px; } }\n\n#sessionize .sz-speaker__links {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  margin-top: 8px; }\n\n#sessionize .sz-speaker__links li {\n  display: inline-block; }\n\n#sessionize .sz-speaker__links .sz-speaker__link {\n  display: block;\n  padding: 4px;\n  border: 1px solid rgba(17, 17, 17, 0.1);\n  font-size: 20px;\n  line-height: 20px;\n  color: #428bca;\n  border-radius: 2px;\n  transition: all .15s ease-in; }\n\n#sessionize .sz-speaker__links .sz-speaker__link:hover, #sessionize .sz-speaker__links .sz-speaker__link:focus, #sessionize .sz-speaker__links .sz-speaker__link:active {\n  opacity: 1;\n  color: #EEE;\n  background-color: #428bca;\n  box-shadow: none; }\n\n#sessionize .sz-speaker__link-label {\n  position: absolute;\n  left: -10000px;\n  top: auto;\n  width: 1px;\n  height: 1px;\n  overflow: hidden; }\n\n#sessionize .sz-speaker__link-icon {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  stroke-width: 0;\n  stroke: currentColor;\n  fill: currentColor;\n  vertical-align: middle; }\n\n#sessionize .sz-speaker.sz-speaker--compact .sz-speaker__photo {\n  width: 128px;\n  height: 128px;\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 16px;\n  border: 4px solid rgba(17, 17, 17, 0.1);\n  border-radius: 50%; }\n\n#sessionize .sz-speaker.sz-speaker--compact .sz-speaker__photo img {\n  display: block;\n  width: 100%;\n  margin: 0 auto;\n  border-radius: 50%; }\n\n#sessionize .sz-speaker.sz-speaker--compact .sz-speaker__photo--placeholder {\n  width: 128px;\n  height: 128px;\n  background-color: #fff;\n  border-left-color: #428bca;\n  border-top-color: #428bca;\n  border-right-color: #428bca;\n  border-bottom-color: #428bca; }\n\n#sessionize .sz-speaker.sz-speaker--compact .sz-speaker__name {\n  margin-bottom: 0;\n  font-size: 20px;\n  line-height: 1.25;\n  font-weight: bold;\n  color: #111; }\n\n#sessionize .sz-speaker.sz-speaker--compact .sz-speaker__tagline {\n  font-size: 14px;\n  line-height: 1.5;\n  font-weight: normal;\n  color: rgba(17, 17, 17, 0.6); }\n\n#sessionize .sz-speaker.sz-speaker--full {\n  text-align: left; }\n\n#sessionize .sz-speaker.sz-speaker--full:after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n@media (min-width: 37.5em) {\n  #sessionize .sz-speaker.sz-speaker--full {\n    margin-top: 16px; } }\n\n#sessionize .sz-speaker.sz-speaker--full:first-child {\n  margin-top: 0; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__photo {\n  float: left;\n  margin-top: 2px;\n  margin-right: 16px;\n  margin-bottom: 8px;\n  max-width: 96px; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__photo img {\n  display: block;\n  width: 100%;\n  border-radius: 2px; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__photo--placeholder {\n  display: none; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__name {\n  margin-bottom: 2px;\n  font-size: 20px;\n  line-height: 1.25;\n  font-weight: bold;\n  color: #428bca; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__tagline {\n  margin-bottom: 2px;\n  font-size: 16px;\n  line-height: 1.5;\n  font-weight: bold;\n  color: #428bca; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__bio {\n  margin-top: 8px; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__sessions {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  margin-top: 8px; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__sessions li {\n  position: relative;\n  display: block;\n  padding-left: 16px;\n  font-size: 16px;\n  line-height: 1.5;\n  font-weight: bold; }\n\n#sessionize .sz-speaker.sz-speaker--full .sz-speaker__sessions li:before {\n  position: absolute;\n  top: 10px;\n  left: 0;\n  width: 10px;\n  height: 2px;\n  background-color: #428bca;\n  content: \"\"; }\n\n#sessionize .sz-gridtable .sz-table {\n  position: relative;\n  margin-bottom: 16px; }\n\n#sessionize .sz-gridtable .sz-scroll {\n  position: relative;\n  overflow-x: auto;\n  border-right: 1px solid rgba(17, 17, 17, 0.1); }\n\n#sessionize .sz-gridtable table {\n  max-width: 100%;\n  width: 100%;\n  margin-bottom: 0;\n  border: none;\n  border-collapse: collapse;\n  border-radius: 4px; }\n\n#sessionize .sz-gridtable th {\n  padding: 8px 16px;\n  font-size: 20px;\n  font-weight: bold;\n  background-color: rgba(17, 17, 17, 0.1); }\n\n#sessionize .sz-gridtable td, #sessionize .sz-gridtable th {\n  width: 1000px;\n  border-bottom: 1px solid rgba(17, 17, 17, 0.1);\n  padding: 16px 24px;\n  vertical-align: top; }\n\n#sessionize .sz-gridtable thead th {\n  background-color: rgba(17, 17, 17, 0.1); }\n\n#sessionize .sz-gridtable tbody th:first-child {\n  width: 1%;\n  white-space: nowrap; }\n\n#sessionize .sz-gridtable .sz-session__title {\n  color: #428bca; }\n\n#sessionize .sz-gridtable .sz-session--plenum .sz-session__title {\n  color: #428bca;\n  font-size: 20px; }\n\n#sessionize .sz-gridtable .sz-session--plenum .sz-session__room {\n  color: #EEE;\n  background-color: #428bca; }\n\n#sessionize .sz-gridtable .sz-row-highlight th {\n  color: rgba(17, 17, 17, 0.8); }\n\n#sessionize .sz-gridtable .sz-session__room {\n  color: #EEE;\n  background-color: #428bca; }\n\n@media (max-width: 47.9375em) {\n  #sessionize .sz-gridtable table {\n    border: none; }\n  #sessionize .sz-gridtable td, #sessionize .sz-gridtable th {\n    display: block;\n    border: none;\n    width: auto;\n    padding: 8px 16px; }\n  #sessionize .sz-gridtable thead {\n    display: none; }\n  #sessionize .sz-gridtable tbody th:first-child {\n    width: 100%; }\n  #sessionize .sz-gridtable tr {\n    margin-bottom: 16px;\n    display: block;\n    border: 1px solid rgba(17, 17, 17, 0.2);\n    border-radius: 2px; }\n  #sessionize .sz-gridtable td[data-room-name]:before {\n    display: block;\n    margin-bottom: 8px;\n    margin-top: -8px;\n    margin-left: -16px;\n    margin-right: -16px;\n    padding: 8px 16px;\n    background-color: rgba(17, 17, 17, 0.2);\n    color: rgba(17, 17, 17, 0.8);\n    font-size: 12px;\n    font-weight: bold;\n    text-transform: uppercase;\n    content: attr(data-room-name); }\n  #sessionize .sz-gridtable .sz-session__room {\n    display: none; }\n  #sessionize .sz-gridtable .sz-row-highlight td {\n    color: rgba(17, 17, 17, 0.8);\n    background-color: transparent; }\n  #sessionize .sz-gridtable .sz-row-highlight td .sz-session__title {\n    color: #428bca; }\n  #sessionize .sz-gridtable .sz-session-empty {\n    display: none; } }\n\n#sessionize .sz-tabs {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  position: relative;\n  margin-bottom: 16px;\n  text-align: center; }\n\n#sessionize .sz-tabs__item {\n  display: inline-block;\n  margin: 4px;\n  font-size: 16px;\n  line-height: 20px;\n  font-weight: bold; }\n\n#sessionize .sz-tabs__link {\n  position: relative;\n  display: block;\n  padding: 8px 16px;\n  text-decoration: none;\n  color: rgba(17, 17, 17, 0.6);\n  border-radius: 2px;\n  border: 1px solid rgba(17, 17, 17, 0.1) !important;\n  transition: all .15s ease-in; }\n\n#sessionize .sz-tabs__link:hover, #sessionize .sz-tabs__link:focus, #sessionize .sz-tabs__link:active {\n  color: #EEE;\n  background-color: #428bca;\n  box-shadow: none !important; }\n\n#sessionize .sz-tabs__item--active {\n  border-color: transparent; }\n\n#sessionize .sz-tabs__item--active .sz-tabs__link {\n  color: #EEE;\n  background-color: #428bca;\n  box-shadow: none; }\n\n#sessionize .sz-tabs__item--active .sz-tabs__link:hover, #sessionize .sz-tabs__item--active .sz-tabs__link:focus, #sessionize .sz-tabs__item--active .sz-tabs__link:active {\n  color: #EEE;\n  background-color: #428bca; }\n\n#sessionize .sz-tab-container {\n  display: none; }\n\n#sessionize .sz-tab-container--active {\n  display: block; }\n\n#sessionize .sz-powered-by {\n  position: relative;\n  margin-top: 16px;\n  display: block;\n  font-size: 11px;\n  line-height: 1.5;\n  text-align: center;\n  color: rgba(17, 17, 17, 0.6); }\n\n#sessionize .sz-powered-by span {\n  color: rgba(17, 17, 17, 0.5);\n  font-weight: bold;\n  transition: all .15s ease-in; }\n\n#sessionize .sz-powered-by strong {\n  color: rgba(17, 17, 17, 0.5);\n  font-weight: bold;\n  transition: all .15s ease-in; }\n\n#sessionize .sz-powered-by a {\n  display: inline-block;\n  border: none;\n  color: rgba(17, 17, 17, 0.5);\n  text-decoration: none; }\n\n#sessionize .sz-powered-by a:hover, #sessionize .sz-powered-by a:focus, #sessionize .sz-powered-by a:active {\n  color: rgba(17, 17, 17, 0.5); }\n\n#sessionize .sz-powered-by a:hover span, #sessionize .sz-powered-by a:focus span, #sessionize .sz-powered-by a:active span {\n  color: rgba(17, 17, 17, 0.6); }\n\n#sessionize .sz-powered-by a:hover strong, #sessionize .sz-powered-by a:focus strong, #sessionize .sz-powered-by a:active strong {\n  color: #1ab394 !important; }\n\n#sessionize .sz-modal-container {\n  text-align: center;\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  align-content: center; }\n\n#sessionize .sz-modal-container.is-hidden {\n  display: none; }\n\n#sessionize .sz-modal-container-inner {\n  max-height: 80%; }\n\n#sessionize .sz-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(221, 221, 221, 0.9); }\n\n#sessionize .sz-modal {\n  position: relative;\n  margin: 24px auto;\n  padding: 16px;\n  max-width: 30em;\n  box-shadow: 0 1em 5em 0 rgba(0, 0, 0, 0.25);\n  border-radius: 4px;\n  background-color: #fff;\n  text-align: left; }\n\n#sessionize .sz-modal__close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: block;\n  padding: 8px !important;\n  border: 0;\n  border-left: 1px solid rgba(17, 17, 17, 0.1);\n  border-bottom: 1px solid rgba(17, 17, 17, 0.1);\n  font-size: 16px;\n  line-height: 1;\n  color: rgba(17, 17, 17, 0.8);\n  border-radius: 0;\n  border-bottom-left-radius: 4px;\n  background-color: transparent; }\n\n#sessionize .sz-spinner {\n  width: 40px;\n  height: 40px;\n  margin: 100px auto;\n  background-color: #428bca;\n  border-radius: 100%;\n  -webkit-animation: sz-scaleout 1.0s infinite ease-in-out;\n  animation: sz-scaleout 1.0s infinite ease-in-out; }\n\n@-webkit-keyframes sz-scaleout {\n  0% {\n    -webkit-transform: scale(0); }\n  100% {\n    -webkit-transform: scale(1);\n    opacity: 0; } }\n\n@keyframes sz-scaleout {\n  0% {\n    -webkit-transform: scale(0);\n    transform: scale(0); }\n  100% {\n    -webkit-transform: scale(1);\n    transform: scale(1);\n    opacity: 0; } }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./scss/ngSessionize.scss":
/*!***************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./scss/ngSessionize.scss ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "/* TODO: Change these colors to match your event's palette */\n/* They will be replaced in the CSS below when the SASS file is processed */\n/* Change these colors to match your event's palette */\n.clear {\n  clear: both; }\n\n/* Custom CSS */\n#sessionize {\n  /* Smartphones (portrait and landscape) ----------- */\n  /* Modal Dialog */ }\n  #sessionize h1, #sessionize h2, #sessionize h3, #sessionize h4, #sessionize h5 {\n    text-transform: none; }\n  #sessionize .ngs-sessions-container > div {\n    float: left; }\n  #sessionize .sz-spinner-container {\n    width: 100%; }\n    #sessionize .sz-spinner-container .sz-spinner {\n      margin: auto;\n      color: #2a6496; }\n  #sessionize .ngs-refiners {\n    width: 30%; }\n    #sessionize .ngs-refiners h2 {\n      color: #2a6496; }\n    #sessionize .ngs-refiners ul.ngs-refiner-group {\n      padding-left: 0; }\n    #sessionize .ngs-refiners ul.ngs-refiner-group {\n      list-style: none;\n      margin-left: 0; }\n      #sessionize .ngs-refiners ul.ngs-refiner-group li {\n        list-style: none;\n        width: 100%; }\n        #sessionize .ngs-refiners ul.ngs-refiner-group li > div.clickable {\n          cursor: pointer; }\n        #sessionize .ngs-refiners ul.ngs-refiner-group li > div {\n          display: inline-block;\n          width: 100%; }\n          #sessionize .ngs-refiners ul.ngs-refiner-group li > div div {\n            float: left; }\n          #sessionize .ngs-refiners ul.ngs-refiner-group li > div div:first-child {\n            width: 80%; }\n          #sessionize .ngs-refiners ul.ngs-refiner-group li > div div:last-child {\n            width: 20%;\n            text-align: right; }\n      #sessionize .ngs-refiners ul.ngs-refiner-group li.selected div {\n        background-color: #EEEEEE; }\n  #sessionize .ngs-sessions {\n    width: 70%; }\n    #sessionize .ngs-sessions .applied-filters > div {\n      float: left; }\n    #sessionize .ngs-sessions .applied-filters > div > div {\n      float: left;\n      background-color: #EEEEEE;\n      padding: 3px 5px 3px 5px;\n      margin: 0 5px 5px 0; }\n    #sessionize .ngs-sessions .applied-filters .ngs-clear {\n      background-color: transparent;\n      cursor: pointer;\n      color: #2a6496; }\n    #sessionize .ngs-sessions .ngs-even {\n      background-color: #EEEEEE; }\n    #sessionize .ngs-sessions .applied-filters,\n    #sessionize .ngs-sessions .ngs-session-count {\n      margin: 0 10px;\n      padding: 0 10px; }\n    #sessionize .ngs-sessions .sz-session {\n      margin: 10px;\n      padding: 10px; }\n    #sessionize .ngs-sessions .sz-session.sz-session--full .sz-session__title {\n      font-size: 1em !important;\n      color: #2a6496;\n      margin: 0 auto 12px auto; }\n    #sessionize .ngs-sessions .sz-session.sz-session--full .sz-session__speaker a {\n      color: #428bca;\n      display: flex;\n      flex-direction: column; }\n    #sessionize .ngs-sessions .sz-session.sz-session--full .ngs-speaker-photos {\n      padding-left: 0; }\n      #sessionize .ngs-sessions .sz-session.sz-session--full .ngs-speaker-photos li {\n        width: 80px;\n        padding-right: 5px;\n        list-style: none;\n        float: left; }\n    #sessionize .ngs-sessions .sz-session.sz-session--full .ngs-session-tags-container {\n      display: inline-block; }\n      #sessionize .ngs-sessions .sz-session.sz-session--full .ngs-session-tags-container > div {\n        float: left; }\n      #sessionize .ngs-sessions .sz-session.sz-session--full .ngs-session-tags-container .ngs-session-tag {\n        float: left;\n        background-color: rgba(17, 17, 17, 0.1);\n        padding: 3px 5px 3px 5px;\n        margin: 0 5px 5px 0; }\n  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {\n    #sessionize .ngs-sessions,\n    #sessionize .ngs-refiners {\n      width: 100%; }\n    #sessionize .ngs-sessions-container > div {\n      float: none; }\n    #sessionize .ngs-sessions .applied-filters,\n    #sessionize .ngs-sessions .ngs-session-count {\n      margin: 0;\n      padding: 0; }\n    #sessionize .ngs-sessions .sz-session {\n      margin: 0;\n      padding: 0; } }\n  #sessionize .ngs-modal .ngs-overlay {\n    width: 100%;\n    height: 100%;\n    background-color: #EEEEEE; }\n  #sessionize .overlay {\n    display: none;\n    position: fixed;\n    top: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n    background-color: rgba(0, 0, 0, 0.05);\n    z-index: 10; }\n  #sessionize .modal {\n    display: none;\n    width: 50%;\n    height: 50%;\n    position: fixed;\n    top: 25%;\n    left: 25%;\n    padding: 20px;\n    background-color: #FFFFFF;\n    border-radius: 5px;\n    z-index: 11;\n    overflow: hidden; }\n  #sessionize .active {\n    display: block; }\n  #sessionize .modal-header {\n    width: 100%;\n    text-align: right;\n    padding-right: 10px;\n    padding-top: 5px; }\n  #sessionize .speaker > div {\n    float: left; }\n    #sessionize .speaker > div .speaker-name, #sessionize .speaker > div speaker-tagline {\n      color: #2a6496;\n      text-transform: capitalize; }\n    #sessionize .speaker > div .speaker-name {\n      font-size: 1.8em; }\n    #sessionize .speaker > div .speaker-tagline {\n      font-size: 1em; }\n  #sessionize .speaker img {\n    width: 100px; }\n  #sessionize .speaker-details {\n    margin-left: 10px; }\n  #sessionize .social .links {\n    list-style: none;\n    float: left; }\n  #sessionize .session {\n    font-weight: bold; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./scss/1cvo9d7r.scss":
/*!****************************!*\
  !*** ./scss/1cvo9d7r.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader!../node_modules/sass-loader/lib/loader.js!./1cvo9d7r.scss */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./scss/1cvo9d7r.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./scss/index.js":
/*!***********************!*\
  !*** ./scss/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__ (/*! ./1cvo9d7r.scss */ "./scss/1cvo9d7r.scss");
__webpack_require__ (/*! ./ngSessionize.scss */ "./scss/ngSessionize.scss");


/***/ }),

/***/ "./scss/ngSessionize.scss":
/*!********************************!*\
  !*** ./scss/ngSessionize.scss ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/css-loader!../node_modules/sass-loader/lib/loader.js!./ngSessionize.scss */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./scss/ngSessionize.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./services/index.js":
/*!***************************!*\
  !*** ./services/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./ngSessionizeService */ "./services/ngSessionizeService.js");


/***/ }),

/***/ "./services/ngSessionizeService.js":
/*!*****************************************!*\
  !*** ./services/ngSessionizeService.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module("ngSessionizeService", [])

  .service("ngSessionizeService", ["$q", "$http", "$rootScope", "$filter",
	  function ($q, $http, $rootScope, $filter) {

		  var self = this;

		  // TODO: Replace this token with your own
		  var sessionizeToken = "tnr13xob";

		  self.ngSessionize = {};
		  self.ngSessionize.initialized = false;

		  self.getSessions = function () {

			  var deferred = $q.defer();

			  $http({
				  method: "GET",
				  url: "https://sessionize.com/api/v2/" + sessionizeToken + "/view/sessions"
			  }).then(function (response) {

				  self.ngSessionize.sessions = response.data[0].sessions;

				  deferred.resolve();

			  });

			  return deferred.promise;
		  };

		  self.getSpeakers = function () {

			  var deferred = $q.defer();

			  $http({
				  method: "GET",
				  url: "https://sessionize.com/api/v2/" + sessionizeToken + "/view/speakers"
			  }).then(function (response) {

				  self.ngSessionize.speakers = response.data;

				  deferred.resolve();

			  });

			  return deferred.promise;
		  };

		  self.initNgSessionize = function () {

			  var deferred = $q.defer();

			  var p = [];

			  p.push(self.getSpeakers());
			  p.push(self.getSessions());

			  $q.all(p).then(function () {

				  deferred.resolve();

			  });

			  return deferred.promise;

		  };

	  }
  ]);


/***/ })

/******/ });
//# sourceMappingURL=ngSessionize.js.map