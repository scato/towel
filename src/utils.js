function $towel(el, nc) {
	return new Towel(el, nc);
}

function $event(target, type, capture) {
	if(arguments.length === 0) {
		return new Towel.Event();
	} else {
		return new Towel.Event.Token(target, type, capture);
	}
}

function $ready() {
	return $event(window, 'domready');
}

function $never() {
	return new Towel.Event.Never();
}

function $timeout(ms) {
	return new Towel.Event.Timeout(ms);
}

function $now() {
	return $timeout(0).next();
}

function $interval(ms) {
	return new Towel.Event.Interval(ms);
}

function $phase(begin, end) {
	return new Towel.Period.Phase(begin, end);
}

function $toggle(event) {
	return $phase(event, event);
}

function $cycle(event) {
	return new Towel.Period.Cycle(event);
}

function $className(element, className) {
	return new Towel.Effect.ClassName(element, className);
}

function $style(element, style) {
	return new Towel.Effect.Style(element, style);
}

function $on(event, listener) {
    return new Towel.Effect.On(event, listener);
}

function $transition(element, style, duration, shape) {
	return new Towel.Transition(element, style, duration, shape);
}












// voor het testen

function $log(value, name) {
	if(value === undefined) {
		console.log(name);
	} else {
		console.log(name + ":", value);
	}
}

function $trace(token, name) {
	if(token instanceof Towel.Event) {
		token.add(function(value) { $log(value, name); });
	} else if(token.begin instanceof Towel.Event && token.end instanceof Towel.Event) {
		$trace(token.begin, name + ".begin");
		$trace(token.end, name + ".end");
	} else {
		$log(token, name);
	}
}









// minder goeie ideeen:

function $cancel(event) {
	event.add(function(event) {
		event.preventDefault();
	});
}

// ik dacht dat MooTools Abstracts had, maar dat is niet zo...
// Namespace maken of (zoals hieronder) objecten gebruiken???
function $namespace(id) {
	var ns = this, list = id.split(".");
	
	list.each(function(id, i) {
		if(ns[id] === undefined) {
			ns[id] = {};
		} else if(typeof ns[id] !== 'object') {
			var parent = list.slice(0, i + 1).join(".");
			var child = list.slice(0, i + 2).join(".");
			
			throw Error("could not create '" + child + "', '" + parent + "' is not an object");
		}
		
		ns = ns[id];
	});
}
