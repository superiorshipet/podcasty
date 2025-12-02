import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Podcast } from "../../../types";
import { api } from "../../../services/api"; 

const PodcastCardSmall = ({ podcast }: { podcast: Podcast }) => {
  const navigate = useNavigate();
  
  const imageSrc = podcast.coverImage || "https://placehold.co/165x165?text=No+Image";
  
  const authorName = podcast.creator?.userName || "Unknown Creator";

  return (
    <article
      onClick={() => navigate(`/podcast/${podcast.podcastId}`)} 
      className="flex flex-col w-full h-[270px] items-start gap-4 bg-white rounded-[14px] overflow-hidden 
                 border-[0.8px] border-solid border-[#0000001a] cursor-pointer
                 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    >
      <div className="h-[164px] bg-gray-100 relative w-full">
        <img
          className="w-full h-full object-cover"
          src={imageSrc}
          alt={`${podcast.title} cover`}
        />
      </div>
      <div className="flex flex-col w-full h-20 items-start gap-1 px-4">
        <h3 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap truncate w-full">
          {podcast.title}
        </h3>
        <p className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm tracking-[0] leading-5 whitespace-nowrap truncate w-full">
          {authorName}
        </p>
      </div>
    </article>
  );
};

export const ContainerWrapper = (): JSX.Element => {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      setIsLoading(true);
      try {
        const allPodcasts = await api.podcasts.getAll();
        
        setPodcasts(Array.isArray(allPodcasts) ? allPodcasts.slice(0, 6) : []);
      } catch (error) {
        console.error("Failed to load popular podcasts", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPopular();
  }, []);

  return (
    <div className="flex flex-col w-full items-start gap-8 pt-16 pb-0 px-4 max-w-6xl mx-auto">
      <div className="flex h-9 items-center justify-between relative self-stretch w-full">
        <div className="relative w-fit h-6">
          <h2 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-lg md:text-xl tracking-[0] leading-6 whitespace-nowrap">
            Popular Podcasts
          </h2>
        </div>
        <button 
          onClick={() => navigate("/browse")}
          className="all-[unset] box-border flex w-fit items-center justify-center gap-2 px-4 py-2 h-9 relative rounded-lg 
                     [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5
                     transition-all duration-200 ease-in-out hover:bg-gray-100"
        >
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="w-full text-center py-10 [font-family:'Arimo',Helvetica]">Loading...</div>
      ) : podcasts.length > 0 ? (
        <div className="self-stretch w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {podcasts.map((podcast) => (
            <PodcastCardSmall key={podcast.podcastId} podcast={podcast} />
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-10 text-gray-500 [font-family:'Arimo',Helvetica]">
          No podcasts found. Go to Dashboard to create one!
        </div>
      )}
    </div>
  );
};