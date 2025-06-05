<?php

// Force-create a request object for use in the application container
$request = new \Illuminate\Http\Request();
$request->server->set('SERVER_NAME', 'localhost');

// Register it in the container before anything else loads
\Illuminate\Support\Facades\App::instance('request', $request);
