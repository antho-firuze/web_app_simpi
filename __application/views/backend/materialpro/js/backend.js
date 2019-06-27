/*
Description: This is script for authenticating AyoAvram Web Application
Author: Ahmad hertanto
Email: antho.firuze@gmail.com
File: js
*/
$(function () {
	"use strict";
	/**
	* Serialize Form data
	*
	* @param String type 			Output type of data 'json' or 'object'
	* @returns json/object
	*/
	$.fn.serialize = function (type) {
		if (typeof (type) == 'undefined') type = 'object';
		type = type.toLowerCase();

		var o = {};
		// Exclude Select Element
		var a = this.find('[name]').not('select').serializeArray();
		var dom = $(this);
		$.each(a, function (i, v) {
			var value_before = dom.find('[name="' + v.name + '"]').data('before');
			// console.log(dom.find('[name="'+v.name+'"]').data('before'));

			v.value = (v.value == 'on') ? '1' : v.value;
			if ($.trim(v.value) != $.trim(value_before))
				o[v.name] = o[v.name] ? o[v.name] || v.value : v.value;
		});

		// Only Select Element
		var a = this.find('select').serializeArray();
		$.each(a, function (i, v) {
			var value_before = dom.find('[name="' + v.name + '"]').data('before');

			if (o[v.name]) {
				o[v.name] += ',' + v.value;
			} else {
				if ($.trim(v.value) != $.trim(value_before)) {
					// console.log($.trim(v.value));
					// console.log($.trim(value_before));
					o[v.name] = v.value;
				}
			}
		});
		return (type == 'json') ? JSON.stringify(o) : o;
	};
	/**
	 * Populate Form <form> tag with value (object)
	 * & Additional states
	 * 
	 * @param json/object o
	 */
	$.fn.populate = function (o) {
		var dom = $(this);
		$.each(o, function (i) {
			var el = dom.find('[name="' + i + '"]');
			if (el.length > 0) {
				if (el.hasClass('date')) {
					// console.log(o[i]);
					if (o[i])
						el.data('before', moment(o[i], 'YYYY-MM-DD').format('DD-MM-YYYY')).val(moment(o[i], 'YYYY-MM-DD').format('DD-MM-YYYY'));
				} else if (el.hasClass('selection')) {
					el.data('before', o[i]).val(o[i]);
				} else {
					el.data('before', o[i]).val(o[i]);
				}
			}
		});
		// Additional states
		$.each(dom.find('input'), function (i, el) {
			var el = $(el);
			if (el.attr('required')) {
				if (el.parent().find('label').length > 0) {
					if (el.parent().find('label span').length < 1) {
						el.parent().find('label').append($('<span style="color:red" />').html(' *'));
					}
				}
			}
		});
		$.each(dom.find('select'), function (i, el) {
			var el = $(el);
			if (el.attr('required')) {
				if (el.parent().find('label').length > 0) {
					if (el.parent().find('label span').length < 1) {
						el.parent().find('label').append($('<span style="color:red" />').html(' *'));
					}
				}
			}
		});
	};
	/**
	 * Populate Selection <select> tag 
	 */
	$.fn.populateSelection = function () {
		var dom = $(this);
		/**
		 * Init Select or Combobox Ajax
		 */
		$.each(dom.find('select.selection'), function (i) {
			// console.log($(this).data('method'));
			var el = $(this);
			var is_autoload = (typeof (el.data('autoload')) == 'undefined') || el.data('autoload') == true ? true : false;
			var method = el.data('method');
			var key = el.data('key');
			var val = el.data('val');
			if (!method || !key || !val)
				return true;
		
			var o;
			if (o = JSON.parse(db_get(method))) {
				if (! is_autoload)
					return false;

				PopulateSelectionDom(el, o);
				return true;
			}

			var token = JSON.parse(db_get('session')).token;
			var data_request = JSON.stringify({
				"id":Math.floor(Math.random()*1000)+1,
				"agent":"web","method":method,"token":token,"lang":lang,"params":{}
			});
			$.ajax({ data:data_request, 
				success: function (data) {
					if (data.status) {
						db_store(method, JSON.stringify(data.result));
						if (! is_autoload)
							return false;

						PopulateSelectionDom(el, data.result);
					} else {
						console.log('fun::populateSelection : status=false, method=' + el.data('method') + ', ');
						console.log(data);
					}
				}
			});
		});
	};
	/**
	 * For populating <select> element 
	 * 
	 * @param {*} el 
	 * @param {*} o 
	 */
	function PopulateSelectionDom(el, o) {
		el.html('').append($('<option />').attr('value', '').html(''));
		$.each(o, function (i, v) { el.append($('<option />').attr('value', String(v[el.data('key')])).html(v[el.data('val')])) });
	}
	/**
	 * Count array/object 
	 */
	function count(o){
		if (Array.isArray(o))
			return o.length;
		else 
			return Object.keys(o).length;
	}	
	/**
	 * Check is_empty 
	 * 
	 * @param {*} o Data type Array/Object
	 */
	function is_empty(o) {
		if (o == undefined) return true;

		if (Array.isArray(o)) 
			return (arr.length > 0) ? false : true;
		else
			return (Object.keys(o).length > 0) ? false : true;
	}
	/**
	 * Distinct Array of Paired Object (JSON) base on fields
	 * 
	 * @param {array} o 			Array of Paired Object (JSON)
	 * @param {array} fields 	Array of String
	 */
	function array_distinct(o, fields) {
		var uniq = [];
		$.each(o, function(i, v){
			var tkey = [];
			$.each(fields, function(j, k){ tkey.push(v[k]) });
			
			if (uniq.indexOf(tkey.join('_')) === -1)
					uniq.push(tkey.join('_'));
		});

		var result = [];
		$.each(uniq, function(i, v){
			var row = [];
			$.each(v.split('_'), function(j, k){ row[fields[j]] = k });
			result.push(row);
		});
		return result;
	}
	/**
	 * Filter Paired Object (JSON) Of Array [{"id":1},{"id":1},{"id":1}]
	 * 
	 * @param {array} o							Array of Paired Object (JSON)
	 * @param {string} field 				Name of Field or Key
	 * @param {string} searchTerm 	Value
	 */
	function array_filter(o, field, searchTerm) {
		return $.grep(o, function(i) {	return (i[field] == searchTerm) });
	}
	/**
	* Store a new settings in the browser
	*
	* @param String name Name of the setting
	* @param String val Value of the setting
	* @returns void
	*/
	function db_store(name, val) {
		if (typeof (Storage) !== "undefined") {
			sessionStorage.setItem(name, val);
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}

	/**
	* Get a prestored setting
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function db_get(name) {
		if (typeof (Storage) !== "undefined") {
			return sessionStorage.getItem(name);
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}

	/**
	* Remove a prestored setting
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function db_remove(name) {
		if (typeof (Storage) !== "undefined") {
			if (name)
				return sessionStorage.removeItem(name);
			else
				return sessionStorage.clear();
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}

	/**
	* Generate random GUID
	*
	* 
	* @returns String the value of random guid
	*/
	var newGuid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	// =================================================================================
	// Variable Global
	// =================================================================================
	var uri = URI(location.href);
	var uri_path = URI(uri.origin() + uri.path());
	var lang = URI.parseQuery(uri.query()).lang;
	var state = URI.parseQuery(uri.query()).state;
	var page = URI.parseQuery(uri.query()).page;
	var token;
	var language = $("#shelter_language").text() ? JSON.parse($("#shelter_language").text()) : '';
	var language_sub = $("#shelter_language_sub").text() ? JSON.parse($("#shelter_language_sub").text()) : '';
	var repos_url = db_get('repos_url');

	var appcode = db_get('appcode');
	var jsonrpc_url = db_get('api_url');
	if (uri.host() == 'localhost:8080')
		jsonrpc_url = 'http://localhost:5050';

	/**
	 * Open Database WebDB
	 */
	// var db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);

	/**
	* For Auto Select Left Navbar
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function AutoSelectLeftNavbar() {
		$('ul#sidebarnav li.active').removeClass('active');
		$('ul#sidebarnav a.active').removeClass('active');
		var element = $('ul#sidebarnav a').filter(function () {
			return this.name == page;
		}).addClass('active').parent().addClass('active');
		while (true) {
			if (element.is('li')) {
				element = element.parent().addClass('in').parent().addClass('active');
			}
			else {
				break;
			}
		}
	}
	/**
	 * Set Default Ajax Setting
	 */
	$.ajaxSetup({ url:jsonrpc_url, method:'POST', async:true, dataType:'json' });
	$( document ).ajaxError(function( event, request, settings ) {
		// if (data.status < 500) {
		// 	var message = data.statusText;
		// } else {
		// 	var error = JSON.parse(data.responseText);
		// 	var message = error.message;
		// }
		// console.log("Event: ", event);
		// console.log("Request: ", request);
		// console.log("Settings: ", settings);
		console.log("Error requesting page: ", settings.url);
		console.log("With data: ", settings.data);
	});
	/**
	* GET Ajax Page
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function LoadAjaxPage(curr_page) {
		// var curr_page = this.name;
		// var content_url = URI(uri.origin()+uri.path()+'/getContent').search({"lang":lang, "state":state, "page":curr_page, "token":decodeURI(token)});
		var content_url = URI(uri.origin() + uri.path() + '/getContent').search({ "lang": lang, "state": state, "page": curr_page });
		$.ajax({
			url: content_url, method: "GET", 
			success: function (data) {
				// console.log(data);
				if (data.status) {
					language_sub = data.language;
					$('div.page-titles h3').html(data.title);
					$('div.content').html('').html(data.content);
					/**
					 * Replace Current URL
					 */
					page = curr_page;
					var new_url = uri_path.search({ "lang": lang, "state": state, "page": page });
					// history.pushState({}, '', new_url);
					history.replaceState({}, '', new_url);
					/**
					 * Init
					 */
					Initialization();

				} else {
					console.log('fun::LoadAjaxPage : status=false, ' + data.message);
				}
			}
		});
	}
	/**
	 * Goto Login Page, with first clear localstorage data
	 */
	function LoginPage() {
		db_remove();
		var login_url = uri.path('frontend').search({ "lang": lang, "page": "home" });
		window.location = login_url;
	}

	function checkToken() {
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent": "web","token": token,"lang": lang,"method": "auth.checkToken"
		};
		// console.log(data_request);
		$.ajax({ data: JSON.stringify(data_request),
			success: function (data) {
				// console.log(data);
				if (!data.status) {
					alert(data.message);
					LoginPage();
				}
			}
		});
	}
	/**
	 * WINDOW EVENTS 
	 */
	$(window).on('load', function(){ 
		if (!db_get('session')) {
			if (state !== 'auth')
				LoginPage();
		} 
	});
	$(window).on("resize", function () {
		$(document).find('[id="balance-chart"]').each(function (e) {
			if ($(this).attr('_echarts_instance_'))
				echarts.getInstanceById($(this).attr('_echarts_instance_')).resize();
		});
	});

	/**
	 * Initialization Procedure
	 */
	function Initialization() {
		// // 1. Init Web SQL
		// db.transaction(function (tx) {
		// 	// here be the transaction
		// 	// do SQL magic here using the tx object
		// 	tx.executeSql('CREATE TABLE IF NOT EXISTS client_balance (simpiID, PositionDate, ClientID, AssetTypeCode, PortfolioID, UnitBalance, UnitPrice, CostPrice, UnitValue, CostTotal, PortfolioCode, PortfolioNameFull, PortfolioNameShort, CcyID, Ccy, CcyDescription)');
		// });
		/**
		 * Populate <select> tag
		 */
		$(document).populateSelection();
		
		// Init on Document Ready (after document load)
		$(function () {
			/**
			 * Auto Select Navigation Left Bar
			 */
			AutoSelectLeftNavbar();
			/**
			 * Init Carousel (if exists)
			 */
			$(".carousel").carousel();
			/**
			 * Init Session
			 */
			if (db_get('session')) {
				var session = JSON.parse(db_get('session'));
				token = session.token;
				checkToken();

				var profile_img = $('img.profile-img img');
				var profile_text = $('div.profile-text a.dropdown-toggle.u-dropdown').html(session.user.full_name);
				var profile_pic = $('img.profile-pic');
				var u_img = $('ul#dropdown-user .u-img img');
				var u_text = $('div.u-text h4').html(session.user.full_name);
				var u_text = $('div.u-text p').html(session.user.email);

				if (page == 'dashboard')
					getBalance();
				if (page == 'profile')
					getProfile();
				if (page == 'subscribe')
					getSubscription();
			}
		});
	}
	/**
	 * Autorun Procedure
	 */
	$(function () {	Initialization() });
	// ============================================================== 
	// Navigation Menu
	// ============================================================== 
	$(document).on('click', '[id="menu"]', function (e) {
		e.preventDefault();

		if (this.name == page)
			return false;

		LoadAjaxPage(this.name);
	});
	// ============================================================== 
	// MENU my profile
	// ============================================================== 
	$(document).on('click', '[id="profile"]', function (e) {
		e.preventDefault();

		if (this.id == page)
			return false;

		LoadAjaxPage(this.id);
	});
	// ============================================================== 
	// MENU change password
	// ============================================================== 
	$(document).on('click', '[id="chg_pwd"]', function (e) {
		e.preventDefault();

		if (this.id == page)
			return false;

		LoadAjaxPage(this.id);
	});
	// ============================================================== 
	// MENU logout
	// ============================================================== 
	$(document).on('click', '[id="logout"]', function (e) {
		e.preventDefault();

		if (!confirm(language.conf_logout)) { return false; }

		$.ajax({
			data: JSON.stringify({
				"id": Math.floor(Math.random()*1000)+1,
				"agent":"web","token": token,"lang": lang,"method": "auth.logout","params": {}
			}),
			success: function (data) {
				// console.log(data);
				if (data.status) {
					LoginPage();
				} else {
					alert(data.message);
					if ($.inArray(data.code, ['498', '440']) >= 0)
						LoginPage();
				}
			}
		});
	});
	// ============================================================== 
	// PAGE loginform
	// ============================================================== 
	$(document).on('submit', '#loginform', function (e) {
		e.preventDefault();

		var params = $(this).serialize();
		params.dt = new Date().toISOString().substr(0, 19).replace('T', ' ');
		params.dt_epoc = Math.round((new Date).getTime() / 1000);

		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","appcode":appcode,"lang":lang,"method":"auth.login","params":params
		}; 
		// console.log("a:"+vform); return false;
		// console.log("a:"+JSON.stringify(params)); return false;
		$.ajax({ data: JSON.stringify(data_request),
			beforeSend: function(xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					db_store('session', JSON.stringify(data.result));
					var url_to = uri_path.search({
						"lang": lang,
						"state": "client",
						"page": "dashboard"
					});
					window.location = url_to;
				} else {
					alert(data.message);
				}
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
			},
			error: function (data, status, errThrown) {
				if (data.status >= 500) {
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
			}
		});
	});
	// ============================================================== 
	// PAGE recoverform
	// ============================================================== 
	$(document).on('submit', '#recoverform', function (e) {
		e.preventDefault();

		var params = $(this).serialize();

		// console.log("b:"+JSON.stringify(params)); return false;
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent": "web","appcode": appcode,"lang": lang,"method": "auth.forgot_password_simple", "params": params
		};
		$.ajax({ data: JSON.stringify(data_request),
			beforeSend: function (xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function (data) {
				// console.log(data);
				if (data.status) {
					alert(data.message);
					$("#recoverform").fadeOut();
					$("#loginform").fadeIn();
				} else {
					alert(data.message);
				}
			}
		}).always(function() {
			setTimeout(function () { $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
		});
	});
	// ============================================================== 
	// PAGE registerform
	// ============================================================== 
	$(document).on('submit', '#registerform', function (e) {
		e.preventDefault();

		var params = $(this).serialize();
		if (!params.account)
			if (lang == 'id')
				alert("Silahkan pilih Status Nasabah");
			else
				alert("Please choose Account Status");

		// console.log("c:"+JSON.stringify(params)); return false;
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent": "web","appcode": appcode,"lang": lang,"method": "auth.register", "params": params
		};
		$.ajax({ data: JSON.stringify(data_request),
			beforeSend: function (xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function (data) {
				// console.log(data);
				if (data.status) {
					alert(data.message);
					$("#recoverform").fadeOut();
					$("#loginform").fadeIn();
				} else {
					alert(data.message);
				}
			}
		}).always(function() {
			setTimeout(function () { $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
		});
	});
	// ============================================================== 
	// PAGE change password
	// ============================================================== 
	$(document).on('submit', '#changepasswordform', function (e) {
		e.preventDefault();

		if ($(this).find('[name="new_password"]').val() !== $(this).find('[name="new_password_confirm"]').val()) {
			alert(language_sub.err_new_password_confirm);
			return false;
		}

		var params = $(this).serialize();

		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent": "web","token": token,"lang": lang,"method": "auth.chg_password", "params": params
		};
		$.ajax({ data: JSON.stringify(data_request),
			beforeSend: function (xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function (data) {
				// console.log(data);
				if (data.status) {
					alert(data.message);
					LoadAjaxPage('dashboard');
				} else {
					alert(data.message);
				}
			}
		}).always(function() {
			setTimeout(function () { $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
		});
	});
	// ============================================================== 
	// PAGE Dashboard
	// ============================================================== 
	function getBalance() {
		var o;
		if (o = JSON.parse(db_get('client.balance'))) {
			o = array_distinct(o, ['CcyID','Ccy','CcyDescription']);
			// console.log(o);
			loadCurrency(o);
			return true;
		}

		var data_request = [];
		data_request[0] = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent": "web","token": token,"lang": lang,"method": "client.balance"
		};
		data_request[1] = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent": "web","token": token,"lang": lang,"method": "client.balance_ccy"
		};
		$.ajax({ data: JSON.stringify(data_request),
			success: function (data) {
				// console.log(data);
				$.each(data, function(i, v) {
					if (v.status) {
						db_store(v.method, JSON.stringify(v.result));
						if (v.method == 'client.balance_ccy')
							loadCurrency(v.result);
					}
				});

			}
		});

		// ============================================================== 
		// populate data currency of balance
		// ============================================================== 
		function loadCurrency(o) {
			var dom = $('#ccy').html('');
			$.each(o, function(i, v) {
				if (i == 0)
					populateBalance(v.CcyID);

				dom.append( $('<option />').data('_id', v.CcyID).html(v.CcyDescription) );
			});
			dom
				.selectpicker('render')
				.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
					var CcyID = $(e.target).find('option:selected').data('_id');
					populateBalance(CcyID);
				});
			// db.transaction(function (tx) {
			// 	tx.executeSql('SELECT DISTINCT CcyID, Ccy, CcyDescription FROM client_balance', [], function (tx, results) {
			// 		$.each(results.rows, function (i, v) {
			// 			if (i == 0)
			// 				populateBalance(v.CcyID);

			// 			dom.append($('<option />').data('_id', v.CcyID).html(v.CcyDescription));
			// 		});
			// 		dom
			// 			.selectpicker('render')
			// 			.on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
			// 				var CcyID = $(e.target).find('option:selected').data('_id');
			// 				populateBalance(CcyID);
			// 			});
			// 	});
			// });
		}

		/**
		 * Populate data balance by currency
		 * 
		 * @param {integer} CcyID 
		 */
		function populateBalance(CcyID) {
			var data_legend = [], data_chart = [], sumPercent = 0, totalValue = 0, totalCost = 0, o;
			
			o = JSON.parse(db_get('client.balance'));
			var o = array_filter(o, 'CcyID', CcyID);
			$.each(o, function (i, v) {
				totalValue = totalValue + parseFloat(v.UnitValue);
				totalCost = totalCost + parseFloat(v.CostTotal);
			});

			$("#investVal").html(accounting.formatMoney(totalValue, '', 2, ".", ","));
			$("#investCost").html(accounting.formatMoney(totalCost, '', 2, ".", ","));
			$("#profitLost").html(accounting.formatMoney(totalValue - totalCost, '', 2, ".", ","));

			loadBalanceChart(o);
			loadListItem(o);

			// db.transaction(function (tx) {
			// 	tx.executeSql("SELECT * FROM client_balance WHERE CcyID = '" + CcyID + "'", [], function (tx, results) {
			// 		o = results.rows;

			// 		$.each(o, function (i, v) {
			// 			totalValue = totalValue + parseFloat(v.UnitValue);
			// 			totalCost = totalCost + parseFloat(v.CostTotal);
			// 		});

			// 		$("#investVal").html(accounting.formatMoney(totalValue, '', 2, ".", ","));
			// 		$("#investCost").html(accounting.formatMoney(totalCost, '', 2, ".", ","));
			// 		$("#profitLost").html(accounting.formatMoney(totalValue - totalCost, '', 2, ".", ","));

			// 		loadBalanceChart(o);
			// 		loadListItem(o);
			// 	});
			// });

			/**
			 * Populate data balance chart
			 * 
			 * @param {Array} o 
			 */
			function loadBalanceChart(o) {
				var data_legend = [], data_chart = [], sumPercent = 0, totalValue = 0;
				$.each(o, function (i, v) {
					totalValue = totalValue + parseFloat(v.UnitValue);
				});
				$.each(o, function (i, v) {
					sumPercent = v.UnitValue / totalValue * 100;
					// var name = v.PortfolioCode+" ("+accounting.formatMoney(sumPercent, '', 2, ".", ",")+"%)";
					data_legend.push(v.PortfolioCode);
					data_chart.push({ "value": sumPercent, "name": v.PortfolioCode + " (" + accounting.formatMoney(sumPercent, '', 2, ".", ",") + "%)" });
				});

				var dom = $('#balance-chart').html('');
				if (dom.length < 1)
					return false;

				var mytempChart = echarts.init(dom[0]);
				var option = {
					tooltip: {
						trigger: 'item',
						formatter: function (params) {
							// console.log(params);
							return accounting.formatMoney(params[2], '', 2, ".", ",") + ' %';
						}
						// formatter: "{b} : {c}%"
					},
					// legend: {
					// orient: 'vertical',
					// x: 'left',
					// data: data_legend
					// },
					// toolbox: {
					// show: true,
					// feature: {
					// dataView: { show: true, readOnly: false },
					// magicType: {
					// show: true,
					// type: ['pie', 'funnel'],
					// option: {
					// funnel: {
					// x: '25%',
					// width: '50%',
					// funnelAlign: 'center',
					// max: 1548
					// }
					// }
					// },
					// restore: { show: true },
					// saveAsImage: { show: true }
					// }
					// },
					color: ["#f62d51", "#009efb", "#55ce63", "#ffbc34", "#2f3d4a", "#6f42c1"],
					calculable: true,
					series: [{
						name: 'Source',
						type: 'pie',
						radius: ['50%', '70%'],
						// itemStyle: {
						// normal: {
						// label: {
						// show: false
						// },
						// labelLine: {
						// show: false
						// }
						// },
						// emphasis: {
						// label: {
						// show: false,
						// position: 'center',
						// textStyle: {
						// fontSize: '30',
						// fontWeight: 'bold'
						// }
						// }
						// }
						// },
						data: data_chart
					}]
				};
				mytempChart.setOption(option, true);
			}
			/**
			 * Populate data balance portfolio list
			 * 
			 * @param {Array} o 
			 */
			function loadListItem(o) {
				var container = $('#portfolio_list').html('');
				if (container.length < 1)
					return false;

				$.each(o, function (i, v) {
					var id = newGuid();
					var layout = $($('#portfolio_list_layout')[0].innerHTML);
					var img = repos_url + '/portfolio/' + v.PortfolioCode + '.png';
					layout.find('.portfolio_name').html(v.PortfolioNameShort);
					layout.attr('id', v.simpiID + '_' + v.PortfolioID);
					layout.find('#asset_type').html(v.AssetTypeCode);
					layout.find('.img-portfolio').attr('src', img);
					layout.find('.img-portfolio').attr('title', v.PortfolioNameShort);

					layout.find('#unit_balance').html(accounting.formatMoney(v.UnitBalance, '', 2, ".", ","));
					layout.find('#unit_price').html(accounting.formatMoney(v.UnitPrice, '', 2, ".", ","));
					layout.find('.nav-date').html(moment(v.PositionDate).format('DD MMM YYYY'));

					layout.find('#unit_value').html(accounting.formatMoney(v.UnitValue, '', 2, ".", ","));
					layout.find('#cost_price').html(accounting.formatMoney(v.CostTotal, '', 2, ".", ","));
					layout.find('#profit_loss').html(accounting.formatMoney(v.CostTotal, '', 2, ".", ","));

					container.append(layout);
				});
			}
		}

	}
	// ============================================================== 
	// PAGE Profile
	// ============================================================== 
	function getProfile() {
		var form_el = $(document).find('#profileform');
		if (form_el.length < 1)
			return false;

		$.ajax({
			data: JSON.stringify({
				"id": Math.floor(Math.random()*1000)+1,
				"agent": "web","token": token,"lang": lang,"method": "client.get_profile","params": {}
			}),
			success: function (data) {
				// console.log(data);
				if (data.status) {
					db_store('client.get_profile', JSON.stringify(data.result));
					$(document).find('#profile_status').html(accounting.formatMoney(data.profile_status, '', 0, ".", ",") + "%");
					form_el.populate(data.result);
				} else {
					alert(data.message);

					if ($.inArray(data.code, ['498', '440']) >= 0)
						LoginPage();

					console.log('fun::getProfile : status=false');
					console.log(data);
				}
			}
		});

		// Auto enable/disable button submit if any changed
		form_el.find('button.primary').prop('disabled', true);
		form_el.on('change', function () { form_el.find('button').prop('disabled', is_empty($(this).serialize())); });

		// Action on button clicked or form submitted
		form_el.click('button', function (e) { btn = $(e.target).attr('id') });

		form_el.find('#cb_same_address').on('change', function (e) {
			if ($(this).prop('checked')) {
				form_el.find('[name="CorrespondenceAddress"]').val(form_el.find('[name="Address"]').val());
				form_el.find('[name="CorrespondenceCity"]').val(form_el.find('[name="City"]').val());
				form_el.find('[name="CorrespondencePostalCode"]').val(form_el.find('[name="PostalCode"]').val());
				form_el.find('[name="CorrespondenceCountryID"]').val(form_el.find('[name="CountryID"]').val());
				form_el.find('[name="CorrespondencePhone"]').val(form_el.find('[name="Phone"]').val());
				form_el.find('[name="CorrespondenceFax"]').val(form_el.find('[name="Fax"]').val());
				form_el.find('[name="CorrespondenceEmail"]').val(form_el.find('[name="Email"]').val());
			}
		});
	}
	var btn;
	$(document).on('submit', '#profileform', function (e) {
		e.preventDefault();

		var params = $(this).serialize();

		// For Auto Convert Date Format
		var date_fields = $(this).find('.date').map(function () { return $(this).attr('name') }).get();
		$.each(date_fields, function (i, v) { if (params[v]) params[v] = moment(params[v], 'DD-MM-YYYY').format('YYYY-MM-DD') });

		if (btn == 'btn_cancel') {
			$(this).trigger('reset');
			getProfile();
			// Initialization();
		} else {
			// console.log(btn);
			if (btn == 'btn_print') {
				pdf_print(params);
			}
			else if (btn == 'btn_email') {
				pdf_email(params);
			}
			else {
				save_draft(params);
			}
		}

		function save_draft(params) {
			// console.log(params); return false;
			$.ajax({
				data: JSON.stringify({
					"id": Math.floor(Math.random()*1000)+1,
					"agent": "web","token": token,"lang": lang,"method": "client.set_profile","params": params
				}),
				success: function (data) {
					// console.log(data);
					if (data.status) {
						alert(data.message);
						getProfile();

						if (params['print_pdf'])
							window.open(data.link);
						// Initialization()
					} else {
						console.log('fun::save_draft : status=false');
						console.log(data);
					}
				}
			});
		}
		function pdf_print(params) {
			var data_request = JSON.stringify({
				"id": Math.floor(Math.random()*1000)+1,
				"agent": "web","token": token,"lang": lang,"method": "client.pdf_print","params": params
			}); 
			$.ajax({
				data: data_request,
				success: function (data) {
					// console.log(data);
					if (data.status) {
						if (! $.isArray(data.result)) {
							window.open(data.result.link);
						} else {
							$.each(data.result, function(i, v){
								// console.log(v.link);
								window.open(v.link);
							});
						}
					} else {
						console.log('fun::pdf_print : status=false');
						console.log(data);
					}
				}
			});
		}
		function pdf_email(params) {
			var data_request = JSON.stringify({
				"id": Math.floor(Math.random()*1000)+1,
				"agent": "web","token": token,"lang": lang,"method": "client.pdf_email","params": params
			}); 
			$.ajax({
				data: data_request,
				success: function (data) {
					// console.log(data);
					if (data.status) {
						alert(data.message);
					} else {
						console.log('fun::pdf_print : status=false');
						console.log(data);
					}
				}
			});
		}
	});

	$(document).on('change', '[name="AccountNotes"]', function (e, clickedIndex, newValue, oldValue) {
		// console.log(this.value, clickedIndex, newValue, oldValue);
		// o = JSON.parse(db_get('client.balance'));
		// var o = array_filter(o, 'CcyID', CcyID);
		var o = array_filter(JSON.parse(db_get('master.bankcode')), 'BankCode', this.value);
		console.log(o[0]['CompanyName']);
		$(document).find('[name="BankName"]').val(o[0]['CompanyName']);
		// console.log($(e.target).find('option:selected'));
	});
	// ============================================================== 
	// PAGE Download
	// ============================================================== 
	$(document).on('click', 'table.download-documents a', function (e) {
		e.preventDefault();
		var el = $(e.currentTarget);
		var formulir = el.attr('data-custom');
		var kind = el.attr('data-original-title').toLowerCase() == 'print' ? 'print' : 'send_mail';
		// console.log(el.attr('data-original-title').toLowerCase());
		// return false;

		var data_request = JSON.stringify({
			"id": Math.floor(Math.random()*1000)+1,
			"agent": "web","token": token,"lang": lang,"method": "download.documents","params": {'formulir':formulir,'kind':kind}
		}); 
		$.ajax({
			data: data_request,
			success: function (data) {
				// console.log(data);
				if (data.status) {
					if (kind == 'print')
						window.open(data.result.link);
					else
						alert(data.message);
				} else {
					console.log('fun::download.documents : status=false');
					console.log(data);
				}
			}
		});
	});
	// ============================================================== 
	// PAGE Subscription
	// ============================================================== 
	var dT, DT;
	function getSubscription() {
		var el = $(document).find('#table_subscription');
		if (el.length < 1)
			return false;

		var filter_subs = JSON.parse(db_get('filter_subs'));
		var start = filter_subs ? moment(filter_subs.DateFrom) : moment().startOf('month');
		var end = filter_subs ? moment(filter_subs.DateTo) : moment().endOf('month');
		$(document).find('#btn_cal').daterangepicker(
				{
					ranges: {
						'This Month': [moment().startOf('month'), moment().endOf('month')],
						'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
						'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
					},
					startDate: moment().startOf('month'),
					endDate: moment().endOf('month')
				},
				function (start, end) {
					$('#btn_cal span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
					db_store('filter_subs', JSON.stringify({"DateFrom":start.format('YYYY-MM-DD'), "DateTo":end.format('YYYY-MM-DD')}));
				}
		);
		
		$(document).find('#btn_cal span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		db_store('filter_subs', JSON.stringify({"DateFrom":start.format('YYYY-MM-DD'), "DateTo":end.format('YYYY-MM-DD')}));

		dT = el.dataTable({
			"lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
			"columns": [
				{"data":"TrxDate","title":"Tanggal",className:"dt-head-center dt-body-center",render:function(data,type,row){return moment(data).format('DD-MM-YYYY')}},
				{"data":"TrxID","title":"TrxID","type":"number"},
				{"data":"PortfolioNameShort","title":"Reksa Dana"},
				{"data":"TrxAmount","title":"Nominal",className:"dt-head-center dt-body-right",render:function(data,type,row){return accounting.formatMoney(data, '', 2, ".", ",")}},
				{"data":"PaymentProof","title":"Bukti Transfer",className:"dt-head-center dt-body-center"},
				{"data":"StatusCode","title":"Status",className:"dt-head-center dt-body-center"},
				{"data":"ResultNet","title":"Net"},
				{"data":"NAVPerUnit","title":"NAV/Unit"},
				{"data":"ResultUnit","title":"Unit"},
				{"data":"NAVDate","title":"Tanggal Unit",className:"dt-head-center dt-body-center",render:function(data,type,row){return data?moment(data).format('DD-MM-YYYY'):''}},
				{"data":"","title":"Action",className:"dt-head-center dt-body-center",render:function(data,type,row){
					return '<button type="button" name="btn_upload_row" class="btn btn-sm btn-icon btn-pure btn-outline upload-row-btn" data-toggle="tooltip" data-original-title="Upload" title="Upload Bukti Pembayaran"><i class="ti-clip" aria-hidden="true"></i></button>'+
					'<button type="button" name="btn_delete_row" class="btn btn-sm btn-icon btn-pure btn-outline delete-row-btn" data-toggle="tooltip" data-original-title="Delete" title="Delete"><i class="ti-close" aria-hidden="true"></i></button>';
				}},
			],
			"order": [],
		});
		DT = el.DataTable();
	
		getSubscriptionData();
		// ft = FooTable.init(el, {
		// 	"paging": {
		// 		"enabled": true,
		// 		"countFormat": "{CP} of {TP} - {TR} rows",
		// 		"limit": 3,
		// 		"position": "right",
		// 		"size": 5,
		// 	},
		// 	"columns": [
		// 		{"name":"dob","title":"Tanggal","type":"date","breakpoints":"xs sm md","formatString":"DD MMM YYYY"},
		// 		{"name":"id","title":"TrxID","breakpoints":"xs sm","type":"number","style":{"width":80,"maxWidth":80}},
		// 		{"name":"firstName","title":"Reksa Dana"},
		// 		{"name":"lastName","title":"Nominal"},
		// 		{"name":"is_transfer","title":"Bukti Transfer"},
		// 		{"name":"status","title":"Status"},
		// 		{"name":"status","title":"Net"},
		// 		{"name":"status","title":"NAV/Unit"},
		// 		{"name":"status","title":"Unit"},
		// 		{"name":"started","title":"Tanggal Unit","type":"date","breakpoints":"xs sm md","formatString":"DD MMM YYYY"},
		// 		{"name":"something","title":"Never seen but always around","visible":false,"filterable":false},
		// 		{"name":"jobTitle","title":"Job Title","breakpoints":"xs sm","visible":false,"style":{"maxWidth":200,"overflow":"hidden","textOverflow":"ellipsis","wordBreak":"keep-all","whiteSpace":"nowrap"}},
		// 	],
		// });
	}

	function getSubscriptionData() {
		var params = JSON.parse(db_get('filter_subs'));

		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","token":token,"lang":lang,"method":"order_subscription.search3","params":params
		}; 

		$.ajax({ data:JSON.stringify(data_request),
			success: function(data) {
				// console.log(data);
				DT.clear().draw();
				if (data.status) {
					dT.fnAddData(data.result);
					
					// ft.rows.load(data.result);
					// ft.loadRows(data.result);
				}
			}
		});
	}

	$(document).on('click', '[name="btn_upload_row"]', function (e) {
		$(document).find('[id="dlg_SubscriptionUpload"]').modal('toggle');
		var data = DT.rows($(e.target).closest('tr')).data();
		$(document).find('[name="TrxID"]').val(data[0].TrxID);
		// var data_request = {
		// 	"id": Math.floor(Math.random()*1000)+1,
		// 	"agent":"web","token":token,"lang":lang,"method":"order_subscription.cancel3","params":{"TrxID":data[0].TrxID}
		// }; 
		// // console.log(data_request); return false;
		// $.ajax({ data: JSON.stringify(data_request),
		// 	success: function(data) {
		// 		if (data.status) {
		// 			alert('Transaksi Anda berhasil dibatalkan');
		// 			getSubscriptionData();
		// 		} else {
		// 			console.log('fun::btn_delete_row : status=false');
		// 			console.log(data);
		// 		}
		// 	},
		// });
	});

	$(document).on('change', '[name="userfile"]', function(e){
		var fileSize = this.files[0].size/1024/1024;
		if (fileSize > 2) { // 2M
				alert('File anda melebihi batas yang ditentukan. Max. 2M');
				// alert('Your file size exceeded. Max. 2M');
				$(this).val('');
		}
	});

	$(document).on('submit', '[id="subscription_upload_form"]', function (e) {
		e.preventDefault();

		var Fdata = new FormData(this);
		var params = $(this).serialize();
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","token":token,"lang":lang,"method":"order_subscription.upload3","params":JSON.stringify(params)
		}; 
		$.each(data_request, function(key, value){ Fdata.append(key, value) })
		// console.log(data_request); 
		// console.log(Fdata); 
		// return false;
		$.ajax({ data: Fdata, processData: false, contentType: false,
			beforeSend: function(xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled") },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					alert(data.message);
					$(document).find('#subscription_upload_form button[type="reset"]').trigger('click');
					$(document).find('[id="dlg_SubscriptionUpload"]').modal('toggle');
					getSubscriptionData();
				} else {
					alert(data.message);
					// console.log('fun::subscription_upload_form : status=false');
					// console.log(data);
				}
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
			},
			// statusCode: {
			// 	413: function(e) {
			// 		alert('Request Entity Too Large');
			// 	}
			// },		
			error: function(data, status, errThrown) {
				// if (data.status < 500) {
				// 	var message = data.statusText;
				// } else {
				// 	var error = JSON.parse(data.responseText);
				// 	var message = error.message;
				// }
				alert(data.status);
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
			}
		});
	});

	$(document).on('click', '[name="btn_delete_row"]', function (e) {
		if (! confirm('Anda yakin ingin meng-cancel transaksi ini? \nSebab proses ini tidak bisa di kembalikan lagi.'))
			return false;

		var data = DT.rows($(e.target).closest('tr')).data();
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","token":token,"lang":lang,"method":"order_subscription.cancel3","params":{"TrxID":data[0].TrxID}
		}; 
		// console.log(data_request); return false;
		$.ajax({ data: JSON.stringify(data_request),
			success: function(data) {
				if (data.status) {
					alert('Transaksi Anda berhasil dibatalkan');
					getSubscriptionData();
				} else {
					console.log('fun::btn_delete_row : status=false');
					console.log(data);
				}
			},
		});
	});

	$(document).on('click', '[id="btn_cal"]', function (e) {
		getSubscriptionData();
	});

	$(document).on('click', '[id="btn_filter"]', function (e) {
		getSubscriptionData();
	});

	$(document).on('change', '[name="PortfolioID"]', function (e) {
		var el = $(document).find('[name="AccountID"]');
		var o = array_filter(JSON.parse(db_get('master_portfolio.bank3')), 'PortfolioID', this.value);
		PopulateSelectionDom(el, o);
	});

	$(document).on('submit', '[id="subscriptionform"]', function (e) {
		e.preventDefault();

		var params = $(this).serialize();
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","token":token,"lang":lang,"method":"order_subscription.new3","params":params
		}; 
		// console.log(params); return false;
		$.ajax({ data: JSON.stringify(data_request),
			beforeSend: function(xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled") },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					getSubscriptionData();
					$(this).find('[type="reset"]').trigger('click');
					$(document).find('[id="dlg_SubscriptionNew"]').modal('toggle');
				} else {
					console.log('fun::subscriptionform : status=false');
					console.log(data);
				}
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
			},
			error: function(data, status, errThrown) {
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); }, 1000);
			}
		});
	});

});