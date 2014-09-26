
define(['can', 'canjs-commons/functions', 'jquery', 'can/construct/super'],
function(can, Functions, $) {
	

	
	return can.Control.extend({
		
	},{
	
	init: function( element , options ){
		
	},
	

	render : function(){
		var self = this;
		return this._preRenderPhase().done(function(){
			self._postRenderPhase();
		})
	},

	_preRenderPhase : function(){
		var controller = this;
		

		var element = controller.element;
		var dfd = $.Deferred();

		var dataDFD = controller.getData() || {};


		$.when(Functions.dfdMap(dataDFD)).done(function(data){
			if(!controller.element){
				dfd.fail();
				return;
			}

			can.extend(controller.options, data);

			$.when(controller.preRender(data)).done(function(){

				
				dfd.resolve();
			})


		}).fail(function(){
		
			dfd.fail();
		});
		return dfd.promise();
	},

	_postRenderPhase : function(){
		var controller = this, element = this.element;
		
		element.html(controller.template(controller.options));
		
		controller.postRender();
		element.addClass('controller');
		element.trigger('rendered');
		
	},
	

	reRender : function(){


		return this.render();
	},

	getData : function(){
		return {}
	},
	preRender : function(data){

	},

	postRender : function(data){

	},
	
	destroy: function() {
		if(this.element){
			this.element.removeClass('controller');
		}

	    this._super();

	}

});
	
	function dfdMap(data){
    	var dfdMap = $.Deferred();
    	var deffereds_array = [];
    	var keys_array = [];
    	$.map(data, function(dfd, key) {
    		deffereds_array.push(dfd);
    		keys_array.push(key);
    	});
    	$.when.apply(null, deffereds_array).done(function(){
    		var args = arguments;
    		var result = {};
    		$.each(args, function(i,e){
    			
    			var key = keys_array[i];
    			if(key){
    				result[key] = e;
    			}
    		});
    		
    		dfdMap.resolve(result);
    	}).fail(function(a,b,c){
    		dfdMap.reject();
    	});

		return dfdMap;
    };
});


