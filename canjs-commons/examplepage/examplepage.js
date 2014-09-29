define(['mtemplate!canjs-commons/examplepage/examplepage.html', 
        'canjs-commons/basecontroller'],
	
function(template, BaseController){

	
BaseController.extend('Page.Itempage',
/* @Static */
{
	
},
/* @Prototype */
{
	/**
	 * The page template. 
	 */
	template : template,
	
	/**
	 * return a map of Deffereds or objects. When all deferreds are resolved,
	 * the map is merged into this.options and used as model for the template
	 */
	getData : function(){
		return {
			/*
			 
			  models : Model.findAll(),
			  plainObject : {prop : 'prop'}
			 
			  
			 */
		}
	},
	
	/**
	 * preRender is called before the template is rendered, but after data is loaded. If a deffered is returned,
	 * the template is rendered after the deferred is resolved. 
	 */
	preRender : function(options){
		/*
		options.length = options.models.length;
		*/
	},
	
	/**
	 * postRender is called after the template is rendered, and may contain logic to e.g 
	 * init jquery plugins that require elements to be present
	 */
	postRender : function(options){
		
	}
	
	

});



})
