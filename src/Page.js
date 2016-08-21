const Page = Backbone.Model.extend({
	initialize: function() {
		this.listenTo(this.get('allCards'), 'error', (error) => {
			this.set('error', error);
			setTimeout(() => {
				this.unset('error');
			}, 3000);
		});
	}
});

export default Page;
