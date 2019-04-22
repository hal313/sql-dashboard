<?php

    /**
     * Custom class for the database. Provides some basic CRUD functionality for product and user management.
     */
    class DashboardDB extends SQLite3
    {

        /**
         * Constructor. Uses "dbdashboard.db" as the file.
         *
         */
        function __construct()
        {
            $this->open('dbdashboard.db');
        }

    }
?>
