<?php defined('FCPATH') OR exit('No direct script access allowed'); 

require(APPPATH.'libraries'.DIRECTORY_SEPARATOR.'F.php');
$f = new F;

/* Time Zone */ 
define('TIME_ZONE', 'Asia/Jakarta'); 
@date_default_timezone_set(TIME_ZONE);

/* Base URL */ 
$protocol = isset($_SERVER["HTTPS"]) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
$http_host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
$http_alias = '';
$http_port = '';
if (strpos($http_host, 'www') > -1) {
	list($http_alias, $http_host, $http_dot) = explode('.', $http_host);
	$http_host = implode('.', [$http_host, $http_dot]);
}

if (strpos($http_host, ':') > -1)
	list($http_host, $http_port) = explode(':', $http_host);

/* List available domain */
$domain_devel = ['localhost','127.0.0.1','192.168.1.15','192.168.100.105'];
$domain_live = ['ayoavram.com','ayoavram.simpipro.com','raiz-invest.simpipro.com'];
$domain = array_merge($domain_devel, $domain_live);
if (!in_array($http_host, $domain))
	$f->bare_response(FALSE, ['message' => "Domain name <strong>$http_host</strong> is not available !"]);

$http_host_full = $http_alias ? $http_alias.'.'.$http_host : $http_host;
$http_host_full = $http_port ? $http_host_full.':'.$http_port : $http_host_full;
define('PROTOCOL', $protocol);
define('HTTP_HOST', $http_host_full);
define('HTTP_METHOD', $_SERVER['REQUEST_METHOD']);

/* Define default path. Implement on $route['default_controller'] */
$path_localhost = [
	8080 => 'frontend',
	8081 => 'webapps',
];
$path = [
	'localhost' 								=> $path_localhost[$http_port],
	'ayoavram.com' 							=> 'frontend',
	'ayoavram.simpipro.com' 		=> 'frontend',
	'raiz-invest.simpipro.com' 	=> 'frontend',
];
define('PATH', $path[$http_host]);

/* Define BASE_URL. Implement on $config['base_url'] */
define('SEPARATOR', '/');
define('BASE_URL', PROTOCOL.HTTP_HOST.SEPARATOR); 

/* Init TMP/CACHE Folder */
$tmp = '__tmp';
if (!file_exists($tmp) && !is_dir($tmp)) { mkdir($tmp); } 

if (in_array($http_host, $domain_devel))
	define('IS_LOCAL', TRUE);
else
	define('IS_LOCAL', FALSE);

/* Override php.ini config */
if (function_exists('ini_set')) {
	@ini_set('max_execution_time', 300);
	@ini_set('date.timezone', TIME_ZONE);
	@ini_set('post_max_size', '8M');
	@ini_set('upload_max_filesize', '2M');
	@ini_set('display_errors', IS_LOCAL ? on : off);					// on | off
	@ini_set('error_reporting', IS_LOCAL ? E_ALL : 0);					// 0 | E_ALL | E_ERROR | E_WARNING | E_PARSE | E_NOTICE
}

if (in_array($http_host, $domain_live)) {
	include FCPATH.'__domain'.DIRECTORY_SEPARATOR.$http_host.'.php';
	$repos_url = BASE_URL.'__repository'.SEPARATOR.$http_host.SEPARATOR;
	$api_url = 'https://api.simpipro.com';
} else {
	include FCPATH.'__domain'.DIRECTORY_SEPARATOR.'localhost.php';
	$repos_url = BASE_URL.'__repository'.SEPARATOR.'localhost'.SEPARATOR;
	$api_url = 'http://'.$http_host.':5050';
}
define('REPOS_URL', $repos_url);
define('API_URL', $api_url);

define('API_GATEWAY', IS_LOCAL ? 'http://localhost:5051' : 'https://gateway-api.simpipro.com');
define('API_OLAP', 		IS_LOCAL ? 'http://localhost:5052' : 'https://olap-api.simpipro.com');
define('API_SYSTEM', 	IS_LOCAL ? 'http://localhost:5053' : 'https://system-api.simpipro.com');
define('API_MARKET', 	IS_LOCAL ? 'http://localhost:5054' : 'https://market-api.simpipro.com');
define('API_MASTER', 	IS_LOCAL ? 'http://localhost:5055' : 'https://master-api.simpipro.com');