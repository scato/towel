Towel.Transition = new Class({
	Extends: Towel.Effect,
	
	initialize: function(element, style, duration, shape) {
		this.parent();
		
		this.element = element;
		
		this.base = {};
		this.morph = {};
		this.mirror = {};
		
		for(var p in style) {
			if($type(style[p]) === 'array') {
				this.morph[p] = style[p];
				this.mirror[p] = [style[p][1], style[p][0]];
			} else {
				this.base[p] = style[p];
			}
		}
		
		duration = duration || 'normal';
		shape = shape || 'sine:in:out';
		
		this.style = new Towel.Effect.Style(element, this.base);
		this.forward = new Towel.Effect.Morph(this.base, this.morph, $type(duration) === 'array' ? duration[0] : duration, $type(shape) === 'array' ? shape[0] : shape);
		this.back = new Towel.Effect.Morph(this.base, this.mirror, $type(duration) === 'array' ? duration[1] : duration, $type(shape) === 'array' ? shape[1] : shape);
		
		this.forward.begin.add(this.style.apply.bind(this.style));
		this.forward.progress.add(this.update.bind(this));
		this.forward.end.add(this.begin.delegate());
		
		this.back.progress.add(this.update.bind(this));
		this.back.end.add(this.style.cancel.bind(this.style));
		this.back.end.add(this.end.delegate());
	},
	
	update: function() {
		new Towel(this.element).dom.updateStyle();
	},
	
	apply: function() {
		this.forward.apply();
	},
	
	cancel: function() {
		this.back.apply();
	},
	
	mirror: function() {
		var mirror = {};
		
		for(var p in this.morph) {
			mirror[p] = [this.morph[p][1], this.morph[p][0]];
		}
		
		return mirror;
	}
});
