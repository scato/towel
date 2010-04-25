Towel.Period = new Class({
	initialize: function() {
		this.begin = new Towel.Event();
		this.end = new Towel.Event();
	},
	
	add: function(alternation) {
		this.begin.add(function() {
			alternation.apply();
		});
		
		this.end.add(function() {
			alternation.cancel();
		});
	},
	
	remove: function(alternation) {},
	
	trace: function(label) {
		this.begin.trace(label + ".begin");
		this.end.trace(label + ".end");
		
		return this;
	},
	
	and: function(period) {
		var begin = new Towel.Event();
		var end = new Towel.Event();
		
		this.begin.during(period).or(period.begin.during(this)).add(begin.delegate());
		this.end.or(period.end).add(end.delegate());
		
		return new Towel.Period.Phase(begin, end);
	},
	
	or: function(period) {
		var begin = new Towel.Event();
		var end = new Towel.Event();
		
		this.begin.or(period.begin).add(begin.delegate());
		this.end.during(period.not()).or(period.end.during(this.not())).add(end.delegate());
		
		return new Towel.Period.Phase(begin, end);
	},
	
	not: function() {
		var period = new Towel.Period();
		
		this.begin.add(period.end.delegate());
		this.end.add(period.begin.delegate());
		
		return period;
	},
	
	advance: function(event) {
		return new Towel.Period.Phase(event.or(this.begin), this.end);
	},
	
	delay: function(event) {
		return new Towel.Period.Phase(event.during(this), this.end);
	},
	
	shorten: function(event) {
		return new Towel.Period.Phase(this.begin, event.or(this.end));
	},
	
	prolong: function(event) {
		return new Towel.Period.Phase(this.begin, event.during(this.not()));
	}
});
