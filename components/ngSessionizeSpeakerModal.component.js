"use strict";

angular.module("ngSessionize")
	.component("ngSessionizeSpeakerModal", {

		template: require("./ngSessionizeSpeakerModal.tmpl.html"),
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