<?php

    // Include the database class
    include 'inc/sqlite3db.php';

    // Assign the content-type header for consumers
    header('Content-Type: application/json');

    // Get the opcode
    $op = $_GET['op'];
    //
    // Dispatch on the opcode
    switch ($op) {
        case 'query':
            // Execute a query (via the URL)
            echo executeQuery($_GET['sql']);
            break;
        case 'init':
            // Execute init statements (an array called 'statements' in the post data)
            echo executeInit($_POST['statements']);
            break;
        default;
            // Error! Unknown op code!
            header('HTTP/1.1 500 Internal Server Error');
            echo "Unknown op '$op'";
    }

    /**
     * Creates a standard response object.
     *
     * @param {Array[String]} $rows the data rows
     * @param {String} $message the message for the response
     * @return {JSON} the standard JSON response
     */
    function createResponse($rows=[], $message=null) {
        // Add the column names
        //
        // Create an array of columns
        $columns = array();
        // Are there rows?
        if (count($rows)) {
            // For each row
            foreach ($rows as $row) {
                // Look at each column in the row
                foreach ($row as $columnName=>$value) {
                    // If the column name is NOT in the columns array
                    if (!in_array($columnName, $columns, true)) {
                        // Add the column name
                        array_push($columns, $columnName);
                    }
                }
            }
        }

        // Build the JSON object
        $jsonObject['data'] = $rows;
        $jsonObject['columns'] = $columns;
        $jsonObject['message'] = $message;

        // Return the JSON object
        return json_encode($jsonObject);
    }

    /**
     * Executes init statements.
     *
     * @param {Array[String]} $statements the SQL statements for init
     * @return {JSON} the standard JSON response
     */
    function executeInit($statements) {
        // Instantiate the database
        $db = new DashboardDB();

        // Delete all tables
        //
        // Get a list of all the table names
        $results = $db->query("SELECT name FROM sqlite_master WHERE type='table'");
        // And put into an array
        $tableNames = array();
        //
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            // Cannot drop the tables here because the database is locked while iterating through results
            array_push($tableNames, $row['name']);
        }
        //
        // Iterate through the table names array and drop the table
        foreach ($tableNames as $tableName) {
            $db->query("DROP TABLE $tableName");
        }

        // Execute each init statement
        foreach ($statements as $statement) {
            $db->query($statement);
        }

        // Close the database
        $db->close();

        // Return a response
        return createResponse([], 'OK');
    }

    /**
     * Executes a query.
     *
     * @param {String} $query the query to execute
     * @return {JSON} the standard JSON response
     */
    function executeQuery($query) {
        // Instantiate the database
        $db = new DashboardDB();

        // Execute the query
        $results = $db->query($query);

        // Create a "rows" array; each cell contains one result (or row)
        $rows = array();

        // Iterate through all the results
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            // Push each row into the "$rows" array
            array_push($rows, $row);
        }

        // Close the database
        $db->close();

        // Return standard response
        return createResponse($rows);
    }

?>
