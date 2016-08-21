let savedCards = require('./savedCards');

import AllCards from './AllCards';

const HeaderView = Backbone.View.extend({
	className: 'header',

	initialize: function() {
		this.listenTo(this.model, 'change', this.render.bind(this));
	},

	render: function() {
		this.el.innerHTML =
		`

			<form class="repo-form">
				https://github.com/
				<input type="text" name="repository" size="30">
				<button type="submit" class="btn add-btn">Add</button>
			</form>
			${
				this.model.get('error') ?
					`<span class="err-msg">${ this.model.get('error').message }</span>`
					:
					``
			}
		`;

		return this;
	},

	events: {
		'submit .repo-form': 'addRepo',
	},

	addRepo: function(event) {
		event.preventDefault();

		const title = this.el.querySelector('[name="repository"]').value;

		this.model.get('allCards').addRepo(title);

		this.el.querySelector('[name="repository"]').value = '';
	}
});

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
					<img src="mark.png" />
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

const PageView = Backbone.View.extend({
	initialize: function() {
		// ...
	},

	render: function() {
		const { allCards } = this.model.attributes;

		this.el.innerHTML = '';

		const headerDiv = document.createElement('div');
		headerDiv.classList.add('header');
		this.el.appendChild(headerDiv);

		const containerDiv = document.createElement('div');
		containerDiv.classList.add('container');
		this.el.appendChild(containerDiv);

		allCards.reset(savedCards);

		const header = new HeaderView({
			model: this.model,
			el: headerDiv
		}).render();

		const container = new AllCardsView({
			collection: allCards,
			el: containerDiv
		}).render();

		return this;
	}
});

const Page = Backbone.Model.extend({
	initialize: function() {
		this.listenTo(this.get('allCards'), 'error', (error) => {
			this.set('error', error);
		});
	}
});

const page = new Page({
	error: null,
	allCards: new AllCards(),
});

const pageView = new PageView({
	el: document.body,
	model: page,
});

pageView.render();




