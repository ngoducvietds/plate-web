require(['jquery', 'router', 'amd-page-loader', 'templates/page', 'singletons',
    'logger', 'events/event-manager'],
    function($, Router, PageLoader, Page, singletons, Logger, EventManager) {

    var log = new Logger('app');

    var pageLoader = PageLoader.init({
        selector: '#pages',
        htmlPrefix: 'pages',
        jsPrefix: '../pages'
    });

    var status = {
        lastModule: undefined,
        loggedIn: false,
        pageAfterLogin: undefined,
        currentUrl: undefined
    };

    var events = new EventManager('app', status);
    events.listen({
        login: function() {
            this.loggedIn = true;
            events.dispatch('redirect', status.pageAfterLogin || 'page1' );
            status.pageAfterLogin = undefined;
        },
        logout: function() {
            this.loggedIn = false;
            status.pageAfterLogin = status.currentUrl;
            events.dispatch('redirect', 'login');
        }
    });

    var pages = {
        _public: ['login'],
        isPublic: function(p_pageId) {
            for (var i in this._public) {
                if (this._public[i] === p_pageId) {
                    return true;
                }
            }
            return false;
        }
    };

    var loading = singletons.loading;

    singletons.router = new Router({
        onRouteChange: function(p_pageId) {
            if (!status.loggedIn && !pages.isPublic(p_pageId)) {
                status.pageAfterLogin = p_pageId;
                events.dispatch('redirect', 'login');
                return;
            }

            loading.show();

            if (status.lastModule) {
                status.lastModule.hide();
                status.lastModule = undefined;
            }

            pageLoader.load(p_pageId)
                .success(pageLoaded)
                .fail(pageError);
            status.currentUrl = p_pageId;
        }
    });

    function pageLoaded(module, element, expired) {
        if (expired) {
            return;
        }

        if (module instanceof Page === false) {
            throw Error('module for ' + element.id + ' should be a Page');
        }

        if (!module.bindingsApplied) module.bind(element);

        module.show();

        status.lastModule = module;

        loading.hide();
    }

    function pageError(err) {
        log.error('error loading page: ' + err.message + '. ' + err.stack);
        pageLoader.load('error')
            .success(pageLoaded);
            // TODO fix don't go into endless loop if failed to load error page
    }

    $(document).ready(function() {
        // initialize botstrap
        require(['bootstrap']);
        // bind static modules
        require(['modules/user-mod'], function(userMod) {
            userMod.bind(document.getElementById('user-mod'));
        });
    });
});