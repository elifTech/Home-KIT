const post = {
  body: {
    user: {
      isRequired: true,
      isLength: {min: 1}
    },
    accessKey: {
      isRequired: true,
      isLength: {min: 1}
    },
    secretKey: {
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

const things = {
  query: {
    user: {
      isRequired: true,
      isLength: {min: 1}
    }
  }
};

export default {
  post: post,
  get: get,
  things: things
}
