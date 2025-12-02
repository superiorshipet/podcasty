import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "../../../types";

// --- Icons ---
const DefaultIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" /></svg>
);

const CategoryCard = ({ category }: { category: Category }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/browse?category=${category.id}`)}
      className="relative w-full h-[148px] items-center justify-center gap-4 flex flex-col bg-white rounded-[14px] 
                 border-[0.8px] border-solid border-[#0000001a] cursor-pointer
                 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative w-12 h-10 text-neutral-950 flex items-center justify-center">
        {/* Placeholder Icon */}
        <DefaultIcon className="w-10 h-10" />
      </div>
      <div className="w-full relative h-auto text-center px-1">
        <span className="[font-family:'Arimo',Helvetica] font-normal text-neutral-950 text-base md:text-lg tracking-[0] leading-[27px] whitespace-nowrap">
          {category.label}
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