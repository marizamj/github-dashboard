const Card = Backbone.Model.extend({
	defaults: {
		justAdded: false,
		starred: false
	},
});

export default Card;
