import { shows, type ShowId } from "./config/channel";
import type { Story } from "./types/story";
import type { StoryDataset } from "./types/story-dataset";

export const EXCLUDED_KEYWORDS = [
  "official music video",
  "music video",
  "promo",
  "teaser",
  "trailer",
  "coming soon",
  "non stop",
  "non-stop",
  "live",
  "announcement",
  "lyrical",
  "title track",
  "title song",
  "Yearwrapped",
  "GMTOnstage"
];

export function isStory(title: string): boolean {
  const t = title.toLowerCase();

  return !EXCLUDED_KEYWORDS.some((keyword) => t.includes(keyword));
}

export function getShow(title: string): ShowId | null {
  for (const show of shows) {
    for (const pattern of show.patterns) {
      if (pattern.test(title)) return show.id;
    }
  }
  return null;
}

export function mapStory(info: any): Story {
  return {
    youtubeId: info.id,
    title: info.title,
    description: info.description ?? "",
    url: info.webpage_url,
    thumbnail: info.thumbnail ?? "",
    duration: info.duration ?? 0,
    publishedAt: toIso(info.timestamp, info.upload_date)
  };
}

export function buildDataset(
  channelName: string,
  stories: { story: Story; show: ShowId }[]
): StoryDataset {
  const dataset: StoryDataset = {
    metadata: {
      channel: channelName,
      scrapedAt: new Date().toISOString(),
      totalStories: stories.length
    },
    shows: {
      "goppo-mir-er-thek": [],
      "gmt-shorts": []
    }
  };

  for (const { story, show } of stories) {
    dataset.shows[show].push(story);
  }

  return dataset;
}

function toIso(timestamp: number | undefined, uploadDate: string | undefined): string {
  if (typeof timestamp === "number") return new Date(timestamp * 1000).toISOString();

  if (uploadDate) {
    const year = Number(uploadDate.slice(0, 4));
    const month = Number(uploadDate.slice(4, 6));
    const day = Number(uploadDate.slice(6, 8));
    if (year && month && day) return new Date(Date.UTC(year, month - 1, day)).toISOString();
  }

  return "";
}
