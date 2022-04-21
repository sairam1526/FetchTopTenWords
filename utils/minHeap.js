export default class MinHeap {
  constructor(capacity) {
    this.size = 0;
    this.capacity = capacity;
    this.arr = [];
  }
}

const parent = (index) => Math.floor((index - 1) / 2);
const left = (index) => 2 * index + 1;
const right = (index) => 2 * index + 2;
/**
 *
 * @param {array} newElement
 * array shape [word, count]
 * @returns
 */
MinHeap.prototype.insert = function (newElement) {
  if (this.size === this.capacity) {
    const [rootWord, rootWordCount] = this.arr[0];
    const [newWord, newWordCount] = newElement;
    if (
      newWordCount > rootWordCount ||
      (newWordCount === rootWordCount && newWord.length > rootWord.length)
    ) {
      this.arr[0] = newElement;
      if (this.arr.length > this.capacity) return;
      this.minHeapify(0);
    }
    return;
  }
  this.size++;
  this.arr[this.size - 1] = newElement;
  let i = this.size - 1;
  while (i !== 0 && this.arr[parent(i)][1] > this.arr[i][1]) {
    //swap parent and current element
    [this.arr[i], this.arr[parent(i)]] = [this.arr[parent(i)], this.arr[i]];
    i = parent(i);
  }
};

MinHeap.prototype.minHeapify = function (index) {
  let leftNodeIndex = left(index),
    rightNodeIndex = right(index),
    smallestNodeIndex = index;
  if (this.arr.length > this.capacity) {
    console.log(this.size, index);
    return;
  }
  if (
    leftNodeIndex < this.size &&
    this.arr[leftNodeIndex][1] < this.arr[smallestNodeIndex][1]
  ) {
    smallestNodeIndex = leftNodeIndex;
  }
  if (
    rightNodeIndex < this.size &&
    this.arr[rightNodeIndex][1] < this.arr[smallestNodeIndex][1]
  ) {
    smallestNodeIndex = rightNodeIndex;
  }
  if (smallestNodeIndex !== index) {
    // swap smallest with index
    [this.arr[smallestNodeIndex], this.arr[index]] = [
      this.arr[index],
      this.arr[smallestNodeIndex],
    ];
    this.minHeapify(smallestNodeIndex);
  }
};
