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
				<span class="card-star"><img src="images/star-grey.png"></span>
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

		this.model.get('starred')
			?
			this.el.classList.add('starred')
			:
			this.el.classList.remove('starred');

		setTimeout(() => {
			this.el.classList.remove('card-invisible');
		}, 100);

		return this;
	},

	events: {
		'click .refresh-btn': 'refresh',
		'click .delete-btn': 'delete',
		'click .card-star img': 'star'
	},

	refresh: function() {
		this.model.collection.loadCard(this.model);
	},

	delete: function() {
		this.el.classList.add('card-deleted');
		setTimeout(() => {
			this.model.collection.deleteCard(this.model);
		}, 1000);
	},

	star: function() {
		this.model.get('starred')
			?
			this.model.set('starred', false)
			:
			this.model.set('starred', true);
	}
});

export default CardView;
