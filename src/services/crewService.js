import axios from "axios";

const CREW_API_URL = "https://ll.thespacedevs.com/2.2.0/astronaut/?in_space=true&limit=15";

/**
 * Fetches the current astronauts in space from The Space Devs API.
 * This API provides high-res images, agency details, and time in space.
 */
export const getLiveCrewData = async () => {
  try {
    const response = await axios.get(CREW_API_URL);
    return response.data.results;
  } catch (error) {
    console.warn("SpaceDevs API rate limited. Falling back to cached crew data.", error.message);
    // Fallback data (Expedition 71 Crew) to prevent UI breakage during dev rate-limits
    return [
      {
        id: 1, name: "Oleg Kononenko", nationality: "Russian", 
        agency: { abbrev: "RFSA" }, time_in_space: "P200D",
        profile_image_thumbnail: "https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/astronaut_images/oleg_kononenko_image_20220911033621.jpeg"
      },
      {
        id: 2, name: "Nikolai Chub", nationality: "Russian",
        agency: { abbrev: "RFSA" }, time_in_space: "P200D",
        profile_image_thumbnail: "https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/astronaut_images/nikolai_chub_image_20211102151615.jpg"
      },
      {
        id: 3, name: "Tracy Caldwell Dyson", nationality: "American",
        agency: { abbrev: "NASA" }, time_in_space: "P50D",
        profile_image_thumbnail: "https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/astronaut_images/tracy_caldwell_dyson_image_20220911033954.jpeg"
      },
      {
        id: 4, name: "Matthew Dominick", nationality: "American",
        agency: { abbrev: "NASA" }, time_in_space: "P30D",
        profile_image_thumbnail: "https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/astronaut_images/matthew_dominick_image_20220911033959.jpeg"
      },
      {
        id: 5, name: "Michael Barratt", nationality: "American",
        agency: { abbrev: "NASA" }, time_in_space: "P30D",
        profile_image_thumbnail: "https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/astronaut_images/michael_barratt_image_20220911034005.jpeg"
      },
      {
        id: 6, name: "Jeanette Epps", nationality: "American",
        agency: { abbrev: "NASA" }, time_in_space: "P30D",
        profile_image_thumbnail: "https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/astronaut_images/jeanette_epps_image_20220911034011.jpeg"
      },
      {
        id: 7, name: "Alexander Grebenkin", nationality: "Russian",
        agency: { abbrev: "RFSA" }, time_in_space: "P30D",
        profile_image_thumbnail: "https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/astronaut_images/alexander_grebenkin_image_20220911034020.jpeg"
      }
    ];
  }
};
