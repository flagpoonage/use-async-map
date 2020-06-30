const { exitOnError } = require('./utils');

function toSemver(value) {
  let semver = value;
  if (typeof value === 'string') {
    semver = new Semver(value);
  }

  if (!(semver instanceof Semver)) {
    console.log(value);
    exitOnError(`Unable to parse semver [${value}]`);
  }

  return semver;
}

class Semver {
  constructor(string) {
    try {
      const vals = string.split('.');

      this.major = Number(vals[0] || 0);
      this.minor = Number(vals[1] || 0);
      this.patch = Number(vals[2] || 0);
      this.build = Number(vals[3] || 0);

    } catch (exception) {
      exitOnError(`Unable to parse semver [${string}]`, exception);
    }
  }

  isSameAs = (value) => {
    let semver = toSemver(value);

    const comparison = this.compare(semver);

    if (
      comparison.major !== 0 ||
      comparison.minor !== 0 ||
      comparison.patch !== 0 ||
      comparison.build !== 0
    ) {
      return false;
    }

    return true;
  };

  isHigherThan = (value) => {
    let semver = toSemver(value);

    const comparison = this.compare(semver);

    if (comparison.major !== 0) {
      return comparison.major > 0 ? true : false;
    }

    if (comparison.minor !== 0) {
      return comparison.minor > 0 ? true : false;
    }

    if (comparison.patch !== 0) {
      return comparison.patch > 0 ? true : false;
    }

    if (comparison.build !== 0) {
      return comparison.build > 0 ? true : false;
    }

    return false;
  };

  isLowerThan = (value) => {
    let semver = toSemver(value);

    const comparison = this.compare(semver);

    if (comparison.major !== 0) {
      return !!comparison.major;
    }

    if (comparison.minor !== 0) {
      return !!comparison.minor;
    }

    if (comparison.patch !== 0) {
      return !!comparison.patch;
    }

    if (comparison.build !== 0) {
      return !!comparison.build;
    }

    return false;
  };

  compare = (value) => {
    return {
      major: this.compareField(value, 'major'),
      minor: this.compareField(value, 'minor'),
      patch: this.compareField(value, 'patch'),
      build: this.compareField(value, 'build'),
    };
  };

  compareField = (value, key) => {
    return value[key] > this[key] ? -1 : value[key] === this[key] ? 0 : 1;
  };
}

module.exports = {
  Semver,
  toSemver
};