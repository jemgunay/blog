<?php

class Content extends Database {

    const TABLE_NAME = 'post';
    private $f3, $captcha_secret_key, $target_email_addresses;

    public function __construct() {
        parent::__construct(self::TABLE_NAME);
        $this->f3 = Base::instance();
        $this->captcha_secret_key = $this->f3->get('captcha_secret_key');
        $this->target_email_addresses = array($this->f3->get('first_contact_email'), $this->f3->get('second_contact_email'));
    }

    // get all posts
    public function get_all() {
        $this->load('hidden = 0', array('order' => 'publish_date DESC'));
        $this->f3->set('blog_posts', $this->query);
    }

    // get all blog posts
    public function get_posts_by_category($category) {
        if ($category == 'All') {
            $this->get_all();
            return;
        }
        $result = $this->db->exec('SELECT * FROM post_category_join WHERE name = ? AND hidden = 0 ORDER BY publish_date DESC', $category);
        $this->f3->set('blog_posts', $result);
    }

    // get a blog post
    public function get_post($post_id) {
        // populate mapper with target blog post
        $this->load(array('post_id=?', $post_id));
        // if post does not exist, return error
        if (!$this->loaded()) {
            $this->f3->reroute('/blog');
        }

        // replace content file paths with modified/correct path
        $post = $this->cast();
        $post['content'] = str_replace('"content/', '"' . $this->f3->get('blog_content_path'), $post['content']);

        $this->f3->set('blog_post', $post);
    }

    // contact
    public function process_contact_form() {
        // check required form fields are sent
        $required_fields = array(array('first_name', 'second_name', 'email', 'message'), array(null));
        if (!Misc::check_required_fields($required_fields)) {
            $this->f3->set('view', 'field_missing');
            return;
        }

        // check captcha was sent
        if ($this->f3->get('POST.g-recaptcha-response') == null) {
            $this->f3->set('view', 'captcha_missing');
            return;
        }

        // check if captcha failed
        $captcha_params = $this->captcha_secret_key . "&response=" . urlencode($this->sanitise_input($this->f3->get('POST.g-recaptcha-response'))) . "&remoteip=" . $_SERVER['REMOTE_ADDR'];
        $captcha_verified = json_decode(file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=" . $captcha_params), true);

        if ($captcha_verified["success"] == false) {
            $this->f3->set('view', 'captcha_failed');
            return;
        }

        // successful form submit
        $this->f3->set('view', 'success');

        // send email to each account
        $message = 'Name: ' . $this->sanitise_input($this->f3->get('POST.first_name')) . ' ' . $this->sanitise_input($this->f3->get('POST.second_name'));
        $message = $message.'<br>Email: ' . $this->sanitise_input($this->f3->get('POST.email')) . '<br>Sender IP: ' . $_SERVER['REMOTE_ADDR'] . '<br><br>' . $this->sanitise_input($this->f3->get('POST.message'));

        foreach ($this->target_email_addresses as $address) {
            $this->send_email($address, $message);
        }
    }

    // sanitise input for safe emailing
    private function sanitise_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    // send email
    private function send_email($address, $message) {
	  $subject = 'Message from the blog...';

      $headers = 'From: contact@jemgunay.co.uk' . "\r\n" .
        "Content-type: text/html; charset=\"UTF-8\"; format=flowed \r\n" .
        "Mime-Version: 1.0 \r\n" .
        "Content-Transfer-Encoding: quoted-printable \r\n";

	  mail($address, $subject, $message, $headers);
    }
}