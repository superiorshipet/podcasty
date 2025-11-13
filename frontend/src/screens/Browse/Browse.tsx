import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Podcast, Category } from "../../types"; 

const PodcastCard = ({ podcast }: { podcast: Podcast }) => {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/podcast/${podcast.id}`)}
      className="flex flex-col w-full h-[364px] items-start gap-6 bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-[#0000001a] cursor-pointer"
    >
      <div className="h-[258.4px] bg-gray-100 relative w-full">
        <img
          className="w-full h-full object-cover"
          src={podcast.imageUrl}
          alt={`${podcast.title} cover`}
        />
      </div>
      <div className="flex flex-col w-full h-20 items-start gap-1 px-4">
        <h3 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
          {podcast.title}
        </h3>
        <p className="[font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm tracking-[0] leading-5 whitespace-nowrap">
          {podcast.author}
        </p>
      </div>
    </article>
  );
};

export const Browse = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // --- [ API] ---
        // const categoriesRes = await fetch("/api/categories");
        // const podcastsRes = await fetch("/api/podcasts?category=" + activeCategory);
        // const categoriesData = await categoriesRes.json();
        // const podcastsData = await podcastsRes.json();
        // setCategories(categoriesData);
        // setPodcasts(podcastsData);
        // ------------------------------------

        // بيانات وهمية مؤقتة
        await new Promise(res => setTimeout(res, 1000));
        setCategories([
          { id: "all", label: "All" },
          { id: "technology", label: "💻 Technology" },
          { id: "business", label: "💼 Business" },
        ]);
        setPodcasts([
          { id: "1", title: "Tech Talks Daily", author: "johndoe", imageUrl: "https://placehold.co/260x260/222/FFF?text=Tech", description: "" },
          { id: "2", title: "Business Minds", author: "sarahsmith", imageUrl: "https://placehold.co/260x260/444/FFF?text=Business", description: "" },
          { id: "3", title: "Wellness Hour", author: "johndoe", imageUrl: "https://placehold.co/260x260/666/FFF?text=Wellness", description: "" },
        ]);
      } catch (err) {
        setError("Failed to load podcasts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeCategory]); 

  return (
    <div
      className="bg-white w-full min-h-screen relative"
    >
      {/* تم حذف الـ Navbar المكرر من هنا.
      */}

      {/* Main Content */}
      <main className="flex flex-col w-full max-w-6xl mx-auto items-start gap-8 pt-8 pb-12 px-4">
        <h2 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-6 whitespace-nowrap">
          Browse All Podcasts
        </h2>

        {/* Podcast Categories */}
        <nav
          className="relative self-stretch w-full flex flex-wrap gap-2"
          role="navigation"
          aria-label="Podcast categories"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`all-[unset] box-border flex items-center justify-center gap-2 px-4 py-2 h-9 rounded-lg ${
                  isActive
                    ? "bg-[#030213] text-white"
                    : "bg-white border-[0.8px] border-solid border-[#0000001a] text-neutral-950"
                } [font-family:'Arimo',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap`}
              >
                {category.label}
              </button>
            );
          })}
        </nav>

        {/* Podcast Grid */}
        <section
          className="relative self-stretch w-full"
          aria-label="Podcast Grid"
        >
          {isLoading && <div className="[font-family:'Arimo',Helvetica]">Loading podcasts...</div>}
          {error && <div className="text-red-500 [font-family:'Arimo',Helvetica]">{error}</div>}
          
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {podcasts.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};