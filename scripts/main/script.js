console.log(
  'Реализация burger menu на обеих страницах: 26/26\nРеализация слайдера-карусели на странице Main: 32/36\nРеализация пагинации на странице Pets: 36/36 \nРеализация попап на обеих страницах: 12/12\nОбщая: 96/100'
);

//Burger menu

const headerBurger = document.querySelector('.header__burger');
const headerNav = document.querySelector('.header__nav-list');
const navItems = document.querySelectorAll('.header__nav-item');
const overlay = document.querySelector('.overlay');
const body = document.querySelector('.page__body');
const header = document.querySelector('.header');

const toggleMenu = () => {
  headerBurger.classList.toggle('active');
  headerNav.classList.toggle('active');
  overlay.classList.toggle('active');
  body.classList.toggle('page__body--hidden');
  header.style.zIndex = '0';
  if (headerBurger.classList.contains('active')) {
    header.style.zIndex = '3';
  } else {
    header.style.zIndex = '0';
  }
};

headerBurger.addEventListener('click', (e) => {
  toggleMenu();
  e.stopPropagation();
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    toggleMenu();
  });
});

document.addEventListener('click', (e) => {
  const isClickInsideBurger = headerBurger.contains(e.target);
  const isClickInsideNav = headerNav.contains(e.target);

  if (!isClickInsideBurger && !isClickInsideNav) {
    if (headerNav.classList.contains('active')) {
      toggleMenu();
    }
  }
});

//pets

window.onload = function () {
  fetch('../../assets/pets/pets.json')
    .then((response) => response.json())
    .then((data) => {
      const chunkSize = 8;
      const pets = data.slice(0, chunkSize);

      const shuffleArray = (array) => {
        return array.sort(() => 0.5 - Math.random());
      };

      const gerPetsForDisplay = () => {
        const width = window.innerWidth;
        if (width <= 500) {
          return 1;
        } else if (width <= 1000) {
          return 2;
        } else {
          return 3;
        }
      };

      const sliderList = document.querySelector('.slider__list');
      let currentIndex = 0;
      let displayedPets = [];

      const renderPets = (pets) => {
        sliderList.classList.add('fade-out'); // Добавляем класс для анимации исчезновения

        setTimeout(() => {
          sliderList.innerHTML = ''; // Очищаем список после анимации исчезновения

          pets.forEach((pet) => {
            const sliderItem = document.createElement('li');
            sliderItem.classList.add('slider__item');

            const sliderItemImgContainer = document.createElement('div');
            sliderItemImgContainer.classList.add('slider__item-img-container');
            sliderItem.appendChild(sliderItemImgContainer);

            const sliderItemImg = document.createElement('img');
            sliderItemImg.src = pet.img;
            sliderItemImg.alt = pet.name;
            sliderItemImg.classList.add('slider__item-img');
            sliderItemImgContainer.appendChild(sliderItemImg);

            const sliderItemTitle = document.createElement('h3');
            sliderItemTitle.classList.add('slider__item-title');
            sliderItemTitle.textContent = pet.name;
            sliderItem.appendChild(sliderItemTitle);

            const sliderButton = document.createElement('button');
            sliderButton.classList.add('btn', 'slider__item-btn');
            sliderButton.textContent = 'Learn more';
            sliderItem.appendChild(sliderButton);
            sliderList.appendChild(sliderItem);

            sliderItem.addEventListener('click', () => modalOpen(pet));
          });

          sliderList.classList.remove('fade-out');
          sliderList.classList.add('fade-in');

          setTimeout(() => {
            sliderList.classList.remove('fade-in');
          }, 200);
        }, 200);
      };

      const updateSlider = () => {
        const displayCount = gerPetsForDisplay();
        const currentPets = displayedPets.slice(currentIndex, currentIndex + displayCount);
        renderPets(currentPets);
      };

      const updateDisplayedPets = () => {
        const shuffledPets = shuffleArray([...pets]);

        let currentPets = [];
        const displayCount = gerPetsForDisplay();
        while (currentPets.length < displayCount) {
          const pet = shuffledPets.pop();
          if (!displayedPets.includes(pet) && !currentPets.includes(pet)) {
            currentPets.push(pet);
          }
        }

        displayedPets = currentPets;
        renderPets(currentPets);
      };

      const arrowRight = document.querySelector('.slider__arrow--right');
      const arrowLeft = document.querySelector('.slider__arrow--left');

      arrowRight.addEventListener('click', () => {
        const displayCount = gerPetsForDisplay();
        currentIndex = (currentIndex + displayCount) % displayedPets.length;
        updateDisplayedPets();
      });

      arrowLeft.addEventListener('click', () => {
        const displayCount = gerPetsForDisplay();
        currentIndex = (currentIndex - displayCount + displayedPets.length) % displayedPets.length;
        updateDisplayedPets();
      });

      window.onresize = updateSlider;

      updateDisplayedPets();
    });
};

//Modal
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalImg = document.querySelector('.modal__img');
const modalName = document.querySelector('.modal__name');
const modalType = document.querySelector('.modal__type');
const modalBreed = document.querySelector('.modal__breed');
const modalDescription = document.querySelector('.modal__description');
const modalAge = document.querySelector('.modal__info-item--age .modal__info-item-text');
const modalInoculations = document.querySelector('.modal__info-item--inoculations .modal__info-item-text');
const modalDiseases = document.querySelector('.modal__info-item--diseases .modal__info-item-text');
const modalParasites = document.querySelector('.modal__info-item--parasites .modal__info-item-text');

const modalOpen = (pet) => {
  modalImg.src = pet.img;
  modalName.textContent = pet.name;
  modalType.textContent = pet.type;
  modalBreed.textContent = ` - ${pet.breed}`;
  modalDescription.textContent = pet.description;
  modalAge.textContent = pet.age;
  modalInoculations.textContent = pet.inoculations.join(', ');
  modalDiseases.textContent = pet.diseases.join(', ');
  modalParasites.textContent = pet.parasites.join(', ');
  modal.style.display = 'grid';
  overlay.classList.toggle('active');
  body.classList.toggle('page__body--hidden');
};

const modalCloseEvt = () => {
  modal.style.display = 'none';
  overlay.classList.toggle('active');
  body.classList.remove('page__body--hidden');
};

window.addEventListener('click', (evt) => {
  if (evt.target === overlay) {
    modalCloseEvt();
  }
});

modalClose.addEventListener('click', () => {
  modalCloseEvt();
});

document.body.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modal.style.display = 'none';
    overlay.classList.remove('active');
    body.classList.remove('page__body--hidden');
  }
});
