Towel.Transformation = new Class({
    Extends: Fx.Morph,
    
    now: 0,
    
    initialize: function(style, morph, duration, shape) {
        this.parent(null, {duration: duration || 'short', transition: shape});
        
        this.style = style;
        this.morph = morph;
        
        this.change = new Towel.Event();
        
        this.initMorph();
    },
    
    initMorph: function() {
        this.from = {};
        this.to = {};
        
        for(var p in this.morph) {
            if(this.morph.hasOwnProperty(p)) {
                if($type(this.morph[p]) === 'array') {
                    this.from[p] = this.parse(this.morph[p][0]);
                    this.to[p] = this.parse(this.morph[p][1]);
                } else {
                    this.style[p] = this.morph[p];
                }
            }
        }
    },
    
    step: function(direction) {
        var complete = false;
        
        var diff = 50 / this.options.duration;
        this.now += diff * direction;

        if(this.now <= 0) {
            this.now = 0;
            complete = true;
        } else if(this.now >= 1) {
            this.now = 1;
            complete = true;
        }

        this.set(this.now);
        
        return complete;
    },
    
    set: function(now) {
        var computed = this.compute(this.from, this.to, now);
        
        for(var p in computed) {
            this.style[p] = this.serve(computed[p]);
            
            if($type(this.style[p]) === 'array') {
                this.style[p] = this.style[p].map(function(value) {
                    if($type(value) === 'number' && value < 0.000001) {
                        return 0;
                    } else {
                        return value;
                    }
                });
            }
        }
        
        this.change.fire();
    }
});

Towel.Transformation.Forward = new Class({
    Extends: Towel.Effect.On,
    
    direction: 1,
    
    initialize: function(interval, transformation) {
        this.parent(interval, this.step.bind(this));
        
        this.transformation = transformation;
    },
    
    step: function() {
        var complete = this.transformation.step(this.direction);
        
        if(complete) {
            this.cancel();
            this.end.fire();
        }
    },
    
    apply: function() {
        this.parent();
        this.step();
    },
    
    cancel: function() {
        this.event.remove(this.listener);
    }
});

Towel.Transformation.Back = new Class({
    Extends: Towel.Transformation.Forward,
    
    direction: -1
});

