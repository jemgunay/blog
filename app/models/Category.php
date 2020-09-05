<?php

class Category extends Database {

    const TABLE_NAME = 'category';
    private $f3;

    public function __construct() {
        parent::__construct(self::TABLE_NAME);
        $this->f3 = Base::instance();
    }

    // get all categories
    public function get_all() {
        $this->load(null, array('order' => 'name ASC'));
        return $this->query;
    }


}