Towel.Period.Phase = new Class({
	Extends: Towel.Period,
	
	initialize: function(begin, end) {
		this.parent();
		
		this.start = function(event) {
			begin.remove(this.start);
			this.begin.fire(event);
			end.add(this.stop);
		}.bind(this);
		
		this.stop = function(event) {
			end.remove(this.stop);
			this.end.fire(event);
			begin.add(this.start);
		}.bind(this);
		
		begin.add(this.start);
	}
});

Towel.Period.Cycle = new Class({
	Extends: Towel.Period,
	
	initialize: function(bang) {
		this.parent();
		
		this.start = function(event) {
			bang.remove(this.start);
			this.begin.fire(event);
			bang.add(this.restart);
		}.bind(this);
		
		this.restart = function(event) {
			bang.remove(this.restart);
			this.end.fire(event);
			this.begin.fire(event);
			bang.add(this.restart);
		}.bind(this);
		
		bang.add(this.start);
	}
});
