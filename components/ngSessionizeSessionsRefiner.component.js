"use strict";

angular.module("ngSessionize")
	.component("ngSessionizeSessionsRefiner", {

		template: require("./ngSessionizeSessionsRefiner.tmpl.html"),
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