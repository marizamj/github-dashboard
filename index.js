let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

const Card = Backbone.Model.extend({});

const AllCards = Backbone.Collection.extend({
	model: Card,

	updateStorage: function(event, model) {
		let updatedCards;

		if (event === 'delete') {
			updatedCards = savedCards.filter(card => {
				return card.repoTitle !== model.get('repoTitle');
			});
		}

		savedCards = updatedCards;
		localStorage.setItem('savedCards', JSON.stringify(updatedCards));
	},

	deleteCard: function(model) {
		this.updateStorage('delete', model);
		this.remove(model);
	},

	addRepo: function(title) {
		const url = `https://api.github.com/repos/${title}/commits`;

		const isRepeat = savedCards.find(card => {
			return card.repoTitle === title.toLowerCase();
		});

		if (isRepeat) {
			this.trigger('error', { message: 'repository already exists' });

			return;
		}

		const newCard = {
			repoTitle: title.toLowerCase(),
			repoUrl: `https://github.com/${title}`,
			fetchUrl: url,
			commits: []
		};

		fetch(url).then(response => {
			return response.json().then(json => {
				for (let i = 0; i < 5; i++) {
					if (json[i]) {
						newCard.commits.push({
							message: json[i].commit.message.split('\n')[0],
							link: json[i].html_url,
							url: json[i].url
						});
					}
				}
			});
		}).then(() => {
			savedCards.unshift(newCard);
			localStorage.setItem('savedCards', JSON.stringify(savedCards));
			this.unshift(newCard);
		});
	}
});

const HeaderView = Backbone.View.extend({
	className: 'header',

	initialize: function() {
		this.listenTo(this.model, 'change', this.render.bind(this));
	},

	render: function() {
		this.el.innerHTML =
		`
			https://github.com/
			<input type="text" name="repository" size="30">
			<button class="btn add-btn">Add</button>
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
		'click .add-btn': 'addRepo',
	},

	addRepo: function() {
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




