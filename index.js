import fetch from 'node-fetch';

import { TEXT_FILE_URL, LOOK_UP_URL } from './config.js';
import { getJSONformatForWordsList, createObject } from './helper.js';
import MinHeap from './utils/minHeap.js';

console.log('fetching');
async function fetchAndProcessData(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
        'content-encoding': 'utf-8',
      },
      mode: 'no-cors',
    });
    if (response.status !== 200)
      throw new Error(
        `Error while fetching data from ${url} , status:${response.status}`
      );
    const data = await response.text();
    // parsing string data word by word
    let word = '',
      dict = {};
    for (let i = 0; i < data.length; i++) {
      if (/[^a-zA-Z]/.test(data[i])) {
        createObject(word, dict);
        word = '';
      } else word += data[i];
    }
    return dict;
  } catch (error) {
    // throw new Error('Something went wrong', error);
    console.log(error);
  }
}

async function fetchWordDetails(words = {}) {
  try {
    const promises = await Promise.all(
      words.map(([word, _]) => {
        return fetch(`${LOOK_UP_URL}&text=${word}`);
      })
    );
    const filteredPromises = promises.filter(
      (promise) => promise.status === 200
    );
    if (
      filteredPromises.length === 0 &&
      promises[0] &&
      promises[0].status !== 200
    ) {
      throw new Error(
        `Error while fetching data from ${LOOK_UP_URL} - status: ${promises[0].status}`
      );
    }
    const data = await Promise.all(
      filteredPromises.map((promise) => promise.json())
    );

    return getJSONformatForWordsList(data);
  } catch (error) {
    console.log('Oops, Error!! try again after sometime', error);
  }
}

const insertWordsToHeap = (dict = {}) => {
  const minHeap = new MinHeap(10);
  for (let word of Object.entries(dict)) {
    if (word[0].length < 5) continue;
    minHeap.insert(word);
  }
  return minHeap.arr;
};

const getTopTenWordsList = async () => {
  const dict = await fetchAndProcessData(TEXT_FILE_URL);
  const topTenWords = insertWordsToHeap(dict);
  const lookUpData = await fetchWordDetails(topTenWords);
  console.log(lookUpData);
};

getTopTenWordsList();
