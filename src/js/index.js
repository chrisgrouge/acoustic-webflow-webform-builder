// ======================================== Various Global Functions ========================================
// assign a data attribute to the outputPreviewBody form inputs
jQuery.fn.assignData = function(id) {
	$('tbody.' + id).find('label, input, legend, select, option, textarea, fieldset, button').each(function(i, elm){
		if($(this).is("br")) {
		}
		$(elm).attr("data",id + i);
		  if($(elm).attr("type") == "hidden") {
        $("<div>").text('Hidden field').addClass("hiddenField").appendTo("form");
      }
	});
}

// function for validating form action section removes required fields text when all are complete
function validateFormAction() {
	if ($("#formID").text() == "" ||
			$("#formAction").text() == "" ||
			$("#formPageId").text() == "" ||
			$("#formSiteId").text() == "" ||
			$("#formParentPageId").text() == "") {
		$("#preheader .hiddenField").text("Form post action required fields");
	}
	else {
		$("#preheader .hiddenField").html("&nbsp;");
	}
}

// generate unique ID strings for input elements
var uniques = [];
var ID = function () {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return Math.random().toString(36).substring(2, 9);
};
jQuery.fn.uniqueIds = function(it) {
		$("#outputPreviewBody").find("tbody[class='" + it + "']").last().each(function(){
			$(this).find("input[id=''], textarea[id=''], select[id=''], fieldset[id='']").each(function() {
				function generate() {
					var newID = ID();
					if (!(uniques.indexOf(newID) === -1)) {
						return generate();
					} else {
						uniques.push(newID);
						return newID
					}
					
				}
				var id = generate();
				$(this).attr("id", id);

        if($(this).is("fieldset")) {
					$(this).attr("for", id);
					$(this).next().attr("id", "error-" + id);
				}
        
				if($(this).attr("type") == "text" || $(this).attr("type") == "email" || $(this).attr("type") == "tel") {
					$(this).prevAll("label:last").attr("for", id);
					$(this).next().attr("id", "error-" + id);
				}

				if($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio") {
					$(this).next("label").attr("for", id);
					// $(this).parent().next().attr("id", "error-" + id);
				}

				if($(this).is("select") || $(this).is("textarea")) {
					$(this).prevAll("label:last").attr("for", id);
					$(this).next().attr("id", "error-" + id);
				}
			});
		});
}

function requiredCheckmark(data) {
	// create the required checkbox to select when it's required
	$("<input>").attr({
		"type": 'checkbox', 
		"data": data, 
		'id': data,
		'checked': ($("#outputPreviewBody *[data='" + data + "']").prop('required') == true || $("#outputPreviewBody fieldset[data='" + data + "'] > input").prop('required') == true) ? "true" : undefined
	}).addClass("requiredCheck").appendTo("form");
	$("form").append(" ");
	$('<label>').text("Required?").attr("for", data).appendTo("form");
	// create label and input to write in custom error message
	$("<div>").text('Error Message').addClass("formLabel").appendTo("form");
	$("<input>").attr({"type": "text", "data": data}).addClass("error").val($("#outputPreviewBody *[data='" + data + "']").next().children("div.text-small").text().trim()).appendTo("form");
}

function copyToClipboardMsg(elem, msgElem) {
  var succeed = copyToClipboard(elem);
  var msg;
  if (!succeed) {
    msg = "Copy not supported or blocked."
  } else {
    msg = "Copied to the clipboard!"
  }
  if (typeof msgElem === "string") {
    msgElem = document.getElementById(msgElem);
  }
  msgElem.innerHTML = msg;
  setTimeout(function() {
    msgElem.innerHTML = "";
  }, 4000);
}
 
function copyToClipboard(elem) {
  // create hidden text element, if it doesn't already exist
  var targetId = "_hiddenCopyText_";
  var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
    // can just use the original source element for the selection and copy
    target = elem;
    origSelectionStart = elem.selectionStart;
    origSelectionEnd = elem.selectionEnd;
  } else {
    // must use a temporary form element for the selection and copy
    target = document.getElementById(targetId);
    if (!target) {
      var target = document.createElement("textarea");
      target.style.position = "absolute";
      target.style.left = "-9999px";
      target.style.top = "0";
      target.id = targetId;
      document.body.appendChild(target);
    }
    target.textContent = elem.textContent;
  }
  // select the content
  var currentFocus = document.activeElement;
  var x = window.scrollX, y = window.scrollY;
  target.focus();
  window.scrollTo(x, y);
  target.setSelectionRange(0, target.value.length);
 
  // copy the selection
  var succeed;
  try {
    succeed = document.execCommand("copy");
  } catch (e) {
    succeed = false;
  }
  // restore original focus
  if (currentFocus && typeof currentFocus.focus === "function") {
    currentFocus.focus();
  }
 
  if (isInput) {
    // restore prior selection
    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
    // clear temporary content
    target.textContent = "";
  }
  return succeed;
}

// creating elements in the edit pane when editing a module
jQuery.fn.editPane = function(mod) {
	mod.find('tbody > div > div > button, tbody > div > div > textarea, tbody > div > *, tbody.hiddenInput > input').each(function(i, el){
		// used to replace any line break html tags
		var regex = /<br\s*[\/]?>/gi;
		var formType = $(el).attr("data");
		var inputType = $(el).attr("type");

		// if the element is a br tag
		if($(el).is("br")) {
			// do nothing
		}

		if($(el).is("label")) {
			$("<div>").text('Label').addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("label").val($(el).text()).appendTo("form");
		}

		if(inputType == "email" || inputType == "text" || inputType == "tel") {
			$("<div>").text('Label').addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("label").val($(el).attr("placeholder")).appendTo("form");
			$("<div>").text("Name").addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("inputName").val($(el).attr("name")).appendTo("form");
			requiredCheckmark(formType);

		}
		
		if($(el).is("fieldset")) {

			$(el).find("legend").each(function() {
				$("<div>").text('Label').addClass("formLabel").appendTo("form");
				$("<input>").attr({"type": "text", "data": formType}).addClass("legend").val($(el).children("legend:first").text()).appendTo("form");
			});

			if(formType.includes("checkbox")) {
				$("<div>").text("Name").addClass("formLabel").appendTo("form");
				$("<input>").attr({"type": "text", "data": formType}).addClass("checkradioName").val($(el).children("input:first").attr("name")).appendTo("form");
			}

			if(formType.includes("radio")) {
				$("<div>").text("Name").addClass("formLabel").appendTo("form");
				$("<input>").attr({"type": "text", "data": formType}).addClass("checkradioName").val($(el).attr("name")).appendTo("form");
			}

			requiredCheckmark(formType);

			$("<div>").text('Options').addClass("formLabel").appendTo("form");

			$(el).find("input").each(function() {
				var crType = $(this).attr("data");
				$("<div>").html('Value <button class="removeOption" type="button" tabindex="-1">Remove</button>').addClass("formLabelSmall").appendTo("form");
				$("<input>").attr({"type": "text", "data": crType}).addClass("checkradioOption").val($(this).attr("value")).appendTo("form");
				$("<div>").text('Vanity').addClass("formLabelSmall vanity").appendTo("form");
				var prevLabel = $("#outputPreviewBody input[data='" + crType + "']").next("label");
				var prevLabelData = prevLabel.attr("data");
				$("<input>").attr({"type": "text", "data": prevLabelData}).addClass("checkradioOption vanity").val(prevLabel.text()).appendTo("form");
			});

			$("<div>").addClass("addOption addCheckRadio").html('<button class="add circle" type="button"><i class="fas fa-plus"></i></button>').appendTo("form");
		}

		if($(el).is("select")) {
			$("<div>").text('Label').addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("label").val($(el).children("option:first").text()).appendTo("form");
			$("<div>").text("Name").addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("inputName").val($(el).attr("name")).appendTo("form");
			requiredCheckmark(formType);
			$("<div>").text('Options').addClass("formLabel").appendTo("form");

			$(el).find("option").each(function() {
				var selType = $(this).attr("data");
				var disabled = $(this).attr("disabled");
				if(!disabled) {
					$("<div>").html('Value <button class="removeOption" type="button" tabindex="-1">Remove</button>').addClass("formLabelSmall").appendTo("form");
					$("<input>").attr({"type": "text", "data": selType}).addClass("selectOption").val($(this).attr("value")).appendTo("form");
					$("<div>").text('Vanity').addClass("formLabelSmall vanity").appendTo("form");
					var vanityText = $(this).text();
					$("<input>").attr({"type": "text", "data": selType}).addClass("selectOption vanity").val(vanityText).appendTo("form");
				}
			});

			$("<div>").addClass("addOption addSelect").html('<button class="add circle" type="button"><i class="fas fa-plus"></i></button>').appendTo("form");
		}

		if($(el).is("textarea")) {
      $("<div>").text('Label').addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("label").val($(el).attr("placeholder")).appendTo("form");
			$("<div>").text("Name").addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("inputName").val($(el).attr("name")).appendTo("form");

			requiredCheckmark(formType);
		}

		if($(el).hasClass("submitArrowWrapper")) {
			formType = $(el).children("input").attr("data");
			$("<div>").text('Button Text').addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("submitButton").val($(el).attr("value")).appendTo("form");
		}

		if($(el).is("button")) {
			$("<div>").text('Button Text').addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("submitButton").val($(el).text()).appendTo("form");
		}

		if(inputType == "hidden") {
			$("<div>").text("Name").addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("inputName").val($(el).attr("name")).appendTo("form");

			$("<div>").text('Value').addClass("formLabel").appendTo("form");
			$("<input>").attr({"type": "text", "data": formType}).addClass("hiddenValue").val($(el).attr("value")).appendTo("form");
		}		
	});
}

// ======================================== App Functions ========================================
// Prevent form submit when pressing enter on edit pane
$(document).on("keydown", ":input:not(textarea)", function(event) {
  return event.key != "Enter";
});

// Dragable Modules
$(".slides").sortable({
  placeholder: 'slide-placeholder',
  axis: "y",
  revert: 150,
  start: function(e, ui) {
  var placeholderHeight = ui.item.outerHeight();
  ui.placeholder.height(placeholderHeight + 15);
  $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
  // add class to say it's been grabbed
  ui.item.addClass("grabbed");
  },
  change: function(event, ui) {
  ui.placeholder.stop().height(0).animate({
    height: ui.item.outerHeight() + 15
  }, 300);

  var placeholderAnimatorHeight = parseInt($(".slide-placeholder-animator").attr("data-height"));

  $(".slide-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
    height: 0
  }, 300, function() {
    $(this).remove();
    var placeholderHeight = ui.item.outerHeight();
    $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
  });

  },
  stop: function(e, ui) {
  $(".slide-placeholder-animator").remove();
  // remove class after delay. Delay is used to decide if it was a click or a drag
  setTimeout( function(){
    ui.item.removeClass("grabbed");
  }, 300);	
  },
});

// ======================================== Content editable section ========================================
// when clicking the addOption button to add options for checkbox, radio, and select
$(".form-overlay").on("click", "button.add", function() {
		
  var parent = $(this).parent();
  var previousData = parent.prevAll("input:first").attr("data");
  var previousId = previousData.replace(/[0-9]/g, '');
  var lastOption = $("#outputPreviewBody [data='" + previousData + "'");
  var lastOptionInput = $("#outputPreviewBody [data='" + previousData + "'").prev("input");
  var li = lastOption.parents("li.slide");
  var tbodyClass = li.children("table").children("tbody").attr("class");

  // if check or radio
  if(parent.hasClass("addCheckRadio")) {
    // update the outputPreviewBody

    // insert label
    lastOption.clone().attr("for", "").text("Option").insertAfter(lastOption).assignData(previousId);
    lastOption.after(" ").after("\n");

    // insert the input
    lastOptionInput.clone().attr("id", "").val("Option").insertAfter(lastOption).assignData(previousId);

    $("<br />").insertAfter(lastOption).before("\n").after("\n");
    
    $("#outputPreviewBody").uniqueIds(tbodyClass);
  }

  // if select
  if(parent.hasClass("addSelect")) {
    lastOption.clone().val("Option").text("Option").insertAfter(lastOption).before("\n").assignData(previousId);
  }

  // update the edit pane
  $(".form-container").empty().editPane(li);
});

// remove an option from a checkbox, radio, or select
$(".form-overlay").on("click", "button.removeOption", function() {
  var parent = $(this).parent();
  var input = parent.next("input");
  var inputDataType = input.attr("data");

  if(inputDataType.indexOf("checkbox") == 0 || inputDataType.indexOf("radio") == 0) {
    // remove the option for the outputputpreviewbody
    $("#outputPreviewBody [data='" + inputDataType +"']").next().remove();
    // remove the next vanity option in the edit pane
    $("[data='" + inputDataType +"']").next("div").remove();
    $("[data='" + inputDataType +"']").next("input").remove();
    // remove the value option from the edit pane
    $("[data='" + inputDataType +"']").prev().remove();
    $("[data='" + inputDataType +"']").remove();
  }
  if(inputDataType.indexOf("select") == 0) {
    $(".form-container [data='" + inputDataType +"']").prev().remove();
    $("[data='" + inputDataType +"']").remove();
    
  }
});

// when clicking the close button, hide the overlayed form and show the cards
$(".content-edit").on("click", function () {
  $("form.form-container").empty();
  $(".form-header").remove();
  $(".form-overlay").hide().animate({
    "left": "700px"
  }, 1).css("position", "absolute");
  $(".modulecard").show();
});

// ======== Clear Canvas Button ========
$( "#clearoutput" ).click(function() {	
  // Get the modal
  var modal = $('#myModal');
  var btn = $(this);
  var span = $(".close");
  var cancel = $(".cancelclose");

  // When the user clicks the button, open the modal 
  modal.show();

  // When the user clicks on <span> (x), close the modal
  span.click(function() {
    modal.hide();
  });

  // When the user clicks on Cancel button, close the modal
  cancel.click(function() {
    modal.hide();
  });

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
      document.getElementById('myModal').style.display = "none";
    }
  }
  
  $('#confirmClear').click(function() {
    $( "#formID, #formActionName, #formActionDataName,  #formAction, #formPageId, #formSiteId, #formParentPageId" ).empty();
    $( "#outputPreviewBody" ).empty();			// Empty the preview
    $( "#footer" ).empty();									// Empty the preview
    $( "#outputBody" ).empty();							// Empty the html that gets copied
    $( ".clearCanvas" ).hide();
    $( ".remove" ).hide();
    $( "#myModal" ).hide();
    // close the module edit overlay if its open
    $("form.form-container").empty();
    $(".form-header").remove();
    $(".form-overlay").hide().animate({ "left": "700px" }, 1 ).css("position", "absolute");
    $(".modulecard").show();
  });
});

// ======== Click to export ========
$("#copyButton").on("click", function() {

  /* validate we have all the necessary pieces for the form to work */
  var errors = [];
  if ($("#formID").text().length == 0) { errors.push("Form ID missing"); }
  if ($("#formAction").text().length == 0) { errors.push("Form action missing"); }
  if ($("#formPageId").text().length == 0) { errors.push("Page ID missing"); }
  if ($("#formSiteId").text().length == 0) { errors.push("Site ID missing"); }
  if ($("#formParentPageId").text().length == 0) { errors.push("Parent Page ID missing"); }
  if ($("#outputPreviewBody :input:not(button.circle.removeMod)[name=''], #footer :input[name='']").length > 0) { errors.push("Missing name attribute on a form field"); }
  if ($("#footer :input[value='']").length > 0) { errors.push("Missing value on a hidden form field"); }
  if ($("#outputPreviewBody label:empty").length > 0) { errors.push("A label is missing text"); }
  if ($("#outputPreviewBody select > option:empty").length > 1) { errors.push("A dropdown is missing text on an option"); }
  else if (errors.length != 0) {
    $("#msg").html(errors.join("<br>"));
  }
  else {
    // empty the holding area
    $("#outputBodyHolding").empty();
    // clone the prevew body area and footer area
    var outputPreviewBody = $('#outputPreviewBody > li > table > tbody').clone();
    var outputPreviewFooter = $('#footer > li > table > tbody').clone();

    // modify the html to remove unwanted elements
    outputPreviewBody.find("*[readonly]").removeAttr("readonly");
    outputPreviewBody.find("*[data]").removeAttr("data");
    outputPreviewBody.find("button.removeMod").remove();
    outputPreviewBody.find("input[type='submit']").unwrap();
    // outputPreviewBody.find("svg").remove();
    outputPreviewFooter.find("*[data]").removeAttr("data");
    outputPreviewFooter.find("span, button.removeMod").remove();

    // make the holding html the same as the preview html after the above modifications
    $("#outputBodyHolding").html(outputPreviewBody);
    $("#outputBodyHolding").append(outputPreviewFooter);
    
      // convert the preview to text and append it to #outputBody
    var modules = $("#outputBodyHolding > tbody")
    var arr = $.map(modules, function(elem, index) {
      return $(elem).html();
        }).join("");

    $("#outputBody").text(arr);
        
    copyToClipboardMsg(document.getElementById("output"), "msg");
  }
  
});

// ======== The Modal Popup ========
var modal = $('#myModal');
var btn = $("#backbutton");
var span = $(".close");
var cancel = $(".cancelclose");

// When the user clicks the button, open the modal 
btn.click(function() {
  modal.show();
});

// When the user clicks on <span> (x), close the modal
span.click(function() {
  modal.hide();
});
  
// When the user clicks on Cancel button, close the modal
cancel.click(function() {
  modal.hide();
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == document.getElementById('myModal')) {
      document.getElementById('myModal').style.display = "none";
  }
}

// ======== Remove a module on canvas area ========
$("#outputPreview").on("click", ".removeMod", function() {
  // remove the module
  $(this).closest("li.slide").remove();
  
  // if there are no more modules
  if( !$.trim( $('#outputPreviewBody').html() ).length ) {
    // hide the clear canvas button
    $( ".clearCanvas" ).hide();
  }
  // remove the button
  $(this).remove();
  
  // hide the overlayed form and show the cards
  $("form.form-container").empty();
  $(".form-header").remove();
  // hide the form
  $(".form-overlay").hide();
  // after a delay, reposition the form. Had to override the li.slides click animation
  setTimeout( function() {
    $(".form-overlay").css({
      "left": "700px",
      "display": "none",
      "position" : "absolute"
    });	
  }, 100);
  $(".modulecard").show();
});
$("#outputPreview").on("mouseenter", ".removeMod", function(e) {
  $(e.target).closest("li.slide").addClass("hover").css("position", "relative");
});
$("#outputPreview").on("mouseleave", ".removeMod", function(e) {
  $(e.target).closest("li.slide").removeClass("hover").css("position", "initial");
});

// ======== Add a module on the canvas area ========
$('.modulecard').on("click", function (e) {
  var clicked_id = $(this).attr('id');
  var r = $('<button class="circle removeMod"><i class="fas fa-times"></i></button>');
var modules = {
emailInput: '\n'+
'<div class="width-full margin-bottom-16">\n'+
'	<input type="text" id="" name="Email" data-name="Email" placeholder="EMAIL ADDRESS*" class="contact-text-field w-input" required="">\n'+
'	<div id="" class="error-text">\n'+
'		<div class="text-small">Please enter a valid Email Address</div>\n'+
'	</div>\n'+
'</div>\n'+
'',
textInput: '\n'+
'<div class="width-full margin-bottom-16">\n'+
'	<input type="text" id="" name="" data-name="" placeholder="TEXT FIELD" class="contact-text-field w-input" maxlength="256">\n'+
'	<div id="" class="error-text">\n'+
'		<div class="text-small">Error message</div>\n'+
'	</div>\n'+
'</div>\n'+
'',
telInput: '\n'+
'<div class="width-full margin-bottom-16">\n'+
'	<input type="tel" id="" name="" data-name="" placeholder="PHONE FIELD" class="contact-text-field w-input" maxlength="256">\n'+
'	<div id="" class="error-text">\n'+
'		<div class="text-small">Error message</div>\n'+
'	</div>\n'+
'</div>\n'+
'',
checkboxInput: '\n'+
'<div class="width-full margin-bottom-16">\n'+
'<fieldset id="">\n'+
'<legend>CHOOSE AS MANY OF THE OPTIONS AS YOU\'D LIKE</legend>\n'+
'	<input type="checkbox" id="" name="" data-name="" value="Option">\n'+
'	<label for="">Option</label>\n'+
'	<br>\n'+
'	<input type="checkbox" id="" name="" data-name="" value="Option">\n'+
'	<label for="">Option</label>\n'+
'</fieldset>\n'+
'	<div id="" class="error-text">\n'+
'		<div class="text-small">Error message</div>\n'+
'	</div>\n'+
'</div>\n'+
'',
radioInput: '\n'+
'<div class="width-full margin-bottom-16">\n'+
'<fieldset id="">\n'+
'	<legend>CHOOSE ONLY ONE OPTION</legend>\n'+
'	<input type="radio" id="" name="" data-name="" value="Option">\n'+
'	<label for="">Option</label>\n'+
'	<br>\n'+
'	<input type="radio" id="" name="" data-name="" value="Option">\n'+
'	<label for="">Option</label>\n'+
'</fieldset>\n'+
'	<div id="" class="error-text">\n'+
'		<div class="text-small">Error message</div>\n'+
'	</div>\n'+
'</div>\n'+
'',
selectInput: '\n'+
'<div class="width-full margin-bottom-16">\n'+
'<select id="" name="" data-name="">\n'+
'	<option value="" disabled selected>CHOOSE ONE FROM THE LIST</option>\n'+
'	<option value="Option">Option</option>\n'+
'	<option value="Option">Option</option>\n'+
'</select>\n'+
'	<div id="" class="error-text">\n'+
'		<div class="text-small">Error message</div>\n'+
'	</div>\n'+
'</div>\n'+
'',
textareaInput: '\n'+
'<div class="width-full margin-bottom-16">\n'+
'	<div class="additional-form-area-2">\n'+
'		<textarea name="" data-name="" id="" placeholder="TYPE OUT A LONGER RESPONSES HERE" class="contact-text-field w-input" maxlength="4000"></textarea>\n'+
'		<div id="" class="error-text">\n'+
'			<div class="text-small">Error message</div>\n'+
'		</div>\n'+
'	</div>\n'+
'</div>\n'+
'',
// 	submitButton: '\n'+
// '<div class="submitArrowWrapper"><input type="submit" value="Submit"><svg width="19" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m11.096 0-1.069 1.105 6.064 6.189L0 7.265.062 8.82l16.029.029-5.91 6.058L11.261 16 19 8.071 11.096 0Z" fill="currentColor"></path></svg></div>\n'+
// '',
// submitButton: '\n'+
// '<div class="policy-text top-20">By submitting this form, you agree to receive our future communications. Visit our Preference Center to make changes and our <a href="/privacy-policy" class="privacy-policy-text">Privacy Policy</a> to learn how we use your data.</div> <div class="newsletter-btn-wrap"> <div class="contact-submit-wrap float-right margin-bottom-40 submitArrowWrapper"> <!-- Submit button --> <input type="submit" value="Subscribe" data-wait="Please wait..." class="contact-submit-button w-button"> <div style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(-45deg) skew(0deg, 0deg); transform-style: preserve-3d;" class="contact-submit-arrow w-embed"> <svg width="19" height="16" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"> <path d="m11.096 0-1.069 1.105 6.064 6.189L0 7.265.062 8.82l16.029.029-5.91 6.058L11.261 16 19 8.071 11.096 0Z" fill="currentColor"></path> </svg></div> </div> </div>\n'+
// '',
submitButton: '\n'+
'<div class="policy-text top-20">By submitting this form, you agree to receive our future communications. Visit our <a href="/lp/email-preferences" class="policy-link-2">Preference Center</a> to make changes and our <a href="/privacy-policy" class="policy-link-2">Privacy Policy</a> to learn how we use your data.</div> <div class="margin-left-auto"><div class="contact-submit-wrap"><button class="contact-submit-button margin-bottom-0 w-button recaptcha-send-btn">talk to us</button><div class="contact-submit-arrow-2 w-embed" style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(-45deg) skew(0deg, 0deg); transform-style: preserve-3d;"><svg width="19" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m11.096 0-1.069 1.105 6.064 6.189L0 7.265.062 8.82l16.029.029-5.91 6.058L11.261 16 19 8.071 11.096 0Z" fill="currentColor"></path></svg><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="AcousticFormLoading" style="margin: auto; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; display: none; shape-rendering: auto;" width="24px" height="24px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#dc137d" stroke-width="8" r="38" stroke-dasharray="179.0707812546182 61.690260418206066"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg></div></div></div>\n'+
'',
hiddenInput: '\n'+
'<input type="hidden" name="" value="">\n'+
'<span class="hiddenField">Hidden field</span>\n'+
''
}

  var modulename = $(this).find("h2").text();
  
  if(modulename == "Hidden Field") {
    $('#footer').append([
      $('<li/>',{ "class": "slide ui-sortable-handle" }).append([
        $('<table/>',{"border": "0", "cellpadding": "0", "cellspacing": "0", "style" : "width: 100%; position: relative"}).append([
          $('<button/>',{ "class": "circle removeMod" }).html('<i class="fas fa-times"></i>'),
          $('<tbody/>',{ "class": clicked_id, "name": modulename}).append([
            modules[clicked_id]
          ])
        ])
      ])
    ]);
  }
  if(!(modulename == "Hidden Field")) {
    $('#outputPreviewBody').append([
      $('<li/>',{ "class": "slide ui-sortable-handle" }).append([
        $('<table/>',{"border": "0", "cellpadding": "0", "cellspacing": "0", "style" : "width: 100%; position: relative"}).append([
          $('<button/>',{ "class": "circle removeMod" }).html('<i class="fas fa-times"></i>'),
          $('<tbody/>',{ "class": clicked_id, "name": modulename}).append([
            modules[clicked_id]
          ])
        ])
      ])
    ]);
  }

  // when the new module is added, create a data attribute and give that attribute a new name. This helps editing content
  $("#outputPreviewBody").assignData(clicked_id);

  // assign unique ids where needed
  $("#outputPreviewBody").uniqueIds(clicked_id);

  /* prevent active on input clicks for the canvas form youre building */
  $('#outputPreviewBody input, #outputPreviewBody textarea, #outputPreviewBody select').attr( "readonly", true );

  // show the clear canvas button and keep the canvas scrolled to the bottom
  $( ".clearCanvas" ).show();	
  var canvas = $('#previewoutput');
  // get the canvas total height
  var canvasheight = canvas[0].scrollHeight;
  // keep the scroll bar at the bottom to show the new mod on screen
  canvas.scrollTop(canvasheight);

e.preventDefault();
});

// when you click any direct tbody child in #outputPreview (added the onclick > tbody because tbody is dynamically added)
$(document).on('click', '#outputPreviewBody li, #footer li', function() {
  var li = $(this);
  if (li.hasClass("grabbed")){
    // don't open the edit pane
  }
  else {
    // empty the form
    $("form.form-container").empty();
    $(".form-header").remove();
    var modname = li.find("tbody[name]").attr("name");
    $("<div>").attr("class", "form-header").text(modname).prependTo('.form-overlay');
    if (!$.trim( $('.form-container').html() ).length) {
      // animate form to the left
      $(".form-overlay").show().animate({ "left": "0px" }, 200 ).css("position", "relative").scrollTop();
      // hide the module cards
      $(".modulecard").hide();
      // kep it scrolled to top
      var container = $('.form-container');
      // get the canvas total height
      var canvasheight = container[0].scrollHeight;
      // keep the scroll bar at the bottom to show the new mod on screen
      // container.scrollTop(0);
      $(this).editPane(li);
      
    }
  }
});

// when the inputs change (added the onclick > input because inputs are dynamically added)
$('form.form-container').on('change', 'input, textarea', function() {
		
  var inputDataType = $(this).attr("data");
  var value = $(this).val();
  var formField = $("#outputPreviewBody [data='" + inputDataType +"']");
  var formFieldID = formField.attr("id");


  // when values are added to the <form> tag
  if ($.inArray(inputDataType, ['formIDInput', 'formActionInput', 'formPageIdInput', 'formSiteIdInput', 'formParentPageIdInput']) >= 0) {
    let id = $(this).attr("data").replace("Input", "");
		$("#" + id).text($(this).val());
		if (id == "formID") {
			$("#formName").text($(this).val());
			$("#formDataName").text($(this).val());
			$("#formAriaLabel").text($(this).val());
		}
		validateFormAction();
  }

  if ($(this).hasClass("inputName")) {
    $("[data='" + inputDataType +"']").attr({
      "name": value,
      "data-name": value
    });

    var inputType = $("#footer [data='" + inputDataType +"']").attr("type");
    if(inputType === "hidden") {
      $("[data='" + inputDataType +"']").next("span").text(value + " hidden field")
    }
  }

  if ($(this).hasClass("label")) {
    // $("[data='" + inputDataType +"']").text($(this).val());
    if(formField.is("input")) {
      formField.attr("placeholder", $(this).val());
    }
    else if(formField.is("select")) {
      formField.children("option:first").html($(this).val());
    }
    else if(formField.is("legend")) {
      formField.text($(this).val());
    }
    else if(formField.is("textarea")) {
      formField.attr("placeholder", $(this).val());
    }
    else {
      //
    }
    
  }

  if ($(this).hasClass("error")) {
    formField.next().children("div.text-small").text(value);
  }

  if ($(this).hasClass("legend")) {
    formField.children("legend:first").text($(this).val());
  }

  if ($(this).hasClass("submitButton")) {
    if(formField.is("button")) {
      formField.text($(this).val());
    }
    else {
      formField.attr("value", $(this).val());
    }
  }

  if ($(this).hasClass("checkradioName")) {
    var value = $(this).val();
    formField.find("input").each(function() {
      $(this).attr({
        "name": value,
        "data-name": value
      });
    });
  }

  if ($(this).hasClass("checkradioOption") && !$(this).hasClass("vanity")) {
    formField.attr("value", $(this).val());
    if ($(this).next().next("input.vanity").val() == "Option") {
      $(this).next().next("input.vanity").val($(this).val());
      formField.next("label").text($(this).val());
    }
  }

  if ($(this).hasClass("checkradioOption") && $(this).hasClass("vanity")) {
    formField.text($(this).val());
    formField.next("label").text($(this).val());
  }

  if ($(this).hasClass("selectOption") && !$(this).hasClass("vanity")) {
    formField.attr("value", $(this).val());
    if ($(this).nextAll("input.vanity:first").val() == "Option") {
      $(this).nextAll("input.vanity:first").val($(this).val());
      formField.text($(this).val());
    }
  }
  if ($(this).hasClass("selectOption") && $(this).hasClass("vanity")) {
    formField.text($(this).val());
  }

  if ($(this).hasClass("hiddenValue")) {
    $("#footer [data='" + inputDataType + "']").attr("value", $(this).val());
  }

  /* required checkbox selection */
  if ($(this).hasClass("requiredCheck")) {		

    if ($(this).prop("checked") == true) {
      
      if (formField.attr("type") == "text" || formField.attr("type") == "tel" || formField.is("textarea")) {
        formField.attr("required", "");
        formField.attr("placeholder", formField.attr("placeholder") + "*");
      }

      if (formField.is("select")) {
        formField.attr("required", "");
        formField.children("option:first").append("*");
      }

      if (formField.is("fieldset")) {
        formField.children("legend").append("*");
        formField.find("input").each(function() {
          $(this).attr("required", "");
        });
        if (inputDataType.indexOf("checkbox") == 0 && !($("#outputClose").hasClass("requiredAdded"))) {
          $("#outputClose").addClass("requiredAdded");
        }
      }

    }
    else {
      if (formField.attr("type") == "text" || formField.attr("type") == "tel" || formField.is("textarea")) {
        formField.removeAttr("required");
        formField.attr("required", "");
        formField.attr("placeholder", formField.attr("placeholder").replace("*", ""));
      }

      if (formField.is("select")) {
        formField.removeAttr("required");
        formField.children("option:first").text(
          formField.children("option:first").text().replace("*", "")
        );
      }

      if (formField.is("fieldset")) {
        formField.children("legend").text(formField.children("legend").text().replace("*", ""));
        formField.find("input").each(function() {
          $(this).removeAttr("required");
        });
        if (inputDataType.indexOf("checkbox") == 0 && $("#outputPreviewBody input:checkbox[required]").length == 0) {
          $("#outputClose").removeClass("requiredAdded");
        }
      }

    }
  }

});

// create in the edit pane inputs for the preheader <form> tag items
$('#outputPreview').on('click', '#preheader', function() {

  // empty the form
  $("form.form-container").empty();
  $(".form-header").remove();
  
  // Create the header
  $("<div>").attr("class", "form-header").text(("form")).prependTo('.form-overlay');
  // animate form to the left
  $(".form-overlay").show().animate({ "left": "0px" }, 200 ).css("position", "relative");
  // hide the module cards
  $(".modulecard").hide();
  
  $("<div>").text('Form ID').addClass("formLabelSmall").appendTo("form");
  $("<input>").attr("type","text").attr("data", 'formIDInput').val($('#formID').text()).appendTo("form");

  $("<div>").text('Action URL').addClass("formLabelSmall").appendTo("form");
  $("<input>").attr("type","text").attr("data", 'formActionInput').val($('#formAction').text()).appendTo("form");

  $("<div>").text('Page Id').addClass("formLabelSmall").appendTo("form");
  $("<input>").attr("type","text").attr("data", 'formPageIdInput').val($("#formPageId").text()).appendTo("form");

  $("<div>").text('Form Site Id').addClass("formLabelSmall").appendTo("form");
  $("<input>").attr("type","text").attr("data", 'formSiteIdInput').val($("#formSiteId").text()).appendTo("form");

  $("<div>").text('Parent Page Id').addClass("formLabelSmall").appendTo("form");
  $("<input>").attr("type","text").attr("data", 'formParentPageIdInput').val($("#formParentPageId").text()).appendTo("form");


});


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeuas5fuQnwiXVDWlE15B_BBkPbenLXBA",
  authDomain: "marcom-webflow-forms.firebaseapp.com",
  projectId: "marcom-webflow-forms",
  storageBucket: "marcom-webflow-forms.appspot.com",
  messagingSenderId: "533912869276",
  appId: "1:533912869276:web:5c99165bd4b1c0acb41059"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

