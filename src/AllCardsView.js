import CardView from './CardView';

const AllCardsView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'update', this.render.bind(this));
	},

	render: function() {
		this.el.innerHTML = '';

		this.collection.models.forEach((card, i) => {
			var cardView = new CardView({ model: card });
			this.el.appendChild(cardView.render().el);
		});

		return this;
	}
});

export default AllCardsView;
