export type ShowId = "goppo-mir-er-thek" | "gmt-shorts";

export interface ChannelConfig {
  id: string;
  name: string;
  url: string;
}

export interface ShowConfig {
  id: ShowId;
  name: string;
  channelId: string;
  patterns: RegExp[];
}

export const channels: ChannelConfig[] = [
  {
    id: "mir-afsar-ali",
    name: "Mir Afsar Ali",
    url: "https://www.youtube.com/@realmir"
  }
];

export const shows: ShowConfig[] = [
  {
    id: "goppo-mir-er-thek",
    name: "Goppo Mir-er Thek",
    channelId: "mir-afsar-ali",
    patterns: [
      /#goppomirerthek/i,
      /#গপ্পোমীরেরঠেক/i,
      /gmt originals/i,
      /goppo mir-?er thek/i,
    ]
  },
  {
    id: "gmt-shorts",
    name: "GMT Shorts",
    channelId: "mir-afsar-ali",
    patterns: [/#gmtshorts/i]
  }
];
