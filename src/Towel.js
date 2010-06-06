var Towel = new Class({
	initialize: function(el, nc) {
        if(el === document) {
            el = document.documentElement;
        }
        
		this.element = $(el, nc);
		
		if(this.element.towel !== undefined) {
			return this.element.towel;
		}
		
		this.element.towel = this;
		
		for(var p in Towel.helpers) {
			if(Towel.helpers.hasOwnProperty(p)) {
				this[p] = new Towel.helpers[p](this.element, this);
			}
		}
	}
});

Towel.helpers = {};

Towel.register = function(name, helper) {
	Towel.helpers[name] = helper;
};
