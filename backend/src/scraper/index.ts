import { channels } from "./config/channel";
import { YouTubeScraper } from "./youtube";
import { getShow, isStory, mapStory, buildDataset } from "./stories";

const scraper = new YouTubeScraper();

async function main() {
  const channel = channels[0];

  if (!channel) throw new Error("No channels configured");

  console.log(`\nAudioPedia scraper — ${channel.name} (${channel.url})`);
  console.log("────────────────────────────────────────────\n");

  console.log("Listing videos…");
  const videos = await scraper.listVideos(channel.url);
  console.log(`Found ${videos.length} uploads\n`);

  console.log("Classifying uploads by show…");
  const candidates = videos.filter(
    (video) => isStory(video.title) && getShow(video.title) !== null
  );

  const counts = {
    "goppo-mir-er-thek": 0,
    "gmt-shorts": 0
  };

  for (const video of candidates) {
    const show = getShow(video.title);
    if (show) counts[show]++;
  }

  console.log(`Stories: ${candidates.length}`);
  console.log(`  goppo-mir-er-thek: ${counts["goppo-mir-er-thek"]}`);
  console.log(`  gmt-shorts:        ${counts["gmt-shorts"]}`);
  console.log(`Ignored:             ${videos.length - candidates.length}\n`);

  console.log(`Fetching full metadata for ${candidates.length} stories…`);
  const infos = await scraper.getVideos(candidates.map((video) => video.id));

  const stories = infos.flatMap((info) => {
    const show = getShow(info.title);
    if (!show) return [];

    return [{ story: mapStory(info), show }];
  });

  console.log(`Mapped ${stories.length} stories\n`);

  const dataset = buildDataset(channel.name, stories);
  const outputPath = `data/${channel.id}.json`;
  await Bun.write(outputPath, JSON.stringify(dataset, null, 2));

  console.log(
    `Wrote ${dataset.metadata.totalStories} stories → ${outputPath} ` +
      `(${dataset.shows["goppo-mir-er-thek"].length} GMT, ${dataset.shows["gmt-shorts"].length} Shorts)`
  );
}

main();