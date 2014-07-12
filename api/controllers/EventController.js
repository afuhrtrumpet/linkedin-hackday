var passport = require('passport'),
		FacebookStrategy = require('passport-facebook').Strategy;
/**
 * EventController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
	create: function(req, res) {
		console.log("Event create called");
		Event.create({
			creatorId: req.session.user.id,
			userIds: [req.session.user.id],
			location: req.param("location")
		}).done(function(err, event) {
			if (err)
				console.log(err);
			return event.toObject();
		});
	},

	viewEvent: function(req, res) {
		var id = req.param("id");
		console.log(id);
		res.view({"id": id});
	},

	joinEvent: function(req, res) {

		var eventId = req.param("id");
		if (!req.session.user) {
		res.redirect('/user/facebook', {"id": req.param("id")});
			/*passport.authenticate('facebook', { scope: ['public_profile',  'read_friendlists', 'email', 'user_about_me', 'user_likes', 'user_friends']},
					function(err, user) {
						req.logIn(user, function(err) {
							if (err) {
								console.log(err);
								req.session.flash = 'There was an error';
								res.redirect('user/login');
							} else {
								req.session.user = user;
								res.redirect('/dashboard');
							}
						});
					})(req, res, next);*/
		} else {
		Event.findOne({id: eventId}, function(err, event) {
			if (err)
				console.log(err);
			else if (req.session.user) {
				event.userIds.push(req.session.user.id);
				event.update({
					userIds: event.userIds
				}, function(err, events) {
					res.redirect('/viewEvent/' + eventId);
				});
			}
		});
		}
	},


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to EventController)
   */
  _config: {}

  
};
