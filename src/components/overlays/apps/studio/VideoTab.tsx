import React, { useState } from 'react';
import { PlayCircle, Film } from 'lucide-react';

const playlist = [
    { id: 1, title: 'Introduction to SaaS', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail: 'https://picsum.photos/seed/vid1/200/100' },
    { id: 2, title: 'Advanced React Patterns', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnail: 'https://picsum.photos/seed/vid2/200/100' },
    { id: 3, title: 'UI/UX Design Principles', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail: 'https://picsum.photos/seed/vid3/200/100' },
];

const VideoTab: React.FC = () => {
    const [currentVideo, setCurrentVideo] = useState(playlist[0]);

    return (
        <div className="w-full h-full flex">
            <div className="w-2/3 bg-black flex items-center justify-center">
                {currentVideo ? (
                    <video key={currentVideo.id} controls autoPlay className="max-w-full max-h-full">
                        <source src={currentVideo.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="text-white text-center">
                        <PlayCircle className="w-16 h-16 mx-auto mb-4"/>
                        <p>Select a video to play</p>
                    </div>
                )}
            </div>
            <div className="w-1/3 bg-brand-surface p-2 flex flex-col">
                <h3 className="text-lg font-bold p-2 text-brand-text">Playlist</h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {playlist.map(video => (
                        <button 
                            key={video.id} 
                            onClick={() => setCurrentVideo(video)}
                            className={`w-full text-left p-2 rounded-lg flex items-center gap-3 ${currentVideo.id === video.id ? 'bg-brand-primary/10' : 'hover:bg-brand-surface-alt'}`}
                        >
                            <img src={video.thumbnail} alt={video.title} className="w-24 h-14 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold text-sm text-brand-text">{video.title}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoTab;
