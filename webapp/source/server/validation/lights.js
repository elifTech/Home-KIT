const post = {
  body: {
    user: {
      isRequired: true,
      isLength: {min: 1}
    },
    thingName: {
      isRequired: true,
      isLength: {min: 1}
    },
    color: {
      isRequired: true,
      isLength: {min: 1}
    },
    lights: {
      yellow: {
        isRequired: true,
        isBoolean: true
      },
      red: {
        isRequired: true,
        isBoolean: true
      },
      green: {
        isRequired: true,
        isBoolean: true
      }
    }
  }
};

export default {
  post: post
}
