define([ 'framework7', 'mtemplate!canjs-commons/fm7-plugin/pagebase.mustache', 'mtemplate!canjs-commons/fm7-plugin/popupnavbar.mustache'], 
		function(fm7, pagebaseTemplate, pageNavbarTemplate, popupNavbarTemplate){

	
	var defaultOptions = {
			
	}
	Framework7.prototype.plugins.canjsPlugin = function (app, params) {
		var overrides = {}, hooks = {};
	
		app.openPage = function (view, pageConfig){

			var defaultConfig = {animatePages : true, showBackLink : true};
			
			var pageConfig = can.extend(defaultConfig, pageConfig);
			
			view.pageConfig = pageConfig;
			
		
		
			pageConfig.content = pagebaseTemplate.render();
			pageConfig.element = $('<div class="page-content"></div>');
			
			var pageControllerClass = Page[can.capitalize(pageConfig.url)];
			if(!pageControllerClass){
				console.log('Could not find controller for ' + pageConfig.url);
				return;
			}
			var controller = new pageControllerClass(pageConfig.element, pageConfig.options); 
			
			return controller._preRenderPhase().done(function(){

				app.loadPage(view, pageConfig);
									
			});

		}
		
		hooks.pageBeforeInit = function(pageData){
        	console.log('pageInit');
        	
        	var $page = $(pageData.container);
			
        	var pageConfig = pageData.view.pageConfig;
			
			$page.append(pageConfig.element);
			var controller = $page.find('.page-content').control();
			var navbar = $(pageData.navbarInnerContainer);
			
			
			controller.navbar = navbar;
			if(controller.renderNavbar){
				controller.renderNavbar(navbar);
			}else{
				var options = {showBackLink : pageConfig.showBackLink};
				$.extend(options, controller.navbarOptions);
				
				var navbarTemplate = pageData.navbarTemplate || pageNavbarTemplate;
				
				navbar.html(navbarTemplate(options));
			}
			
			
			controller._postRenderPhase();
			pageData.view.pageConfig = null;

        	
        };
		
		
        hooks.pageBeforeRemove = function(pageData){
        	var el = $(pageData.container).find('.page-content');
			var control = el.control();
			control.destroy();
        }

		
        app.openPopup = function(url, options){
			var self = this, options = options || {};
			
			
			var view = FM7App.popupView;
			
			var pageConfig = {
				animatePages : false,
				showBackLink : false,
				url : url,
				options : options,
				navbarTemplate : popupNavbarTemplate
			}
			
			
			app.openPage(FM7App.popupView, pageConfig).done(function(){
				self.popup('.popup')
			})
			
		};
        
		
		Framework7.$('.popup').on('closed', function(){
			Framework7.$('.popup .page .page-content').remove();
		});
		
		
		return {
			hooks : hooks
	    };  
	};
	

	
	
	
	
})