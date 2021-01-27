$(() => {
  const $container = $("#container");
  const $modal = $("#modal");
  const $testButton = $("#test");
  const $nextButton = $("#next");
  const $prevButton = $("#prev");
  const $closeButton = $("#close");
  const $dropdownButton = $("#dropdown-button");
  const $chevronUp = $(".lnr-chevron-up");
  const $mHeader = $("#m-header");
  const $mText = $("#m-text");
  const $mImage = $("#m-image");
  const $mImageText = $("#m-image-text");
  const $dropdown = $("#dropdown");
  let statePictures = [];
  let pictureIndex = 0;

  const makeApiCall = async () => {
    const response = await fetch("http://localhost:3000/states");
    const data = await response.json();
    await createModal(data[0]);
  };

  const createModal = (state) => {
    state.pictures.map((picture) => statePictures.push(picture));
    $mHeader.text(`${state.name}`);
    $mText.text(`${state.entry}`);
    $mImage.attr(`src`, statePictures[pictureIndex].url);
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
    $mImage.attr(`src`, statePictures[pictureIndex].url);
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

  const openDropdown = () => {
    $dropdown.slideDown();
  };

  const closeDropDown = () => {
    $dropdown.slideUp();
  };

  $testButton.on("click", makeApiCall);
  $nextButton.on("click", showNextPicture);
  $prevButton.on("click", showPrevPicture);
  $closeButton.on("click", closeModal);
  $dropdownButton.on("click", openDropdown);
  $chevronUp.on("click", closeDropDown);
});
