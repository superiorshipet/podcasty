import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Podcast } from "../../types";

// Category colors for cards
const categoryColors = [
  "from-purple-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-blue-500 to-cyan-600",
  "from-green-500 to-emerald-600",
  "from-orange-500 to-amber-600",
  "from-red-500 to-pink-600",
  "from-teal-500 to-green-600",
  "from-violet-500 to-purple-600",
];

// Podcast images for hero section
const heroImages = {
  left: "https://hiszpanskiodpodstaw.pl/wp-content/uploads/2025/12/podcasty-dla-uczacych-sie-hiszpanskiego.png",
  right: "https://www.podcasty.net/wp-content/uploads/2024/11/Podcaster-kto-to-1024x724.webp"
};

// Public Stats interface
interface PublicStats {
  usersCount: number;
  podcastsCount: number;
  episodesCount: number;
}

// Hero Section for non-logged in users
const HeroSection = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.publicStats.get();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative min-h-[80vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Image Circle */}
        <div className="hidden lg:flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src={heroImages.left}
                alt="Podcast listener"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-60 blur-xl"></div>
          </div>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <img
              src={heroImages.right}
              alt="Podcaster"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Start Publishing Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Podcast
            </span>{" "}
            Today
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Share your voice with the world. Create, publish, and grow your podcast audience with our powerful platform. Join thousands of creators already sharing their stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full 
                       hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-purple-500/50"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/browse")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border border-white/20
                       hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
            >
              Explore Podcasts
            </button>
          </div>

          {/* Real Stats from API */}
          <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats?.usersCount || 0}
              </div>
              <div className="text-gray-400 text-sm">Registered Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats?.podcastsCount || 0}
              </div>
              <div className="text-gray-400 text-sm">Podcasts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats?.episodesCount || 0}
              </div>
              <div className="text-gray-400 text-sm">Episodes</div>
            </div>
          </div>
        </div>

        {/* Right Image Circle */}
        <div className="hidden lg:flex flex-col items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <img
              src={heroImages.left}
              alt="Listener"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src={heroImages.right}
                alt="Creator"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 opacity-60 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Mobile Images */}
      <div className="lg:hidden flex justify-center gap-6 pb-12">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
          <img src={heroImages.left} alt="Podcast" className="w-full h-full object-cover" />
        </div>
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
          <img src={heroImages.right} alt="Podcaster" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, colorIndex }: { category: any; colorIndex: number }) => {
  const navigate = useNavigate();
  const colorClass = categoryColors[colorIndex % categoryColors.length];

  return (
    <div
      onClick={() => navigate(`/browse?category=${category.categoryId}`)}
      className={`relative overflow-hidden rounded-2xl p-6 h-40 cursor-pointer
                 bg-gradient-to-br ${colorClass}
                 transform hover:scale-105 transition-all duration-300
                 shadow-lg hover:shadow-2xl group`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-8 translate-y-8"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <h3 className="text-xl md:text-2xl font-bold text-white text-center drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {category.name}
        </h3>
      </div>
    </div>
  );
};

// Categories Section for logged in users
const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await api.categories.getAll();
        setCategories(cats || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Find podcasts that match your interests
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.categoryId} category={category} colorIndex={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">No categories available</div>
        )}
      </div>
    </div>
  );
};

// Popular Podcasts Section
const PopularPodcastsSection = () => {
  const navigate = useNavigate();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const allPodcasts = await api.podcasts.getAll();
        setPodcasts(Array.isArray(allPodcasts) ? allPodcasts.slice(0, 6) : []);
      } catch (error) {
        console.error("Failed to load podcasts", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Popular Podcasts
          </h2>
          <button
            onClick={() => navigate("/browse")}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            View All
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : podcasts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {podcasts.map((podcast) => (
              <div
                key={podcast.podcastId}
                onClick={() => navigate(`/podcast/${podcast.podcastId}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                  {podcast.coverImage ? (
                    <img
                      src={podcast.coverImage}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                  {podcast.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {podcast.creator?.userName || "Unknown Creator"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No podcasts found. Be the first to create one!
          </div>
        )}
      </div>
    </div>
  );
};

// Main Landing Page Component
export const LandingPage = (): JSX.Element => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {!user ? (
        // Not logged in: Show hero section
        <>
          <HeroSection />
          <PopularPodcastsSection />
        </>
      ) : (
        // Logged in: Show categories and podcasts
        <>
          <div className="pt-8">
            <CategoriesSection />
          </div>
          <PopularPodcastsSection />
        </>
      )}
    </div>
  );
};