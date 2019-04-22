import {SQLite3DataSource} from './impl/SQLite3DataSource.js';
import {WebSQLDataSource} from './impl/WebSQLDataSource.js';
import {DEFAULT_QUERY, INIT_STATEMENTS} from './sql.js';


// The jQuery ready handler
$(function onReady() {

    // Parse out the URL parameters
    let params = {};
    (window.location.search.split('?')[1] || '').split('&').forEach(item => {
        let [name, value] = item.split('=');
        params[name] = value;
    });


    // The query string starts as the sefault query
    let queryString = DEFAULT_QUERY;


    ////////////////////////////////////////////////////////////////////////////
    // jQuery members
    ////////////////////////////////////////////////////////////////////////////
    //
    // jQuery members for the "save modal" functionality
    let $saveModalLink = $('#save-modal-link'),
        $saveModalURL = $('#save-modal-url'),
        $saveModal = $('#save-modal');
    //
    // jQuery members for the "message modal" functionality
    let $messageModalTitle = $('#message-modal-title'),
        $messageModalBody = $('#message-modal-body'),
        $messageModal = $('#message-modal');
    //
    //jQuery members for the "error modal" functionality
    let $errorContainer = $('#error'),
        $errorModal = $('#error-modal');
    //
    // The result, query and history containers
    let $resultsContainer = $('#results-container');
    let $queryContainer = $('#query-container');
    let $historyContainer = $('#history-container');
    //
    // The data source list element
    let $dataSourceList = $('#datasources');
    // Create the data sources
    let dataSources = {
        websql: new WebSQLDataSource(),
        sqlite3: new SQLite3DataSource()
    };
    //
    // Populate the data sources
    Object.getOwnPropertyNames(dataSources).forEach((id) => {
        // Get the data source instance
        let dataSource = dataSources[id];

        // Add an option element
        $dataSourceList.append(new Option(dataSource.getName(), id));
    });


    ////////////////////////////////////////////////////////////////////////////
    // Setup the UI based on URL parameters
    ////////////////////////////////////////////////////////////////////////////
    //
    // Select the datasource (if provided)
    if (!!params.datasource) {
        if (!!dataSources[params.datasource]) {
            $dataSourceList.val(params.datasource);
        } else {
            showMessage('Unknown Datasource', `Unknown data source "${params.datasource}".`);
        }
    }
    // Set the query (if provided)
    if (!!params.sql) {
        queryString = decodeURIComponent(params.sql);
    }


    ////////////////////////////////////////////////////////////////////////////
    // UI setup tasks
    ////////////////////////////////////////////////////////////////////////////
    //
    // Set the SQL string
    $queryContainer.val(queryString.trim());
    //
    // Focus the query box
    $queryContainer.focus();
    //
    // Run the query if the URL parameter "autorun" is true
    if ('true' === params.autorun) {
        doQuery();
    }


    ////////////////////////////////////////////////////////////////////////////
    // Handlers
    ////////////////////////////////////////////////////////////////////////////
    //
    // Invoke the search when...
    //
    //   The "submit" button is pressed
    $('#submit').click(doQuery);
    //   The "enter" key is pressed within the "query" text field
    $queryContainer.keypress(function onKeyPress(event) {
        // If "enter" (13) is pressed
        if (13 === event.charCode) {
            // Invoke the search
            doQuery();
        }
    });
    //
    // Save the query
    $('#save').click(function onSave() {
        showSave($queryContainer.val(), $dataSourceList.val());
    });
    //
    // Initialize the data source
    $('#init').click(event => {
        getDataSource()
        .then((datasource) => datasource.init(INIT_STATEMENTS))
        .then(() => showMessage('Initialized', 'The database has been initialized.'))
        .catch(handleError);
    });


    ////////////////////////////////////////////////////////////////////////////
    // Helper functions
    ////////////////////////////////////////////////////////////////////////////
    //
    /**
     * Gets the selected data source.
     *
     * @return {Promise} which resolves to the selected data sources
     */
    function getDataSource() {
        return Promise.resolve(dataSources[$dataSourceList.val()]);
    }
    //
    /**
     * Resets the UI for a query.
     *
     * Empties the results and error content sections.
     */
    function resetUIForQuery() {
        // Empty the results table
        $resultsContainer.empty();
        // Empty the errors
        $errorContainer.empty();
    }
    //
    /**
     * Executes a query.
     *
     * Get the SQL from the query container and dispatch to the correct data source.
     */
    function doQuery() {
        // Get the query string (at the time the query was executed)
        let sqlQuery = $queryContainer.val();

        Promise.resolve()
            // Reset the UI
            .then(resetUIForQuery)
            // Execute the query
            .then(() => executeQuery(sqlQuery))
            // Handle the results
            .then(handleQueryResults)
            // Add to history
            .then(() => addToHistory(sqlQuery))
            // Handle error
            .catch(handleError);
    };
    //
    /**
     * Handles query results.
     *
     * Populates a table with the results from a query.
     *
     * {
     *      data: String[],
     *      columns: String[],
     *      message: String
     * }
     *
     * @param {Object} results the query results (see above format)
     */
    function handleQueryResults(results) {
        // The HTML string
        let columnHeadersHTML;

        // Print the column headers
        //
        // Create the HTML string
        columnHeadersHTML = '<thead><tr><th>Row</th>';
        $.each(results.columns, function onColumn(index, columnName) {
            // Add each column
            columnHeadersHTML += `<th>${columnName}</th>`;
        });
        columnHeadersHTML += '</tr></thead>';

        // Add the column headers to the table
        $resultsContainer.append(columnHeadersHTML);

        // Add the rows to the table
        $.each(results.data, function onRow(index, row) {
            // The row HTML
            let rowHTML = `<tr><th>${index}</th>`;

            // For each row, add the data into the HTML (use the columns array as indexes to the data)
            $.each(results.columns, function onColumn(index, columnName) {
                // Add each column
                rowHTML += `<td>${row[columnName]}</td>`;
            });
            rowHTML += '</tr>';

            // Append the HTML row
            $resultsContainer.append(rowHTML);
        });
    }
    //
    /**
     * Generate a URL for saving.
     *
     * @param {String} sqlQuery the query to run
     * @param {String} datasourceId the ID of the datasource to use
     * @return {String} a URL which will auto-run the query when loaded
     */
    function generateSaveURL(sqlQuery, datasourceId) {
        return `${location.href.split('?')[0]}?datasource=${datasourceId}&autorun=true&op=query&sql=${encodeURIComponent(sqlQuery)}`;
    }
    //
    /**
     * Shows the "save" modal.
     *
     * @param {String} sqlQuery the SQL statement to save
     * @param {String} datasourceId the ID of the data source
     */
    function showSave(sqlQuery, datasourceId) {
        // Build the save URL
        let url = generateSaveURL(sqlQuery, datasourceId);

        // Populate the modal fields
        $saveModalLink.html(`<a href="${url}" target="_blank">Open in new window</a>`);
        $saveModalURL.val(url);
        // Show the modal
        $saveModal.modal();
    }
    //
    /**
     * Shows a generic "message" modal.
     *
     * @param {String} title the title of the modal
     * @param {String} message the message to show
     */
    function showMessage(title, message) {
        // Populate the modal fields
        $messageModalTitle.html(title);
        $messageModalBody.html(message);
        // Show the modal
        $messageModal.modal();
    }
    //
    /**
     * Adds a query to the history
     *
     * @param {String} sqlQuery the query to add to the results
     */
    function addToHistory(sqlQuery) {
        // Add to the history (at the top)
        //
        // Generate the URL
        let url = generateSaveURL(sqlQuery, $dataSourceList.val());
        // Write the DOM element
        $historyContainer.prepend(`
            <div class="history-item-container">
                <a href="${url}" target="_blank">
                    <i id="launch-button" class="fas fa-external-link-square-alt"></i>
                </a>
                <a class="history-link" onclick="rerunQuery('${sqlQuery}');return false;" href="/">${sqlQuery}</a>
            </div>
        `);
    }
    /**
     * Executes a query against the currently selected data source.
     *
     * @param {String} sqlQuery the query to execute
     * @return {Promise} a promise which resolves with the query results
     */
    function executeQuery(sqlQuery) {
        return Promise.resolve()
            // Get the data source
            .then(getDataSource)
            // Execute the query
            .then((datasource) => datasource.execute(sqlQuery))
        ;
    }
    //
    /**
     * Reruns a query and updates the results, but does not add to the history.
     *
     * @param {String} sqlQuery the query to rerun
     */
    window.rerunQuery = function rerunQuery(sqlQuery) {
        // Execute the query
        Promise.resolve()
            // Reset the UI
            .then(resetUIForQuery)
            // Execute the query
            .then(() => executeQuery(sqlQuery))
            // Handle the results
            .then(handleQueryResults)
            // Change to "results" tab
            .then(() => $('#results-tab').trigger('click'))
            // Handle error
            .catch(handleError);
    };
    /**
     * Shows an "error" modal.
     *
     * @param {Error} error the error to show
     */
    function handleError(error) {
        // Print the error to the console
        console.error('Error', error);

        // If there is response text, add it to the DOM
        if (!!error.responseText) {
            $errorContainer.html(error.responseText);
        }

        // Show the modal
        $errorModal.modal();
    }

});
