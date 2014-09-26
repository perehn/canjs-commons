define(['jquery',
        'can'],
        function($, can){

	can.Control.prototype.find = function(s){
		return this.element.find(s);  
	};

	can.Model.List.prototype.findById = function(id){
		return this.filter(function(element){
			return element.id == id;
		})[0];
	};
	can.Model.List.prototype.sort = function(sortFunc){

		[].sort.apply(this, [sortFunc]); 
		return this;
	};
	can.Model.List.prototype.remove = function(item){

		var index = this.indexOf(item);
		this.splice(index, 1);
		console.log(index);
	};



	$.fn.model = function(m){
		if(m){

			this.data('model', m);
			this.addClass(m.constructor._shortName);
			this.addClass(m.constructor._shortName + "_" + m.id);
			return this;
		}else{
			return this.data('model');
		}
	};


	$.Event.prototype.stop = function(){
		this.stopPropagation();
		this.preventDefault();
	};





})