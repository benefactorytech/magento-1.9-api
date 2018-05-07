window.shouldCheckByDefault = true;
window.bfsku = "benefactory_contribution";
window.itemId = 0;
window.checkboxId = "#bf_contribution";


function check_for_product(){
	var sokShops = _sokShops;
	var cart = sokShops["cart"];
	var cart_count = Object.keys(cart).length;
	for(key in cart){
		var cart_object = cart[key];
		for(key in cart_object){
			var product_object = cart_object[key];
			try{
				var sku_id = cart_object.sku_id[0];
				if(sku_id == window.bfsku){
					return true;
				}
			}catch(e){

			}
		}
	}
	return false;
}

var productAddToCartForm = new VarienForm('product_addtocart_form');
productAddToCartForm.submit = function(){
	var form = document.forms.namedItem("bf-form");
	var oldUrl = form.action;
	console.log(form.action);

	var e = null;
	try{
		form.submit();
	}catch(e){
		console.log(e);
	}
}.bind(productAddToCartForm);

function productRemoveFromCart(){
	var before_bf = document.getElementById("before_bf");
	var after_bf = document.getElementById("after_bf");
	var product_cart_infos = document.getElementsByClassName("product-details");
	var product_exists = false;
	var source = null;

	for(var i = 0; i < product_cart_infos.length; i++){
		var innerHtml = product_cart_infos[i].innerHTML;
		var n = innerHtml.search("contribute-to-helping-causes-at-benefactory.html");
		if(n == -1){
			continue;
		}else{
			product_exists = true;
			source = innerHtml.toString();
			break;
		}
	}
	if(product_exists){
		var pipe = source.search("delete");
		var a_start = source.search("<a href=");
		var a_end = null;
		if(a_start < pipe){
			var a_end = source.search(" title");
			var a_href = source.slice(a_start, a_end).trim();
			a_start = a_href.search('"');
			a_end = a_href.length;
			var href = a_href.slice(a_start+1, a_end-1);
			console.log(href);
			window.location.href = href;
		}
	}
}


jQuery(document).ready(function(){
	if(check_for_product()){
		jQuery("#bf_contribution").attr("checked", true);
	}else{
		jQuery("#bf_contribution").attr("checked", false);
		var status = getCookie("manual_delete");
		if(status == "true"){
			console.log("manually deleted...ignoring");
		}else{
			productAddToCartForm.submit();
		}
	}

	jQuery("#bf_contribution").click(function(){
		if(check_for_product()){
			document.cookie = "manual_delete=true;";
			productRemoveFromCart();
		}else{
			productAddToCartForm.submit();
		}
	});
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}