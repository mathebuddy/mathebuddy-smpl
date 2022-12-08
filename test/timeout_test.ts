//function run(maxTime: number): void {
const maxTime = 100;
const promise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    console.log('timeout!!');
    reject(new Error('timeout'));
  }, maxTime);
  let x = 0;
  for (;;) {
    x++;
  }
  resolve('blub');
})
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
//}

promise.then((res) => {
  console.log('xx');
});
