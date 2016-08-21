import Card from './Card';

const AllCards = Backbone.Collection.extend({
	model: Card,

	initialize: function() {
		let savedCards;

		try {
			savedCards = JSON.parse(localStorage.getItem('savedCards'));
		} catch (e) {
			console.error(e);
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

		const isRepeat = this.findWhere({ repoTitle: title.toLowerCase() });

		if (isRepeat) {
			this.trigger('error', { message: 'repository already exists' });

			return;
		}

		fetch(url)
		.then(response => response.json())
		.then(json => {
			const commits = json.slice(0, 5).map(obj => ({
				message: obj.commit.message.split('\n')[0],
				link: obj.html_url,
				url: obj.url
			}));

			const newCard = {
				repoTitle: title.toLowerCase(),
				repoUrl: `https://github.com/${title}`,
				fetchUrl: url,
				commits
			};

			return newCard;
		}).then(newCard => {
			this.unshift(newCard);
		});
	}
});

export default AllCards;
