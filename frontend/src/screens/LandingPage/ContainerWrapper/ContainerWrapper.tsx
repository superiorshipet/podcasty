import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Podcast } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext"; 

// (Popular Podcasts Section) - Refactored for API, Polish, & Guest Mode

const PodcastCardSmall = ({ podcast }: { podcast: Podcast }) => {
  const navigate = useNavigate();
  const { user, openLoginModal } = useAuth(); 

  const handleClick = () => {
    if (!user) {
      openLoginModal(); 
    } else {
      navigate(`/podcast/${podcast.id}`);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="flex flex-col w-full h-[270px] items-start gap-4 bg-white rounded-[14px] overflow-hidden 
                 border-[0.8px] border-solid border-[#0000001a] cursor-pointer
                 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1" 
    >
      <div className="h-[164px] bg-gray-100 relative w-full">
        <img
          className="w-full h-full object-cover"
          src={podcast.imageUrl}
          alt={`${podcast.title} cover`}
        />
      </div>
      <div className="flex flex-col w-full h-20 items-start gap-1 px-4">
        <h3 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap truncate w-full">
          {podcast.title}
        </h3>
        <p className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm tracking-[0] leading-5 whitespace-nowrap truncate w-full">
          {podcast.author}
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
    // --- جلب بيانات وهمية ---
    const fetchPopular = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 1000)); // محاكاة تحميل
      setPodcasts([
        { id: "1", title: "Tech Talks Daily", author: "johndoe", imageUrl: "https://placehold.co/165x165/222/FFF?text=Tech", description: "" },
        { id: "2", title: "Business Minds", author: "sarahsmith", imageUrl: "https://placehold.co/165x165/444/FFF?text=Business", description: "" },
        { id: "3", title: "Wellness Hour", author: "johndoe", imageUrl: "https://placehold.co/165x165/666/FFF?text=Wellness", description: "" },
        { id: "4", title: "Future Learning", author: "sarahsmith", imageUrl: "https://placehold.co/165x165/888/FFF?text=Learning", description: "" },
        { id: "5", title: "Cinema Secrets", author: "johndoe", imageUrl: "https://placehold.co/165x165/AAA/FFF?text=Cinema", description: "" },
        { id: "6", title: "Science Unveiled", author: "sarahsmith", imageUrl: "https://placehold.co/165x165/CCC/000?text=Science", description: "" },
      ]);
      setIsLoading(false);
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
                     transition-all duration-200 ease-in-out hover:bg-gray-100" // <-- إضافة Hover
        >
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="w-full text-center [font-family:'Arimo',Helvetica]">Loading popular podcasts...</div>
      ) : (
        // (7) تعديل: أصبح Grid مرن (responsive)
        <div className="self-stretch w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {podcasts.map((podcast) => (
            <PodcastCardSmall key={podcast.id} podcast={podcast} />
          ))}
        </div>
      )}
    </div>
  );
};