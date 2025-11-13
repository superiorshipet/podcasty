import React, { useState } from "react";

interface Category {
  id: string;
  label: string;
}

interface PodcastCard {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
}

export const Browse = (): JSX.Element => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories: Category[] = [
    { id: "all", label: "All" },
    { id: "technology", label: "💻 Technology" },
    { id: "business", label: "💼 Business" },
    { id: "health", label: "🏥 Health" },
    { id: "education", label: "📚 Education" },
    { id: "entertainment", label: "🎬 Entertainment" },
    { id: "science", label: "🔬 Science" },
    { id: "news", label: "📰 News" },
    { id: "sports", label: "⚽ Sports" },
  ];

  const podcastsRow1: PodcastCard[] = [
    {
      id: 1,
      title: "Tech Talks Daily",
      author: "johndoe",
      imageUrl:
        "https://c.animaapp.com/bc77ScGo/img/image--tech-talks-daily-@2x.png",
    },
    {
      id: 2,
      title: "Business Minds",
      author: "sarahsmith",
      imageUrl:
        "https://c.animaapp.com/bc77ScGo/img/image--business-minds-@2x.png",
    },
    {
      id: 3,
      title: "Wellness Hour",
      author: "johndoe",
      imageUrl:
        "https://c.animaapp.com/bc77ScGo/img/image--wellness-hour-@2x.png",
    },
    {
      id: 4,
      title: "Future Learning",
      author: "sarahsmith",
      imageUrl:
        "https://c.animaapp.com/bc77ScGo/img/image--future-learning-@2x.png",
    },
  ];

  const podcastsRow2: PodcastCard[] = [
    {
      id: 5,
      title: "Cinema Secrets",
      author: "johndoe",
      imageUrl:
        "https://c.animaapp.com/bc77ScGo/img/image--cinema-secrets-@2x.png",
    },
    {
      id: 6,
      title: "Science Unveiled",
      author: "sarahsmith",
      imageUrl:
        "https://c.animaapp.com/bc77ScGo/img/image--science-unveiled-@2x.png",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div
      className="bg-white w-full min-w-[1144px] min-h-[1137px] relative"
      data-model-id="1:239"
    >
      {/* Navigation Bar */}
      <nav className="flex flex-col w-[1144px] h-[69px] items-start pt-4 pb-[0.8px] px-4 absolute top-[31px] left-0 bg-white border-b-[0.8px] [border-bottom-style:solid] border-[#0000001a]">
        <div className="flex h-9 items-center justify-between pr-[-4.58e-05px] pl-0 py-0 relative self-stretch w-full">
          <div className="flex w-[208.88px] h-7 items-center gap-8 relative">
            <div className="flex w-[126.04px] h-7 items-center gap-2 relative">
              <img
                className="relative w-6 h-6"
                alt="Podstream logo icon"
                src="https://c.animaapp.com/bc77ScGo/img/icon.svg"
              />

              <div className="relative flex-1 grow h-7">
                <div className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-xl tracking-[0] leading-7 whitespace-nowrap">
                  Podstream
                </div>
              </div>
            </div>

            <div className="relative w-[50.84px] h-6">
              <div className="-top-0.5 [font-family:'Arimo',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 whitespace-nowrap absolute left-0">
                Browse
              </div>
            </div>
          </div>

          <div className="flex w-[167.09px] h-9 items-center gap-4 relative">
            <button
              className="all-[unset] box-border flex flex-col w-[69.08px] h-9 items-start relative"
              type="button"
              aria-label="Login"
            >
              <span className="all-[unset] box-border relative self-stretch w-full bg-white border-[0.8px] border-solid border-[#0000001a] h-9 rounded-lg flex items-center justify-center">
                <span className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Login
                </span>
              </span>
            </button>

            <button
              className="all-[unset] box-border flex flex-col w-[82.01px] h-9 items-start relative"
              type="button"
              aria-label="Sign Up"
            >
              <span className="all-[unset] box-border relative self-stretch w-full bg-[#030213] h-9 rounded-lg flex items-center justify-center">
                <span className="[font-family:'Arimo',Helvetica] font-normal text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
                  Sign Up
                </span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col w-[1144px] h-[1137px] items-start gap-8 pt-[100.8px] pb-0 px-4 top-[83px] bg-white absolute left-0">
        <div className="relative self-stretch w-full h-6">
          <div className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
            Browse All Podcasts
          </div>
        </div>

        {/* Podcast Categories */}
        <nav
          className="relative self-stretch w-full h-9"
          role="navigation"
          aria-label="Podcast categories"
        >
          {categories.map((category, index) => {
            const isActive = activeCategory === category.id;
            const positions = [0, 57, 194, 313, 419, 547, 702, 814, 914];
            const widths = [49, 129, 111, 99, 120, 147, 104, 91, 98];

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`all-[unset] box-border flex items-center justify-center gap-2 px-4 py-2 absolute top-0 h-9 rounded-lg ${
                  isActive
                    ? "bg-[#030213]"
                    : "bg-white border-[0.8px] border-solid border-[#0000001a]"
                }`}
                style={{
                  left: `${positions[index]}px`,
                  width: `${widths[index]}px`,
                }}
                aria-pressed={isActive}
                aria-label={`Filter by ${category.label}`}
              >
                <span
                  className={`relative w-fit ${
                    isActive ? "mt-[-1.00px]" : "mt-[-0.80px]"
                  } [font-family:'Arimo',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap ${
                    isActive ? "text-white" : "text-neutral-950"
                  }`}
                >
                  {category.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Podcast Grid */}
        <section
          className="relative self-stretch w-full h-[752px]"
          aria-label="Podcast Grid"
        >
          {podcastsRow1.map((podcast, index) => (
            <article
              key={podcast.id}
              className="pt-[3.04e-06px] pl-[1.13e-06px] pr-0 pb-0 top-0 flex flex-col w-[260px] h-[364px] items-start gap-6 absolute bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-[#0000001a]"
              style={{ left: `${index * 284}px` }}
            >
              <div className="h-[258.4px] bg-gray-100 relative w-[258.4px]">
                <div
                  className="w-[258px] h-[258px] bg-cover bg-[50%_50%]"
                  style={{ backgroundImage: `url(${podcast.imageUrl})` }}
                  role="img"
                  aria-label={`${podcast.title} cover image`}
                />
              </div>

              <div className="flex flex-col w-[258.4px] h-20 items-start gap-1 pt-4 pb-0 px-4 relative">
                <div className="relative self-stretch w-full h-6">
                  <h3 className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
                    {podcast.title}
                  </h3>
                </div>

                <div className="relative self-stretch w-full h-5">
                  <p className="absolute -top-px left-0 [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {podcast.author}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {podcastsRow2.map((podcast, index) => (
            <article
              key={podcast.id}
              className="pt-[1.83e-05px] pl-[1.13e-06px] pr-0 pb-0 top-[388px] flex flex-col w-[260px] h-[364px] items-start gap-6 absolute bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-[#0000001a]"
              style={{ left: `${index * 284}px` }}
            >
              <div className="flex flex-col h-[258.4px] items-start bg-gray-100 relative w-[258.4px]">
                <div
                  className="relative self-stretch w-full h-[258.4px] bg-cover bg-[50%_50%]"
                  style={{ backgroundImage: `url(${podcast.imageUrl})` }}
                  role="img"
                  aria-label={`${podcast.title} cover image`}
                />
              </div>

              <div className="flex flex-col w-[258.4px] h-20 items-start gap-1 pt-4 pb-0 px-4 relative">
                <div className="relative self-stretch w-full h-6">
                  <h3 className="absolute -top-0.5 left-0 [font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base tracking-[0] leading-6 whitespace-nowrap">
                    {podcast.title}
                  </h3>
                </div>

                <div className="relative self-stretch w-full h-5">
                  <p className="absolute -top-px left-0 [font-family:'Arimo',Helvetica] font-normal text-[#495565] text-sm tracking-[0] leading-5 whitespace-nowrap">
                    {podcast.author}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};
