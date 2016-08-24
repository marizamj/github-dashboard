import CardView from './CardView';

const AllCardsView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'update', this.render.bind(this));
	},

	render: function() {
		this.el.innerHTML = '';

		let cardsToShow;

		if (this.collection.mode === 'showStarred') {
			cardsToShow = this.collection.models.filter(card => card.get('starred')) || [];
		} else {
			cardsToShow = this.collection.models;
		}

		cardsToShow.forEach((card, i) => {
			if (card.get('justAdded') === true) {
				var cardView = new CardView({ model: card, className: 'card card-invisible' });
				this.collection.get(card).set('justAdded', false);

			} else {
				var cardView = new CardView({ model: card });
			}

			this.el.insertBefore(cardView.render().el, this.el.firstChild);
			this.collection.syncStorage();
		});

		return this;
	}
});

export default AllCardsView;
