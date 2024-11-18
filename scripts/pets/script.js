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

//Pets

window.onload = function () {
  fetch('../../assets/pets/pets.json')
    .then((response) => response.json())
    .then((data) => {
      const gerPetsForDisplay = () => {
        const width = window.innerWidth;
        if (width <= 500) {
          return 3;
        } else if (width <= 1000) {
          return 6;
        } else {
          return 8;
        }
      };

      const chunkSize = gerPetsForDisplay();
      let currentPage = 0;
      let totalChunks = Math.ceil(data.length / chunkSize);

      const shuffleArray = (array) => {
        return array.sort(() => 0.5 - Math.random());
      };

      const chunkArray = (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
        }
        return chunks;
      };

      const petChunks = chunkArray(data, chunkSize);
      const shuffledPets = petChunks.map((chunk) => shuffleArray(chunk)).flat();

      const catalogList = document.querySelector('.catalog__list');
      const renderPets = (pets) => {
        setTimeout(() => {
          catalogList.innerHTML = '';
          pets.forEach((pet) => {
            const catalogItem = document.createElement('li');
            catalogItem.classList.add('catalog__item');

            const catalogItemImgContainer = document.createElement('div');
            catalogItemImgContainer.classList.add('catalog__item-img-container');
            catalogItem.appendChild(catalogItemImgContainer);

            const catalogItemImg = document.createElement('img');
            catalogItemImg.src = pet.img;
            catalogItemImg.alt = pet.name;
            catalogItemImg.classList.add('slider__item-img');
            catalogItemImgContainer.appendChild(catalogItemImg);

            const catalogItemTitle = document.createElement('h3');
            catalogItemTitle.classList.add('catalog__item-title');
            catalogItemTitle.textContent = pet.name;
            catalogItem.appendChild(catalogItemTitle);

            const catalogButton = document.createElement('button');
            catalogButton.classList.add('btn', 'catalog__item-btn');
            catalogButton.textContent = 'Learn more';
            catalogItem.appendChild(catalogButton);
            catalogList.appendChild(catalogItem);

            catalogItem.addEventListener('click', () => modalOpen(pet));
          });
          catalogList.classList.remove('hidden');
        }, 400);
      };
      const updatePaginationNumber = () => {
        paginationNumber.textContent = `${currentPage + 1}`;
      };

      const renderPage = () => {
        catalogList.classList.add('hidden');
        const start = currentPage * gerPetsForDisplay();
        const end = start + gerPetsForDisplay();
        renderPets(shuffledPets.slice(start, end));
        updatePaginationNumber();
      };

      const paginationNumber = document.querySelector('.catalog__pagination-item--number');
      const paginationForward = document.querySelector('.catalog__pagination-item--arrow-right');
      const paginationForceForward = document.querySelector('.catalog__pagination-item--double-arrow-right');
      const paginationBack = document.querySelector('.catalog__pagination-item--arrow-left');
      const paginationForceBack = document.querySelector('.catalog__pagination-item--double-arrow-left');

      const CheckPaginationForward = () => {
        if (currentPage > 0) {
          paginationBack.classList.remove('catalog__pagination-item--inactive');
          paginationForceBack.classList.remove('catalog__pagination-item--inactive');
        }
        if (currentPage === totalChunks - 1) {
          paginationForward.classList.add('catalog__pagination-item--inactive');
          paginationForceForward.classList.add('catalog__pagination-item--inactive');
        }
      };

      paginationForward.addEventListener('click', () => {
        if (currentPage < totalChunks - 1) {
          currentPage++;
          renderPage();
          CheckPaginationForward();
        }
      });

      paginationForceForward.addEventListener('click', () => {
        if (currentPage < totalChunks - 1) {
          currentPage = totalChunks - 1;
          renderPage();
          CheckPaginationForward();
        }
      });

      const CheckPaginationBack = () => {
        if (currentPage !== totalChunks - 1) {
          paginationForward.classList.remove('catalog__pagination-item--inactive');
          paginationForceForward.classList.remove('catalog__pagination-item--inactive');
        }
        if (currentPage === 0) {
          paginationBack.classList.add('catalog__pagination-item--inactive');
          paginationForceBack.classList.add('catalog__pagination-item--inactive');
        }
      };

      paginationBack.addEventListener('click', () => {
        if (currentPage > 0) {
          currentPage--;
          renderPage();
          CheckPaginationBack();
        }
      });

      paginationForceBack.addEventListener('click', () => {
        if (currentPage > 0) {
          currentPage = 0;
          renderPage();
          CheckPaginationBack();
        }
      });

      renderPage();

      window.onresize = () => {
        const chunkSize = gerPetsForDisplay();
        totalChunks = Math.ceil(data.length / chunkSize);
        if (currentPage >= totalChunks) {
          currentPage = totalChunks - 1;
        }
        renderPage();
        CheckPaginationForward();
        CheckPaginationBack();
      };
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
