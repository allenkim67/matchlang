class Bimap {
  constructor() {
    this._keys = {};
    this._values = {};
  }

  push(key, value) {
    this._keys[key] ? this._keys[key].push(value) : this._keys[key] = [value];
    this._values[value] = key;
  }

  get keys() {
    return Object.keys(this._keys);
  }

  remove(key, value) {
    if (this._keys[key]) {
      const i = this._keys[key].indexOf(value);
      this._keys[key].splice(i, 1);
      if (this._keys[key].length === 0) {
        delete this._keys[key];
      }
    }

    if (this._values[value]) {
      delete this._values[value];
    }
  }

  getKey(value) {
    return this._values[value];
  }

  getValue(key) {
    return this._keys[key];
  }
}

module.exports = Bimap;