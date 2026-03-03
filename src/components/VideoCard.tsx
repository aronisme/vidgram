import Link from "next/link";
import Image from "next/image";
import { Play, Eye, Calendar } from "lucide-react";
import { VideoMetadata } from "@/lib/videoService";

export default function VideoCard({ video }: { video: VideoMetadata }) {
    return (
        <article className="group glass overflow-hidden rounded-[var(--radius-md)] flex flex-col transition-all hover:scale-[1.02]">
            <Link href={`/video/${video.slug}`} className="relative aspect-video overflow-hidden">
                <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-110"
                    priority={false}
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 p-3 rounded-full text-[var(--accent)]">
                        <Play size={24} fill="currentColor" />
                    </div>
                </div>
            </Link>

            <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-lg leading-tight group-hover:text-[var(--accent)] transition-colors">
                    <Link href={`/video/${video.slug}`}>
                        {video.title}
                    </Link>
                </h3>

                <p className="text-[var(--text-secondary)] text-sm line-clamp-2">
                    {video.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs font-medium text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                        <Eye size={14} />
                        <span>{video.views} views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{new Date(video.createdAt?.toDate?.() || video.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
