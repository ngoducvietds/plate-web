define(['templates/bindable', 'knockout', 'singletons', 'net/authentication'],
    function(Bindable, ko, singletons, authentication) {

    var ajax = singletons.ajax;
    var storage = singletons.storage;

    var vm = {
        user: ko.observable(),
        loggedIn: ko.observable(false),
        form: {
            email: ko.observable(),
            password: ko.observable()
        },
        logout: function() {
            authentication.logout();
        },
        login: function() {
            authentication.login({
                email: this.form.email(),
                password: this.form.password()
            });
            this.form.password('');
        }
    };

    var userMod = new Bindable({
        name: 'user-mod',
        viewModel: vm,
        events: {
            'logged-in': function(p_user) {
                this.log.debug('logged-in event, setting user: ', p_user);
                this.viewModel.user(p_user);
                this.viewModel.loggedIn(true);
            },
            'logged-out': function() {
                this.log.debug('logged-out event, unsetting user');
                this.viewModel.loggedIn(false);
                this.viewModel.user(undefined);
            }
        },
        visible: true,
    });

    userMod.onBind = function() {
        var user = storage.load('user');
        if (user) {
            vm.user(user);
            vm.loggedIn(true);
        }
    };

    return userMod;
});