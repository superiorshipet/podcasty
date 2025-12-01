import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../../types"; 


const TechIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21M9 17.25v-10.5a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25V17.25m9-13.5l-3.86 3.86m0 0a2.25 2.25 0 01-3.182 0l-1.9-1.9a2.25 2.25 0 010-3.182l1.9-1.9a2.25 2.25 0 013.182 0l3.86 3.86z" />
  </svg>
);
const BusinessIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);
const HealthIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const EducationIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
  </svg>
);
const EntertainmentIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);
const ScienceIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
);
const NewsIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125H6.75" />
  </svg>
);
const SportsIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048m-3.484 0a2.25 2.25 0 00-1.161-.886l-.51-.766a.98.98 0 01.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568M12.75 3.031a9 9 0 00-3.484 0M12.75 3.031a9 9 0 013.484 0M12 21v-4.5m0 4.5H9.75a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h4.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25H12m-3-9v-3m3 3v-3m-3 0h3m-3 0h-1.5a2.25 2.25 0 00-2.25 2.25V12M15 9V6m0 0h1.5a2.25 2.25 0 012.25 2.25V12" />
  </svg>
);
const DefaultIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
  </svg>
);
const categoryIcons: { [key: string]: JSX.Element } = {
  technology: <TechIcon className="w-10 h-10" />,
  business: <BusinessIcon className="w-10 h-10" />,
  health: <HealthIcon className="w-10 h-10" />,
  education: <EducationIcon className="w-10 h-10" />,
  entertainment: <EntertainmentIcon className="w-10 h-10" />,
  science: <ScienceIcon className="w-10 h-10" />,
  news: <NewsIcon className="w-10 h-10" />,
  sports: <SportsIcon className="w-10 h-10" />,
};


const CategoryCard = ({ category }: { category: Category }) => {
  const navigate = useNavigate();
  const icon = categoryIcons[category.id.toLowerCase()] || <DefaultIcon className="w-10 h-10" />;

  return (
    <div
      onClick={() => navigate(`/browse?category=${category.id}`)}
      className="relative w-full h-[148px] items-center justify-center gap-4 flex flex-col bg-white rounded-[14px] 
                 border-[0.8px] border-solid border-[#0000001a] cursor-pointer
                 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    >
      {}
      <div className="relative w-12 h-10 text-neutral-950 flex items-center justify-center">
        {icon}
      </div>
      {}
      <div className="w-full relative h-auto text-center px-1">
        <span className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base md:text-lg tracking-[0] leading-[27px] whitespace-nowrap">
          {category.label} {}
        </span>
      </div>
    </div>
  );
};

export const DivWrapper = (): JSX.Element => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      await new Promise(res => setTimeout(res, 500)); 
      setCategories([
        { id: "technology", label: "Technology" },
        { id: "business", label: "Business" },
        { id: "health", label: "Health" },
        { id: "education", label: "Education" }, 
        { id: "entertainment", label: "Entertainment" },
        { id: "science", label: "Science" },
        { id: "news", label: "News" },
        { id: "sports", label: "Sports" },
      ]);
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col w-full items-start gap-8 px-4 py-16 bg-gray-50 mt-16 max-w-6xl mx-auto rounded-lg">
      <div className="relative self-stretch w-full h-6">
        <h2 className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-lg md:text-xl tracking-[0] leading-6 whitespace-nowrap">
          Browse by Category
        </h2>
      </div>

      {isLoading ? (
        <div className="w-full text-center [font-family:'Arimo',Helvetica]">Loading categories...</div>
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};