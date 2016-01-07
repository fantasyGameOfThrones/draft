// Fisher-Yates shuffle - http://bost.ocks.org/mike/shuffle/
export function shuffle (array) {
  let m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
};

export function snakeOrder (array, times) {
  let order = [];

  while (times--) {
    order = order.concat(array)
    array.reverse();
  }

  return order;
}

export function randomSnakeOrder (array, times) {
  return snakeOrder(shuffle(array), times);
}

export function randomValueFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
