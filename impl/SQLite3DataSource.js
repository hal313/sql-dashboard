import {IDataSource} from './IDataSource.js';

export class SQLite3DataSource extends IDataSource {

    /**
     * Gets the name of the data source.
     *
     * @return {String} the name of the datasource
     */
    getName() {
        return 'SQLite3';
    }

    /**
     * Gets the description of the data source.
     *
     * @return {String} the description of the datasource
     */
    getDescription() {
        return 'Implements a remote SQLite3 DataSource';
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
        // This always succeeds
        return new Promise((resolve, reject) => {
            this.handleCallbacks(null, onSuccess, resolve);
        });
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
        return new Promise((resolve, reject) => {
            $.post({
                url: `sqlite3.php?op=init`,
                data: {
                    statements: sqlStatements
                },
                success: (result) => this.handleCallbacks(result, onSuccess, resolve),
                error: (error) => this.handleCallbacks(error, onFail, reject)
            });
        });
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
        return new Promise((resolve, reject) => {
            $.get({
                url: `sqlite3.php?op=query&sql=${sqlStatement}`,
                success: (result) => this.handleCallbacks(result, onSuccess, resolve),
                error: (error) => this.handleCallbacks(error, onFail, reject)
            });
        });
    }

}
