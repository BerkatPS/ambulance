<?php
// Custom helper file for console applications

// Since we've moved the request binding logic to bootstrap/app.php,
// this file can be much simpler and won't cause autoloading issues

// This file is loaded before the autoloader in artisan, so we can't use classes
// that haven't been loaded yet (like Container and Request)
