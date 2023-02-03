import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './refs';
import ImageApiService from './imageApiService ';
import compiledTemplate from '../template/renderCard.hbs';

const imageApiService = new ImageApiService();
//  lightbox
const lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
// опции Notify
const options = { success: { background: '#0954e0' } };

let currentHits = 0;
let totalHits = 0;

// бесконечная прокрутка

const loadMore = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imageApiService.query !== '' && imageApiService.page !== 1) {
      imageApiService
        .fetchImg()
        .then(data => {
          renderImgCard(data);
          lightbox.refresh();
          showNotification(data);
        })
        .catch(error => console.log(error.message));
    }
  });
};

const observer = new IntersectionObserver(loadMore, {
  rootMargin: '150px',
});

const showNotification = function (data) {
  totalHits = data.totalHits;
  currentHits += data.hits.length;

  if (totalHits === 0) {
    return Notify.failure('Sorry, there are no images matching your search query. Please try again.', options);
  } else if (currentHits >= totalHits) {
    observer.unobserve(refs.sentinel);
    return Notify.failure('Sorry, there are no images matching your search query. Please try again.', options);
  } else if (currentHits > 0 && currentHits < 41) {
    return Notify.success(`Hooray! We found ${totalHits} images.`, options);
  }
};

const clearGaleryList = function () {
  refs.gallery.innerHTML = '';
  currentHits = 0;
};
const appendArticlesMarkup = function (images) {
  refs.gallery.insertAdjacentHTML('beforeend', compiledTemplate(images));
};

const renderImgCard = function (data) {
  appendArticlesMarkup(data.hits);
};

const onSearch = function (e) {
  e.preventDefault();
  if (e.target.searchQuery.value === '') {
    return;
  }
  observer.unobserve(refs.sentinel);
  imageApiService.query = e.target.searchQuery.value;

  imageApiService.resetPage();
  clearGaleryList();

  imageApiService
    .fetchImg()
    .then(data => {
      renderImgCard(data);
      lightbox.refresh();
      showNotification(data);
    })
    .catch(error => console.log(error.message));

  setTimeout(() => {
    observer.observe(refs.sentinel);
  }, 1500);
};

refs.form.addEventListener('submit', onSearch);
