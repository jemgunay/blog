<?php
define('DIR_BASE', dirname( __FILE__ ).'/');

$f3 = require('lib/base.php');
$f3->config('config/config.ini');

// content routes
$f3->route(
    array(
        'GET|POST /',
        'GET|POST /@page',
        'GET|POST /@page/category/@category',
        'GET|POST /@page/post/@blog_id',
    ),
    'ContentController->content'
);

// error page
$f3->set('ONERROR', function($f3) {
    $f3->reroute('/blog');
});

// extend session to prevent user-agent change 403 error
new Session(function(Session $session, $id) {
    return true;
});

// template & static functions
new Misc();

// start listening to requests
$f3->run();