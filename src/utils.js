import axios from "axios";

const YOUTUBE_API_KEY = "ENV";

export const getVideoInfo = async (videoId) => {
  try {
    const {
      data: { items },
    } = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        key: YOUTUBE_API_KEY,
        part: "id,snippet",
        id: videoId,
      },
    });
    return items[0];
  } catch (e) {
    console.log(`error on youtube data api : ${e}`);
  }
};
