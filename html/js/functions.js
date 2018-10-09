/**
 * 
 */

function login() {
    var usr = $("#un").val();
    var pwd = $("#pw").val();
    console.log(pwd + " = " + btoa(pwd));
    var payload = {
        un: usr,
        pw: btoa(pwd),
    };

    jQuery.ajax({
        url: "http://localhost:3002/customerByUN/" + $("#un").val(),
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(payload),
        success: function (data, textStatus, errorThrown) {
            if (data.name) {
                loginSuccessfull(data.name, data.points);
            } else {
                loginFailed(data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
        },
        timeout: 120000,
    });
};

function loginSuccessfull(name, points) {
    console.log("LOGIN SUCCESS");
    console.log(name);
    console.log(points);
    $("#cName").val(name);
    $("#cPoints").val(points);
    $("#login").hide();
    $("#ordering").show();
    $("#loginErr").text("");

    $("#loPoints").text(points);
    $("#CusName").text("Hello " + name + ", ");
};

function loginFailed(msg) {
    console.log("LOGIN FAILED: " + msg);
    $("#un").val("");
    $("#pw").val("");
    $("#loginErr").text("Login Failed: " + msg);

};

function updatePoints(lPoints) {
    jQuery.ajax({
        url: "http://localhost:3002/updatePoints/" + $("#un").val(),
        type: "PUT",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({ points: lPoints }),
        success: function (data, textStatus, errorThrown) {
            console.log(data.message);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
        },
        timeout: 120000,
    });
}

function getDetails() {
    console.log(Date.now());

    jQuery.ajax({
        url: "http://localhost:3001/foods",
        type: "GET",
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, errorThrown) {
            //here is your json.
            // process it
            jQuery.each(data, function (k, v) {
                // '<option value="'+ data[k].id +'">'+ data[k].name + ' - Rs.' + data[k].price +'</option>'
                var foodItem = ('<option value="' + data[k].id + '">' + data[k].name + ' - Rs.' + data[k].price + '</option>');
                console.log(data[k].id + ")" + data[k].name + " - Rs." + data[k].price);
                $('#foodList').append(foodItem);
            });

            $("#name").text(data[0].name);
            $("#price").text(data[0].price);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
        },
        timeout: 120000,
    });
};

function checkAddability() {
    var qty = $("#qty").val();
    $("#addable").hide();
    if (qty > 0) {
        $("#addable").show();
    } else {
        $("#addable").hide();
    }

};

function checkMobPayability() {
    var phone = $("#phone").val().length;
    console.log("Phone length: " + phone);
    var pin = $("#pin").val().length;
    $("#mobPayable").hide();
    if (phone == 10 && pin == 4) {
        $("#mobPayable").show();
    } else {
        $("#mobPayable").hide();
    }
};

function checkCredPayability() {
    var ccNo = $("#ccNo").val().length;
    var cvc = $("#cvc").val().length;
    var holder = $("#holder").val().length;
    $("#credPayable").hide();
    if (ccNo == 19 && cvc == 3 && holder > 0) {
        $("#credPayable").show();
    } else {
        $("#credPayable").hide();
    }
};

function mobilePayForm() {
    $("#mobilePaymentDetails").show();
    $("#creditPaymentDetails").hide();
};

function creditPayForm() {
    $("#creditPaymentDetails").show();
    $("#mobilePaymentDetails").hide();
};

function checkPayability() {
    console.log("checkPayability()");
    var tot = $("#totalAmount").text();
    console.log(tot);
    $("#payable").hide();
    if (tot > 0) {
        $("#payable").show();
    }

};

function addToCart() {
    console.log(Date.now());
    jQuery.ajax({
        url: "http://localhost:3001/foodById/" + $("#foodList").val(),
        type: "GET",
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, errorThrown) {
            //here is your json.
            // process it
            console.log(data);
            var name = data.name;
            var price = data.price;
            var qty = $("#qty").val();
            if (qty == "") {
                qty = 0;
            }
            var subTotal = price * qty;
            var curTot = $("#totalAmount").text();
            console.log('curTot:' + curTot);
            curTot = parseInt(curTot) + subTotal;

            var orderItem = ('<tr><td>' + name + '</td><td>' + qty + '</td><td>' + subTotal + '</td></tr>');
            $('#lastRow').before(orderItem);

            $('#totalAmount').text(curTot);

            checkPayability();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
        },
        timeout: 120000,
    });

};

function mobilePay() {

    var payload = {
        phone: $("#phone").val(),
        pin: $("#pin").val(),
        amount: $("#totalAmount").text()
    }

    jQuery.ajax({
        url: "http://localhost:3003/process",
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(payload),
        success: function (data, textStatus, errorThrown) {
            if (data.message == "success") {
                paymentSuccessfull();
            } else if (data.message == "failed") {
                paymentFailed();
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
        },
        timeout: 120000,
    });
};

function creditPay() {
    var payload = {
        ccNo: $("#ccNo").val(),
        cvc: $("#cvc").val(),
        holder: $("#holder").val(),
        amount: $("#totalAmount").text()
    }

    jQuery.ajax({
        url: "http://localhost:3004/process",
        type: "POST",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(payload),
        success: function (data, textStatus, errorThrown) {
            if (data.message == "success") {
                paymentSuccessfull();
            } else if (data.message == "failed") {
                paymentFailed();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR!");
        },
        timeout: 120000,
    });
};

function paymentSuccessfull() {
    console.log("Payment Successfull");
    $("#ordering").hide();
    $("#done").show();
    var billTot = $("#totalAmount").text();
    var loPoints = billTot / 100;
    $("#message").text("You have earned " + loPoints + " loyalty points!. Thankyou, Enjoy your food! ;)");
    updatePoints(loPoints);
};

function paymentFailed() {
    console.log("Payment Failed");
    $("#ordering").hide();
    $("#done").show();
    $("#message").text("We are so sorry! Something has gone wrong :(");
};

// url: "http://localhost:3001/foods" + $("#id").val()