;(function () {
  window.Serpent = window.Serpent || {};
  var Util = window._ = window.Serpent.Util = {};

  Util.arraysEqual = function arraysEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  Util.includesArray = function includesArray(arrayOfArrays, array) {
    return arrayOfArrays.some(function (arrayItem) {
      return Util.arraysEqual(arrayItem, array);
    });
  };

  Util.sample = function sample(array) {
    var length = array.length;
    var index = Math.floor(Math.random() * length);
    return array[index];
  };

  Util.vectorSum = function vectorSum(v1, v2) {
    var row = v1[0] + v2[0];
    var col = v1[1] + v2[1];
    return [row, col];
  };
}());
