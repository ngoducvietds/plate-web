define(['extendable', 'jquery', 'logger', 'signals'],
    function(Extendable, $, Logger, signals) {

    /**
     * Abstract page
     * @exports Page
     * @extends {Extendable}
     */
    var Page = {
        /**
         * Initializes the page. Throws an error if the page was already
         * initialized
         * @param {HTMLElement} p_element   The page's root element
         * @return {Page}                   A new instance of Page
         */
        init: function(p_element) {
            if (this.initialized) {
                log.error('Page already initialized');
                throw Error('Page for \'' + p_element.id + '\' initialized');
            }

            this.log = Logger.init(p_element.id);
            this.id = p_element.id;
            this.element = p_element;
            this.initialized = true;

            this.onInit();
        },
        /**
         * Shows the page element
         * @return {Page}
         */
        show: function() {
            this.log.debug('showing page');

            this.onShow();
            $(this.element).show();

            return this;
        },
        /**
         * Hides the page element
         * @return {Page}
         */
        hide: function() {
            this.log.debug('hiding page');

            this.onHide();
            $(this.element).hide();

            return this;
        },
        /**
         * Method called by init(). Does nothing, override it for custom
         * actions.
         */
        onInit: function() {

        },
        /**
         * Method called just before the element becomes visible. Does nothing,
         * override it for custom actions.
         */
        onShow: function() {

        },
        /**
         * Method called after the element is hidden. Does nothing, override it
         * for custom actions.
         */
        onHide: function() {

        }
    };

    return Extendable.extend(Page);
});