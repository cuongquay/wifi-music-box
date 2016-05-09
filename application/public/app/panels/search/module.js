/** @scratch /panels/5
 * include::panels/text.asciidoc[]
 */

/** @scratch /panels/text/0
 * == text
 * Status: *Stable*
 *
 * The text panel is used for displaying static text formated as markdown, sanitized html or as plain
 * text.
 *
 */
define(['angular', 'app', 'lodash', 'jquery', 'require', 'd3'], function(angular, app, _, $, require, d3) {
	'use strict';

	var module = angular.module('go4smac.panels.search', []);
	app.useModule(module);

	module.controller('search', ['$scope', '$rootScope', '$timeout', '$window', 'soundcloud', 'alertSrv',
	function($scope, $rootScope, $timeout, $window, soundcloud, alertSrv) {
		$scope.panelMeta = {
			status : "Stable",
			description : "A static text panel that can use plain text, markdown, or (sanitized) HTML"
		};

		// Set and populate defaults
		var _d = {
		};
		_.defaults($scope.panel, _d);		

		$scope.init = function() {
			$scope.ready = false;
			$scope.items = [];
			var searchKey = localStorage.getItem("search-key");
			$scope.panel.title = "Results for \"" + decodeURIComponent(searchKey) + "\"";
			soundcloud.searchFor(searchKey, $scope.panel.partition).success(function(result) {				
				Array.prototype.push.apply($scope.items, result.collection);
				if (result.next_href) {
					soundcloud.getPartitioning($scope.items, result.next_href, $scope.panel.limit, "collection", "https://api-v2.soundcloud.com", "http://wifioner.com");
				}
				$scope.ready = true;
			}).error(function(error){
				
			});			
		};
		
		$scope.onTrackClick = function(event, item) {			
			soundcloud.getStreamById(item.id).success(function(data) {
				if (data.http_mp3_128_url) {					
					item.spectrum_url = "https://wis.sndcdn.com" + (/.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/.exec( item.waveform_url )[1]).replace(".png",".json");
					item.http_mp3_128_url = data.http_mp3_128_url;
					$rootScope.$broadcast("onAddTrackToList", item);
					$scope.next();
				}
			});
		};
	}]);
});