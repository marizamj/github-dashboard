const CardView = Backbone.View.extend({
	className: 'card',

	initialize: function() {
		this.listenTo(this.model, 'change', this.render.bind(this));
	},

	render: function() {

		const commitsListHtml = this.model.get('commits').reduce((string, commit, i) => {
			return string +=
			`
				<li class="commits-list__item" style="top:${i * 50}px">
					<img src="images/mark.png" />
					<a  href="${commit.link}">
						${commit.message}
					</a>
				</li>
			`;
		}, '');

		this.el.innerHTML =
		`
			<div class="card__header">
				<h3><a href="${this.model.get('repoUrl')}">${this.model.get('repoTitle')}</a></h3>
			</div>
			<div class="card__body">
				<ul class="commits-list">
					${commitsListHtml}
				</ul>
			</div>
			<div class="card__footer">
				<button class="btn refresh-btn">Refresh</button>
				<button class="btn delete-btn">Delete</button>
			</div>
		`;

		return this;
	},

	events: {
		'click .refresh-btn': 'refresh',
		'click .delete-btn': 'delete'
	},

	refresh: function() {
		console.log('refresh');
		// ...
	},

	delete: function() {
		this.model.collection.deleteCard(this.model);
	}
});

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
