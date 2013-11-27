define(['extendable', 'crossroads', 'hasher', 'logger', 'ui/menu'],
    function(Extendable, crossroads, hasher, Logger, menu) {

    var log = Logger.init('router');

    /**
     * Module for handling navigation
     * @exports Router
     * @extends {Extendable}
     */
    var Router = {
        /**
         * Initializes the module
         * @param {Object} p_params                    configuration object
         * @param {Function} p_params.onRouteChange    callback function to
         * execute when the route changes
         * @return {Router}
         */
        init: function(p_params) {
            this.onRouteChange = p_params.onRouteChange;

            this._setupCrossroads();
            this._setupHasher();
        },
        _setupCrossroads: function() {
            var self = this;

            crossroads.addRoute('{pageName}');
            crossroads.routed.add(function(request, data) {
                if (self.onRouteChange) {
                    log.debug('route changed to: ', data.params);
                    self.onRouteChange.apply(self, data.params);
                    menu.markCurrentMenuItem(request);
                }
            });
        },
        _setupHasher: function() {
            function parseHash(newHash, oldHash) {
                crossroads.parse(newHash);
            }
            hasher.initialized.add(parseHash);
            hasher.changed.add(parseHash);
            hasher.init();
        }
    };

    return Extendable.extend(Router);
});