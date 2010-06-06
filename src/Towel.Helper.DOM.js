Towel.Helper.DOM = new Class({
	Extends: Towel.Helper,
	
	initStyle: function() {
		if(!this.styleList) {
			this.styleList = [];
			if(
                typeof this.element.hasAttribute === 'function' && this.element.hasAttribute("style")
                || this.element.getAttribute('style') !== null
            ) {
				var style = {};
				
				Towel.Styles.each(function(name) {
					if(this.element.style[name]) {
						style[name] = this.element.style[name];
					}
				}, this);
				
				this.styleList.push(style);
			}
		}
	},
	
	currentStyle: function() {
		this.initStyle();
		
		var currentStyle = {};
		
		this.styleList.each(function(style) {
			for(var p in style) {
	            if(style.hasOwnProperty(p)) {
	                currentStyle[p] = style[p];
	            }
			}
		});
		
		return currentStyle;
	},
	
	updateStyle: function() {
		var currentStyle = this.currentStyle();
		
		this.element.set('style', '');
		
		for(var p in currentStyle) {
			// setStyle('opacity', ...) automaticaly sets visibility to visible or hidden
			if(p === 'opacity') {
				this.element.setOpacity(parseFloat(currentStyle[p]));
			} else {
				this.element.setStyle(p, currentStyle[p]);
			}
		}
	},
	
	addStyle: function(style) {
		this.initStyle();
		this.styleList.push(style);
		this.updateStyle();
	},
	
	removeStyle: function(style) {
		this.initStyle();
		this.styleList.erase(style);
		this.updateStyle();
	}
});

Towel.register("dom", Towel.Helper.DOM);

