<?php

class Misc {

    private static $f3;

    public function __construct() {
       self::$f3 = Base::instance();

        // anonymous functions for templates
        self::$f3->set('to_currency', [$this, 'to_currency']);
        self::$f3->set('split_datetime', [$this, 'split_datetime']);
        self::$f3->set('space_to_newline', [$this, 'space_to_newline']);
        self::$f3->set('trim_blog_content', [$this, 'trim_blog_content']);
    }

    // adds trailing 0s to currency (i.e. 1.5 -> 1.50)
    static function to_currency($num) {
        return number_format((float)$num, 2, '.', '');
    }

    // split datetime into seperate date & time array
    static function split_datetime($datetime) {
        $dt = new DateTime($datetime);
        $date = $dt->format('d/m/Y');
        $time = $dt->format('H:i:s');
        return array($date, $time);
    }

    // check all required fields were posted
    static function check_required_fields($required_fields) {
        foreach ($required_fields[0] as $i => $field) {
            if (self::$f3->get('POST.' . $field) == '') {
                self::$f3->set('error', 'Please fill in the \'' . $required_fields[1][$i] . '\' field.');
                return false;
            }
        }
        return true;
    }

    // filter out unwanted post fields
    static function copyFrom_filter($target, $inclusive_fields) {
        $target->copyfrom('POST', function($val) use (&$inclusive_fields) {
            // the 'POST' array is passed to our callback function
            return array_intersect_key($val, array_flip($inclusive_fields));
        });
    }

    // validate hex (6 and 3 char variations)
    static function validate_hex($hex) {
        $hex_trimmed = ltrim($hex, '#');
        return (ctype_xdigit($hex_trimmed) && (strlen($hex_trimmed) == 3 || strlen($hex_trimmed) == 6));
    }

    // get first URL param
    static function get_param($param_position=0) {
        return explode('/', self::$f3->get('PARAMS.0'))[$param_position+1];
    }

    // convert space to new line
    static function space_to_newline($str) {
        return str_replace(" ","<br>", $str);
    }

    // trim blog post content for preview
    static function trim_blog_content($str) {
        $trim_length = 200;
        // trim to 300 characters in length
        $content = strip_tags(html_entity_decode($str));
        $content = substr($content, 0, $trim_length);

        // ensure no partial words are left at the end of the text
        $i = strlen($content)-1;
        while ($i > 0) {
            // traverse until first space is found and trim (as long as no punctuation is found, checked by ascii value)
            if ($content[$i] == " " && ord($content[$i-1]) >= 65) {
                $content = substr($content, 0, $i);
                break;
            }
            $i--;
        }

        return $content . "...";
    }

    // var_dump debug
    static function dump($var) {
        var_dump($var);
        exit;
    }

}
