define(['events/event-manager', 'knockout', 'templates/bindable'],
    function(EventManager, ko, Bindable) {

    /**
     * Set the breadcrumbs
     * @event EventManager#breadcrumbs-set
     * @param {Array} p_routes     An array of Strings
     */

    var bcArray = [];

    function setLastBcActive(p_active) {
        var bc = bcArray[bcArray.length - 1];
        if (!bc) return;
        bc.active(p_active ? true : false);
    }

    var vm = {
        breadcrumbs: ko.observableArray(bcArray)
    };

    var breadcrumbsMod = new Bindable({
        name: 'breadcrumbs-mod',
        viewModel: vm,
        events: {
            'breadcrumbs-set': function(p_routes) {
                this.viewModel.breadcrumbs.removeAll();
                var addedRoutes = [];
                var count = p_routes.length;
                for (var i = 0; i < count; i++) {
                    var route = p_routes[i];
                    // skip homepage
                    if (route.literal === '') continue;

                    addedRoutes.push(route.literal);
                    this.viewModel.breadcrumbs.push({
                        title: 'bc.' + route.abstract,
                        href: '#/' + addedRoutes.join('#'),
                        active: i === count - 1
                    });
                }
            }
        },
        visible: true
    });

    events = breadcrumbsMod.events;

    return breadcrumbsMod;
});