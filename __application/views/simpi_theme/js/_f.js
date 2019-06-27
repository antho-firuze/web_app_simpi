/**
 * This are a bunch of js scripts 
 * 
 * Author: Ahmad hertanto
 * 
 */
var f = {};
f.newGuid = function(){
	/**
	* Generate random GUID
	*
	* @returns string 
	*/
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};
f.newRndNum = function(){
	/**
	* Generate random Number
	*
	* @returns integer 
	*/
	return Math.floor(Math.random()*1000)+1;
};
f.count = function(o){
	/**
	 * Count array/object 
	 * 
	 * @returns integer
	 */
	if (Array.isArray(o))
		return o.length;
	else 
		return Object.keys(o).length;
};
f.is_empty = function(o) {
	/**
	 * Check object or array are empty 
	 * 
	 * @param boolean
	 */
	if (o == undefined) return true;

	if (Array.isArray(o)) 
		return (arr.length > 0) ? false : true;
	else
		return (Object.keys(o).length > 0) ? false : true;
}
f.s_set = function(name, val) {
	/**
	* Store a new settings in the browser
	*
	* @param String name Name of the setting
	* @param String val Value of the setting
	* @returns void
	*/
	if (typeof (Storage) !== "undefined") {
		sessionStorage.setItem(name, val);
	} else {
		window.alert('Please use a modern browser to properly view this template!');
	}
}
f.s_get = function(name) {
	/**
	* Get a prestored setting
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	if (typeof (Storage) !== "undefined") {
		return sessionStorage.getItem(name);
	} else {
		window.alert('Please use a modern browser to properly view this template!');
	}
}
f.s_rem = function(name) {
	/**
	* Remove a prestored setting
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	if (typeof (Storage) !== "undefined") {
		if (name)
			return sessionStorage.removeItem(name);
		else
			return sessionStorage.clear();
	} else {
		window.alert('Please use a modern browser to properly view this template!');
	}
}

// ============================
// = jQuery function extended =
// ============================
/**
* Serialize tag type form
*
* @param String type Output type of data 'json' or 'object'
* @returns json/object
*/
jQuery.fn.serialize = function (type) {
	if (typeof (type) == 'undefined') type = 'object';
	type = type.toLowerCase();

	var o = {};
	// Exclude Select Element
	var a = this.find('[name]').not('select').serializeArray();
	var dom = jQuery(this);
	jQuery.each(a, function (i, v) {
		var value_before = dom.find('[name="' + v.name + '"]').data('before');

		v.value = (v.value == 'on') ? '1' : v.value;
		if (jQuery.trim(v.value) != jQuery.trim(value_before))
			o[v.name] = o[v.name] ? o[v.name] || v.value : v.value;
	});

	// Only Select Element
	var a = this.find('select').serializeArray();
	jQuery.each(a, function (i, v) {
		var value_before = dom.find('[name="' + v.name + '"]').data('before');

		if (o[v.name]) {
			o[v.name] += ',' + v.value;
		} else {
			if (jQuery.trim(v.value) != jQuery.trim(value_before)) {
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
jQuery.fn.populate = function (o) {
	var dom = jQuery(this);
	jQuery.each(o, function (i) {
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
	jQuery.each(dom.find('input'), function (i, el) {
		var el = jQuery(el);
		if (el.attr('required')) {
			if (el.parent().find('label').length > 0) {
				if (el.parent().find('label span').length < 1) {
					el.parent().find('label').append(jQuery('<span style="color:red" />').html(' *'));
				}
			}
		}
	});
	jQuery.each(dom.find('select'), function (i, el) {
		var el = jQuery(el);
		if (el.attr('required')) {
			if (el.parent().find('label').length > 0) {
				if (el.parent().find('label span').length < 1) {
					el.parent().find('label').append(jQuery('<span style="color:red" />').html(' *'));
				}
			}
		}
	});
};

jQuery.f = f;

// =================================
// ======= Global Functions ========
// =================================
function get_data(url, method, params, force) {
	params = (params == undefined || params == {}) ? {} : params;
	force = (force == undefined || !force) ? false : true;

	if (f.s_get(method))
		if (!force) {
			if (is_local) console.log([true, 'Already on stream', method]);
			return [true, 'Already on stream', method];
		}

	var data_request = {id: f.newRndNum(), agent: agent, appcode: appcode, lang: lang, method: method, params: params};
	return jQuery.ajax({ url: url, data: JSON.stringify(data_request), method:'POST', async:true, dataType:'json',
		success: function(data) {
			if (data.status) {
				f.s_set(method, JSON.stringify(data.result));
			}
		}
	});
}

