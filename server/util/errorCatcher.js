export default function errorCatcher(handler) {
  "use strict";

  return function(req, res, next) {

    try {
      const result = handler(req, res, next);
      if (result.catch) result.catch(next);
    } catch (e) {
      next(e);
    }

  };

}