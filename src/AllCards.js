import Card from './Card';

const AllCards = Backbone.Collection.extend({
	model: Card,

	initialize: function() {
		let savedCards;

		try {
			savedCards = JSON.parse(localStorage.getItem('savedCards'));
		} catch (e) {

		}

		this.set(savedCards || []);

		this.on('update', () => {
			this.syncStorage();
		});
	},

	syncStorage: function() {
		localStorage.setItem('savedCards', JSON.stringify(this.models));
	},

	deleteCard: function(model) {
		this.remove(model);
	},

	addRepo: function(title) {
		const url = `https://api.github.com/repos/${title}/commits`;

		const isRepeat = this.models.find(card => {
			return card.get('repoTitle') === title.toLowerCase();
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
			this.unshift(newCard);
		});
	}
});

export default AllCards;
