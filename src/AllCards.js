import Card from './Card';
import { client } from './config';


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

		this.forEach(card => {
			this.loadCard(card);
		});

		this.on('update', () => {
			this.syncStorage();
		});
	},

	syncStorage: function() {
		localStorage.setItem('savedCards', JSON.stringify(this.models));
	},

	loadCard: function(model) {
		const url = model.get('fetchUrl');

		fetch(url)
		.then(response => {
			if (response.status === 200) {
				return response.json()
			} else {
				throw { message: `Repository not found` };
			}
		})
		.then(json => {
			const commits = json.slice(0, 5).map(obj => ({
				message: obj.commit.message.split('\n')[0],
				link: obj.html_url
			}));

			model.set('commits', commits);

			return model;
		}).then(model => {
			this.add(model);
		}).catch(error => {
			this.trigger('error', { message: error.message, timestamp: Date.now() });
		});
	},

	deleteCard: function(model) {
		this.remove(model);
	},

	addRepo: function(title) {
		const url =
			`https://api.github.com/repos/${title}/commits?client_id=${client.id}&client_secret=${client.sec}`;

		const isRepeat = this.findWhere({ repoTitle: title.toLowerCase() });

		if (isRepeat) {
			this.trigger('error', { message: `Repository "${title.toLowerCase()}" already exists` });

			return;
		}

		this.loadCard(new Card({
			justAdded: true,
			repoTitle: title.toLowerCase(),
			repoUrl: `https://github.com/${title}`,
			fetchUrl: url
		}));
	}
});

export default AllCards;
