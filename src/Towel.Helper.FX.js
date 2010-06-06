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
		
		return this.transition(style, duration, shape);
	},
    
    transition: function(style, duration, shape) {
        return new Towel.Transition(this.element, style, duration, shape);
    },
    
    className: function(className) {
        return new Towel.Effect.ClassName(this.element, className);
    },
    
    style: function(style) {
        return new Towel.Effect.Style(this.element, style);
    },
    
    position: function() {
        if(this._position === undefined) {
            var relative = this.element.getOffsetParent();
            
            this._position = this.style({
                'left': this.element.getCoordinates(relative).left,
                'top': this.element.getCoordinates(relative).top
            });
            
            this._position.apply();
        }
        
        return this._position;
    },
    
    follow: function() {
        var position = this.position();
        var movement = new Towel(document).ui.mouseMovement();
        
        var follow = new Towel.Effect.On(movement, function(e) {
            position.style.left += e.x;
            position.style.top += e.y;
            position.update();
        });
        
        return follow;
    },
    
    container: function(x, y) {
        if(this._container === undefined) {
            x = x || 'left';
            y = y || 'top';
            
            this._container = new Element('div')
                .replaces(this.element)
                .adopt(this.element)
                .setStyles(this.element.getStyles('visibility', 'position', x, y));
            
            this.towel.dom.addStyle({
                'visibility': 'inherit',
                'position': 'relative',
                'top': null,
                'left': null,
                'bottom': null,
                'right': null
            });
        }
        
        return this._container;
    },
    
    slideDown: function(duration, shape) {
        var outer = new Towel(this.container());
        var size = this.container().getSize();
        
        var outerStyle = {
            'visibility': 'visible',
            'overflow': 'hidden',
            'height': [0, size.y]
        };
        
        var innerStyle = {
            'top': [-size.y, 0]
        };
        
        return outer.fx.transition(outerStyle, duration, shape)
            .bundle(this.transition(innerStyle, duration, shape));
    }
});

Towel.register("fx", Towel.Helper.FX);

