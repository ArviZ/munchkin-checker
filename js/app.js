(function(window) {
	var ENTER_KEY = 13;
	var ESC_KEY = 27;

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
				.on('render', function(evt) {
					this
						.bindNode({
							edit: ':sandbox .edit',
						})
						.bindNode('editing', ':sandbox', MK.binders.className('editing'))
						.on('click::deleteButton', function() {
							this.trigger('destroyThisPlayer', this);
						})
						.on('dblclick::name', function() {
							this.editing = true;
							this.edit = this.name;
							this.$bound( 'edit' ).focus();
						})
						.on('keyup::edit', function(evt) {
							var editValue;
							if( evt.which === ESC_KEY ) {
								this.editing = false;
							} else if( evt.which === ENTER_KEY ) {
								if( editValue = this.edit.trim() ) {
									this.name = editValue;
									this.editing = false;
								} else {
									this.trigger('destroyThisPlayer', this);
								}
							}
						})
					;
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