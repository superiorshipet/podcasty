import {
  LoginData, 
  SignupData, 
  UpdateUserData, 
  PodcastCreateData, 
  PodcastUpdateData, 
  EpisodeCreateData, 
  EpisodeUpdateData, 
  PlayHistoryCreateData, 
  EditCommentData
} from "../types"; 

const BASE_URL = "http://localhost:5016/api";

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("podcasty_token");
  const headers: HeadersInit = {};
  
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token && token !== "null" && token !== "undefined") {
    
    // ✅ الإصلاح: إزالة علامات التنصيص المحيطة بالتوكن (Quotes Stripping)
    const cleanToken = token.replace(/^"|"$/g, '');
    
    // التحقق من أن التوكن حقيقي (يحتوي على نقطتين فاصلتين)
    if (cleanToken.split('.').length === 3) {
        headers["Authorization"] = `Bearer ${cleanToken}`;
    }
  }
  
  return headers;
};

// دالة معالجة الاستجابة (HandleResponse)
const handleResponse = async (response: Response) => {
  const text = await response.text();

  if (!response.ok) {
    if (!text) {
        throw new Error(response.statusText || "Server Error");
    }

    try {
      const json = JSON.parse(text);
      // التعامل مع مصفوفة أخطاء Identity أو رسالة عادية
      const errorMessage = Array.isArray(json) && json[0]?.description 
        ? json.map((e: any) => e.description).join(', ') 
        : (json.title || json.message || json.error || text);
        
      throw new Error(errorMessage);
    } catch (e: any) {
      throw new Error(text);
    }
  }

  if (response.status === 204 || !text) {
      return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const api = {
  auth: {
    login: (data: LoginData) => fetch(`${BASE_URL}/User/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(handleResponse),
    register: (data: SignupData) => fetch(`${BASE_URL}/User/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(handleResponse),
  },
  profile: {
    update: (data: UpdateUserData) => fetch(`${BASE_URL}/Profile`, { method: "PATCH", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
  },
  podcasts: {
    getAll: () => fetch(`${BASE_URL}/Podcasts`, { headers: getHeaders() }).then(handleResponse),
    getById: (id: number | string) => fetch(`${BASE_URL}/Podcasts/${id}`, { headers: getHeaders() }).then(handleResponse),
    getByCategory: (catId: number) => fetch(`${BASE_URL}/Podcasts/category/${catId}`, { headers: getHeaders() }).then(handleResponse),
    create: (data: PodcastCreateData) => fetch(`${BASE_URL}/Podcasts`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    update: (id: number, data: PodcastUpdateData) => fetch(`${BASE_URL}/Podcasts/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    delete: (id: number) => fetch(`${BASE_URL}/Podcasts/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
  },
  episodes: {
    create: (data: EpisodeCreateData) => fetch(`${BASE_URL}/Episodes`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    update: (id: number, data: EpisodeUpdateData) => fetch(`${BASE_URL}/Episodes/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    delete: (id: number) => fetch(`${BASE_URL}/Episodes/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    getByPodcast: (podcastId: number) => fetch(`${BASE_URL}/Episodes/podcast/${podcastId}`, { headers: getHeaders() }).then(handleResponse),
    getById: (id: number) => fetch(`${BASE_URL}/Episodes/${id}`, { headers: getHeaders() }).then(handleResponse),
  },
  categories: {
    getAll: () => fetch(`${BASE_URL}/Category`, { headers: getHeaders() }).then(handleResponse),
    getById: (id: number) => fetch(`${BASE_URL}/Category/${id}`, { headers: getHeaders() }).then(handleResponse),
  },
  interactions: {
    like: (userId: number, podcastId: number) => fetch(`${BASE_URL}/UserInteraction/like`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId, podcastId }) }).then(handleResponse),
    dislike: (userId: number, podcastId: number) => fetch(`${BASE_URL}/UserInteraction/dislike`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId, podcastId }) }).then(handleResponse),
    favorite: (userId: number, podcastId: number) => fetch(`${BASE_URL}/UserInteraction/favorite`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId, podcastId }) }).then(handleResponse),
    follow: (userId: number, podcastId: number) => fetch(`${BASE_URL}/UserInteraction/follow`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId, podcastId }) }).then(handleResponse),
    comment: (userId: number, podcastId: number, content: string) => fetch(`${BASE_URL}/UserInteraction/comment`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId, podcastId, content }) }).then(handleResponse),
    getComments: (podcastId: number) => fetch(`${BASE_URL}/UserInteraction/bypodcast/${podcastId}`, { headers: getHeaders() }).then(handleResponse),
    getByUser: () => fetch(`${BASE_URL}/UserInteraction/byuser`, { headers: getHeaders() }).then(handleResponse),
    deleteComment: (id: number) => fetch(`${BASE_URL}/UserInteraction/comment/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    updateComment: (id: number, data: EditCommentData) => fetch(`${BASE_URL}/UserInteraction/comment/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
  },
  search: {
    query: (q: string) => fetch(`${BASE_URL}/Search?q=${encodeURIComponent(q)}`, { headers: getHeaders() }).then(handleResponse),
  },
  discovery: {
    filterByCategory: (id: number) => fetch(`${BASE_URL}/SortAndFilter/Filter?categoryId=${id}`, { headers: getHeaders() }).then(handleResponse),
    sort: (type: 'time' | 'duration' | 'views', order: 'asc' | 'desc') => fetch(`${BASE_URL}/SortAndFilter/sortby${type}-${order}`, { headers: getHeaders() }).then(handleResponse),
  },
  history: {
      add: (data: PlayHistoryCreateData) => fetch(`${BASE_URL}/PlayHistory`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
      getMine: () => fetch(`${BASE_URL}/PlayHistory/mine`, { headers: getHeaders() }).then(handleResponse),
  },
  admin: {
    getStats: () => fetch(`${BASE_URL}/admin/analytics/stats`, { headers: getHeaders() }).then(handleResponse),
    getUsers: (query?: string) => {
        let url = `${BASE_URL}/admin/users`;
        if(query) url += `?name=${query}`; 
        return fetch(url, { headers: getHeaders() }).then(handleResponse);
    },
    banUser: (id: number, banned: boolean) => fetch(`${BASE_URL}/admin/users/${id}/status`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(banned) }).then(handleResponse),
    changeRole: (id: number, role: string) => fetch(`${BASE_URL}/admin/users/${id}/role`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(role) }).then(handleResponse),
  }
};