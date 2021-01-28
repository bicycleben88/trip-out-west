$(() => {
  const $modal = $("#modal");
  const $testButton = $("#test");
  const $nextButton = $("#next");
  const $prevButton = $("#prev");
  const $closeButton = $("#close");
  const $dropdownButton = $("#dropdown-button");
  const $mHeader = $("#m-header");
  const $mText = $("#m-text");
  const $mImage = $("#m-image");
  const $mImageText = $("#m-image-text");
  const $dropdown = $("#dropdown");
  const $stamp = $(".stamp");
  const $stampText = $(".stamp-text");
  let statePictures = [];
  let pictureIndex = 0;
  let stateIndex = 0;

  const makeApiCall = async () => {
    const response = await fetch(
      "https://trip-out-west-api.herokuapp.com/states"
    );
    const data = await response.json();
    await createModal(data[stateIndex]);
  };

  const createModal = (state) => {
    state.pictures.map((picture) => statePictures.push(picture));
    $mHeader.text(`${state.name}`);
    $mText.text(`${state.entry}`);
    $mImage.attr({
      src: statePictures[pictureIndex].url,
      alt: statePictures[pictureIndex].location,
    });
    $mImageText.text(`${statePictures[pictureIndex].location}`);
    $modal.css("display", "flex");
    $testButton.hide();
  };

  const closeModal = () => {
    $modal.hide();
    statePictures = [];
    pictureIndex = 0;
  };

  const showNextPicture = () => {
    if (pictureIndex < statePictures.length - 1) {
      pictureIndex += 1;
    } else {
      pictureIndex = 0;
    }
    $mImage.attr({
      src: statePictures[pictureIndex].url,
      alt: statePictures[pictureIndex].location,
    });
    $mImageText.text(`${statePictures[pictureIndex].location}`);
  };

  const showPrevPicture = () => {
    if (pictureIndex === 0) {
      pictureIndex = statePictures.length - 1;
    } else {
      pictureIndex -= 1;
    }
    $mImage.attr(`src`, statePictures[pictureIndex].url);
    $mImageText.text(`${statePictures[pictureIndex].location}`);
  };

  const toggleDropdown = () => {
    $dropdown.slideToggle();
    $dropdown.css("display", "flex");
  };

  const revealText = (event) => {
    // display text over stamp
    $(event.target).children().show(400);
    // match stateIndex with element id
    stateIndex = $(event.target).attr("id");
  };

  const hideText = () => {
    $stampText.hide(400);
  };

  $testButton.on("click", makeApiCall);
  $nextButton.on("click", showNextPicture);
  $prevButton.on("click", showPrevPicture);
  $closeButton.on("click", closeModal);
  $dropdownButton.on("click", toggleDropdown);
  $stamp.hover(revealText, hideText);
  $stampText.on("click", makeApiCall);
});
