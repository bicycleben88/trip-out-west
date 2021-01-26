$(() => {
//---------------------------
//--Variables
//---------------------------
const $stamp = $('.stamp');
const $mapImage = $('#map-image')
const $modal = $('#modal');
const $nextButton = $('.next-button');
const $exitButton = $('.last-modal-button');
const $lastModalText = $('.last-modal-text');
const $oldStampsDiv = $('#old-stamps');
let modalImageIndex = 0;
let modalStateIndex = 0;
const gearList = [];
let weatherCity = ''; 

//---------------------------
//--Functions
//---------------------------
const openModal = (event) => {
        //removes state stampe from map and removes event listener from stamp
        $(event.currentTarget).hide().off()
        //displays modal for current state
        $modal.css('display', 'flex');
        $modal.children().eq(modalStateIndex).css('display', 'flex');
        $nextButton.show();
        $('.modal-text').show();
}

const hideModal = (event) => {
    //hides modal for current state
    $modal.children().eq(modalStateIndex).hide();
    $lastModalText.hide();
    $exitButton.hide();
    $modal.hide();
    $lastModalText.empty()

    //update modalStateIndex to the next state
    modalStateIndex++;

    //run this loop after clicking on div for each state
    if (modalStateIndex > 6) {    
        $stamp.map(function() {
            //create anchor tag to use at end
            let $stampAnchor = $('<a href="https://bikepacking.com/" class="stamp-anchor" target=#>')
            //append this .stamp div to anchor tag
            $stampAnchor.append(this);
            //append anchor tags to DOM
            $oldStampsDiv.append($stampAnchor);
        })
        $stamp.css('position', 'static').show();
    }
    //reveals next state stamp on map
    revealStateStamp();
}

const revealStateStamp = () => {
    //accesses next child div in array of divs to display stamp for the next state
    $($mapImage.children().eq(modalStateIndex)[0]).css('display', 'inline-block');
}


const displayLastModalPage = (array) => {
    //hides the last displayed image
    $(array).eq(modalImageIndex).hide();
    //hides next button
    $nextButton.hide();
    //hides text
    $('.modal-text').hide()

    //run function based on the state  
    if (modalStateIndex === 0) {
        displayFlaLastModal()
    } else {
        createWeatherModal()
    }

    //displays exits button
    $exitButton.show();
}

const displayNextImage = (event) => {
    //accesses an array of img tags within sibling node of event target
    let $imagesArray = $(event.currentTarget).parent().children().children('img');
    let $lastImageIndex = $imagesArray.length - 1;
    //hide current image and display next image in array until last image in array
    if (modalImageIndex < $lastImageIndex) {
        $imagesArray.eq(modalImageIndex).hide();
        modalImageIndex++;
        $imagesArray.eq(modalImageIndex).show();
    //at last image in array
    } else {
        displayLastModalPage($imagesArray);
        modalImageIndex = 0;
    }
}

//--Florida Modal Last Page

const displayFlaLastModal = () => {
    $lastModalText.css('display', 'flex');
}


const renderToFlaModal = (gear) => {
    if (gear !== '') {
        $('#list-gear').append(`<li class="li-gear"><a href="https://www.rei.com/search?q=${gear}" target="#" class="gear-anchor">  ${gearList[gearList.length - 1]} </a></li>`)  
    }
}

const addToGearList = (event) => {
    let $gear = $('#input-gear').val() 
    //add value of input-gear to gearList []
    if ($gear !== '') {
        gearList.push($gear);
    }
    //stop page from reloading
    event.preventDefault();
    //reset value of input box after submit
    $(event.currentTarget).trigger('reset');
    //limit to ten items
    if(gearList.length <= 10){
        renderToFlaModal($gear);
    } 
}

//--All Other States Modal Last Page

const updateWeatherCity = (event) => {

    event.preventDefault()
    //get user input
    weatherCity = $(event.currentTarget[0]).val();
    //remove comma from input and convert input to array
    let weatherCityTwo = weatherCity.replace(/,/, '').split('');
    //locate last two indexes for state code
    let lastTwoIndexes= weatherCityTwo.length - 2;
    //get all elements before the indexes of the state code -1 for the space in the array and convert to string
    let city = weatherCityTwo.slice(0, lastTwoIndexes - 1).join('');
    //get last two indexes for the state code and convert to string
    let state = weatherCityTwo.slice(lastTwoIndexes).join('');
 
    printWeather(city, state)
}

const hideWeatherForm = () => {

    $('.submit-weather').remove();
    $('.form-weather').remove();
    $('.input-weather').remove();
}


const createWeatherModal = () => {
    
    //create form 
    let $formWeather = $('<form class="form-weather">').on('submit', updateWeatherCity);
    $formWeather.append('<input type="text" class="input-weather" placeholder="city, state">') 
    $formWeather.append('<input type="submit" class="submit-weather" value="Get Weather">')
    $lastModalText.show().append($formWeather);

    //create ul 
    const $listWeather = $('<ul id="list-weather">');
    $lastModalText.append($listWeather);

}

const printWeather = (city, state) => {
  
    //--API request
    $.ajax({
        url:`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f1058eb4a381d62c708214b466195dfe`,   
    }).then(
        (data) => {
           
            for (let i = 0; i < data.list.length; i++) {
                if (i % 8 === 0) {
                    let dayNumberValue = new Date(data.list[i].dt_txt).getDay();
                    let day = '';
                    switch (dayNumberValue) {
                        case 0: day = 'Sunday'
                        break;
                        case 1: day = 'Monday'
                        break;
                        case 2: day = 'Tuesday'
                        break;
                        case 3: day = 'Wednesday'
                        break;
                        case 4: day = 'Thursday'
                        break;
                        case 5: day = 'Friday'
                        break;
                        case 6: day = 'Satruday'
                        break;
                        default: day = dayNumberValue; 
                        break;
                    }
                   $($('#list-weather')[0])
                   .append(`<h5 class="h5-weather">${day}:</h5>`)
                   .append(`<li class="li-weather"><a href="https://www.wunderground.com/weather/us/${state}/${city}" target="#" class="weather-anchor"><strong>Temperature</strong>:  ${Math.floor((((data.list[i].main.temp) - 273) * (9/5) + 32))} </a></li>`)
                   .append(`<li class="li-weather"><a href="https://www.wunderground.com/weather/us/${state}/${city}" target="#" class="weather-anchor"><strong>Weather</strong>:  ${data.list[i].weather[0].description} </a></li>`);
                }
            }
            hideWeatherForm();
            $lastModalText.append($('#list-weather')[0])
        },
        () => {
            console.log('NO DICE DUDE')
        }
        )
        $("form").trigger("reset");
        $("#list-weather").empty();
    }
 





//---------------------------
//--Event Listeners
//---------------------------
$stamp.on('click', openModal);
$nextButton.on('click', displayNextImage);
$exitButton.on('click', hideModal);
$('#form-gear').on('submit', addToGearList)
})

