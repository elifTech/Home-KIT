const get = {
  query: {
    user: {
      isRequired: true,
      isLength: {min: 1}
    },
    thingName: {
      isRequired: true,
      isLength: {min: 1}
    }
  }
};

const remove = {
  body: {
    user: {
      isRequired: true,
      isLength: {min: 1}
    },
    thingName: {
      isRequired: true,
      isLength: {min: 1}
    },
    type: {
      isRequired: true,
      isLength: {min: 1}
    }
  }
};

export default {
  get: get,
  remove: remove
}
