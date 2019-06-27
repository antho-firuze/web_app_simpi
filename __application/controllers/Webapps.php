<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Webapps extends CI_Controller 
{
	public $view_url;
	public $view_path;
	public $view_dir 		= 'views';
	public $theme 			= VIEW_THEME;
	public $title 			= TITLE_MAIN;
	public $page_ext		= '.html';
	public $page_path;

	function __construct()
	{
		parent::__construct();
		$this->view_url 	= BASE_URL.'__application'.SEPARATOR.$this->view_dir.SEPARATOR;
		$this->view_path 	= APPPATH.$this->view_dir.DIRECTORY_SEPARATOR;
		$this->error_path = $this->theme.SEPARATOR.'errors'.SEPARATOR;

		define('THEME_URL', $this->view_url.$this->theme.SEPARATOR);
		define('THEME_PATH', $this->view_path.$this->theme.DIRECTORY_SEPARATOR);
		
		/* Get input from request browser */
		$this->params = (object) $this->input->get();
		
		// ============================================================== 
		// Checking parameters => page
		// ============================================================== 
		if (!isset($this->params->page)) 
			$this->params->page = 'home';
		
		// Check, is page name has extension & extension is allow ['htm','html','php']
		if (! $ext = substr(strrchr($this->params->page,'.'),1)) 
			$this->params->page = $this->params->page.$this->page_ext;
		
		$this->page_path = $this->theme.DIRECTORY_SEPARATOR.$this->params->page;
		if(! file_exists($this->view_path.$this->page_path))
			$this->page_path = $this->error_path.'error_404.php';
		
	}
	
	// public function index() {echo 'Frontend OK !';}
	public function index() { $this->load->view($this->page_path); }
	
}
