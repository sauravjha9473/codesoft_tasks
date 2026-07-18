// Display
let display = document.getElementById("display");

// Add values to display
function append(value){

    display.value += value;

}

// Clear all
function clearDisplay(){

    display.value = "";

}

// Delete last character
function deleteLast(){

    display.value = display.value.slice(0,-1);

}

// Calculate result
function calculate(){

    try{

        display.value = eval(display.value);

    }

    catch{

        display.value = "Error";

        setTimeout(()=>{

            display.value="";

        },1000);

    }

}

// Keyboard Support

document.addEventListener("keydown",function(event){

    const key = event.key;

    if(
        (key >= "0" && key <= "9") ||
        key=="+" ||
        key=="-" ||
        key=="*" ||
        key=="/" ||
        key=="." ||
        key=="%"
    ){

        append(key);

    }

    else if(key==="Enter"){

        event.preventDefault();

        calculate();

    }

    else if(key==="Backspace"){

        deleteLast();

    }

    else if(key==="Escape"){

        clearDisplay();

    }

});