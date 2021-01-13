<?php

class ContentController extends Controller {

	private $content, $category;

	public function __construct() {
		parent::__construct();
        $this->content = new Content();
        $this->category = new Category();
	}

    // process content requests
    public function content() {
	    // get page param
	    $page = $this->f3->get('PARAMS.page');
        // get categories for side nav
        $this->f3->set('categories', $this->category->get_all());

        // blog
        if ($page == 'blog' || $page == null) {
            $category = $this->f3->get('PARAMS.category');
            $blog_id = $this->f3->get('PARAMS.blog_id');

            // list all blog posts
            if ($blog_id == null && $category == null) {
                $this->content->get_all();
            }
            // filter blog posts by category
            else if ($category != null) {
                $this->content->get_posts_by_category($category);
            }
            // get single blog post
            else if ($blog_id != null) {
                $this->content->get_post($blog_id);
            }
            else {
                $this->f3->reroute('/blog');
            }

            $this->f3->set('view', 'content/blog.htm');
        }
        // about
        else if ($page == 'about') {
            $this->f3->set('view', 'content/about.htm');
        }
        // contact
        else if ($page == 'contact') {
            if ($this->f3->get('POST.contact_form')) {
                $this->content->process_contact_form();
            }
            else {
                $this->f3->set('view', 'content/contact.htm');
            }
        }
        else {
            // page does not exist
            $this->f3->reroute('/blog');
        }

        // if ajax request exclude surrounding view, return target page content only
        if ($this->f3->get('POST.ajax'))
            $this->f3->set('response_content', $this->f3->get('view'));

    }
}