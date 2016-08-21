const HeaderView = Backbone.View.extend({
	className: 'header',

	initialize: function() {
		this.listenTo(this.model, 'change', this.render.bind(this));
	},

	render: function() {
		this.el.innerHTML =
		`
			<form class="repo-form">
				https://github.com/
				<input type="text" name="repository" size="30">
				<button type="submit" class="btn add-btn">Add</button>
				${
					this.model.get('error') ?
						`<span class="err-msg">${ this.model.get('error').message }</span>`
						:
						``
				}
			</form>
		`;

		return this;
	},

	events: {
		'submit .repo-form': 'addRepo',
	},

	addRepo: function(event) {
		event.preventDefault();

		const title = this.el.querySelector('[name="repository"]').value;

		this.model.get('allCards').addRepo(title);

		this.el.querySelector('[name="repository"]').value = '';
	}
});

export default HeaderView;
