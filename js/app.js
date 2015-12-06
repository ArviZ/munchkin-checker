(function(window) {
	var Player = Class({
		'extends': MK.Object,
		constructor: function(data) {
			this
				.jset({
					name: 'Player',
					level: 1,
					damage: 1,
					runAway: 0,
				})
				.set(data)
				.on('click::deleteButton', function() {
					this.trigger('destroyThisPlayer', this);
				})
			;
		},
		onRender: function() {
			this
				.bindNode({
					name: ':sandbox .playerName',
					level: ':sandbox .level',
					damage: ':sandbox .damage',
					runAway: ':sandbox .runAway',
					deleteButton: ':sandbox .delete'
				}, MK.binders.html())
			;
		}
	});

	var unitPlayer = Class({
		'extends': MK.Array,
		Model: Player,
		itemRenderer: '#playerTemplate',
		constructor: function() {
			this
				.bindings()
				.events()
				.recreate(JSON.parse(localStorage['players'] || '[]'))
			;
		},
		bindings: function() {
			return this
				.bindNode('sandbox', '.playersList')
				.bindNode('addButton', '.add')
			;
		},
		events: function() {
			return this
				.onDebounce('change:JSON', function(evt) {
					localStorage['players'] = evt.value;
				})
				.on('modify @change:name @change:level @change:damage @change:runAway', function() {
					this.JSON = JSON.stringify(this);
				})
				.on('@destroyThisPlayer', function(player) {
					this.pull(player);
				})
			;
		},
	});

	window.munchkins = new unitPlayer;
	MK.on(munchkins, 'click::addButton', function() {
		munchkins.push({});
	});
})(window)