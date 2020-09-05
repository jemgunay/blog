<?php

class Database extends DB\SQL\Mapper {

	protected $db;

	public function __construct($table) {
		$f3 = Base::instance();

		$this->db = new DB\SQL($f3->get('db_host'), $f3->get('db_user'), $f3->get('db_pass'));

		parent::__construct($this->db, $table);
	}

	// get the highest id of a table
	public function get_highest_id($table_name) {
	    $id_name = substr($table_name, 0, -1).'_id';
        $result = $this->db->exec('SELECT '.$id_name.' FROM '.$table_name.' ORDER BY '.$id_name.' DESC LIMIT 1');

        // check if any results were in the database already
        if (!empty($result)) {
            return (int)$result[0][$id_name];
        }
        return 0;
    }
}