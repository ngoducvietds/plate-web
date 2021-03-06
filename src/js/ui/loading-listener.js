define(['extendable', 'events/event-manager', 'logger'],
    function(Extendable, EventManager, Logger) {

    /**
     * @class Listens to various events and sends request to {@link Loading}
     * class.
     * @name LoadingListener
     *
     * @param {Object} p_params           Configuration object
     * @param {String} p_params.name      Name of the instance
     * @param {Loading} p_params.loading  An instance of loading
     *
     * @listens EventManager#page-loading-start
     * @listens EventManager#page-loading-end
     * @listens EventManager#ajax-start
     * @listens EventManager#ajax-end
     */
    function LoadingListener(p_params) {
        this.name = p_params.name;
        this.loading = p_params.loading;

        this.log = new Logger(this.name, this.constructor.name);
        this.events = new EventManager(this.log.name, this);
        this.events.listen({
            'page-loading-start': function() {
                this.loading.show();
            },
            'page-loading-end': function() {
                this.loading.hide();
            },
            'ajax-start': function() {
                this.loading.show();
            },
            'ajax-end': function() {
                this.loading.hide();
            }
        });
    }

    var LoadingListenerPrototype = /** @lends LoadingListener.prototype */ {};

    return Extendable.extend(LoadingListener, LoadingListenerPrototype);
});