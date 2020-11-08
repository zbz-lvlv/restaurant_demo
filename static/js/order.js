let allItems = {};

let shoppingCart = {};

//Javascript sends a GET request to the flask server to get the restaurant's items
$.ajax({url: "/get_items", dataType: "json", async: true,

    success: function(result){

        let jsonString = JSON.stringify(result);
        let gottenData = jQuery.parseJSON(jsonString);

        allItems = gottenData;

        let table = document.getElementById("food_table");

        for (let itemId in gottenData){

        	let item = gottenData[itemId];

        	let temp = document.getElementById("food_item_template");
			let cloned = temp.content.cloneNode(true);
			table.appendChild(cloned);

			let itemImage = document.createElement("img");
			itemImage.src = "/static/images/" + item.img;
			itemImage.style.width = "200px";
			itemImage.style.height = "200px";

			let itemRow = document.getElementById("food_item");
			itemRow.id = "food_item|" + itemId;
			itemRow.value = itemId;

			itemRow.cells[0].innerHTML = item.name;
			itemRow.cells[1].appendChild(itemImage);
			itemRow.cells[2].innerHTML = item.price;

        }

    },

    complete: function(jqXHR, exception){
        
    }
});

function foodItemSelected(thisNumericUpDown){

	let itemRow = thisNumericUpDown.parentNode.parentNode;
	let itemId = itemRow.value;

	if(!(itemId in shoppingCart)){
		shoppingCart[itemId] = 0;
	}

	shoppingCart[itemId] = thisNumericUpDown.value;

	calculateAndDisplayTotalPrice();

}

function calculateAndDisplayTotalPrice(){

	let totalPrice = 0;

	for (let itemId in shoppingCart){
		totalPrice += shoppingCart[itemId] * allItems[itemId].price;
	}

	let totalPriceLabel = document.getElementById("total_price");
	totalPriceLabel.innerHTML = totalPrice.toFixed(2);

}

function buyClicked(){

	let dataToSend = shoppingCart;

	$.ajax({type: "POST", url: "/buy_items", data: JSON.stringify(dataToSend), dataType: "json", async: true, 

		success: function(data, status){
			alert("下单成功, 已付" + parseFloat(data.total_paid).toFixed(2));
        },

        error: function(request, status, error){
        	alert("下单失败");
        	console.log(request);
        	console.log(status);
        	console.log(error);
        }

    });

}