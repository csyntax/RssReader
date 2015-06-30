(function($){
	$.fn.rssreader = function(url, options, fn) {
		var options = $.extend({
			limit: 10,
			_offset: 1,
			header: true,
			titletag: "h4",
			date: true,
			content: true,
			_snippet: true,
			showerror: true,
			errormsg: "",
			linktarget: "_blank",
			_linkredirect: "",
		}, options);

		return this.each(function(i, e) {
			var s = "";

			if (!$(e).hasClass("rssreader")) {
				$(e).addClass("rssreader");
			}

			if(url == null) {
				return false;
			}

			var apiUrl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=";
			var api = apiUrl + encodeURIComponent(url) + "&num=" + options.limit +"&output=json_xml";

			$.getJSON(api, function(data){
				if (data.responseStatus == 200) {
					_process(e, data.responseData, options);

					if ($.isFunction(fn)) {
						fn.call(this, $(e));
					}
				} else {
					if (options.showerror)
						if (options.errormsg != "") {
							var msg = options.errormsg;
						} else {
							var msg = data.responseDetails;
						};

						$(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
				};
			});
		});
	};

	function _process(e, data, options) {
		var feeds = data.feed;
		var rowArray = [];
		var rowIndex = 0;
		var html = "";
		var row = "odd";

		if (!feeds) {
			return false;
		}

		if (options.header) {
			html +=	'<div class="rssHeader">' +
				'<a href="'+feeds.link+'" title="'+ feeds.description +'">'+ feeds.title +'</a>' +
				'</div>';
	 	}

		html += '<div class="rssBody">' + '<ul>';

		for (var i = options._offset; i < feeds.entries.length; i++) {
			rowIndex = i - options._offset;
			rowArray[rowIndex] = [];

			var entry = feeds.entries[i];
			var pubDate;
			var feedLink = entry.link;

			if (entry.publishedDate) {
				var entryDate = new Date(entry.publishedDate);
				var pubDate = entryDate.toLocaleDateString() + " " + entryDate.toLocaleTimeString();
			}

			if (options._linkredirect) {
				feedLink = encodeURIComponent(feedLink);
			}

			rowArray[rowIndex]["html"] =
				'<'+ options.titletag +'><a href="'+ options._linkredirect + feedLink +'" title=" '+
				 feeds.title +'">'+ entry.title +'</a></'+ options.titletag +'>'

			if (options.date && pubDate){
				rowArray[rowIndex]["html"] += "<div>"+ pubDate + "</div>"
			}

			if (options.content) {
				if (options._snippet && entry.content_snippet != "") {
					var content = entry.content_snippet;
				} else {
					var content = entry.content;
				}

				rowArray[rowIndex]["html"] += "<p>" + content + "</p>"
			}
		}

		$.each(rowArray, function(e) {
			html += '<li class="rssRow '+ row +'">' + rowArray[e]["html"] + '</li>';

			if (row == "odd") {
				row = "even";
			} else {
				row = "odd";
			}
		});

		html += "</ul>" + "</div>";

		$(e).html(html);

		$("a", e).attr("target", options.linktarget);
	}

	function _formatFilesize(bytes) {
		var s = [
			"bytes",
			"kb",
			"MB",
			"GB",
			"TB",
			"PB"
		];
		var e = Math.floor(Math.log(bytes)/Math.log(1024));

		return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
	}

 function _formatDate(date, mask) {
		var fmtDate = new Date(date);

		date = mask;

		date = date.replace("dd", _formatDigit(fmtDate.getDate()));
		date = date.replace("MMMM", _getMonthName(fmtDate.getMonth()));
		date = date.replace("MM", _formatDigit(fmtDate.getMonth()+1));
		date = date.replace("yyyy",fmtDate.getFullYear());
		date = date.replace("hh", _formatDigit(fmtDate.getHours()));
		date = date.replace("mm", _formatDigit(fmtDate.getMinutes()));
		date = date.replace("ss", _formatDigit(fmtDate.getSeconds()));

		return date;
	}

	function _formatDigit(digit) {
		digit += "";

		if (digit.length < 2) {
			digit = "0" + digit;
		}

		return digit;
	}

	function _getMonthName(month) {
		var name = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		];

		return name[month];
	}

	function _getXMLDocument(str) {
		var browser = navigator.appName;
		var xml;

		if (browser == "Microsoft Internet Explorer") {
			xml = new ActiveXObject("Microsoft.XMLDOM");
			xml.async = "false";
			xml.loadXML(str);
		} else {
			xml = (new DOMParser()).parseFromString(str, "text/xml");
		}

		return xml;
	}

	function _getLapsedTime(date) {
		var todayDate = new Date();
		var pastDate = new Date(date);
		var lapsedTime = Math.round((todayDate.getTime() - pastDate.getTime())/1000)

		if (lapsedTime < 60) {
			return "< 1 min";
		} else if (lapsedTime < (60*60)) {
			var t = Math.round(lapsedTime / 60) - 1;
			var u = "min";
		} else if (lapsedTime < (24*60*60)) {
			var t = Math.round(lapsedTime / 3600) - 1;
			var u = "hour";
		} else if (lapsedTime < (7*24*60*60)) {
			var t = Math.round(lapsedTime / 86400) - 1;
			var u = "day";
		} else {
			var t = Math.round(lapsedTime / 604800) - 1;
			var u = "week";
		}

		if (t > 1) {
			u += "s";
		}

		return t + " " + u;
	}
})(jQuery);
