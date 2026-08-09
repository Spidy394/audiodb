import type { ShowId } from "../config/channel";
import type { Story } from "./story";

export interface StoryDataset {
  metadata: {
    channel: string;
    scrapedAt: string;
    totalStories: number;
  };

  shows: Record<ShowId, Story[]>;
}
