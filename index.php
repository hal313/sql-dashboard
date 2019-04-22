<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <link rel="stylesheet" href="site.css">
    </head>

    <body class="container">
        <div>

            <div class="form-group">
                <label for="query">Query</label>
                <input type="text" id="query" name="query" class="form-control">
            </div>
            <div class="form-group">
                <label for="datasource">Datasource</label>
                <select class="form-control" id="datasources">

                </select>
            </div>
            <div>
                <button type="submit" id="submit" class="btn btn-primary">Run</button>
                <button id="save" class="btn btn-secondary">Save</button>
                <button id="init" class="float-right btn btn-secondary">Init</button>
            </div>
        </div>

        <div>
            <table class="table" id="results">
            </table>
        </div>

        <div>
            <div class="alert-danger" id="error"></div>
        </div>

        <!-- // This is a Bootstrap modal dialog, invoked by JavaScript-->
        <div class="modal" tabindex="-1" role="dialog" id="error-modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Oops!</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Something bad happened!</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- // This is a Bootstrap modal dialog, invoked by JavaScript-->
        <div class="modal" tabindex="-1" role="dialog" id="save-modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">URL</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <span id="save-modal-link"></span><i id="launch-button" class="fas fa-external-link-square-alt"></i>
                        <div class="form-group">
                            <label for="save-modal-url"></label>
                            <textarea id="save-modal-url" class="text-monospace form-control" rows="4"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- // This is a Bootstrap modal dialog, invoked by JavaScript-->
        <div class="modal" tabindex="-1" role="dialog" id="message-modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="message-modal-title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="save-modal-url"></label>
                            <div id="message-modal-body"></div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- // Load scripts -->
        <script src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="//stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
        <script src="dashboard.js" type="module"></script>
        <script defer src="https://use.fontawesome.com/releases/v5.8.1/js/all.js" integrity="sha384-g5uSoOSBd7KkhAMlnQILrecXvzst9TdC09/VM+pjDTCM+1il8RHz5fKANTFFb+gQ" crossorigin="anonymous"></script>
    </body>
</html>
