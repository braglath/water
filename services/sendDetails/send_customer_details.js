module.exports = function (res) {
  const customerDetails = res.userDetails;
  const message = res.message;

  // console.log(`send customer details ~ customerDetails ~ ${customerDetails}`);

  return res.json({
    status: 200,
    success: true,
    message: message,
    data: {
      token: {
        access_token: customerDetails["access_token"],
        refresh_token: customerDetails["refresh_token"],
      },
      id: customerDetails["user_id"],
      result_id: customerDetails["result_id"],
      type: customerDetails["type"],
      name: customerDetails["name"],
      email: customerDetails["email"],
      phonenumber: customerDetails["phonenumber"],
      profile_image: customerDetails["profile_image"],
      geo_location: {
        latitude: customerDetails["latitude"],
        longitude: customerDetails["longitude"],
      },
      address: {
        door_number: customerDetails["door_number"],
        street: customerDetails["street"],
        city: customerDetails["city"],
        state: customerDetails["state"],
        zip_code: customerDetails["zip_code"],
        country: customerDetails["country"],
      },
      date_created: customerDetails["date_created"],
    },
  });
};
