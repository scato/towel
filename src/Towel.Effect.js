Towel.Effect = new Class({
	Extends: Towel.Period,
	
	apply: function() {
		this.begin.fire();
	},
	
	cancel: function() {
		this.end.fire();
	},
	
	delegate: function() {
		return this.apply.bind(this);
	},
	
    bundle: function(effect) {
        var bundle = new Towel.Effect();
        
        bundle.add(this);
        bundle.add(effect);
        
        return bundle;
    },
    
	chain: function(effect) {
		var chain = new Towel.Effect();
		
		chain.apply = function() {
			this.begin.next().add(function() {
				effect.begin.next().add(function() {
					chain.begin.fire();
				}.bind(this));
				
				effect.apply();
			}.bind(this));
			
			this.apply();
		}.bind(this);
		
		chain.cancel = function() {
			effect.end.next().add(function() {
				this.end.next().add(function() {
					chain.end.fire();
				}.bind(this));
				
				this.cancel();
			}.bind(this));
			
			effect.cancel();
		}.bind(this);
		
		return chain;
	}
});

Towel.Effect.On = new Class({
    Extends: Towel.Effect,
    
    initialize: function(event, listener) {
        this.parent();
        
        this.event = event;
        this.listener = listener;
    },
    
    apply: function() {
        this.event.add(this.listener);
        this.parent();
    },
    
    cancel: function() {
        this.event.remove(this.listener);
        this.parent();
    }
});

Towel.Effect.ClassName = new Class({
	Extends: Towel.Effect,
	
	initialize: function(element, className) {
		this.parent();
		
		this.element = element;
		this.className = className;
	},
	
	apply: function() {
		this.element.addClass(this.className);
        this.parent();
	},
	
	cancel: function() {
		this.element.removeClass(this.className);
        this.parent();
	}
});

Towel.Effect.Style = new Class({
	Extends: Towel.Effect,
	
	initialize: function(element, style) {
		this.parent();
		
		this.towel = new Towel(element);
		this.style = style;
	},
	
	apply: function() {
		this.towel.dom.addStyle(this.style);
        this.parent();
	},
	
	cancel: function() {
		this.towel.dom.removeStyle(this.style);
        this.parent();
	},
    
    update: function() {
        this.towel.dom.updateStyle();
    }
});

Towel.Effect.Morph = new Class({
	Extends: Fx.Morph,
	
	initialize: function(style, morph, duration, shape) {
		this.style = style;
		this.morph = morph;
		
		this.begin = new Towel.Event.Token(this, "start");
		this.end = new Towel.Event.Token(this, "complete");
		this.progress = new Towel.Event();
		
		this.parent(null, {duration: duration, transition: shape});
	},
	
	render: function(element, property, value, unit) {
		this.style[property] = this.serve(value, unit);
	},
	
	set: function(now) {
		this.parent(now);
		this.progress.fire();
		
		return this;
	},
	
	apply: function() {
		this.start(this.morph);
		this.set(this.compute(this.from, this.to, 0));
	}
});
