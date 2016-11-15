const post = {
  body: {
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

const get = {
  query: {
    user: {
      isRequired: true,
      isLength: {min: 1}
    }
  }
};

const connect = {
  body: {
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

export default {
  post: post,
  get: get,
  connect: connect
}
