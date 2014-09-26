define([
        'can',
        'jquery'

        ], function(can, $) {

	return can.Control.extend({
		defaults : {
			defaultPage : 'home',
			pageContainer : '#page-container',
			animate : true,
			preAnimation : function(container){
				var dfd = can.Deferred();
				container.animate({
					opacity: 0.1
				}, 200, function() {
					dfd.resolve();
				});
				return dfd.promise();
			},
			postAnimation : function(container){
				var dfd = can.Deferred();
				container.animate({
					opacity: 1
				}, 200, function() {
					dfd.resolve();
				});
				return dfd.promise();
			},
			cleanupAnimation : function(container){
				container.css({opacity: 1});
			},
			urlControllerMapping : {}
		}
	}, {
		init: function(element, options) {
			var self = this;


			can.route(":page/:subpage", {});

			
			can.route.ready();
			var page = can.route.attr('page');
			if (page == null)
				can.route.attr('page', self.options.defaultPage);
			

		},
		
		/**
		 * Default mapping used
		 * 
		 * url -> PageControllerClass
		 * #!exampleurl - Page.Exampleurl
		 */

		":page route": function(data) {

			var url = data.page;
			
			var PageControllerClass = this.options.urlControllerMapping[url] || Page[can.capitalize(url)];
			if(!PageControllerClass){
				console.error('Could not find page ' + url);
				return;
			}
			
			this.openUrl(data.page);

		},
		
		":page/:subpage route": function(data) {

			this.openUrl(data.page, {subpage : data.subpage})

		},
		
		
		openUrl : function(url, pageOptions){
			var PageControllerClass = this.options.urlControllerMapping[url] || Page[can.capitalize(url)];
			if(!PageControllerClass){
				console.error('Could not find page ' + url);
				return;
			}
			
			this.openPage(PageControllerClass, pageOptions);
		},
		

		openPage : function(PageControllerClass, pageOptions ){
			var pageContainer = $(this.options.pageContainer),
			options = this.options,
			self = this;

			
			
			var currentController = pageContainer.control();
			if (currentController) {
				currentController.destroy();
			}
		

			var pageController = new PageControllerClass(pageContainer, pageOptions);

			if(options.animate){
				$.when(pageController._preRenderPhase(), options.preAnimation(pageContainer) ).done(function(){
					pageController._postRenderPhase();
					options.postAnimation(pageContainer);
			
				}).fail(function(){
					options.cleanupAnimation(pageContainer);
				})
			}else{
				pageController.render();

			}


		}

	});


});
