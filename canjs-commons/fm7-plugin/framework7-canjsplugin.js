define([ 'framework7', 'mtemplate!canjs-commons/fm7-plugin/pagebase.mustache', 'mtemplate!canjs-commons/fm7-plugin/pagenavbar.mustache'], 
		function(fm7, pagebaseTemplate, pagenavbarTemplate){

	
	
	Framework7.prototype.plugins.canjsPlugin = function (app, params) {
		var overrides = {}, hooks = {};
	
		overrides.loadPage = app.loadPage;

		app.loadPage = function (view, pageConfig){

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
			
			controller._preRenderPhase().done(function(){

				overrides.loadPage(view, pageConfig);
									
			});

		}
		
		hooks.pageBeforeInit = function(pageData){
        	console.log('pageInit');
        	
        	var $page = $(pageData.container);
			
        	var pageConfig = pageData.view.pageConfig;
			
			$page.append(pageConfig.element);
			var controller = $page.find('.page-content').control();
			var navbar = $(pageData.navbarInnerContainer);
			
			
			if(controller.renderNavbar){
				controller.renderNavbar(navbar);
			}else{
				var options = {showBackLink : pageConfig.showBackLink};
				$.extend(options, controller.navbarOptions);
				navbar.html(pagenavbarTemplate(options));
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
			
			app.popupView.url = '';
			
			var pages = $('.popup .pages');
			pages.html('');
			
			pages.append('<div class="page page-on-center"><div class="page-content"></div></div>')
			var target = $('.popup .page .page-content');
			
			
			
			var pageController = Page[can.capitalize(url)];
			if (pageController == null) {
				console.error(url + ' not found');
				
				return;
			}

			var renderDFD = new pageController(target, options).render();
			renderDFD.done(function(){
				self.popup('.popup');
			});
		};
		
		
		$('.popup').on('closed', function(){
			console.log('popup closed');
			$('.popup .page .page-content').remove();
		});
		
		
		return {
			hooks : hooks
	    };  
	};
	

	
	
	
	
})