// Common | Set cookie
function yottapaySetCookie(name, value, days) {
    var expires = '';

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

// Common | Check cookie exist
function yottapayCheckCookieExist(name) {
    var ca = document.cookie.split(';');

    if (ca.includes(name + '=1') || ca.includes(' ' + name + '=1')) {
        return true;
    } else {
        return false;
    }
}

// Common | Show default error notification
function yottapayShowErrorNotification(errorContainer, message = '') {
    if (errorContainer) {
        if (message != '') {
            errorContainer.innerHTML = (
                '<ul class="woocommerce_error woocommerce-error wc-stripe-error">'
                + '<li>' + message + '</li>'
                + '</ul>'
            );
        } else {
            errorContainer.innerHTML = (
                '<ul class="woocommerce_error woocommerce-error wc-stripe-error">'
                + '<li> Request failed.Please contact the store owner to solve the problem</li>'
                + '</ul>'
            );
        }
        try {
            window.scrollTo(0, 0);
        } catch (scrollE) {
            console.log(scrollE);
        }
    } else {
        if (message != '') {
            alert(message);
        } else {
            alert('Request failed. Please contact the store owner to solve the problem');
        }
    }
}

// Payment | Supercheckout
function yottapayPaymentSc() {
    //Get error container element
    var errorContainers = document.getElementsByClassName('woocommerce-notices-wrapper');
    if (errorContainers.length > 0) {
        var errorContainer = errorContainers[0];
    } else {
        var errorContainer = null;
    }

    //Get SC button boxes
    var btnYottaPayScCartProceedToCheckoutBox = jQuery('#btnYottaPayScCartProceedToCheckoutBox');
    var btnYottaPayScCheckoutAfterTermsAndConditionsBox = jQuery('#btnYottaPayScCheckoutAfterTermsAndConditionsBox');
    var btnYottaPayScCheckoutBeforeCheckoutBillingFormBox = jQuery('#btnYottaPayScCheckoutBeforeCheckoutBillingFormBox');

    //Block SC button boxes
    if (btnYottaPayScCartProceedToCheckoutBox != null) {
        btnYottaPayScCartProceedToCheckoutBox.block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });
    }
    if (btnYottaPayScCheckoutAfterTermsAndConditionsBox != null) {
        btnYottaPayScCheckoutAfterTermsAndConditionsBox.block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });
    }
    if (btnYottaPayScCheckoutBeforeCheckoutBillingFormBox != null) {
        btnYottaPayScCheckoutBeforeCheckoutBillingFormBox.block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });
    }

    //Call payment sc controller
    try {
        fetch('/wc-api/yottapay_payment_sc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw 'Check internet connection and try again.';
                }
            }).then((data) => {
                console.log(data);
                if (data.status == '1') {
                    window.location.href = data.link;
                } else {
                    //Show notification
                    yottapayShowErrorNotification(errorContainer, data.error);
                    //Unblock SC button boxes
                    if (btnYottaPayScCartProceedToCheckoutBox != null) {
                        btnYottaPayScCartProceedToCheckoutBox.unblock();
                    }
                    if (btnYottaPayScCheckoutAfterTermsAndConditionsBox != null) {
                        btnYottaPayScCheckoutAfterTermsAndConditionsBox.unblock();
                    }
                    if (btnYottaPayScCheckoutBeforeCheckoutBillingFormBox != null) {
                        btnYottaPayScCheckoutBeforeCheckoutBillingFormBox.unblock();
                    }
                }
            })
            .catch((promiseError) => {
                //Log error
                console.log(promiseError);
                //Show notification
                yottapayShowErrorNotification(errorContainer);
                //Unblock SC button boxes
                if (btnYottaPayScCartProceedToCheckoutBox != null) {
                    btnYottaPayScCartProceedToCheckoutBox.unblock();
                }
                if (btnYottaPayScCheckoutAfterTermsAndConditionsBox != null) {
                    btnYottaPayScCheckoutAfterTermsAndConditionsBox.unblock();
                }
                if (btnYottaPayScCheckoutBeforeCheckoutBillingFormBox != null) {
                    btnYottaPayScCheckoutBeforeCheckoutBillingFormBox.unblock();
                }
            });
    } catch (e) {
        //Log error
        console.log(e);
        //Show notification
        yottapayShowErrorNotification(errorContainer);
        //Unblock SC button boxes
        if (btnYottaPayScCartProceedToCheckoutBox != null) {
            btnYottaPayScCartProceedToCheckoutBox.unblock();
        }
        if (btnYottaPayScCheckoutAfterTermsAndConditionsBox != null) {
            btnYottaPayScCheckoutAfterTermsAndConditionsBox.unblock();
        }
        if (btnYottaPayScCheckoutBeforeCheckoutBillingFormBox != null) {
            btnYottaPayScCheckoutBeforeCheckoutBillingFormBox.unblock();
        }
    }
}

// Loyalty | Set cookie to hide loyalty popup
function yottapaySetLoyaltyMonthCookie() {
    if ( confirm('Don\'t show again?') ) {
        yottapaySetCookie('yottapay_loyalty_month_popup', '1', '30');
        //Hide Loyalty popup
        var $b = jQuery.noConflict(true);
        $b('#yottapayLoyaltyPopup').hide();
    }
}

// Loyalty | Process create deferred
function yottapayCreateDeferred(orderId) {
    //Get error container element
    var errorContainers = document.getElementsByClassName('woocommerce-notices-wrapper');

    if (errorContainers.length > 0) {
        var errorContainer = errorContainers[0];
    } else {
        var errorContainer = null;
    }

    //Call loyalty controller
    try {
        fetch('/wc-api/yottapay_loyalty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'order_id': orderId })
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw 'Check internet connection and try again.';
                }
            }).then((data) => {
                console.log(data);

                if (data.status == '1') {
                    window.location.href = data.link;
                } else {
                    yottapayShowErrorNotification(errorContainer);
                }
            })
            .catch((promiseError) => {
                console.log(promiseError);
                yottapayShowErrorNotification(errorContainer);
            });
    } catch (e) {
        console.log(e);
        yottapayShowErrorNotification(errorContainer);
    }
}
