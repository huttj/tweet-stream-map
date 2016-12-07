export default function np(cb){
  "use strict";
  return new Promise((resolve, reject) => {
    cb((err, res) =>
      err ? reject(err) : resolve(res)
    );
  })
}