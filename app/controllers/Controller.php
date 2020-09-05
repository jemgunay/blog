<?php

class Controller {

    /** @var Base */
	protected $f3, $render_target;

    public function __construct() {
        $this->f3 = Base::instance();
    }

    public function beforeroute() {
        // for responses within normal body html structure
        $this->f3->set('view', '');
        // plain html or json response (for ajax requests)
        $this->f3->set('response_content', '');
        $this->f3->set('response_type', 'text/html');

        // reference to first param for templates
        $first_param = Misc::get_param(0) == null ? 'projects' : Misc::get_param(0);
        $this->f3->set('first_param', $first_param);
	}

    public function afterroute() {
        // render
        if ($this->f3->get('response_content') != "") {
            if (strpos($this->f3->get('response_content'), '.htm') !== false) {
                // return html file
                echo Template::instance()->render($this->f3->get('response_content'), $this->f3->get('response_type'));
            }
            else {
                echo $this->f3->get('response_content');
            }
        }
        else {
            // return main html with view
            echo Template::instance()->render('main.htm', $this->f3->get('response_type'));
        }
	}

}
