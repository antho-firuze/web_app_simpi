/*
Description: This is script for authenticating Simpipro Web Application
Author: Ahmad hertanto
Email: antho.firuze@gmail.com
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
var api_olap_url   	 = jQuery.f.s_get('api_olap_url');
var api_system_url   = jQuery.f.s_get('api_system_url');
var api_market_url   = jQuery.f.s_get('api_market_url');
var api_master_url   = jQuery.f.s_get('api_master_url');
var base_url  = jQuery.f.s_get('base_url');
var theme_url = jQuery.f.s_get('theme_url');
var repos_url = jQuery.f.s_get('repos_url');
var is_local = jQuery.f.s_get('is_local');

jQuery(function () {
	"use strict";
	
	/**
	 * Set Default Ajax Setting
	 */
	// jQuery.ajaxSetup({ method:'POST', async:true, dataType:'json' });
	// jQuery(document).ajaxError(function( event, request, settings ) {
	// 	console.log("Error requesting page: " + settings.url);
	// 	console.log("With data: " + settings.data);
	// });
	
	// ============================================================== 
	// Initial Procedure
	// ============================================================== 
	
		jQuery.when(
			get_data('parameter_market.master_securities.ccy'),
			get_data('parameter_master.parameter_portfolio.asset_type'),
			get_data('master_portfolio.master_portfolio.search'),
			get_data('master_portfolio.master_portfolio.codeset_search'),
			get_data('olap_nav.portfolio_return.search_last'),
			get_data('olap_nav.portfolio_nav.search_last')
		).then(function(a, b, c, d, e, f){
			// console.log(a, b, c, d, e, f);
			var ccy = JSON.parse(jQuery.f.s_get('parameter_market.master_securities.ccy'));
			var asset_type = JSON.parse(jQuery.f.s_get('parameter_master.parameter_portfolio.asset_type'));
			var master_portfolio = JSON.parse(jQuery.f.s_get('master_portfolio.master_portfolio.search'));
			var codeset_portfolio = JSON.parse(jQuery.f.s_get('master_portfolio.master_portfolio.codeset_search'));
			var afa_return = JSON.parse(jQuery.f.s_get('olap_nav.portfolio_return.search_last'));
			var afa_nav = JSON.parse(jQuery.f.s_get('olap_nav.portfolio_nav.search_last'));

			var portfolio = $linx(afa_nav)
				.join(master_portfolio, 'x => x.PortfolioID', 'x => x.PortfolioID', "(o, i) => jQuery.extend({}, o, i)")
				.join(ccy, 'x => x.CcyID', 'x => x.CcyID', "(o, i) => jQuery.extend({}, o, i)")
				.join(asset_type, 'x => x.AssetTypeID', 'x => x.AssetTypeID', "(o, i) => jQuery.extend({}, o, i)")
				.groupJoin(afa_return, 'x => x.PortfolioID, x.PositionDate', 'x => x.PortfolioID, x.PositionDate', 
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

			// var x = $linx(afa_nav)
			// 	.join(portfolio, 'x => x.PortfolioID', 'x => x.PortfolioID', "(o, i) => jQuery.extend({}, o, i)")
			// 	.toArray();
			// console.log(x);
			console.log(portfolio);
			// var el = jQuery(document).find('[id="result"]');
			// el.html(JSON.stringify(x));
		});

		// var el = jQuery(document).find('[id="olap"]');
		// var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"test.from_olap"}; 
		// jQuery.ajax({ 
		// 	data: JSON.stringify(data_request),
		// 	success: function(data) {
		// 		if (data.status) {
    //       el.html(JSON.stringify(data.result));
		// 		} else {
		// 			el.html('');
		// 		}
		// 	},
    // });
    
    // var el2 = jQuery(document).find('[id="master"]');
		// var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"test.from_master"}; 
		// jQuery.ajax({ 
		// 	data: JSON.stringify(data_request),
		// 	success: function(data) {
		// 		if (data.status) {
    //       el2.html(JSON.stringify(data.result));
		// 		} else {
		// 			el2.html('');
		// 		}
		// 	},
		// });
    
    var from_olap = [{"simpiID":"812","PortfolioID":"120"},{"simpiID":"812","PortfolioID":"50"},{"simpiID":"812","PortfolioID":"51"},{"simpiID":"812","PortfolioID":"52"},{"simpiID":"812","PortfolioID":"53"},{"simpiID":"812","PortfolioID":"54"},{"simpiID":"812","PortfolioID":"55"},{"simpiID":"812","PortfolioID":"56"},{"simpiID":"812","PortfolioID":"57"},{"simpiID":"812","PortfolioID":"58"},{"simpiID":"812","PortfolioID":"59"},{"simpiID":"812","PortfolioID":"60"}];
    var from_master = [{"PortfolioID":"50","PortfolioCode":"ABCS","PortfolioNameShort":"Avrist Balanced Cross Sectoral"},{"PortfolioID":"51","PortfolioCode":"AECS","PortfolioNameShort":"Avrist Equity Cross Sectoral"},{"PortfolioID":"52","PortfolioCode":"ABAS","PortfolioNameShort":"Avrist Balanced Amar Syariah"},{"PortfolioID":"53","PortfolioCode":"AEAS","PortfolioNameShort":"Avrist Equity Amar Syariah"},{"PortfolioID":"54","PortfolioCode":"APBF","PortfolioNameShort":"Avrist Prime Bond Fund"},{"PortfolioID":"55","PortfolioCode":"APIF","PortfolioNameShort":"Avrist Prime Income Fund"},{"PortfolioID":"56","PortfolioCode":"APFI","PortfolioNameShort":"Avrist Protected Fund I"},{"PortfolioID":"57","PortfolioCode":"ASIF","PortfolioNameShort":"Avrist Sukuk Income Fund"},{"PortfolioID":"58","PortfolioCode":"AAKAMU","PortfolioNameShort":"Avrist Ada Kas Mutiara"},{"PortfolioID":"59","PortfolioCode":"AASBUS","PortfolioNameShort":"Avrist Ada Saham Blue Safir"},{"PortfolioID":"60","PortfolioCode":"SPIRIT1","PortfolioNameShort":"AVRIST DANA TERPROTEKSI SPIRIT 1"},{"PortfolioID":"61","PortfolioCode":"INTAN","PortfolioNameShort":"AVRIST ADA KAS INTAN"},{"PortfolioID":"73","PortfolioCode":"Demo EQ 1","PortfolioNameShort":"Demo EQ 1"},{"PortfolioID":"75","PortfolioCode":"Demo EQ 2","PortfolioNameShort":"Demo EQ 2"},{"PortfolioID":"76","PortfolioCode":"Demo EQ 3","PortfolioNameShort":"Demo EQ 3"},{"PortfolioID":"77","PortfolioCode":"Demo FI 1","PortfolioNameShort":"Demo FI 1"},{"PortfolioID":"78","PortfolioCode":"Demo FI 2","PortfolioNameShort":"Demo FI 2"},{"PortfolioID":"79","PortfolioCode":"Demo FI 3","PortfolioNameShort":"Demo FI 3"},{"PortfolioID":"80","PortfolioCode":"Sales Referral","PortfolioNameShort":"Sales Referral"},{"PortfolioID":"81","PortfolioCode":"SPIRIT2","PortfolioNameShort":"AVRIST DANA TERPROTEKSI SPIRIT 2"}];

		// plugins/jlinq-beta/jlinq.js =================
		// var a = jlinq.from(from_olap).join(from_master, "portfolio", "PortfolioID", "PortfolioID", {"PortfolioCode":"null"})
    //   .select(function(r){ return {"simpiID":r.simpiID, "PortfolioID":r.PortfolioID, "PortfolioCode":r.portfolio.PortfolioCode}; });
    // var el = jQuery(document).find('[id="result"]');
		// el.html(JSON.stringify(a));
		
		// plugins/js-linq/jslinq.js ===================
		// var a = linq.from(from_olap).join(from_master, 
		// 	'x => x.PortfolioID', 
		// 	'x => x.PortfolioID', 
		// 	"(outer, inner) => {'simpiID':outer.simpiID, 'PortfolioID':outer.PortfolioID, 'PortfolioCode':inner.PortfolioCode}")
		// 	.orderBy('x => x.PortfolioID')
		// 	.toArray();
    // var el = jQuery(document).find('[id="result"]');
		// el.html(JSON.stringify(a));

		// plugins/linq.js/linq.js =====================
		var a = $linx(from_olap)
			// .join(
			// 	from_master, 
			// 	'x => x.PortfolioID', 
			// 	'x => x.PortfolioID', 
			// 	"(o, i) => {simpiID: o.simpiID, portfolio: {id: o.PortfolioID, code: i.PortfolioCode, name: i.PortfolioNameShort}}")
			// .toArray();
			.groupJoin(
				from_master, 
				'x => x.PortfolioID', 
				'x => x.PortfolioID', 
				function (o, i){
					return $linx(i)
            .defaultIfEmpty({PortfolioCode:'',PortfolioNameShort:''})
            .select(function (x) { return {simpiID: o.simpiID, portfolio: {id: o.PortfolioID, code: x.PortfolioCode, name: x.PortfolioNameShort}}; })
            .toArray();
				})
			.selectMany("x => x")
			.toArray();
    // var el = jQuery(document).find('[id="result"]');
		// el.html(JSON.stringify(a));

		// var method = 'parameter_market.master_securities.ccy';
		// get_data(method, {}, false);
		// var methods = [
		// 	{method:'parameter_market.master_securities.ccy'},
		// 	{method:'parameter_master.parameter_portfolio.asset_type'},
		// 	{method:'master_portfolio.master_portfolio.search'},
		// 	{method:'master_portfolio.master_portfolio.codeset_search'},
		// 	{method:'olap_nav.portfolio_return.search_last'},
		// 	{method:'olap_nav.portfolio_nav.search_last'},
		// ];
		// get_batch_data(methods);
		jQuery(document).find('[id="olap"]').html();
	
});