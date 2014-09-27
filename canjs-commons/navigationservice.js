define([
        'can',
        'jquery'

        ], function(can, $) {

	return can.Construct.extend({
		
	}, {
		
		defaults : {
			pageContainer : '#page-container',
			animate : true,
			preAnimation : function(container){
				var dfd = can.Deferred();
				container.animate({
					opacity: 0
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
			}
			
		},
		
		
		init: function(options) {
			var self = this;
			
			this.options = can.extend(this.defaults, options);
			
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
