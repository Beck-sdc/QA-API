import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';
import http from 'k6/http';

export const options = {
  vus: 1000,
  duration: '10s',
};

var myErrorCounter = new Counter("my_error_counter");

export default () => {
  const random = Math.floor(Math.random() * 351896) + 3167067;
  const res = http.get(`http://localhost:3001/qa/questions?product_id=${random}`);
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 200ms': r => r.timings.duration < 200,
    'transaction time < 500ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000,
  });
  if (res.status === 500) {
    myErrorCounter.add(1)
  };
  sleep(1);
};
