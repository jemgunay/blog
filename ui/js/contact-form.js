function initContactForm() {
	$('#contact-submit').click(function(e) {
		// ajax to the php file to send the mail
		var data = $('#contact-form').serializeArray();
        data.push({name: 'ajax', value: true});
        data.push({name: 'contact_form', value: true});

		$.ajax({
			type: "POST",
			url: $('#contact-form').attr('data-target'),
			data: $.param(data),
			success: function(status) {
				console.log(status);
                // outcome
                if (status == "success") {
                    contactFormMsg("Thanks for the message - I'll get back to you as soon as possible!", "success");
                    $(".form-group").fadeOut(700, function() {
                        $(this).remove();
                    });
                } else if (status == "captcha_missing") {
                    contactFormMsg("Please tick the captcha box below.", "error");
                } else if (status == "captcha_failed") {
                    contactFormMsg("Captcha failed. Please repeat the submission.", "error");
                    grecaptcha.reset();
                } else if (status == "field_missing") {
                    contactFormMsg("Please fill in all of the fields below.", "error");
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
	});
}

// append respective alert message
function contactFormMsg(msg, type) {
	var typeAttr = "alert-info";
	if (type == "success") {
		typeAttr = "alert-success";
	}
	
	$("#contact_result").empty().append('<div class="alert ' + typeAttr +' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg + '</div>');
}