export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImg() {
    const BASE_URL = 'https://pixabay.com/api/';
    const searchParams = new URLSearchParams({
      key: '33062017-dcd03692d6ff22d3e6e4522a8',
      q: this.query,
      orientation: 'horizontal',
      safesearch: 'false',
      per_page: 40,
      page: this.page,
    });

    const url = `${BASE_URL}?${searchParams}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.total !== 0) {
      this.incrementPage();
    }
    return data;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
