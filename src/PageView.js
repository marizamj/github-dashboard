import SearchView from './SearchView';
import AllCardsView from './AllCardsView';

const PageView = Backbone.View.extend({
	render: function() {
		const { allCards } = this.model.attributes;

		this.el.innerHTML = '';

		const headerDiv = document.createElement('div');
		headerDiv.classList.add('header');
		this.el.appendChild(headerDiv);

		const containerDiv = document.createElement('div');
		containerDiv.classList.add('container');
		this.el.appendChild(containerDiv);

		const header = new SearchView({
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

export default PageView;
