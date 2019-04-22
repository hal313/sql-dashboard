import {IDataSource} from './IDataSource.js';

// Database constants
const DATABASE_NAME = 'database';
const DATABASE_VERSION = '1';
const DATABASE_DESCRIPTION = 'Sample database';
const DATABASE_SIZE = 1024 * 1024;

// Driver specific constants
const DRIVER_NAME = 'WebSQL';
const DRIVER_DESCRIPTION = 'Implements a WebSQL DataSource';
const DRIVER_DATABASE_TABLE_COLUMN_NAME = 'tbl_name';
const DRIVER_DATABASE_METADATA_TABLE_NAME = '__WebKitDatabaseInfoTable__';

export class WebSQLDataSource extends IDataSource {
    instance;

    /**
     * Gets the name of the data source.
     *
     * @return {String} the name of the datasource
     */
    getName() {
        return DRIVER_NAME;
    }

    /**
     * Gets the description of the data source.
     *
     * @return {String} the description of the datasource
     */
    getDescription() {
        return DRIVER_DESCRIPTION;
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
        return new Promise((resolve, reject) => {
            if (!this.instance) {
                this.instance = openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE, (/*database*/) => this.handleCallbacks(null, onSuccess, resolve));

                // If there is a version, then the database was already created; just resolve the promise!
                if (null !== this.instance.version && undefined !== this.instance.version && '' !== this.instance.version) {
                    this.handleCallbacks(null, onSuccess, resolve);
                }
            } else {
                // The database was already opened; just resolve
                this.handleCallbacks(null, onSuccess, resolve);
            }
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
        return this.open(null, onFail)
            // Remove all tables here
            .then(() => {
                // Get a list of tables
                return this.execute("SELECT tbl_name from sqlite_master WHERE type = 'table'", null, onFail);
            })
            // Pick just the 'data' element
            .then(results => results.data)
            // Pick the actual table name
            .then(tableNameRows => tableNameRows.map(tableNameRow => tableNameRow[DRIVER_DATABASE_TABLE_COLUMN_NAME]))
            // Do not attempt to remove the meta table (this is not allowed)
            .then(tableNames => tableNames.filter(tableName => DRIVER_DATABASE_METADATA_TABLE_NAME !== tableName))
            // For each table name, remove the table
            .then(tableNames => {
                // Remove each table
                //
                // Create a promise chain for each remove statement
                let promiseChain = Promise.resolve();
                // Iterate through each table name
                tableNames.forEach(tableName => {
                    // Append to the promise chain
                    promiseChain = promiseChain.then(() => {
                        return this.execute(`DROP TABLE ${tableName}`);
                    });
                });
                return promiseChain;
            })
            // Execute each statement
            .then(() => Promise.all(sqlStatements.map(statement => this.execute(statement))))
            // Invoke the success function
            .then(onSuccess)
            // On error, invoke the fail function
            .catch(onFail)
        ;
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
        return this.open(null, onFail)
            .then(() => {
                return new Promise((resolve, reject) => {
                    this.instance.transaction(transaction => {
                        transaction.executeSql(sqlStatement, [],
                            (tx, result) => this.handleCallbacks(this.normalizeResultSet(result), onSuccess, resolve),
                            (tx, error) => this.handleCallbacks(error, onFail, reject)
                        )
                    });
                });
            });
    }

    /**
     *
     * Normalizes a result set from the internal WebSQL result set to the standard JSON result set:
     * {
     *      data: String[],
     *      columns: String[],
     *      message: String
     * }
     *
     * @param {Object} resultSet the internal result set structure from WebSQL
     * @return {Object} the standard JSON result set
     */
    normalizeResultSet(resultSet) {
        // Build the result set
        let result = {
            data: [],
            columns: []
        };

        // Iterate through the WebSQL result set and transform to the standard SQL result set
        for (let index=0; index<resultSet.rows.length; index++) {
            // Get the row
            let row = resultSet.rows[index];
            // Build a clone
            let clone = {};
            // For each property name in the result set, copy the name/value to the clone
            Object.getOwnPropertyNames(row).forEach(propertyName => {
                clone[propertyName] = row[propertyName];
                if (!result.columns.includes(propertyName)) {
                    result.columns.push(propertyName);
                }
            });
            //Add the data
            result.data.push(clone);
        }

        // Return the results
        return result;
    }

}