$(document).ready(function () { //The document Ready Event fires when all HTML elements have been rendered.
    $('#money').val('0.00');
    loadItems();
    addDollar();
    addQuarter();
    addDime();
    addNickel();
    makePurchase();
    showChange();
    changeReturn();

});

//This function will load all items from the API on the server
function loadItems() {
    clearAllItems(); //We call this function to clear all items from the div on the HTML page to avoid repetition 
                     //of items with each load
    var contentItems = $('#items'); //we use id value to reference to the div where all items will be appended

    // Ajax call to get all items from the web service
    $.ajax({
        type: 'GET',
        url: 'http://vending.us-east-1.elasticbeanstalk.com/items',
        success: function (itemArray) {
            //Data is pulled from the dataset one row at a time and add each row in the form of a div
            $.each(itemArray, function (index, item) {
                var itemId = item.id;
                var name = item.name;
                var price = item.price.toFixed(2);
                var quan = item.quantity;
                

                var item = '<div class="item col-lg-3 col-md col-sm" id="click" onclick="showId(\'' + itemId + '\',' + index + ')">';
                item += '<p>' + (index+1) +'</p>';
                item += '<p style="text-align: center;">' + name;
                item += '<br></br>';
                item += '$' + price;
                item += '<br></br>';
                item += 'Quantity Left: ' + quan;
                item += '</p></div>';

                contentItems.append(item);
            })
        },

        error: function () { //If ajax call is not succeeded, error function is executed


            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}

//This function clears all items from the div with id="items"
function clearAllItems() {
    $('#items').empty();
}

//This function adds a Dollar amount to "Total $ In" input when "Add Dollar" button is clicked
function addDollar() {
    $('#addDollar').click(function (event) {
        $('#message').val(''); //clears any message in the message input box
        $('#change').val(''); //clears any change in the change input box
        $('#changeMoney').show(); // shows the div with the change input box
        $('#changeReturn').show(); //shows the div with the "Change Return" button

        var totalMoney = $('#money').val(); //value from the "Total $ In"
        var newMoney = Number(totalMoney) + 1.00; // 1.00 amount is added to the value in "Total$ In"
        $('#money').val(newMoney.toFixed(2)); // Value of newMoney is changed to a string with 2 digits after the decimal.
    });
}

//This function adds a Quarter amount to "Total $ In" input when "Add Quarter" button is clicked
function addQuarter() {
    $('#addQuarter').click(function (event) {
        $('#message').val('');
        $('#change').val('');
        $('#changeMoney').show();
        $('#changeReturn').show();
        var totalMoney = $('#money').val();
        var newMoney = Number(totalMoney) + 0.25;
        $('#money').val(newMoney.toFixed(2));
    });
}

//This function adds a Dime amount to "Total $ In" input when "Add Dime" button is clicked
function addDime() {
    $('#addDime').click(function (event) {
        $('#message').val('');
        $('#change').val('');
        $('#changeMoney').show();
        $('#changeReturn').show();
        var totalMoney = $('#money').val();
        var newMoney = Number(totalMoney) + 0.10;
        $('#money').val(newMoney.toFixed(2));
    });
}
//This function adds a Nickel amount to "Total $ In" input when "Add Dollar" button is clicked
function addNickel() {
    $('#addNickel').click(function (event) {
        $('#message').val('');
        $('#change').val('');
        $('#changMoney').show();
        $('#changeReturn').show();
        var totalMoney = $('#money').val();
        var newMoney = Number(totalMoney) + 0.05;
        $('#money').val(newMoney.toFixed(2));
    });
}

//This function displays the index of the selected item in "Item" input box and also stored id of the selected item in the hiddden 
//input
function showId(itemId, index) {

    $('#hiddenItemId').val(itemId); // input with id="hiddenItemid" gets the value itemid
    $('#itemNumber').val(index +1); //input with id="itemnumber" gets the value index+1
    $('#message').val(''); //clears any message in the message input box
    $('#change').val(''); //clears any change in the change input box
    $('#changeMoney').show(); // shows the div with the change input box
    $('#changeReturn').show(); //shows the div with the "Change Return" button

}

//This function lets to make the purchase of the item from the API of the web service on the server 
//when "Make purchase" button is clicked
function makePurchase() {

    $('#makePurchaseButton').click(function (event) {

        var userMoney = $('#money').val(); //value of money from the "Total $ In" input is stored in the variable userMoney
        var id = $('#hiddenItemId').val(); //value of id of the selected item is stored in the variable id
        var index= $('#itemNumber').val();
        if(index ==' '|| index.length == 0){
          $('#message').val('Please make a selection');
        } else{
       //Ajax call to make purchase from the API of the web service on the server
        $.ajax({
            type: 'POST',
            url: 'http://vending.us-east-1.elasticbeanstalk.com/money/' + userMoney + '/item/' + id,

            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'

            },
            'dataType': 'json',
            success: function (data) {
                var quarters = data.quarters;
                var dimes = data.dimes;
                var nickels = data.nickels;
                var pennies = data.pennies;
                
                showChange(quarters, dimes, nickels, pennies);

                $('#message').val('THANK YOU!!!');
                $('#money').val('0.00');
                $('#itemNumber').val('');
                $('#hiddenItemId').val('');
                loadItems();
                $('#changeReturn').hide();
            },

            //Error function to be called when ajax request doesn't succeed. This function has three 
            //parameters xhr object, status describing the type of eror and exception object.)
            error: function (xhr, status, error) {
                var responseText = jQuery.parseJSON(xhr.responseText); //xhr.responseText gets the message from the response body
                $('#message').val(responseText.message);
              
                loadItems();

            }
        });
    }  
    })
}


//This function returns and displays the money in"Total $ In" input to the change input when "Change Return"
//button is clicked.
function changeReturn() {

    $('#changeReturnButton').click(function (event) {
        $('#itemNumber').val(''); //Any item selection is cleared
        $('#hiddenItemId').val(''); //item selection in the hidden input is cleared
        $('#message').val('');
        loadItems();
        
        var totalMoney = Number($('#money').val()); //Total money from"Total $ In" input is stored in the variable totalMoney
        var quarters = 0;
        var dimes = 0;
        var nickels = 0;
        var pennies = 0;

        if (totalMoney > 0.00) { //The condition is checked if the item is not purchased
            totalPennies = (totalMoney * 100);

            while (totalPennies >= 25) {
                quarters++;
                totalPennies -= 25;
            }

            while (totalPennies >= 10) {
                dimes++;
                totalPennies -= 10;
            }

            while (totalPennies >= 5) {
                nickels++;
                totalPennies -= 5;
            }

            while (totalPennies >= 1) {
                pennies++;
                totalPennies -= 1;
            }

            $('#money').val('0.00'); // the value of "Total $ In" is set to 0.00
            $('#message').val(''); // any message is cleared in the message input

            showChange(quarters, dimes, nickels, pennies);
            $('#changeReturn').hide(); //The "Change Return" Button is hide after the change is returned

        }

        if (totalMoney == 0.00) { // If the "Total $ In" is intially zero return the div with change input is hidden
            $('#changeMoney').hide();

        }

    })
}


//This function displays the change in the change input field. it shows number of different type of coins in the change.
function showChange(quarters, dimes, nickels, pennies) {

    var message = '';
    var coins = quarters + dimes + nickels + pennies;

    coins -= quarters;
    if (quarters == 1 & coins > 0) {
        message += quarters + ' Quarter, ';
    } else if (quarters == 1 & coins == 0) {
        message += quarters + ' Quarter ';
    } else if (quarters > 1 & coins > 0) {
        message += quarters + ' Quarters, ';
    } else if (quarters > 1 & coins == 0) {
        message += quarters + ' Quarters ';
    }

    coins -= dimes;
    if (dimes == 1 & coins > 0) {
        message += dimes + ' Dime, ';
    } else if (dimes == 1 & coins == 0) {
        message += dimes + ' Dime ';
    } else if (dimes > 1 & coins > 0) {
        message += dimes + ' Dimes, ';
    } else if (dimes > 1 & coins == 0) {
        message += dimes + ' Dimes ';
    }

    coins -= nickels;
    if (nickels == 1 & coins > 0) {
        message += nickels + ' Nickel, ';
    } else if (nickels == 1 & coins == 0) {
        message += nickels + ' Nickel ';
    }

    if (pennies == 1) {
        message += pennies + ' Penny ';
    } else if (pennies > 1) {
        message += pennies + ' Pennies ';
    }


    $('#change').val(message);

}








