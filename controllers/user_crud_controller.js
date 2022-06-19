exports.sendUser = (req, res) => {
  const user = req.user;
  res.json({
    status: 200,
    data: {
      token: {
        access_token: user["access_token"],
        refresh_token: user["refresh_token"],
      },
      user_id: user["user_id"],
      type: user["type"],
      name: user["name"],
      email: user["email"],
      phonenumber: user["phonenumber"],
      profile_image: user["profile_image"],
      geo_location: {
        latitude: user["latitude"],
        longitude: user["longitude"],
      },
      address: {
        door_number: user["door_number"],
        street: user["street"],
        city: user["city"],
        state: user["state"],
        zip_code: user["zip_code"],
        country: user["country"],
      },
      date_created: user["date_created"],
    },
  });
};
