import AllCards from './AllCards';
import PageView from './PageView';
import Page from './Page';

const page = new Page({
	error: null,
	allCards: new AllCards(),
});

const pageView = new PageView({
	el: document.body,
	model: page,
});

pageView.render();




