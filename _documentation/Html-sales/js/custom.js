jQuery(document).ready(function(){
								
								
								
								
/**********LOGIN FORM*********/  
/**********LOGIN FORM*********/								
$(function() {
					//the form wrapper (includes all forms)
				var $login_wrapper	= $('#login_wrapper'),
					//the current form is the one with class active
					$currentForm	= $login_wrapper.children('form.active'),
					//the change form links
					$linkform		= $login_wrapper.find('.linkform');
						
				//get width and height of each form and store them for later						
				$login_wrapper.children('form').each(function(i){
					var $theForm	= $(this);
					//solve the inline display none problem when using fadeIn fadeOut
					if(!$theForm.hasClass('active'))
						$theForm.hide();
					$theForm.data({
						width	: $theForm.width(),
						height	: $theForm.height()
					});
				});
				
				//set width and height of wrapper (same of current form)
				setWrapperWidth();
				
				/*
				clicking a link (change form event) in the form
				makes the current form hide.
				The wrapper animates its width and height to the 
				width and height of the new current form.
				After the animation, the new form is shown
				*/
				$linkform.bind('click',function(e){
					var $link	= $(this);
					var target	= $link.attr('rel');
					$currentForm.fadeOut(400,function(){
						//remove class active from current form
						$currentForm.removeClass('active');
						//new current form
						$currentForm= $login_wrapper.children('form.'+target);
						//animate the wrapper
						$login_wrapper.stop()
									 .animate({
										width	: $currentForm.data('width') + 'px',
										height	: $currentForm.data('height') + 'px'
									 },500,function(){
										//new form gets class active
										$currentForm.addClass('active');
										//show the new form
										$currentForm.fadeIn(400);
									 });
					});
					e.preventDefault();
				});
				
				function setWrapperWidth(){
					$login_wrapper.css({
						width	: $currentForm.data('width') + 'px',
						height	: $currentForm.data('height') + 'px'
					});
				}
				
				/*
				for the demo we disabled the submit buttons
				if you submit the form, you need to check the 
				which form was submited, and give the class active 
				to the form you want to show
				
				$login_wrapper.find('input[type="submit"]')
							 .click(function(e){
								e.preventDefault();
							 });	
				*/			 
			});


								
	
	
	
	
/**********CALENDAR*********/  
/**********CALENDAR*********/	
	
	
var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		
		var calendar = $('#calendar').fullCalendar({
			//theme: true, //Remove Comment For color theme
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			selectable: true,
			selectHelper: true,
			select: function(start, end, allDay) {
				var title = prompt('Event Title:');
				if (title) {
					calendar.fullCalendar('renderEvent',
						{
							title: title,
							start: start,
							end: end,
							allDay: allDay
						},
						true // make the event "stick"
					);
				}
				calendar.fullCalendar('unselect');
			},
			editable: true,
			events: [
				{
					title: 'All Day Event',
					start: new Date(y, m, 1)
				},
				{
					title: 'Long Event',
					start: new Date(y, m, d-5),
					end: new Date(y, m, d-2)
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: new Date(y, m, d-3, 16, 0),
					allDay: false
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: new Date(y, m, d+4, 16, 0),
					allDay: false
				},
				{
					title: 'Meeting',
					start: new Date(y, m, d, 10, 30),
					allDay: false
				},
				{
					title: 'Lunch',
					start: new Date(y, m, d, 12, 0),
					end: new Date(y, m, d, 14, 0),
					allDay: false
				},
				{
					title: 'Birthday Party',
					start: new Date(y, m, d+1, 19, 0),
					end: new Date(y, m, d+1, 22, 30),
					allDay: false
				},
				{
					title: 'Click for Google',
					start: new Date(y, m, 28),
					end: new Date(y, m, 29),
					url: 'http://google.com/'
				}
			]
		});	
	
	
	
	
	
	
	
	
	
								
								
								
						   

/**********NOTIFICATIONS*********/  
/**********NOTIFICATIONS*********/ 


$('#simple-alert').click(function(ev) {

    $.msgbox("jQuery is a fast and concise JavaScript Library that simplifies HTML document traversing, event handling, animating, and Ajax interactions for rapid web development.", {type: "info"});

});




$('#attention-alert').click(function(ev) {

   $.msgbox("The selection includes process white objects. Overprinting such objects is only useful in combination with transparency effects.");

});




$('#error').click(function(ev) {

    $.msgbox("An error 1053 ocurred while perfoming this service operation on the MySql Server service.", {type: "error"});

});


$('#confirm').click(function(ev) {

   $.msgbox("Are you sure that you want to permanently delete the selected element?", {
	type: "confirm",
    
	buttons : [
        {type: "submit", value: "Yes"},{type: "submit", value: "No"},
		{type: "cancel", value: "Cancel"}]},
	
	function(result) { $("#result2").text(result); });

});




$('#simple_forms').click(function(ev) {

  $.msgbox("<p>In order to process your request you must provide the following:</p>", {
    type    : "prompt",
    name    : "lock",
    inputs  : [
      {type: "text",     name: "username", value: "", label: "Username:", required: true},
      {type: "password", name: "password", value: "", label: "Password:", required: true}
    ],
    buttons : [
      {type: "submit", name: "submit", value: "Sign In"},
      {type: "cancel", value: "Cancel"}
    ],
    form : {
      active: true,
      method: 'post',
      action: 'login.php'
    }
  });
  
  ev.preventDefault();

});



$("#form_with_confirm").click(function() {
									   
  $.msgbox("<p>In order to process your request you must provide the following:</p>", {
    type    : "prompt",
    inputs  : [
      {type: "text",     label: "Insert your Name:", value: "", required: true},
      {type: "password", label: "Insert your Password:", value: "", required: true}
    ],
    buttons : [
      {type: "submit", value: "OK"},
      {type: "cancel", value: "Exit"}
    ]
  }, function(name, password) {
    if (name) {
      $.msgbox("Hello <strong>"+name+"</strong>, your password is <strong>"+password+"</strong>.", {type: "info"});
    } else {
      $.msgbox("Bye!", {type: "info"});
    }
  });
  
});



/*Stiky Notes*/

$( '.stiky-auto-hide' ).click( function () 
	{
	 var notice = '<div class="notice">'
	  + '<div class="notice-body">' 
	  + '<img src="images/info2.png" alt="" />'
	  + '<h3>Auto Hide Stiky Note</h3>'
	  + '<p>This Message will disappear after few seconds</p>'
	  + '</div>'
	  + '<div class="notice-bottom">'
	  + '</div>'
	  + '</div>';
							  
	  $( notice ).purr(
	   {
		 usingTransparentPNG: true
	   }
	   );
						
		return false;
		}
		);
 
 
 
				
$( '.stiky-fixed' ).click( function () 
	{
	  var notice = '<div class="notice">'
	  + '<div class="notice-body">' 
	  + '<img src="images/info2.png" alt="" />'
	  + '<h3>"Sticky" Purr Example</h3>'
	  + '<p>akshay is good boy</p>'
	  + '</div>'
	  + '<div class="notice-bottom">'
	  + '</div>'
	  + '</div>';
							  
	  $( notice ).purr(
	      {
		    usingTransparentPNG: true,
		    isSticky: true
		  }
		);
						
		return false;
	}
	);







$('.basic-modal').click(function (e) {
		$('#basic-modal-content').modal();
		return false;
	});


$('.scrolling-modal').click(function (e) {
		$('#basic-modal-content2').modal();
		return false;
	});










/**********GRAPH*********/  
/**********GRAPH*********/

      $('#bar1')
        .css({"height":100});	
	  $('#bar2')
	     .css({"height":40}); //GRAPH ROW NUMBER : 1
		
	  $('#bar3')
        .css({"height":130});
	  $('#bar4')
	     .css({"height":80});//GRAPH ROW NUMBER : 2
		 
      $('#bar5')
        .css({"height":115})
	  $('#bar6')
	     .css({"height":30})//GRAPH ROW NUMBER : 3
		 
	  $('#bar7')
        .css({"height":80});
	  $('#bar8')
	     .css({"height":60});//GRAPH ROW NUMBER : 4
		 
	  $('#bar9')
        .css({"height":115});
	  $('#bar10')
	     .css({"height":80});//GRAPH ROW NUMBER : 5
		 
	   $('#bar11')
        .css({"height":90});
	  $('#bar12')
	     .css({"height":45});//GRAPH ROW NUMBER : 6 
		 
	  $('#bar13')
        .css({"height":140});
	  $('#bar14')
	     .css({"height":80});//GRAPH ROW NUMBER : 7
		 
	  $('#bar15')
        .css({"height":100});
	  $('#bar16')
	     .css({"height":50});//GRAPH ROW NUMBER : 7

	//Graph Ends Here
	
	
	
	
	
	
	
	
/**********PROCESSING BARS*********/  
/**********PROCESSING BARS*********/
	
	  $('#p-bar1')
        .css({"width":150});
	  $('#p-bar2')
	     .css({"width":100});
	  $('#p-bar3')
	     .css({"width":250});












/**********TABS MENU*********/  
/**********TABS MENU*********/
	
	  $(".tabs_links ul li:first").addClass("active").show(); //Activate first tab
	  $(".tab_content").hide(); //Hide all content
	  $(".tab_content:first").show(); //Show first tab content
	  //On Click Event
	  $(".tabs_links ul li").click(function() {
		  $(".tabs_links ul li").removeClass("active"); //Remove any "active" class
		  $(this).addClass("active"); //Add "active" class to selected tab
		  $(".tab_content").hide(); //Hide all tab content
		  var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active content
	  	  return false;
	  });
	  
	  
	  
	  /*Horizontal Tabs*/
	  
	  $(".horizontal-tabs ul li:first").addClass("active").show(); //Activate first tab
	  $(".horizontal-tab-content").hide(); //Hide all content
	  $(".horizontal-tab-content:first").show(); //Show first tab content
	  //On Click Event
	  $(".horizontal-tabs ul li").click(function() {
		  $(".horizontal-tabs ul li").removeClass("active"); //Remove any "active" class
		  $(this).addClass("active"); //Add "active" class to selected tab
		  $(".horizontal-tab-content").hide(); //Hide all tab content
		  var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active content
	  	  return false;
	  });
	  
	  
	  /*Vertical Tabs*/
	  
	  $(".vertical-tabs ul li:first").addClass("active").show(); //Activate first tab
	  $(".vertical-tab-content").hide(); //Hide all content
	  $(".vertical-tab-content:first").show(); //Show first tab content
	  //On Click Event
	  $(".vertical-tabs ul li").click(function() {
		  $(".vertical-tabs ul li").removeClass("active"); //Remove any "active" class
		  $(this).addClass("active"); //Add "active" class to selected tab
		  $(".vertical-tab-content").hide(); //Hide all tab content
		  var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
		  $(activeTab).fadeIn(); //Fade in the active content
	  	  return false;
	  });





	
/**********SIDEBAR ACCORDION MENU*********/  
/**********SIDEBAR ACCORDION MENU*********/ 

		$("#main-nav li ul").hide(); // Hide all sub menus
		$("#main-nav li a.current").parent().find("ul").slideToggle("slow"); // Slide down the current menu item's sub menu
		
		$("#main-nav li a.nav-top-item").click( // When a top menu item is clicked...
			function () {
				//$(this).parent().siblings().find("ul").slideUp("normal"); // Slide up all sub menus except the one clicked
				$(this).next().slideToggle("normal"); // Slide down the clicked sub menu
				return false;
			}
		);
		
		$("#main-nav li a.no-submenu").click( 
			function () {
				window.location.href=(this.href); // Just open the link instead of a sub menu
				return false;
			}
		);
		
		

    // Sidebar Accordion Menu Hover Effect:
		
		$("#main-nav li .nav-top-item").hover(
			function () {
				$(this).stop().animate({ paddingLeft: "25px" }, 200);
			}, 
			function () {
				$(this).stop().animate({ paddingLeft: "15px" });
			}
		);
		
		
		
		
		
		
		
/**********Minimize Content Box*********/ 
/**********Minimize Content Box*********/ 

		
		$(".content-box-header h3").css({ "cursor":"s-resize" }); // Give the h3 in Content Box Header a different cursor
		$(".closed-box .content-box-content").hide(); // Hide the content of the header if it has the class "closed"
		$(".closed-box .content-box-tabs").hide(); // Hide the tabs in the header if it has the class "closed"
		
		$(".content-box-header h3").click( // When the h3 is clicked...
			function () {
			  $(this).parent().next().toggle(); // Toggle the Content Box
			  $(this).parent().parent().toggleClass("closed-box"); // Toggle the class "closed-box" on the content box
			  $(this).parent().find(".content-box-tabs").toggle(); // Toggle the tabs
			}
		);

    // Content box tabs:
		
		$('.content-box .content-box-content div.tab-content').hide(); // Hide the content divs
		$('ul.content-box-tabs li a.default-tab').addClass('current'); // Add the class "current" to the default tab
		$('.content-box-content div.default-tab').show(); // Show the div with class "default-tab"
		
		$('.content-box ul.content-box-tabs li a').click( // When a tab is clicked...
			function() { 
				$(this).parent().siblings().find("a").removeClass('current'); // Remove "current" class from all tabs
				$(this).addClass('current'); // Add class "current" to clicked tab
				var currentTab = $(this).attr('href'); // Set variable "currentTab" to the value of href of clicked tab
				$(currentTab).siblings().hide(); // Hide all content divs
				$(currentTab).show(); // Show the content div with the id equal to the id of clicked tab
				return false; 
			}
		);
		
		
		
		

    //Close button:
		
		$(".close").click(
			function () {
				$(this).parent().fadeTo(400, 0, function () { // Links with the class "close" will close parent
					$(this).slideUp(400);
				});
				return false;
			}
		);
		
		$(".close_2").click(
			function () {
				$(this).parent().parent().fadeTo(400, 0, function () { // Links with the class "close" will close parent
					$(this).slideUp(400);
				});
				return false;
			}
		);
		

    // Alternating table rows:
		
		$('tbody tr:even').addClass("alt-row"); // Add class "alt-row" to even table rows
		
		

    // Check all checkboxes when the one in a table head is checked:
		$('.check-all').click(
			function(){
				$(this).parent().parent().parent().parent().find("input[type='checkbox']").attr('checked', $(this).is(':checked'));   
			}
		);
		
		
		
	$('#datepicker_1' ).hover(
		function(){
			$(this).datepicker({ altField: "#alternate",altFormat: "DD, d MM, yy" }) 
		}
	);	
   
   
   
   // Fancybox
	$('a.modal').hover(
		function(){
			$(this).fancybox({
		                      'overlayOpacity':	0.7,
		                      'overlayColor'	:	'#000',
		                      'padding'		:	0
	                        });
        }
	);
	
	
	// Image hover actions menu
	$('ul.imglist li').hover(
		function() { $(this).find('ul').css('display', 'none').stop(true, true).fadeIn('fast').css('display', 'block'); },
		function() { $(this).find('ul').stop(true, true).fadeOut(100); }
	);
	
		
	// Image delete confirmation
	$('ul.imglist .delete a').click(function() {
		if (confirm('Are you sure you want to delete this image?')) {
		
			// Make AJAX call to delete
						
			$(this).parents('li').fadeOut('slow', function() {
				$(this).remove();
			});
		}
		return false;
	});
   







/**********INPUT MASK*********/  
/**********INPUT MASK*********/

      $('#date').click(function(){$(this).mask("99/99/9999"); });    /******$("#date").mask("99/99/9999",{placeholder:" "} );***this is code you can use for place holder**/
	  
      $('#phone').click(function(){$(this).mask("(999) 999-9999"); });
	  
	  $('#phone-ext').click(function(){$(this).mask("(999) 999-9999? x99999"); });
	  
      $('#tin').click(function(){$(this).mask("99-9999999"); });
	  
      $('#ssn').click(function(){$(this).mask("999-99-9999"); });
	  
	  $('#product-key').click(function(){$(this).mask("a*-999-a999"); });
	  
	  $('#eye-script').click(function(){$(this).mask("~9.99 ~9.99 999"); });
	  

      
	  
	  



     
/**********FILE EXPLORER*********/  
/**********FILE EXPLORER*********/

	 $().ready(function() {
			
			var f = $('#finder').elfinder({
				url : 'connectors/php/connector.php',
				lang : 'en',
				docked : true

				// dialog : {
				// 	title : 'File manager',
				// 	height : 500
				// }

				// Callback example
				//editorCallback : function(url) {
				//	if (window.console && window.console.log) {
				//		window.console.log(url);
				//	} else {
				//		alert(url);
				//	}
				//},
				//closeOnEditorCallback : true
			})
			// window.console.log(f)
			$('#close,#open,#dock,#undock').click(function() {
				$('#finder').elfinder($(this).attr('id'));
			})
			
		})
	 
	 
	 
	 




	 

/**********UI SLIDER*********/  
/**********UI SLIDER*********/

     $( "#slider-vertical-1" ).slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 60,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-1" ).slider( "value" ) );



     $( "#slider-vertical-2" ).slider({
			orientation: "vertical",
			range: "max",
			min: 0,
			max: 100,
			value: 25,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-2" ).slider( "value" ) );


    $( "#slider-vertical-3" ).slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 55,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-3" ).slider( "value" ) );


   $( "#slider-vertical-4" ).slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 82,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-4" ).slider( "value" ) );


   $( "#slider-vertical-5" ).slider({
			orientation: "vertical",
			range: "max",
			min: 0,
			max: 100,
			value: 45,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-5" ).slider( "value" ) );


   $( "#slider-vertical-6" ).slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 17,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-6" ).slider( "value" ) );


   $( "#slider-vertical-7" ).slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 46,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-7" ).slider( "value" ) );


   $( "#slider-vertical-8" ).slider({
			orientation: "vertical",
			range: "max",
			min: 0,
			max: 100,
			value: 53,
			slide: function( event, ui ) {
				$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-vertical-8" ).slider( "value" ) );









     $( "#slider-horizontal-1" ).slider({
			  range: "min",
			  value: 60,
			  min: 1,
			  max: 100,
			  slide: function( event, ui ) {
			  	$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-horizontal-1" ).slider( "value" ) );


   

     $( "#slider-range1" ).slider({
			  range: true,
			min: 0,
			max: 500,
			values: [ 75, 300 ],
			slide: function( event, ui ) {
				$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-horizontal-2" ).slider( "value" ) );


     
    $( "#slider-horizontal-2" ).slider({
			  range: "min",
			  value: 20,
			  min: 1,
			  max: 100,
			  slide: function( event, ui ) {
			  	$( "#amount" ).val( "%" + ui.value );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-horizontal-3" ).slider( "value" ) );



   $( "#slider-range2" ).slider({
			  range: true,
			min: 0,
			max: 500,
			values: [ 20, 400 ],
			slide: function( event, ui ) {
				$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			  }
		  });
	    	$( "#amount" ).val( "%" + $( "#slider-horizontal-4" ).slider( "value" ) );








    /*
 ### jQuery Google Maps Plugin v1.01 ###
 * Home: http://www.mayzes.org/googlemaps.jquery.html
 * Code: http://www.mayzes.org/js/jquery.googlemaps1.01.js
 * Date: 2010-01-14 (Thursday, 14 Jan 2010)
 * 
 * Dual licensed under the MIT and GPL licenses.
 *   http://www.gnu.org/licenses/gpl.html
 *   http://www.opensource.org/licenses/mit-license.php
 ###
*/
jQuery.fn.googleMaps = function(options) {

	if (!window.GBrowserIsCompatible || !GBrowserIsCompatible())  {
	   return this;
	}
	

	// Fill default values where not set by instantiation code
	var opts = $.extend({}, $.googleMaps.defaults, options);
	
	//$.fn.googleMaps.includeGoogle(opts.key, opts.sensor);
	return this.each(function() {
		// Create Map
		$.googleMaps.gMap = new GMap2(this, opts);
		$.googleMaps.mapsConfiguration(opts);
	});
};

$.googleMaps = {
	mapsConfiguration: function(opts) {
		// GEOCODE
		if ( opts.geocode ) {
			geocoder = new GClientGeocoder();
			geocoder.getLatLng(opts.geocode, function(center) {
				if (!center) {
					alert(address + " not found");
				}
				else {
    	      		$.googleMaps.gMap.setCenter(center, opts.depth);
					$.googleMaps.latitude = center.x;
					$.googleMaps.longitude = center.y;
				}
      		});
		}
		else {
			// Latitude & Longitude Center Point
			var center 	= $.googleMaps.mapLatLong(opts.latitude, opts.longitude);
			// Set the center of the Map with the new Center Point and Depth
			$.googleMaps.gMap.setCenter(center, opts.depth);
		}
		
		// POLYLINE
		if ( opts.polyline )
			// Draw a PolyLine on the Map
			$.googleMaps.gMap.addOverlay($.googleMaps.mapPolyLine(opts.polyline));
		// GEODESIC 
		if ( opts.geodesic ) {
			$.googleMaps.mapGeoDesic(opts.geodesic);
		}
		// PAN
		if ( opts.pan ) {
			// Set Default Options
			opts.pan = $.googleMaps.mapPanOptions(opts.pan);
			// Pan the Map
			window.setTimeout(function() {
				$.googleMaps.gMap.panTo($.googleMaps.mapLatLong(opts.pan.panLatitude, opts.pan.panLongitude));
			}, opts.pan.timeout);
		}
		
		// LAYER
		if ( opts.layer )
			// Set the Custom Layer
			$.googleMaps.gMap.addOverlay(new GLayer(opts.layer));
		
		// MARKERS
		if ( opts.markers )
			$.googleMaps.mapMarkers(center, opts.markers);

		// CONTROLS
		if ( opts.controls.type || opts.controls.zoom ||  opts.controls.mapType ) {
			$.googleMaps.mapControls(opts.controls);
		}
		else {
			if ( !opts.controls.hide ) 
				$.googleMaps.gMap.setUIToDefault();
		}
		
		// SCROLL
		if ( opts.scroll ) 
			$.googleMaps.gMap.enableScrollWheelZoom();
		else if ( !opts.scroll )
			$.googleMaps.gMap.disableScrollWheelZoom();
		
		// LOCAL SEARCH
		if ( opts.controls.localSearch )
			$.googleMaps.gMap.enableGoogleBar();
		else 
			$.googleMaps.gMap.disableGoogleBar();

		// FEED (RSS/KML)
		if ( opts.feed ) 
			$.googleMaps.gMap.addOverlay(new GGeoXml(opts.feed));
		
		// TRAFFIC INFO
		if ( opts.trafficInfo ) {
			var trafficOptions = {incidents:true};
			trafficInfo = new GTrafficOverlay(trafficOptions);
			$.googleMaps.gMap.addOverlay(trafficInfo);	
		}
		
		// DIRECTIONS
		if ( opts.directions ) {
			$.googleMaps.directions = new GDirections($.googleMaps.gMap, opts.directions.panel);
  			$.googleMaps.directions.load(opts.directions.route);
		}
		
		if ( opts.streetViewOverlay ) {
			svOverlay = new GStreetviewOverlay();
    		$.googleMaps.gMap.addOverlay(svOverlay);	
		}
	},
	mapGeoDesic: function(options) {
		// Default GeoDesic Options
		geoDesicDefaults = {
			startLatitude: 	37.4419,
			startLongitude: -122.1419,
			endLatitude:	37.4519,
			endLongitude:	-122.1519,
			color: 			'#ff0000',
			pixels: 		2,
			opacity: 		10
		}
		// Merge the User & Default Options
		options = $.extend({}, geoDesicDefaults, options);
		var polyOptions = {geodesic:true};
		var polyline = new GPolyline([ 
			new GLatLng(options.startLatitude, options.startLongitude),
			new GLatLng(options.endLatitude, options.endLongitude)], 
			options.color, options.pixels, options.opacity, polyOptions
		);
		$.googleMaps.gMap.addOverlay(polyline);
	},
	localSearchControl: function(options) {
		var controlLocation = $.googleMaps.mapControlsLocation(options.location);
		$.googleMaps.gMap.addControl(new $.googleMaps.gMap.LocalSearch(), new GControlPosition(controlLocation, new GSize(options.x,options.y)));
	},
	getLatitude: function() {
		return $.googleMaps.latitude;
	},
	getLongitude: function() {
		return $.googleMaps.longitude;
	},
	directions: {},
	latitude: '',
	longitude: '',
	latlong: {},
	maps: {},
	marker: {},
	gMap: {},
	defaults: {
	// Default Map Options
		latitude: 	37.4419,
		longitude: 	-122.1419,
		depth: 		13,
		scroll: 	true,
		trafficInfo: false,
		streetViewOverlay: false,
		controls: {
			hide: false,
			localSearch: false
		},
		layer:		null
	},
	mapPolyLine: function(options) {
		// Default PolyLine Options
		polylineDefaults = {
			startLatitude: 	37.4419,
			startLongitude: -122.1419,
			endLatitude:	37.4519,
			endLongitude:	-122.1519,
			color: 			'#ff0000',
			pixels: 		2
		}
		// Merge the User & Default Options
		options = $.extend({}, polylineDefaults, options);
		//Return the New Polyline
		return new GPolyline([
			$.googleMaps.mapLatLong(options.startLatitude, options.startLongitude),
			$.googleMaps.mapLatLong(options.endLatitude, options.endLongitude)], 
			options.color, 
			options.pixels
		);
	},
	mapLatLong: function(latitude, longitude) {
		// Returns Latitude & Longitude Center Point
		return new GLatLng(latitude, longitude);
	},
	mapPanOptions: function(options) {
		// Returns Panning Options
		var panDefaults = {
			panLatitude:	37.4569, 	
			panLongitude:	-122.1569,
			timeout: 		0
		}
		return options = $.extend({}, panDefaults, options);
	},
	mapMarkersOptions: function(icon) {
		//Define an icon
		var gIcon = new GIcon(G_DEFAULT_ICON);	
		if ( icon.image ) 
			// Define Icons Image
			gIcon.image = icon.image;
		if ( icon.shadow )
			// Define Icons Shadow
			gIcon.shadow = icon.shadow;
		if ( icon.iconSize )
			// Define Icons Size
			gIcon.iconSize = new GSize(icon.iconSize);
		if ( icon.shadowSize )
			// Define Icons Shadow Size
			gIcon.shadowSize = new GSize(icon.shadowSize);
		if ( icon.iconAnchor )
			// Define Icons Anchor
			gIcon.iconAnchor = new GPoint(icon.iconAnchor);
		if ( icon.infoWindowAnchor )
			// Define Icons Info Window Anchor
			gIcon.infoWindowAnchor = new GPoint(icon.infoWindowAnchor);
		if ( icon.dragCrossImage ) 
			// Define Drag Cross Icon Image
			gIcon.dragCrossImage = icon.dragCrossImage;
		if ( icon.dragCrossSize )
			// Define Drag Cross Icon Size
			gIcon.dragCrossSize = new GSize(icon.dragCrossSize);
		if ( icon.dragCrossAnchor )
			// Define Drag Cross Icon Anchor
			gIcon.dragCrossAnchor = new GPoint(icon.dragCrossAnchor);
		if ( icon.maxHeight )
			// Define Icons Max Height
			gIcon.maxHeight = icon.maxHeight;
		if ( icon.PrintImage )
			// Define Print Image
			gIcon.PrintImage = icon.PrintImage;
		if ( icon.mozPrintImage )
			// Define Moz Print Image
			gIcon.mozPrintImage = icon.mozPrintImage;
		if ( icon.PrintShadow )
			// Define Print Shadow
			gIcon.PrintShadow = icon.PrintShadow;
		if ( icon.transparent )
			// Define Transparent
			gIcon.transparent = icon.transparent;
		return gIcon;
	},
	mapMarkers: function(center, markers) {
        if ( typeof(markers.length) == 'undefined' )
        	// One marker only. Parse it into an array for consistency.
            markers = [markers];
		
		var j = 0;
		for ( i = 0; i<markers.length; i++) {
			var gIcon = null;
			if ( markers[i].icon ) {
				gIcon = $.googleMaps.mapMarkersOptions(markers[i].icon);
			}
			
			if ( markers[i].geocode ) {
				var geocoder = new GClientGeocoder();
				geocoder.getLatLng(markers[i].geocode, function(center) {										
					if (!center) 
						alert(address + " not found");
					else 
						$.googleMaps.marker[i] = new GMarker(center, {draggable: markers[i].draggable, icon: gIcon});
				});
			}
			else if ( markers[i].latitude && markers[i].longitude ) {
				// Latitude & Longitude Center Point
				center = $.googleMaps.mapLatLong(markers[i].latitude, markers[i].longitude);
				$.googleMaps.marker[i] = new GMarker(center, {draggable: markers[i].draggable, icon: gIcon});
			}
			$.googleMaps.gMap.addOverlay($.googleMaps.marker[i]);
			if ( markers[i].info ) {
				// Hide Div Layer With Info Window HTML
				$(markers[i].info.layer).hide();
				// Marker Div Layer Exists
				if ( markers[i].info.popup )
					// Map Marker Shows an Info Box on Load
					$.googleMaps.marker[i].openInfoWindowHtml($(markers[i].info.layer).html());
				else
					$.googleMaps.marker[i].bindInfoWindowHtml( $(markers[i].info.layer).html().toString() );
			}
		}
	},
	mapControlsLocation: function(location) {
		switch (location) {
			case 'G_ANCHOR_TOP_RIGHT' :
				return G_ANCHOR_TOP_RIGHT;
			break;
			case 'G_ANCHOR_BOTTOM_RIGHT' :
				return G_ANCHOR_BOTTOM_RIGHT;
			break;
			case 'G_ANCHOR_TOP_LEFT' :
				return G_ANCHOR_TOP_LEFT;
			break;
			case 'G_ANCHOR_BOTTOM_LEFT' :
				return G_ANCHOR_BOTTOM_LEFT;
			break;
		}
		return;
	},
	mapControl: function(control) {
		switch (control) {
			case 'GLargeMapControl3D' :
				return new GLargeMapControl3D();
			break;
			case 'GLargeMapControl' :
				return new GLargeMapControl();
			break;
			case 'GSmallMapControl' :
				return new GSmallMapControl();
			break;
			case 'GSmallZoomControl3D' :
				return new GSmallZoomControl3D();
			break;
			case 'GSmallZoomControl' :
				return new GSmallZoomControl();
			break;
			case 'GScaleControl' :
				return new GScaleControl();
			break;
			case 'GMapTypeControl' :
				return new GMapTypeControl();
			break;
			case 'GHierarchicalMapTypeControl' :
				return new GHierarchicalMapTypeControl();
			break;
			case 'GOverviewMapControl' :
				return new GOverviewMapControl();
			break;
			case 'GNavLabelControl' :
				return new GNavLabelControl();
			break;
		}
		return;
	},
	mapTypeControl: function(type) {
		switch ( type ) {
			case 'G_NORMAL_MAP' :
				return G_NORMAL_MAP;
			break;
			case 'G_SATELLITE_MAP' :
				return G_SATELLITE_MAP;
			break;
			case 'G_HYBRID_MAP' :
				return G_HYBRID_MAP;
			break;
		}
		return;
	},
	mapControls: function(options) {
		// Default Controls Options
		controlsDefaults = {
			type: {
				location: 'G_ANCHOR_TOP_RIGHT',
				x: 10,
				y: 10,
				control: 'GMapTypeControl'
			},
			zoom: {
				location: 'G_ANCHOR_TOP_LEFT',
				x: 10,
				y: 10,
				control: 'GLargeMapControl3D'
			}
		};
		// Merge the User & Default Options
		options = $.extend({}, controlsDefaults, options);
		options.type = $.extend({}, controlsDefaults.type, options.type);
		options.zoom = $.extend({}, controlsDefaults.zoom, options.zoom);
		
		if ( options.type ) {
			var controlLocation = $.googleMaps.mapControlsLocation(options.type.location);
			var controlPosition = new GControlPosition(controlLocation, new GSize(options.type.x, options.type.y));
			$.googleMaps.gMap.addControl($.googleMaps.mapControl(options.type.control), controlPosition);
		}
		if ( options.zoom ) {
			var controlLocation = $.googleMaps.mapControlsLocation(options.zoom.location);
			var controlPosition = new GControlPosition(controlLocation, new GSize(options.zoom.x, options.zoom.y))
			$.googleMaps.gMap.addControl($.googleMaps.mapControl(options.zoom.control), controlPosition);
		}
		if ( options.mapType ) {
			if ( options.mapType.length >= 1 ) {
				for ( i = 0; i<options.mapType.length; i++) {
					if ( options.mapType[i].remove )
						$.googleMaps.gMap.removeMapType($.googleMaps.mapTypeControl(options.mapType[i].remove));
					if ( options.mapType[i].add )
						$.googleMaps.gMap.addMapType($.googleMaps.mapTypeControl(options.mapType[i].add));
				}
			} 
			else {
				if ( options.mapType.add )
					$.googleMaps.gMap.addMapType($.googleMaps.mapTypeControl(options.mapType.add));
				if ( options.mapType.remove )
					$.googleMaps.gMap.removeMapType($.googleMaps.mapTypeControl(options.mapType.remove));
			}
		}
	},
	geoCode: function(options) {
		geocoder = new GClientGeocoder();
		
		geocoder.getLatLng(options.address, function(point) {
			if (!point)
				alert(address + " not found");
			else
          		$.googleMaps.gMap.setCenter(point, options.depth);
      	});
	}
};


	
	/*Define #ID*/
	$('#basic-canvas').googleMaps();
	
	
	 $('#multi-marker-canvas').googleMaps({
        markers: [{
            latitude: 	37.4416,
            longitude: -122.1516
        },{
            latitude: 	37.4516,
            longitude: -122.1616
        },{
            latitude: 	37.4566,
            longitude: -122.1666
        }]
    });
    
    $('#street-canvas').googleMaps({
	    streetViewOverlay: true
    }); 
    
    $('#traffic-canvas').googleMaps({
		   trafficInfo: true
	 });
	 
	 $('#search-canvas').googleMaps({
	    controls: {
			localSearch: true
		}
    }); 
    
    $('#info-canvas').googleMaps({
        markers: {
            latitude: 	37.4416,
            longitude: -122.1516,
            info: {
                layer: '#address',
                popup: true
            }
        }
    }); 
    
    $('#layer-canvas').googleMaps({
        layer: 'org.wikipedia.en'
    });














 
 
 
}); /*.ready ends*/







/**********RIGHT MENU FIXED*********/  
/**********RIGHT MENU FIXED*********/
$(window).load(function()
    {
        var scroller = new StickyScroller("#scrollbox",
        {
            start: 207,
            end: 100000,
            interval: 300,
            range: 100,
            margin: 17
        });
                
        var opacity = .25;
        var fadeTime = 300;
        var current;
                
        //Apply opacity to all but first item.
        $(".block").slice(1).css('opacity', opacity);

        scroller.onScroll(function(index)
        {                        
            if(scroller.inRange())
            {
                $(".block").eq(index).stop(true).animate({"opacity": 1}, fadeTime);
                if(!(
                (index === 0 || index === scroller.lastIndex()) &&
                (scroller.getOldIndex() === 0 || scroller.getOldIndex() === scroller.lastIndex())
                    ))
                {
                    $(".block").eq(scroller.getOldIndex()).stop(true).animate({"opacity": opacity}, fadeTime);
                }
            }
        });
        

});

