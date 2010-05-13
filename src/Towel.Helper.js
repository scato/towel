Towel.Helper = new Class({
	initialize: function(element) {
		this.element = element;
	}
});

Towel.Styles = ['position', 'visibility'];

Element.Styles.each(function(value, key) {
	if(!Element.ShortStyles[key]) {
		Towel.Styles.push(key);
	}
});

Towel.Helper.DOM = new Class({
	Extends: Towel.Helper,
	
	initStyle: function() {
		if(!this.styleList) {
			this.styleList = [];
			if(this.element.hasAttribute("style")) {
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

Towel.Helper.UI = new Class({
	Extends: Towel.Helper,
	
	_event: function(type) {
		return new Towel.Event.Token(this.element, type);
	},
	
	click: function() {
		return this._event("click");
	},
	
	// phase in which mouse is over this element (or child elements)
	hover: function() {
		return new Towel.Period.Phase(this._event('mouseenter'), this._event('mouseleave'));
	},
	
	// phase in which mouse is over this element (or child elements) for longer than ms
	linger: function(ms) {
		var delay = new Towel.Event.Timeout(ms || 500);
		
		return this.hover().delay(delay);
	},
	
	// phase in which mouse is over this element (or child elements) and does not move for longer than ms
	steady: function(ms) {
		var moving = new Towel.Period.Cycle(this.move());
		var delay = new Towel.Event.Timeout(ms || 500).during(moving);
		
		return this.hover().delay(delay);
	},
	
	down: function() {
		return new Towel.Period.Phase(this._event("mousedown"), new Towel(document).ui._event('mouseup'));
	},
	
	move: function() {
	    return this._event('mousemove');
	},
	
	// phase in which the element is dragged
	drag: function() {
		var down = this.down();
		var move = new Towel(document).ui.move();
	    
	    return down.delay(move);
	},
	
	focus: function() {
	    return new Towel.Period.Phase(this._event('focus'), this._event('blur'));
	},
	
	// partialy fixed keypress event
	// TODO: implement all result by http://unixpapa.com/js/key.html
	stroke: function() {
	    return this._event('keypress').filter(function(event) {
	        switch(event.key) {
	            case 'up':
	            case 'down':
	            case 'left':
	            case 'right':
	            case 'tab':
	                return false;
	            case 'delete':
	            case 'backspace':
	                return true;
	            case 'enter':
	                if(event.target.tagName.toLowerCase() !== 'textarea') {
	                    return false;
	                }
	                
	                return (event.event.charCode && !event.alt && !event.control);
	            default:
	                return (event.event.charCode && !event.alt && !event.control);
	        }
	    });
	},
	
	// phase in which the element value is being altered
	alter: function(ms) {
	    var stroking = new Towel.Period.Cycle(this.stroke());
	    var delay = new Towel.Event.Timeout(ms || 500);
	    
	    return stroking.delay(delay).not().advance(this.stroke());
	},
	
	change: function() {
	    return this._event('change');
	}
});

Towel.register("ui", Towel.Helper.UI);

Towel.Helper.FX = new Class({
	Extends: Towel.Helper,
	
	show: function() {
		return new Towel.Effect.Style(this.element, {visibility: 'visible'});
	},
	
	display: function(display) {
		return new Towel.Effect.Style(this.element, {display: display || 'block'});
	},
	
	fade: function(duration, shape) {
		var currentStyle = new Towel(this.element).dom.currentStyle();
		
		var style = {
			visibility: 'visible'
		};
		
		var morph = {
			opacity: [0, currentStyle.opacity === undefined ? 1 : currentStyle.opacity]
		};
		
		return new Towel.Effect.Style(this.element, style).chain(new Towel.Transition(this.element, morph, duration, shape));
	},
	
	zoom: function(duration, shape) {
		var position = this.element.getPosition();
		var size = this.element.getSize();
		
		var style = {
			visibility: 'visible',
			width: [0, size.x],
			height: [0, size.y],
			position: 'absolute',
			left: [position.x + size.x / 2, position.x],
			top: [position.y + size.y / 2, position.y],
			marginLeft: 0,
			marginTop: 0
		};
		
		return new Towel.Transition(this.element, style, duration, shape);
	}
});

Towel.register("fx", Towel.Helper.FX);

