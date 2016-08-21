const Page = Backbone.Model.extend({
	initialize: function() {
		this.listenTo(this.get('allCards'), 'error', (error) => {
			this.set('error', error);
		});
	}
});

export default Page;
