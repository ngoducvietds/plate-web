define(['extendable'], function(Extendable) {

    /**
     * @class Simple function queue implementation
     * @name Queue
     * @extends {Extendable}
     */
    function Queue() {
        this._queue = [];
    }

    var QueuePrototype = /** @lends Queue.prototype */ {
        /**
         * Add a job to the queue. May be undefined so that you can keep track
         * of the queue.
         * @param {Object} p_job             Job description to add to the queue
         * @param {Function} p_job.callback  Callback function to call when
         * the queue is executed.
         * @param {Function} p_job.self      Optional parameter to set the
         * `this` context for the callback
         * @param {Object} p_self
         * @returns {Job}                    Instance of a Job
         */
        add: function(p_callback, p_self) {
            var job = {
                callback: p_callback,
                self: p_self
            };
            this._queue.push(job);
            return job;
        },
        /**
         * Removes a job from the queue
         * @param  {Job} p_job    Job instance to remove. If not specified,
         * the last added job will be removed from the queue and returned.
         * @return {Job} Removed job instance or undefined if not found
         */
        remove: function(p_job) {
            var queue = this._queue;
            if (!p_job) {
                return queue.pop();
            }
            for (var i in queue) {
                var job = queue[i];
                if (job === p_job) {
                    // remove and return the job
                    queue.splice(i, 1);
                    return job;
                }
            }
            return undefined;
        },
        /**
         * Clears the queue
         */
        clear: function() {
            this._queue = [];
        },
        size: function() {
            return this._queue.length;
        },
        /**
         * Execute the next job in the queue
         * @return {Boolean} `true` if a job was found and executed, `false`
         * otherwise
         */
        next: function() {
            if (this._queue.length === 0) {
                return false;
            }

            var job = this._queue.shift();
            if (job && typeof job.callback === 'function') {
                job.callback.call(job.self);
            }
            return true;
        },
        /**
         * Execute all the jobs from the queue using the FIFO method.
         */
        execute: function() {
            while(this.next()) {
                // execute all jobs
            }
        }
    };

    return Extendable.extend(Queue, QueuePrototype);
});