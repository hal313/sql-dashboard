export class IDataSource {

    /**
     * Gets the name of the data source.
     *
     * @return {String} the name of the datasource
     */
    getName() {
        throw '"getName" not implemented!';
    }

    /**
     * Gets the description of the data source.
     *
     * @return {String} the description of the datasource
     */
    getDescription() {
        throw '"getDescription" not implemented!';
    }


    /**
     * Opens the database. Some implementations may require this function, which is designed
     * to be invoked when a database is going to be used.
     *
     * @param {Function} [onSuccess] the success handler
     * @param {Function} [onFail] the fail handler
     * @return {Promise} which resolves nothing but invoking onSuccess or rejects invoking onFail
     */
    open(onSuccess, onFail) {
        return Promise.reject('"open" not implemented!');
    }

    /**
     * Initializes a database.
     *
     * @param {String[]} sqlStatements the SQL statements require for initializing the database
     * @param {Function} [onSuccess] the success handler
     * @param {Function} [onFail] the fail handler
     * @return {Promise} which resolves the standard JSON query response (with no data) and invoking onSuccess or rejects invoking onFail
     */
    init(sqlStatements, onSuccess, onFail) {
        return Promise.reject('"init" not implemented!');
    }

    /**
     * Executes a query.
     *
     * @param {String[]} sqlStatement the SQL statement to execute
     * @param {Function} [onSuccess] the success handler
     * @param {Function} [onFail] the fail handler
     * @return {Promise} which resolves the standard JSON query response (with possible) and invoking onSuccess or rejects invoking onFail
     */
    execute(sqlStatement, onSuccess, onFail) {
        return Promise.reject('"execute" not implemented!');
    }


    isFunction(fn) {
        return 'function' === typeof fn;
    }

    handleCallbacks(args, ...callbacks) {
        // Make sure that the arguments are an array!
        let normalizedArgs = args || [];

        if (!Array.isArray(normalizedArgs)) {
            normalizedArgs = [args];
        }

        callbacks.forEach(callback => {
            if (this.isFunction(callback)) {
                callback.apply({}, normalizedArgs);
            }
        });
    }

}