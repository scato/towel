Towel.Transition = new Class({
    Extends: Towel.Effect,
    
    initialize: function(element, morph, duration, shape) {this.morph = morph;
        this.parent();
        
        var style = {};
        var effect = new Towel.Effect.Style(element, style);
        var transformation = new Towel.Transformation(style, morph, duration, shape);
        
        var interval = new Towel.Event.Interval(50);
        this.forward = new Towel.Transformation.Forward(interval, transformation);
        this.back = new Towel.Transformation.Back(interval, transformation);
        
        this.forward.begin.add(effect.apply.bind(effect));
        this.back.end.add(effect.cancel.bind(effect));
        
        transformation.change.add(function() {
            effect.update();
        });
        
        this.forward.end.add(this.begin.delegate());
        this.back.end.add(this.end.delegate());
    },
    
    apply: function() {
        this.back.cancel();
        this.forward.apply();
    },
    
    cancel: function() {
        this.forward.cancel();
        this.back.apply();
    }
});

