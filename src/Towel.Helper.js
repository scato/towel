Towel.Helper = new Class({
	initialize: function(element, towel) {
		this.element = element;
        this.towel = towel;
	}
});

Towel.Styles = ['position', 'visibility'];

Element.Styles.each(function(value, key) {
	if(!Element.ShortStyles[key]) {
		Towel.Styles.push(key);
	}
});

