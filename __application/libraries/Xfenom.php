<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Xfenom extends Fenom
{
	public function __construct()
	{
		$this->template_dir = THEME_PATH;
		$this->compile_dir 	= THEME_PATH.'_cache';
		$this->options = array(
			'strip' 			=> true,
			'auto_trim' 	=> true,
			'auto_reload' => true
		);
		
		if (!file_exists($this->compile_dir) && !is_dir($this->compile_dir)) { mkdir($this->compile_dir); } 
		
		$this->fenom = Fenom::factory($this->template_dir, $this->compile_dir, $this->options);
		
		log_message('debug', "Fenom Class Initialized");
	}
	
	function view($template, $data = array(), $return = FALSE)
	{
		if ($return == FALSE) 
		{
			log_message('debug', "Fenom: display output'");
			$this->fenom->display($template, $data);
			exit();
		} else {
			log_message('debug', "Fenom: return output'");
			return $this->fenom->fetch($template, $data);
		}
	}
	
}