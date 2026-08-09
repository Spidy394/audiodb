import { execa } from "execa";

export interface FlatVideo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
}

const CHUNK_SIZE = 20;

export class YouTubeScraper {
  async listVideos(channelUrl: string, limit?: number): Promise<FlatVideo[]> {
    const args = ["--flat-playlist", "-J"];

    if (limit) args.push("--playlist-end", limit.toString());

    args.push(`${channelUrl}/videos`);

    const { stdout } = await execa("yt-dlp", args);

    const entries = stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .flatMap((object: any) =>
        Array.isArray(object.entries) ? object.entries : [object]
      );

    return entries
      .filter((video: any) => video.id)
      .map((video: any) => ({
        id: video.id,
        title: video.title,
        duration: video.duration ?? 0,
        thumbnail: video.thumbnails?.[video.thumbnails.length - 1]?.url ?? ""
      }));
  }

  async getVideos(ids: string[]): Promise<any[]> {
    const results: any[] = [];
    const chunks: string[][] = [];

    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      chunks.push(ids.slice(i, i + CHUNK_SIZE));
    }

    for (const chunk of chunks) {
      const urls = chunk.map((id) => `https://www.youtube.com/watch?v=${id}`);

      try {
        const { stdout } = await execa("yt-dlp", ["--dump-single-json", ...urls]);

        for (const line of stdout.trim().split("\n").filter(Boolean)) {
          results.push(JSON.parse(line));
        }
      } catch (error) {
        console.error(`Failed to fetch chunk: ${urls.join(", ")}`, error);
      }

      console.log(`  [${results.length}/${ids.length}] ${chunk.length} videos`);
    }

    return results;
  }
}
