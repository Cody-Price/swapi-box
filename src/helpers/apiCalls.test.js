import * as API from './apiCalls.js';
import mockData from './mockData.js';
import * as Cleaner from './Cleaner.js';
// jest.mock('./apiCalls.js');

describe('API', () => {
  let mockUrl;
  let mockResponse;
  let url;
  
  describe('fetchData', () => {
    mockResponse = mockData.films
    url = 'https://swapi.co/api/';

    it('should call fetch with the correct arguments', async () => {
      window.fetch = jest.fn();

      await API.fetchData(url);
      expect(window.fetch).toHaveBeenCalledWith(url);
    })

    it('should return an object if fetch is successful', async () => {
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          json: () => {
            return Promise.resolve(mockResponse.results);
          }
        })
      })

      const expected = mockResponse.results;
      const result = await API.fetchData(url);
      expect(result).toEqual(expected);
    })

    it('should return an error if fetch is not successful', async () => {
      window.fetch = jest.fn().mockImplementation(() => {
        Promise.reject(new Error('Cannot fetch'));
      })

      const expected = 'Cannot fetch';
      const result = API.fetchData(url);
      expect(result).rejects.toEqual(expected);
    })
  })

  describe('getRandomFilmCrawl', () => {
    beforeEach(() => {
      mockUrl = 'https://swapi.co/api/films/'
      mockResponse = mockData.films
      window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          json: () => Promise.resolve(mockResponse)
        })
      })
    })

    it('should call fetch with correct params', async () => {
      const expected = 'https://swapi.co/api/films/';
      await API.getRandomFilmCrawl(mockUrl);

      expect(window.fetch).toHaveBeenCalledWith(expected);
    })

    it('should return an expected object if everything is ok', async () => {
      let randomIndex = 0

      const expected = {
        crawl: mockData.films.results[randomIndex].opening_crawl,
        title: mockData.films.results[randomIndex].title,
        episode: mockData.films.results[randomIndex].episode_id
      }

      Math.random = jest.fn().mockImplementation(() => 0)
      const result = await API.getRandomFilmCrawl(mockUrl)

      expect(result).toEqual(expected)
    })
  })

  describe('fetchByMenu', () => {
    const selection = 'people';
    
    it('should call fetchData with the correct arguments', async () => {
      Cleaner.cardCleaner = jest.fn();
      const expected = 'https://swapi.co/api/people';

      await API.fetchByMenu(selection);

      expect(window.fetch).toHaveBeenCalledWith(expected);
    })

    it('should call cardCleaner with the correct parameters', async () => {
      Cleaner.cardCleaner = jest.fn();

      await API.fetchByMenu(selection);

      expect(Cleaner.cardCleaner).toHaveBeenCalledWith(mockResponse.results, selection);
    })

    it('should return the result of the cardCleaner', async () => {
      Cleaner.cardCleaner = jest.fn(() => ({}))
      const expected = {}

      const result = await API.fetchByMenu('people');

      expect(result).toEqual(expected);
    })
  })

  describe('fetchProperty', () => {

    it('should call fetchData with a url if it recieves a single URL as a string', async () => {
      const expected = 'https://swapi.co/api/';

      await API.fetchProperty(url);

      expect(window.fetch).toHaveBeenCalledWith(expected);
    })

    it('should return the result of fetchData if it was passed a single URL', async () => {
      const expected = mockResponse;

      const result = await API.fetchProperty(mockUrl);

      expect(result).toEqual(expected);
    })

    it('should map over an array of URLs and call fetch data multiple times if it recieves an array', async () => {
      const urlArray = [mockUrl, mockUrl];

      // await API.fetchProperty(urlArray);

      expect(window.fetch).toHaveBeenCalledTimes(2);
    })

    it('should return an array of objects if it was passed an array', async () => {
      const urlArray = [mockUrl, mockUrl];
      const expected = [mockResponse, mockResponse]

      const result = await API.fetchProperty(urlArray);

      expect(result).toEqual(expected);
    })
  })
})

