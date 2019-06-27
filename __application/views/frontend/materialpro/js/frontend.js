/*
Description: This is script for authenticating AyoAvram Web Application
Author: Ahmad hertanto
Email: antho.firuze@gmail.com
File: js
*/
$(function () {
	"use strict";
	
	/**
	* Serialize tag type form
	*
	* @param String type Output type of data 'json' or 'object'
	* @returns json/object
	*/
	$.fn.serialize = function(type) {
		if (typeof(type) == 'undefined') type = 'object';
		type = type.toLowerCase();
		
		var o = {};
		// Exclude Select Element
		var a = this.find('[name]').not('select').serializeArray();
		$.each(a, function (i, v) {
			v.value = (v.value == 'on') ? '1' : v.value;
			o[v.name] = o[v.name] ? o[v.name] || v.value : v.value;
		});
		// Only Select Element
		var a = this.find('select').serializeArray();
		$.each(a, function (i, v) {
			if (o[v.name]) {
				o[v.name] += ',' + v.value;
			} else {
				o[v.name] = v.value;
			}
		});
		return (type == 'json') ? JSON.stringify(o) : o;
	};

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
	var newGuid = function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
	
	// =================================================================================
	// Variable Global
	// =================================================================================
	var uri = URI(location.href);
	var uri_path = URI(uri.origin()+uri.path());
	var lang = URI.parseQuery(uri.query()).lang;
	var page = URI.parseQuery(uri.query()).page;
	var language = $("#shelter_language").text() ? JSON.parse($("#shelter_language").text()) : '';
	var language_sub = $("#shelter_language_sub").text() ? JSON.parse($("#shelter_language_sub").text()) : '';
	var repos_url = db_get('repos_url');

	var appcode = db_get('appcode');
	var jsonrpc_url = db_get('api_url');
	if (uri.host() == 'localhost:8080')
		jsonrpc_url = 'http://localhost:5050';
	
	var lang = lang ? lang : 'id';
	var page = page ? page : 'home';
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
		console.log("Error requesting page: " + settings.url);
		console.log("With data: " + settings.data);
	});
	/**
	* For loading ajax page
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function LoadAjaxPage(curr_page) {
		// var curr_page = this.name;
		var content_url = URI(uri.origin()+uri.path()+'/getContent').search({"lang":lang, "page":curr_page});
		$.ajax({ url:content_url, method:"GET", async:true, dataType:'json',
			success: function(data) {
				// console.log(data);
				if (data.status) {
					language_sub = data.language;
					console.log(language_sub);
					$('div.page-titles h3').html(data.title);
					$('div.content').html(data.content);
					$(".carousel").carousel();
					
					page = curr_page;
					var new_url = uri_path.search({"lang":lang, "page":page});
					// history.pushState({}, '', new_url);
					history.replaceState({}, '', new_url);
					AutoSelectLeftNavbar();
					// Initialization();

				} else {
					alert(data.message);
				}
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				console.log(data);
				alert(message);
			}
		});
	}
	
	// ============================================================== 
	// Initial Procedure
	// ============================================================== 
	function Initialization() {
		populateRunnningText();
	}
	
	$(function () {
		// AutoSelectLeftNavbar();
		Initialization();
		loadDataPortfolio();
		
	});
	
	function populateRunnningText() {
		var container = $('.webticker');
		container.html("");
		
		var spaces1 = '&nbsp;';
		var spaces2 = '&nbsp;&nbsp;';
		var spaces_lg = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		$.ajax({ url:jsonrpc_url, method:"POST", async:true, dataType:'json', 
			data: JSON.stringify({ 
				"id":Math.floor(Math.random() * 1000),
				"agent":"web", "appcode":appcode, "lang":lang, "method":"portfolio.running_text",	"params":{}
			}),
			success: function(data) {
				if (data.status) {
					$.each(data.result, function(i, v){
						var layout = $( $('#running_text_layout')[0].innerHTML );
						layout.find('.portfolio_name').html(((i < 1)?'*'+spaces_lg+spaces_lg:'')+v.PortfolioNameShort+spaces2);
						layout.find('.nav_per_unit').html(accounting.formatMoney(v.NAVPerUnit, 'IDR ', 2, ".", ",")+spaces2);
						layout.find('.ytd').html(accounting.formatMoney(v.PortfolioReturn, '', 2, ".", ",")+'%'+spaces2);
						layout.find('.benchmark').html(
							(v.BenchmarkReturn) ? accounting.formatMoney(v.BenchmarkReturn, '', 2, ".", ",")+'%'+spaces_lg
							: '-'+spaces_lg);
						container.append( $('<li />').append(layout) );
					});
					populateRunnningText2();
					container.webTicker({
						startEmpty:false, 
						hoverpause:true, 
					});
				} else {
					container.html('');
				}
			},
		});
	}
	
	function populateRunnningText2() {
		var container = $('.webticker');
		
		var spaces1 = '&nbsp;';
		var spaces2 = '&nbsp;&nbsp;';
		var spaces_lg = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		$.ajax({ url:jsonrpc_url, method:"POST", async:true, dataType:'json',
			data: JSON.stringify({ 
				"id":Math.floor(Math.random() * 1000),
				"agent":"web", 
				"appcode":appcode, 
				"lang":lang,
				"method":"portfolio.running_text2", 
				"params":{}
			}),
			beforeSend: function(xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				if (data.status) {
					// console.log(data.result);
					$.each(data.result, function(i, v){
						var layout = $( $('#running_text2_layout')[0].innerHTML );
						layout.find('.benchmark_code').html(((i < 1)?'*'+spaces_lg+spaces_lg:'')+v.BenchmarkCode+spaces2);
						layout.find('.benchmark_value').html(accounting.formatMoney(v.BenchmarkValue, 'IDR ', 2, ".", ",")+spaces_lg);

						container.webTicker('update',$('<li />').append(layout)[0].outerHTML,'swap',true,false);
					});
				} 
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				console.log('function populateRunnningText2: Error: '+message);
			}
		});
	}
	
	// ============================================================== 
	// login
	// ============================================================== 
	$(document).on('submit', '#loginform', function(e) {
		e.preventDefault();
		
		var params = $(this).serialize();
		params.dt = new Date().toISOString().substr(0,19).replace('T',' ');
		params.dt_epoc = Math.round((new Date).getTime()/1000);
		
		// console.log("a:"+vform); return false;
		// console.log("a:"+JSON.stringify(params)); return false;
		$.ajax({ url:jsonrpc_url, method:"POST", async:true, dataType:'json',
			data: JSON.stringify({ 
				"id":Math.floor(Math.random() * 1000),
				"agent":"web", 
				"appcode":appcode, 
				"lang":lang,
				"method":"auth.login", 
				"params":params
			}),
			beforeSend: function(xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					db_store('session', JSON.stringify(data.result));
					var url_to = uri.path('backend').search({
						"lang":lang, 
						"state":"client", 
						"page":"dashboard"
					});
					window.location = url_to;
				} else {
					alert(data.message);
				}
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			}
		});
	}); 
	
	// ============================================================== 
	// forgot
	// ============================================================== 
	$(document).on('submit', '#recoverform', function(e) {
		e.preventDefault();
		
		var params = $(this).serialize();
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","appcode":appcode,"lang":lang,"method":"auth.forgot_password_simple","params":params
		}; 
		// console.log("b:"+JSON.stringify(params)); return false;
		$.ajax({ data: JSON.stringify(data_request),
			beforeSend: function(xhr) { $(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					// var url_to = uri_path.search({
						// "lang":lang, 
						// "state":"auth", 
						// "page":"login"
					// });
					// window.location = url_to;
					
					alert(data.message);
					$(document).find("#recoverform").fadeOut();
					$(document).find("#loginform").fadeIn();
				} else {
					alert(data.message);
				}
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ $(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			}
		});
	}); 
	
	$(document).on('click', '[id="to-recover-cancel"]', function(e) {
		$(document).find("#recoverform").fadeOut();
		$(document).find("#loginform").fadeIn();
	}); 
	
	// ============================================================== 
	// register
	// ============================================================== 
	$(document).on('click', '[id="register"]', function(e) {
		e.preventDefault();

		var url_to = uri.path('backend').search({
			"lang":lang, 
			"state":"auth", 
			"page":"register"
		});
		window.location = url_to;
	});
	
	// ============================================================== 
	// load data portfolio
	// ============================================================== 

	function loadDataPortfolio(){
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","appcode":appcode,"lang":lang,"method":"portfolio.performance","params":{}
		}; 
		$.ajax({ data: JSON.stringify(data_request),
			success: function(data) {
				// console.log(data);
				if (data.status) {
					populatePortfolioPerformance(data.result);

				} else {
					console.log('loadDataPortfolio: status:false');
					console.log(data);
					// alert(data.message);
				}
			},
		});
	}
	
	function populatePortfolioPerformance(o) {
		var container = $('#portfolio_accordion').html('');

		$.each(o, function(i){
			var id = newGuid();
			var layout = $($('#portfolio_performance_layout')[0].innerHTML);
			var img = repos_url+'/portfolio/'+o[i]['PortfolioCode']+'.png';
			layout.find('h3.portfolio_name').html(o[i]['PortfolioNameShort']);
			layout.attr('id', o[i]['simpiID']+'_'+o[i]['PortfolioID']);
			layout.find('#asset_type').html(o[i]['AssetTypeCode']);
			layout.find('a.view_detail').attr('href', '#'+id);
			layout.find('a.view_detail').data('simpi_id', o[i]['simpiID']);
			layout.find('a.view_detail').data('portfolio_id', o[i]['PortfolioID']);
			layout.find('div.collapse').attr('id', id);
			layout.find('img.img-portfolio').attr('src', img);
			layout.find('img.img-portfolio').attr('title', o[i]['PortfolioNameShort']);
			
			layout.find('div.nav-unit').html(accounting.formatMoney(o[i]['NAVperUnit'], '', 2, ".", ","));
			layout.find('div.nav-date').html(moment(o[i]['PositionDate']).format('DD MMM YYYY'));
			layout.find('.barrating').barrating({initialRating:o[i]['RiskScore'],emptyValue:0,allowEmpty:true,showValues:true,showSelectedRating:false,readonly:true,hoverState:false,theme:'bars-square'});
			
			layout.find('#mtd').html(accounting.formatMoney(o[i]['rMTD']*100, '', 2, ".", ",")+'%');
			layout.find('#ytd').html(accounting.formatMoney(o[i]['rYTD']*100, '', 2, ".", ",")+'%');
			layout.find('#1y').html(accounting.formatMoney(o[i]['r1Y']*100, '', 2, ".", ",")+'%');
			layout.find('#2y').html(accounting.formatMoney(o[i]['r2Y']*100, '', 2, ".", ",")+'%');
			// layout.find('#5y').html(accounting.formatMoney(o[i]['r5Y']*100, '', 2, ".", ",")+'%');
			// layout.find('#inception').html(accounting.formatMoney(o[i]['rInception']*100, '', 2, ".", ",")+'%');
			
			layout.find('#investment_goal').html(o[i]['InvestmentGoal']);
			layout.find('#subs_fee').html(o[i]['SubsFee']);
			layout.find('#redeem_fee').html(o[i]['RedeemFee']);
			layout.find('#switching_fee').html(o[i]['SwitchingFee']);
			// layout.find('.barrating').barrating({initialRating:null,emptyValue:0,allowEmpty:true,showValues:true,showSelectedRating:false,readonly:true,hoverState:false,theme:'bars-square'});
			
			if (o[i]['AssetTypeCode'].toUpperCase() == 'EQ') {
				layout.find('.eq').show();
				layout.find('.non-eq').hide();
			} else {
				layout.find('.eq').hide();
				layout.find('.non-eq').show();
			}
			
			container.append(layout);
		});
	}
	
	$(document).on('click', '[id="view_detail"]', function(e) {
		var simpi_id = $(this).data('simpi_id');
		var portfolio_id = $(this).data('portfolio_id');
		// console.log($(this).data('portfolio_id'));
		// console.log($(this).attr('href'));
		// var this_id = $(this).attr('href');
		// console.log($(this).parent().parent().parent().find(this_id));
		// console.log($(this).hasClass('collapsed'));
		// console.log($(this).attr('href').hasClass('collapse'));
		if (!$(this).hasClass('collapsed')) {

			// =======================
			// Performance Year To Date / Kinerja Sejak Awal Tahun / id="line-chart"
			// =======================
			$.ajax({ url:jsonrpc_url, method:"POST", async:true, dataType:'json',
				data: JSON.stringify({ 
					"id":Math.floor(Math.random() * 1000),
					"agent":"web", 
					"appcode":appcode, 
					"lang":lang,
					"method":"portfolio.chart_nav", 
					"params":{"simpi_id":simpi_id, "portfolio_id":portfolio_id}
				}),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						// console.log(data.result);
						populateLineChart(simpi_id, portfolio_id, data.result);

						} else {
						alert(data.message);
					}
				},
				error: function(data, status, errThrown) {
					if (data.status >= 500){
						var message = data.statusText;
					} else {
						var error = JSON.parse(data.responseText);
						var message = error.message;
					}
					alert(message);
				}
			});
			
			// =======================
			// Top 5 Stock NAV / Efek dalam Portfolio (Top 5) / id="tablePortfolio"
			// =======================
			$.ajax({ url:jsonrpc_url, method:"POST", async:true, dataType:'json',
				data: JSON.stringify({ 
					"id":Math.floor(Math.random() * 1000),
					"agent":"web", 
					"appcode":appcode, 
					"lang":lang,
					"method":"portfolio.top_stock_nav", 
					"params":{"simpi_id":simpi_id, "portfolio_id":portfolio_id, "fields":"SecuritiesNameShort,TypeDescription,Percent"}
				}),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						// console.log(data.result);
						populatePortfolioTop5(simpi_id, portfolio_id, data.result);

					} else {
						// alert(data.message);
						$('#'+simpi_id+'_'+portfolio_id).find('#tablePortfolio').html(data.message);
					}
				},
				error: function(data, status, errThrown) {
					if (data.status >= 500){
						var message = data.statusText;
					} else {
						var error = JSON.parse(data.responseText);
						var message = error.message;
					}
					alert(message);
				}
			});
			
			var asset_type = $('#'+simpi_id+'_'+portfolio_id).find('#asset_type').html();
			if (asset_type.toUpperCase() == 'EQ') {

				// =======================
				// Sector EQ / Alokasi Sektor (Top 5) / id="doughnut-chart"
				// =======================
				$.ajax({ url:jsonrpc_url, method:"POST", async:true, dataType:'json',
					data: JSON.stringify({ 
						"id":Math.floor(Math.random() * 1000),
						"agent":"web", 
						"appcode":appcode, 
						"lang":lang,
						"method":"portfolio.top_sector_eq", 
						"params":{"simpi_id":simpi_id, "portfolio_id":portfolio_id}
					}),
					success: function(data) {
						// console.log(data);
						if (data.status) {
							// console.log(data.result);
							populateDoughnutChart(simpi_id, portfolio_id, data.result);

						} else {
							$('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html(data.message);
						}
					},
					error: function(data, status, errThrown) {
						if (data.status >= 500){
							var message = data.statusText;
						} else {
							var error = JSON.parse(data.responseText);
							var message = error.message;
						}
						alert(message);
					}
				});
				
			} else {
				
				// =======================
				// Sector Non EQ / Asset Class / id="tableAssetClass"
				// =======================
				$.ajax({ url:jsonrpc_url, method:"POST", async:true, dataType:'json',
					data: JSON.stringify({ 
						"id":Math.floor(Math.random() * 1000),
						"agent":"web", 
						"appcode":appcode, 
						"lang":lang,
						"method":"portfolio.top_sector_non_eq", 
						"params":{"simpi_id":simpi_id, "portfolio_id":portfolio_id}
					}),
					success: function(data) {
						// console.log(data);
						if (data.status) {
							// console.log(data.result);
							populateAssetClass(simpi_id, portfolio_id, data.result);

						} else {
							$('#'+simpi_id+'_'+portfolio_id).find('#tableAssetClass').html(data.message);
						}
					},
					error: function(data, status, errThrown) {
						if (data.status >= 500){
							var message = data.statusText;
						} else {
							var error = JSON.parse(data.responseText);
							var message = error.message;
						}
						alert(message);
					}
				});
			}
		}
	});
	
	$(window).on("resize", function() {
		$(document).find('[id="line-chart"]').each(function(e){
			if ($(this).attr('_echarts_instance_'))
				echarts.getInstanceById($(this).attr('_echarts_instance_')).resize();
		});
	});

	function populateLineChart(simpi_id, portfolio_id, data) {
		var x_axis = [], y_axis = [];
		$.each(data, function(i){ 
			// y_axis.push(accounting.formatMoney(data[i].line1 * 100, '', 2, ".", ","));
			y_axis.push(data[i].line1 * 100);
			x_axis.push(moment(data[i].PositionDate).format('DD MMM YYYY'));
		});
		
		var dom = $('#'+simpi_id+'_'+portfolio_id).find('#line-chart').html('');
		var mytempChart = echarts.init(dom[0]);
		var option = {
				tooltip: { 
					trigger: 'axis', 
					formatter : function (params) {
							return params[0].name + ' : ' + accounting.formatMoney(params[0].value, '', 2, ".", ",") + ' %';
					}
				},
				
				// legend: { data: ['max temp', 'min temp'] },
				toolbox: {
					show: true,
					feature: {
							magicType: { show: true, type: ['line', 'bar'] },
							restore: { show: true },
							saveAsImage: { show: true }
					}
				},
				color: ["#55ce63", "#009efb"],
				calculable: true,
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: x_axis
				}],
				yAxis: [{
					type: 'value',
					axisLabel: { formatter: '{value} %' }
				}],
				series: [{
					// name: 'max temp',
					type: 'line',
					color: ['#000'],
					data: y_axis,
					smooth: true,
					itemStyle: {
							normal: {
									areaStyle: {type: 'default'},
									lineStyle: {
											shadowColor: 'rgba(0,0,0,0.3)',
											shadowBlur: 10,
											shadowOffsetX: 8,
											shadowOffsetY: 8
									}
							}
					},
					markLine: {
							data: [
									{ type: 'average', name: 'Average' }
							]
					}
				}]
		};
		mytempChart.setOption(option, true);
	}
	
	function populateDoughnutChart(simpi_id, portfolio_id, o) {
		var data_legend = [], data_chart = [], sumPercent = 0;
		$.each(o, function(i){ 
			sumPercent = sumPercent + (o[i].Percent * 100);
			data_legend.push(o[i].SectorName);
			data_chart.push({"value":o[i].Percent * 100, "name":o[i].SectorName});
		});
		// Add Others
		data_legend.push('OTHERS');
		data_chart.push({"value":(100 - sumPercent), "name":"OTHERS"});

		console.log(data_chart);
		var dom = $('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html('');
		var mytempChart = echarts.init(dom[0]);
		var option = {
			tooltip: {
					trigger: 'item',
					formatter : function (params) {
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
	
	function populateAssetClass(simpi_id, portfolio_id, o) {
		var dom = $('#'+simpi_id+'_'+portfolio_id).find('#tableAssetClass');
		dom.html('');
		var tbl_class = dom.attr('class');
		
		var container = $('<div class="'+tbl_class+'"><table class="table" style="margin-bottom:0px;"><thead></thead><tbody></tbody></table></div>'),
				table = container.find('table'),
				thead = container.find('thead'),
				tbody = container.find('tbody');
				
		// TABLE DETAIL
		if (o) {
			var sumPercent = 0;
			$.each(o, function(i){
				var tr = $('<tr />');
				$.each(o[i], function(j){
					if (j=='Percent') {
						sumPercent = sumPercent + (o[i][j]*100);
						tr.append( $('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(o[i][j]*100, '', 2, ".", ",")+' %') );
					} else	
						tr.append( $('<td style="padding:0px; font-size:12px;" />').html(o[i][j]) );
				});
				tr.appendTo(tbody);
			});
			
			// Add Liquidity
			var tr = $('<tr />');
			tr.append( $('<td style="padding:0px; font-size:12px;" />').html('LIQUIDITY') );
			tr.append( $('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(100-sumPercent, '', 2, ".", ",")+' %') );
			tr.appendTo(tbody);

			dom.append(container);
		} else {
			dom.html('Record not found');
		}
	}
	
	function populatePortfolioTop5(simpi_id, portfolio_id, o) {
		var dom = $('#'+simpi_id+'_'+portfolio_id).find('#tablePortfolio').html('');
		var tbl_class = dom.attr('class');
		
		var container = $('<div class="'+tbl_class+'"><table class="table" style="margin-bottom:0px;"><thead></thead><tbody></tbody></table></div>'),
				table = container.find('table'),
				thead = container.find('thead'),
				tbody = container.find('tbody');
		
		// TABLE HEADER
		// if (o.showheader){
			// var tr = $('<tr />');
			// $.each(o.columns, function(j){
				// if (c==1){ if (o.rowno){ tr.append( $('<th />').html('#') ); } }
				// tr.append( $('<th />').html(o.columns[j]['title']) );
				// c++;
			// });
			// tr.appendTo(thead);
		// }
		// var o = [
			// { name: "Obligasi Pemerintah", category: "Obligasi", percent: "31.00" },
			// { name: "Astra International", category: "Saham", percent: "6.00" },
			// { name: "Bank Central Asia", category: "Saham", percent: "6.00" },
			// { name: "PT. BRI (Persero)", category: "Saham", percent: "5.00" },
			// { name: "Bank Mandiri (Persero)", category: "Saham", percent: "5.00" },
		// ];

		// TABLE DETAIL
		if (o) {
			$.each(o, function(i){
				var tr = $('<tr />');
				$.each(o[i], function(j){
					if (j=='Percent')
						tr.append( $('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(o[i][j]*100, '', 2, ".", ",")+' %') );
					else	
						tr.append( $('<td style="padding:0px; font-size:12px;" />').html(o[i][j]) );
				});
				tr.appendTo(tbody);
			});
			dom.append(container);
		} else {
			dom.html('Record not found');
		}
	}
	
	// ============================================================== 
	// sidebar-nav menu
	// ============================================================== 
	$(document).on('click', '[id="menu"]', function(e) {
		e.preventDefault();

		if (this.name == page)
			return false;
		
		LoadAjaxPage(this.name);
	});
	// ============================================================== 
	// nav-item dropdown
	// ============================================================== 
	$(function () {
		if (db_get('session')) {
			var session = JSON.parse(db_get('session'));
			var profile_img = $('img.profile-img img');
			// var profile_text = $('div.profile-text a.dropdown-toggle.u-dropdown').html(session.client.full_name);
			
			var profile_pic = $('img.profile-pic');
			var u_img = $('ul#dropdown-user .u-img img');
			// var u_text = $('div.u-text h4').html(session.client.full_name);
			// var u_text = $('div.u-text p').html(session.client.CorrespondenceEmail);
		}
	});
});