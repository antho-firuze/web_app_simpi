/**
 * Description: This is script for Simpipro Web Application
 * 
 * Author: Ahmad hertanto
 * Email: antho.firuze@gmail.com
 */
// =================================================================================
// Variable Global
// =================================================================================
var uri       = URI(location.href);
var uri_path  = URI(uri.origin()+uri.path());
var lang      = URI.parseQuery(uri.query()).lang ? URI.parseQuery(uri.query()).lang : 'id';
var agent			= 'web';
var token;
var appcode   = jQuery.f.s_get('appcode');
var api_url   	 		= jQuery.f.s_get('api_url');
var api_olap_url   	= jQuery.f.s_get('api_olap_url');
var api_system_url  = jQuery.f.s_get('api_system_url');
var api_market_url  = jQuery.f.s_get('api_market_url');
var api_master_url  = jQuery.f.s_get('api_master_url');
var base_url  = jQuery.f.s_get('base_url');
var theme_url = jQuery.f.s_get('theme_url');
var repos_url = jQuery.f.s_get('repos_url');
var is_local = jQuery.f.s_get('is_local');

jQuery(function () {
	"use strict";
	
  /**
   * Check token, is token still valid?
   */
	function checkToken() {
		var data_request = { id: jQuery.f.newRndNum, "agent": "web","token": token, lang:  lang, method:  "auth.checkToken"	};
		jQuery.ajax({ data: JSON.stringify(data_request),
			success: function (data) {
				if (!data.status) {
					alert(data.message);
					UnLoginState();
				}
			}
		});
	}
	/**
	 * Goto Login Page, with first clear localstorage data
	 */
	function UnLoginState() {
		// jQuery.f.s_rem();
	}
	/**
	 * WINDOW EVENTS 
	 */
	jQuery(window).on('load', function(){ 
		if (! jQuery.f.s_get('session')) {
      UnLoginState();
		} 
	});
	jQuery(window).on("resize", function () {
		jQuery(document).find('[id="balance-chart"]').each(function (e) {
			if (jQuery(this).attr('_echarts_instance_'))
				echarts.getInstanceById(jQuery(this).attr('_echarts_instance_')).resize();
		});
	});
	
	// ============================================================== 
	// Initial Procedure
	// ============================================================== 
	function Initialization() {
		var page = jQuery(document).find('body').attr('class');
		if (page == 'home') {
			simpi_portfolio_performance();
		}
		// populateRunnningText();
		// simpi_portfolio_performance();
		// checkMenu();
	}
	
	Initialization();
	// ============================================================== 
	// ============================================================== 
	
	// function checkMenu() {
	// 	var el = jQuery(document).find('body').attr('class');
	// 	console.log(el);
	// }

	function populateRunnningText() {
		// check existing element container
		var el = jQuery(document).find('[id="_running_text"]');
		if (el.length < 1) return false;

		el.html("");
		
		var spaces1 = '&nbsp;';
		var spaces2 = '&nbsp;&nbsp;';
		var spaces_lg = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "portfolio.running_text", params:{}}; 
		jQuery.ajax({ 
			data: JSON.stringify(data_request),
			success: function(data) {
				if (data.status) {
					var sub_container = jQuery('<ul />');
					jQuery.each(data.result, function(i, v){
						var dom = jQuery('<div />');
						var portfolio_name = ((i < 1)?'*'+spaces_lg+spaces_lg:'')+v.PortfolioNameShort+spaces2;
						var nav_per_unit = accounting.formatMoney(v.NAVPerUnit, 'IDR ', 2, ".", ",")+spaces2;
						var ytd = accounting.formatMoney(v.PortfolioReturn, '', 2, ".", ",")+'%'+spaces2;
						var benchmark = (v.BenchmarkReturn) ? accounting.formatMoney(v.BenchmarkReturn, '', 2, ".", ",")+'%'+spaces_lg:'-'+spaces_lg;
						dom.append( jQuery('<span id="_rt_portfolio_name" />').html(portfolio_name) );
						dom.append( jQuery('<span id="_rt_nav_per_unit" />').html(nav_per_unit) );
						dom.append( jQuery('<span id="_rt_ytd" />').html(ytd) );
						dom.append( jQuery('<span id="_rt_benchmark" />').html(benchmark) );
						el.append( jQuery('<li />').append(dom) );
					});
					// populateRunnningText2();
					el.webTicker({ startEmpty:false, hoverpause:true,	});
				} else {
					el.html('');
				}
			},
		});
	}
	
	// ============================================================== 
	// login
	// ============================================================== 
	jQuery(document).on('submit', '[id="form_login"]', function(e) {
		e.preventDefault();
		
    var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "auth.login", params: jQuery(this).serialize()}; 
		jQuery.ajax({ url: api_system_url, data: JSON.stringify(data_request),
			beforeSend: function(xhr) { jQuery(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
          jQuery.f.s_set('session', JSON.stringify(data.result));
          LoginState();
				} else {
					alert(data.message);
				}
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			}
		});
	}); 
	
	// ============================================================== 
	// forgot
	// ============================================================== 
	jQuery(document).on('submit', '[id="form_reset_pwd"]', function(e) {
		e.preventDefault();
		
		var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "auth.forgot_password", params: jQuery(this).serialize()}; 
		jQuery.ajax({ url: api_system_url, data: JSON.stringify(data_request),
			beforeSend: function(xhr) { jQuery(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					alert(data.message);
					jQuery(document).find("#form_reset_pwd").fadeOut();
					jQuery(document).find("#form_login").fadeIn();
				} else {
					alert(data.message);
				}
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			}
		});
	}); 
	
	// ============================================================== 
	// register
	// ============================================================== 
	jQuery(document).on('click', '[id="register"]', function(e) {
		e.preventDefault();

		var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "auth.register", params: jQuery(this).serialize()}; 
		jQuery.ajax({ url: api_system_url, data: JSON.stringify(data_request),
			beforeSend: function(xhr) { jQuery(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					alert(data.message);
					jQuery(document).find("#form_reset_pwd").fadeOut();
					jQuery(document).find("#form_login").fadeIn();
				} else {
					alert(data.message);
				}
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			}
		});
	});
	
	// ============================================================== 
	// load data portfolio
	// ============================================================== 

	function simpi_portfolio_performance(){
		// check existing element container
		var el = jQuery(document).find('[id="_portfolio_list"]');
		if (el.length < 1) return false;

		jQuery.when(
			get_data(api_market_url, 'parameter_market.master_securities.ccy'),
			get_data(api_master_url, 'parameter_master.parameter_portfolio.asset_type'),
			get_data(api_master_url, 'master_portfolio.master_portfolio.search'),
			get_data(api_master_url, 'master_portfolio.master_portfolio.codeset_search'),
			get_data(api_olap_url, 'olap_nav.portfolio_return.search_last'),
			get_data(api_olap_url, 'olap_nav.portfolio_nav.search_last')
		).then(function(a, b, c, d, e, f){
			// console.log(a, b, c, d, e, f);
			var ccy = JSON.parse(jQuery.f.s_get('parameter_market.master_securities.ccy'));
			var asset_type = JSON.parse(jQuery.f.s_get('parameter_master.parameter_portfolio.asset_type'));
			var master_portfolio = JSON.parse(jQuery.f.s_get('master_portfolio.master_portfolio.search'));
			var codeset_portfolio = JSON.parse(jQuery.f.s_get('master_portfolio.master_portfolio.codeset_search'));
			var afa_return = JSON.parse(jQuery.f.s_get('olap_nav.portfolio_return.search_last'));
			var afa_nav = JSON.parse(jQuery.f.s_get('olap_nav.portfolio_nav.search_last'));

			if (afa_return == null) {
				console.log('olap_nav.portfolio_return.search_last is null')
				return false;
			}

			var data = $linx(afa_nav)
				.join(master_portfolio, 'x => x.PortfolioID', 'x => x.PortfolioID', "(o, i) => jQuery.extend({}, o, i)")
				.join(ccy, 'x => x.CcyID', 'x => x.CcyID', "(o, i) => jQuery.extend({}, o, i)")
				.join(asset_type, 'x => x.AssetTypeID', 'x => x.AssetTypeID', "(o, i) => jQuery.extend({}, o, i)")
				.groupJoin(afa_return, 'x => x.PortfolioID + x.PositionDate', 'x => x.PortfolioID + x.PositionDate', 
					function (o, i){
						return $linx(i)
							.defaultIfEmpty({FieldData:''})
							.select(function (x) { return jQuery.extend({}, o, x) })
							.toArray();
					}
				)
				.selectMany("x => x")
				.groupJoin(codeset_portfolio,	'x => x.PortfolioID + 22', 'x => x.PortfolioID + x.FieldID', 
					function (o, i){
						return $linx(i)
							.defaultIfEmpty({FieldData:''})
							.select(function (x) { return jQuery.extend({}, o, {RiskScore:x.FieldData}) })
							.toArray();
					}
				)
				.selectMany("x => x")
				.groupJoin(codeset_portfolio,	'x => x.PortfolioID + 6', 'x => x.PortfolioID + x.FieldID', 
					function (o, i){
						return $linx(i)
							.defaultIfEmpty({FieldData:''})
							.select(function (x) { return jQuery.extend({}, o, {InvestmentGoal:x.FieldData}) })
							.toArray();
					}
				)
				.selectMany("x => x")
				.groupJoin(codeset_portfolio,	'x => x.PortfolioID + 14', 'x => x.PortfolioID + x.FieldID', 
					function (o, i){
						return $linx(i)
							.defaultIfEmpty({FieldData:''})
							.select(function (x) { return jQuery.extend({}, o, {SubsFee:x.FieldData}) })
							.toArray();
					}
				)
				.selectMany("x => x")
				.groupJoin(codeset_portfolio,	'x => x.PortfolioID + 15', 'x => x.PortfolioID + x.FieldID', 
					function (o, i){
						return $linx(i)
							.defaultIfEmpty({FieldData:''})
							.select(function (x) { return jQuery.extend({}, o, {RedeemFee:x.FieldData}) })
							.toArray();
					}
				)
				.selectMany("x => x")
				.groupJoin(codeset_portfolio,	'x => x.PortfolioID + 16', 'x => x.PortfolioID + x.FieldID', 
					function (o, i){
						return $linx(i)
							.defaultIfEmpty({FieldData:''})
							.select(function (x) { return jQuery.extend({}, o, {SwitchingFee:x.FieldData}) })
							.toArray();
					}
				)
				.selectMany("x => x")
				.toArray();

			console.log(data);
			set_data(el, data);
		});

		function set_data(dom, data) {
			jQuery.each(data, function(i, v){
				var id = jQuery.f.newGuid();
				var layout = jQuery( 
				'   <div class="items-row cols-1 row-0">  '  + 
				'       <div class="span12">  '  + 
				'           <div class="item column-1">  '  + 
				'               <div class="wraptitle">  '  + 
				'                   <div class="page-header">  '  + 
				'                       <h2 id="_param_portfolio_name">Avrist Balance Cross Sectoral</h2>  '  + 
				'                   </div>  '  + 
				'               </div>  '  + 
				'               <div class="wrapcontent">  '  + 
				'                   <div class="wrapblogimg"><div class="wrapimg"><img id="_param_portfolio_image" src="" /></div></div>  '  + 
				'                   <div class="wrapcontentinside">  '  + 
				'                       <div class="divWrap">  '  + 
				'                           <div class="column colNav">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell">  '  + 
				'                                       <h3>NAV/Unit</h3>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_nav_per_unit" class="divCell">0.00</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div id="_param_position_date" class="divCell date">23 Aug 2018</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-4">  '  + 
				'                                   <div class="divCell">  '  + 
				'                                       <div class="boxlevel">  '  + 
				'                                           <ul class="wraplevel">  '  + 
				'                                               <li id="_param_risk_score1"><span>1</span></li>  '  + 
				'                                               <li id="_param_risk_score2"><span>2</span></li>  '  + 
				'                                               <li id="_param_risk_score3"><span>3</span></li>  '  + 
				'                                               <li id="_param_risk_score4"><span>4</span></li>  '  + 
				'                                               <li id="_param_risk_score5"><span>5</span></li>  '  + 
				'                                           </ul>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-5">  '  + 
				'                                   <div class="divCell desclevel">  '  + 
				'                                       <div class="wrapdesclevel">  '  + 
				'                                           <span class="left">Konservatif</span>&nbsp;<span class="right">Agresif</span>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-6">  '  + 
				'                                   <div class="divCell">  '  + 
				'                                       <div class="readmore">  '  + 
				'                                           <a id="_param_btn_detail" class="btn" href="javascript:void(0)">  '  + 
				'                                               <span class="text">Lihat Detail</span>  '  + 
				'                                           </a>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="column colMTD">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell"><h3>MTD</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_mtd" class="divCell percent">3,96%</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div class="divCell"><h3>1Y</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-4">  '  + 
				'                                   <div id="_param_1y" class="divCell percent">11,58%</div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="column colYTD">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell"><h3>YTD</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_ytd" class="divCell percent">8,52%</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div class="divCell"><h3>2Y</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-4">  '  + 
				'                                   <div id="_param_2y" class="divCell percent">14,12%</div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="column colTujuan">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell colinvest"><h3>Tujuan Investasi</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_investment_goal" class="divCell colinvest descinvest">Avrist Balance - Cross Sectoral (ABCS) bertujuan untuk memberikan keseimbangan  '  + 
				'                                       antara pertumbuhan nilai investasi dengan volatilitasnya, dengan berinvestasi pada efek bersifat ekuitas, efek surat utang,  '  + 
				'                                       dan instrumen uang di Indonesia.  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div class="divCell colinvest">  '  + 
				'                                       <div class="colfee">  '  + 
				'                                           <span class="subscription">  '  + 
				'                                               <ul>  '  + 
				'                                                   <li class="label">Subscription Fee:</li>  '  + 
				'                                                   <li id="_param_subs_fee" class="percent">1%</li>  '  + 
				'                                               </ul>  '  + 
				'                                           </span>  '  + 
				'                                           <span class="redemption">  '  + 
				'                                               <ul>  '  + 
				'                                                   <li class="label">Redemption Fee:</li>  '  + 
				'                                                   <li id="_param_redeem_fee" class="percent">1%</li>  '  + 
				'                                               </ul>  '  + 
				'                                           </span>  '  + 
				'                                           <span class="switching">  '  + 
				'                                               <ul>  '  + 
				'                                                   <li class="label">Switching Fee:</li>  '  + 
				'                                                   <li id="_param_switching_fee" class="percent">0.5%</li>  '  + 
				'                                               </ul>  '  + 
				'                                           </span>  '  + 
				'                                           <div class="clean"></div>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="clean"></div>  '  + 
				'                       </div>  '  + 
				'                       <div class="clean"></div>  '  + 
				'                   </div>  '  + 
				'                   <div class="clean"></div>  '  + 
				'               </div>  '  + 
				'               <div class="clean"></div>  '  + 
				'           </div>  '  + 
				'           <div class="clean"></div>  '  + 
				'           <!-- end item -->   '  + 
				'       </div>  '  + 
				'       <!-- end span -->   '  + 
				'   </div>  '  + 
				'  <!-- end row -->  '
				);
				var img = repos_url+'/portfolio/'+v.PortfolioCode+'.png';
				layout.find('#_param_portfolio_name').html(v.PortfolioNameShort);
				layout.find('#_param_portfolio_image').attr('src', img);
				layout.find('#_param_nav_per_unit').html(accounting.formatMoney(v.NAVperUnit, '', 2, ".", ","));
				layout.find('#_param_position_date').html(moment(v.PositionDate).format('DD MMM YYYY'));
				if (v.RiskScore) {
					for (var i=1; i <= v.RiskScore; i++) 
						layout.find('#_param_risk_score'+i).attr('class', 'activelevel');
				}
				layout.find('#_param_mtd').html(accounting.formatMoney(v.rMTD*100, '', 2, ".", ",")+'%');
				layout.find('#_param_ytd').html(accounting.formatMoney(v.rYTD*100, '', 2, ".", ",")+'%');
				layout.find('#_param_1y').html(accounting.formatMoney(v.r1Y*100, '', 2, ".", ",")+'%');
				layout.find('#_param_2y').html(accounting.formatMoney(v.r2Y*100, '', 2, ".", ",")+'%');
				layout.find('#_param_investment_goal').html(v.InvestmentGoal);
				layout.find('#_param_subs_fee').html(v.SubsFee);
				layout.find('#_param_redeem_fee').html(v.RedeemFee);
				layout.find('#_param_switching_fee').html(v.SwitchingFee);
				layout.find('#_param_btn_detail').data('simpi_id', v.simpiID).data('portfolio_id', v.PortfolioID);
				dom.append(layout);
			});
		}
	}
	
	jQuery(document).on('click', '#_param_btn_detail', function(e) {
		var simpi_id = jQuery(this).data('simpi_id');
		var portfolio_id = jQuery(this).data('portfolio_id');

		// console.log(simpi_id, portfolio_id);
		// return false;

		var layout = jQuery(
			'<div id="_param_chart_nav"></div>' +
			'<div id="_param_chart_top_sector_eq"></div>' +
			'<div id="_param_chart_top_sector_eq"></div>'
		);
		// =======================
		// Performance Year To Date / Kinerja Sejak Awal Tahun / id="line-chart"
		// =======================
		populate_chart_nav(this, simpi_id, portfolio_id);

		// // =======================
		// // Top 5 Stock NAV / Efek dalam Portfolio (Top 5) / id="tablePortfolio"
		// // =======================
		// populate_top_stock_nav(simpi_id, portfolio_id, data.result);
		
		// var asset_type = jQuery('#'+simpi_id+'_'+portfolio_id).find('#asset_type').html();
		// if (asset_type.toUpperCase() == 'EQ') {

		// 	// =======================
		// 	// Sector EQ / Alokasi Sektor (Top 5) / id="doughnut-chart"
		// 	// =======================
		// 	populate_top_sector_eq(simpi_id, portfolio_id, data.result);
			
		// } else {
			
		// 	// =======================
		// 	// Sector Non EQ / Asset Class / id="tableAssetClass"
		// 	// =======================
		// 	populate_top_sector_non_eq(simpi_id, portfolio_id, data.result);

		// }
	});
	
	jQuery(window).on("resize", function() {
		jQuery(document).find('[id="line-chart"]').each(function(e){
			if (jQuery(this).attr('_echarts_instance_'))
				echarts.getInstanceById(jQuery(this).attr('_echarts_instance_')).resize();
		});
	});

	function populate_chart_nav(parent, simpi_id, portfolio_id) {
		// check existing element container
		var el = jQuery(document).find('[id="_param_chart_nav"]');
		if (el.length < 1) return false;
		// var id = simpi_id+'_'+portfolio_id;
		// var el = '<div id="'+id+'" class="wrapcontent"></div>';
		// jQuery(parent).closest('div.item').append(jQuery(el).html('yajdfjklasdklfj;klsdj;fkl'));
		// return false;

		jQuery.when(
			get_data(api_url, 'portfolio.chart_nav', {simpi_id: simpi_id, portfolio_id: portfolio_id}, true),
		).then(function(a){
			var chart_nav = JSON.parse(jQuery.f.s_get('portfolio.chart_nav'));
			console.log(chart_nav);
		});

		// function get_data() {
		// 	var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "portfolio.chart_nav", params:{"simpi_id":simpi_id,"portfolio_id":portfolio_id}}; 
		// 	jQuery.ajax({ data: JSON.stringify(data_request),
		// 		success: function(data) {
		// 			// console.log(data);
		// 			if (data.status) {
		// 				set_data(el, data.result);
		// 			} else {
		// 				console.log('loadDataLineChart: status:false', data);
		// 			}
		// 		},
		// 	});
		// }

		function set_data(el, data) {
			var x_axis = [], y_axis = [];
			jQuery.each(data, function(i){ 
				// y_axis.push(accounting.formatMoney(data[i].line1 * 100, '', 2, ".", ","));
				y_axis.push(data[i].line1 * 100);
				x_axis.push(moment(data[i].PositionDate).format('DD MMM YYYY'));
			});
			
			// var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#line-chart').html('');
			var dom = el.html('');
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
	}
	
	function populate_top_sector_eq(simpi_id, portfolio_id, o) {
		get_data();

		function get_data() {
			var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "portfolio.top_sector_eq", params:{"simpi_id":simpi_id,"portfolio_id":portfolio_id}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(simpi_id, portfolio_id, data.result);
					} else {
						jQuery('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html(data.message);
					}
				},
			});
		}

		function set_data(simpi_id, portfolio_id, data) {
			var data_legend = [], data_chart = [], sumPercent = 0;
			jQuery.each(o, function(i){ 
				sumPercent = sumPercent + (o[i].Percent * 100);
				data_legend.push(o[i].SectorName);
				data_chart.push({"value":o[i].Percent * 100, "name":o[i].SectorName});
			});
			// Add Others
			data_legend.push('OTHERS');
			data_chart.push({"value":(100 - sumPercent), "name":"OTHERS"});
	
			console.log(data_chart);
			var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html('');
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
				color: ["#f62d51", "#009efb", "#55ce63", "#ffbc34", "#2f3d4a", "#6f42c1"],
				calculable: true,
				series: [{
						name: 'Source',
						type: 'pie',
						radius: ['50%', '70%'],
						data: data_chart
				}]
			};
			mytempChart.setOption(option, true);
		}
	}
	
	function populate_top_sector_non_eq(simpi_id, portfolio_id, o) {
		get_data();

		function get_data() {
			var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "portfolio.top_sector_non_eq", params:{"simpi_id":simpi_id,"portfolio_id":portfolio_id}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(simpi_id, portfolio_id, data.result);
					} else {
						jQuery('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html(data.message);
					}
				},
			});
		}

		function set_data(simpi_id, portfolio_id, data) {
			var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#tableAssetClass');
			dom.html('');
			var tbl_class = dom.attr('class');
			
			var container = jQuery('<div class="'+tbl_class+'"><table class="table" style="margin-bottom:0px;"><thead></thead><tbody></tbody></table></div>'),
					table = container.find('table'),
					thead = container.find('thead'),
					tbody = container.find('tbody');
					
			// TABLE DETAIL
			if (o) {
				var sumPercent = 0;
				jQuery.each(o, function(i){
					var tr = jQuery('<tr />');
					jQuery.each(o[i], function(j){
						if (j=='Percent') {
							sumPercent = sumPercent + (o[i][j]*100);
							tr.append( jQuery('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(o[i][j]*100, '', 2, ".", ",")+' %') );
						} else	
							tr.append( jQuery('<td style="padding:0px; font-size:12px;" />').html(o[i][j]) );
					});
					tr.appendTo(tbody);
				});
				
				// Add Liquidity
				var tr = jQuery('<tr />');
				tr.append( jQuery('<td style="padding:0px; font-size:12px;" />').html('LIQUIDITY') );
				tr.append( jQuery('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(100-sumPercent, '', 2, ".", ",")+' %') );
				tr.appendTo(tbody);
	
				dom.append(container);
			} else {
				dom.html('Record not found');
			}
		}
	}
	
	function populate_top_stock_nav(simpi_id, portfolio_id, o) {
		get_data();

		function get_data() {
			var data_request = {id: jQuery.f.newRndNum, agent: agent, appcode: appcode, lang: lang, method: "portfolio.top_stock_nav", params:{"simpi_id":simpi_id, "portfolio_id":portfolio_id, "fields":"SecuritiesNameShort,TypeDescription,Percent"}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(simpi_id, portfolio_id, data.result);
					} else {
						jQuery('#'+simpi_id+'_'+portfolio_id).find('#tablePortfolio').html(data.message);
					}
				},
			});
		}

		function set_data(simpi_id, portfolio_id, data) {
			var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#tablePortfolio').html('');
			var tbl_class = dom.attr('class');
			
			var container = jQuery('<div class="'+tbl_class+'"><table class="table" style="margin-bottom:0px;"><thead></thead><tbody></tbody></table></div>'),
					table = container.find('table'),
					thead = container.find('thead'),
					tbody = container.find('tbody');
			
			// TABLE HEADER
			// if (o.showheader){
				// var tr = jQuery('<tr />');
				// jQuery.each(o.columns, function(j){
					// if (c==1){ if (o.rowno){ tr.append( jQuery('<th />').html('#') ); } }
					// tr.append( jQuery('<th />').html(o.columns[j]['title']) );
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
				jQuery.each(o, function(i){
					var tr = jQuery('<tr />');
					jQuery.each(o[i], function(j){
						if (j=='Percent')
							tr.append( jQuery('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(o[i][j]*100, '', 2, ".", ",")+' %') );
						else	
							tr.append( jQuery('<td style="padding:0px; font-size:12px;" />').html(o[i][j]) );
					});
					tr.appendTo(tbody);
				});
				dom.append(container);
			} else {
				dom.html('Record not found');
			}
		}
	}
	
});