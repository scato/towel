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
	},
    
    mousePosition: function() {
        var move = this._event('mousemove');
        var up = this._event('mouseup');
        var down = this._event('mousedown');
        
        return move.or(up).or(down).map(function(e) {
            return {x: e.page.x, y: e.page.y, t: $time()};
        });
    },
    
    mouseMovement: function() {
        return this.mousePosition().combine(function(a, b) {
            return {x: b.x - a.x, y: b.y - a.y, t: b.t - a.t};
        });
    }
});

Towel.register("ui", Towel.Helper.UI);

