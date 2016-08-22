const Card = Backbone.Model.extend({
	defaults: {
		justAdded: false
	},

	initialize: function() {
		// this.listenTo(this, 'change', this.collection.syncStorage());
	}
});

export default Card;
