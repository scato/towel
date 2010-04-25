Towel.Event.Token = new Class({
	Extends: Towel.Event,
	
	initialize: function(target, type, capture) {
		this.target = target;
		this.type = type;
		this.capture = capture || false;
		
		// WARNING: potential memory leak... :(
		this.add(function(event) {
			this.last = $lambda(event);
		}.bind(this));
	},
	
	add: function(listener) {
		this.target.addEvent(this.type, listener, this.capture);
	},
	
	remove: function(listener) {
		this.target.removeEvent(this.type, listener, this.capture);
	},
	
	fire: function() {
		this.target.fireEvent(this.type, arguments);
	}
});

Towel.Event.Never = new Class({
	Extends: Towel.Event,
	
	add: function() {},
	remove: function() {}
});

Towel.Event.Timeout = new Class({
	Extends: Towel.Event,
	
	initialize: function(ms) {
		this.ms = ms;
		this.list = new Hash();
	},
	
	add: function(listener) {
		var start = $time();
		var id = setTimeout(function() {
			var time = $time() - start;
			
			this.last = $lambda(time);
			listener(time);
			
			this.list.erase(id);
		}.bind(this), this.ms);
		
		this.list.set(id, listener);
	},
	
	remove: function(listener) {
		var id = this.list.keyOf(listener);
		
		clearTimeout(id);
		this.list.erase(id);
	}
});

Towel.Event.Interval = new Class({
	Extends: Towel.Event,
	
	initialize: function(ms) {
		this.ms = ms;
		this.list = new Hash();
	},
	
	add: function(listener) {
		var start = $time();
		var id = setInterval(function() {
			var time = $time() - start;
			
			this.last = $lambda(time);
			listener(time);
		}.bind(this), this.ms);
		
		this.list.set(id, listener);
	},
	
	remove: function(listener) {
		var id = this.list.keyOf(listener);
		
		clearInterval(id);
		this.list.erase(id);
	}

});
