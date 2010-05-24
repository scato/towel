Towel.Event = new Class({
	initialize: function() {
		this.list = [];
	},
	
	add: function(listener) {
		this.list.push(listener);
	},
	
	remove: function(listener) {
		this.list.erase(listener);
	},
	
	fire: function(event) {
		this.last = $lambda(event);
		
		this.list.slice().each(function(listener) {
			listener(event);
		});
	},
	
	trace: function(label) {
		this.add(function() {
			console.log(label);
		});
		
		return this;
	},
	
	during: function(period) {
		var delegate = new Towel.Event();
		var listener = delegate.delegate();
		
		period.begin.add(function() {
			this.add(listener);
		}.bind(this));
		
		period.end.add(function() {
			this.remove(listener);
		}.bind(this));
		
		return delegate;
	},
	
	or: function(event) {
		var delegate = new Towel.Event();
		var listener = delegate.delegate();
		
		this.add(listener);
		event.add(listener);
		
		return delegate;
	},
	
	and: function(event) {
		var delegate = new Towel.Event();
		
		this.add(function() {
			event.add(function() {
				delegate.fire();
			});
		});
		
		event.add(function() {
			this.add(function() {
				delegate.fire();
			});
		});
		
		return delegate;
	},
	
	next: function() {
		var delegate = new Towel.Event();
		
		var listener = function(event) {
			this.remove(listener);
			delegate.fire(event);
		}.bind(this);
		
		this.add(listener);
		
		return delegate;
	},
	
	last: function() {
		return null;
	},
	
	delegate: function() {
		return this.fire.bind(this);
	},
	
	map: function(func) {
		var delegate = new Towel.Event();
		
		var listener = function(event) {
			delegate.fire(func(event));
		};
		
		this.add(listener);
		
		return delegate;
	},
	
	filter: function(func) {
		var delegate = new Towel.Event();
		
		var listener = function(event) {
			if(func(event)) {
				delegate.fire(event);
			}
		};
		
		this.add(listener);
		
		return delegate;
	},
	
	bind: function(value) {
		var delegate = new Towel.Event();
		
		var listener = function() {
			delegate.fire(value);
		}.bind(this);
		
		this.add(listener);
		
		return delegate;
	},
    
    combine: function(func) {
        var event = new Towel.Event();
        var first = true;
        var last;
        
        this.add(function(e) {
            if(first) {
                last = e;
                first = false;
            } else {
                event.fire(func(last, e));
                last = e;
            }
        });
        
        return event;
    },
    
    sample: function(timer) {
        var source = this;
        
        return timer.after(source).map(function() {
            return source.last();
        });
    },
    
    before: function(event) {
        return this.during(new Towel.Period.Phase(new Towel.Event.Now(), event));
    },
    
    after: function(event) {
        return this.during(new Towel.Period.Phase(event, new Towel.Event.Never()));
    }
});
