module.exports = function (res) {
  const providerDetails = res.userDetails;
  const message = res.message;

  res.json({
    status: 200,
    success: true,
    message: message,
    data: {
      token: {
        access_token: providerDetails["access_token"],
        refresh_token: providerDetails["refresh_token"],
      },
      id: providerDetails["user_id"],
      result_id: providerDetails["result_id"],
      type: providerDetails["type"],
      name: providerDetails["name"],
      email: providerDetails["email"],
      phonenumber: providerDetails["phonenumber"],
      profile_image: providerDetails["profile_image"],
      geo_location: {
        latitude: providerDetails["latitude"],
        longitude: providerDetails["longitude"],
      },
      address: {
        door_number: providerDetails["door_number"],
        street: providerDetails["street"],
        city: providerDetails["city"],
        state: providerDetails["state"],
        zip_code: providerDetails["zip_code"],
        country: providerDetails["country"],
      },
      shop_details: {
        shop_name: providerDetails["shop_name"],
        shop_images: providerDetails["shop_images"],
        shop_contact_number: providerDetails["shop_contact_number"],
        damaged_can_cost: providerDetails["damaged_can_cost"],
        shop_geo_location: {
          latitude: providerDetails["shop_latitude"],
          longitude: providerDetails["shop_longitude"],
        },
        shop_address: {
          shop_door_number: providerDetails["shop_door_number"],
          shop_street: providerDetails["shop_street"],
          shop_city: providerDetails["shop_city"],
          shop_state: providerDetails["shop_state"],
          shop_zip_code: providerDetails["shop_zip_code"],
          shop_country: providerDetails["shop_country"],
        },
      },
      date_created: providerDetails["date_created"],
    },
  });
};
