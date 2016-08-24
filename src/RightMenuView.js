const RightMenuView = Backbone.View.extend({
	render: function() {
		this.el.innerHTML =
		`
			<button class="btn refresh-all-btn">Refresh all</button>
			<label class="switch-mode">
			  <input type="checkbox">
			  <div class="slider"></div>
			</label>
		`;

		return this;
	},

	events: {
		'click .switch-mode .slider': 'switchMode'
	},

	switchMode: function() {
		if (this.collection.mode === 'showStarred') {
			this.collection.mode = 'showAll';
		} else {
			this.collection.mode = 'showStarred';
		}
		this.collection.trigger('update');
	}
});

export default RightMenuView;
