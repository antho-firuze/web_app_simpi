<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Xsmarty extends Smarty 
{
	public function __construct()
	{
		parent::__construct();
		$this->template_dir = DIR_TEMPLATE;
		$this->compile_dir 	= DIR_TEMPLATE.'_cache';
		$this->compile_check = TRUE;
		
		if (!file_exists($this->compile_dir) && !is_dir($this->compile_dir)) { mkdir($this->compile_dir); } 
		
		log_message('debug', "Smarty Class Initialized");
	}

	function view($template, $data = array(), $return = FALSE)
	{
		foreach ($data as $key => $val){
			$this->assign($key, $val);
		}

		if ($return == FALSE) {
			$ci =& get_instance();
			if (method_exists( $ci->output, 'set_output' )) {
				$ci->output->set_output( $this->fetch($template) );
			} else {
				$ci->output->final_output = $this->fetch($template);
			}
			exit();
		} else {
			return $this->fetch($template);
		}
	}
	
}
