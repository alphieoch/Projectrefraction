const apiKey = '2164218-a660e6d3883800d89a77a4886';
const apiUrl = `https://pixabay.com/api/videos/?key=${apiKey}&q=aerial&min_width=3840&min_height=2160&video_type=film`;

async function fetchBackgroundVideos() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const filteredVideoUrls = data.hits
            .filter(video => video.videos.large && video.videos.large.width >= 3840 && video.videos.large.height >= 2160)
            .map(video => video.videos.large.url);

        return filteredVideoUrls;
    } catch (error) {
        console.log('Error fetching background videos:', error);
        return [];
    }
}