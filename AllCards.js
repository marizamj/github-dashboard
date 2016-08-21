let savedCards = require('./savedCards');

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

export default AllCards;
