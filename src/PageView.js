import SearchView from './SearchView';
import AllCardsView from './AllCardsView';
import RightMenuView from './RightMenuView';

const PageView = Backbone.View.extend({
	render: function() {
		const { allCards } = this.model.attributes;

		this.el.innerHTML = '';

		const headerDiv = document.createElement('div');
		headerDiv.classList.add('header');
		this.el.appendChild(headerDiv);

		const rightMenuDiv = document.createElement('div');
		rightMenuDiv.classList.add('right-menu');
		this.el.appendChild(rightMenuDiv);

		const containerDiv = document.createElement('div');
		containerDiv.classList.add('container');
		this.el.appendChild(containerDiv);

		const header = new SearchView({
			model: this.model,
			el: headerDiv
		}).render();

		const rightMenu = new RightMenuView({
			collection: allCards,
			el: rightMenuDiv
		}).render();

		const container = new AllCardsView({
			collection: allCards,
			el: containerDiv
		}).render();

		return this;
	}
});

export default PageView;
