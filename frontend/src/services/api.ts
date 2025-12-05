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

const getUserId = (): number => {
  try {
    const userStr = localStorage.getItem("podcasty_user");
    if (!userStr) return 0;
    const user = JSON.parse(userStr);
    return user.id || 0;
  } catch (e) {
    return 0;
  }
};

const getHeaders = () => {
  const token = localStorage.getItem("podcasty_token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token && token !== "null" && token !== "undefined") {
    const cleanToken = token.replace(/^"|"$/g, '');
    if (cleanToken.split('.').length === 3) {
      headers["Authorization"] = `Bearer ${cleanToken}`;
    }
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const text = await response.text();
  if (!response.ok) {
    if (!text) throw new Error(response.statusText || "Server Error");
    try {
      const json = JSON.parse(text);
      throw new Error(json.title || json.message || json.error || text);
    } catch (e: any) {
      throw new Error(text);
    }
  }
  if (response.status === 204 || !text) return null;
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
    get: () => fetch(`${BASE_URL}/Profile`, { headers: getHeaders() }).then(handleResponse),
    update: (data: UpdateUserData) => fetch(`${BASE_URL}/Profile`, { method: "PATCH", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
  },
  podcasts: {
    getAll: () => fetch(`${BASE_URL}/Podcasts`, { headers: getHeaders() }).then(handleResponse),
    getById: (id: number | string) => fetch(`${BASE_URL}/Podcasts/${id}`, { headers: getHeaders() }).then(handleResponse),
    getByCategory: (catId: number) => fetch(`${BASE_URL}/Podcasts/category/${catId}`, { headers: getHeaders() }).then(handleResponse),
    getStats: (id: number | string) => fetch(`${BASE_URL}/Podcasts/${id}/stats`, { headers: getHeaders() }).then(handleResponse),
    create: (data: PodcastCreateData) => fetch(`${BASE_URL}/Podcasts`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    update: (id: number, data: Partial<PodcastUpdateData>) => fetch(`${BASE_URL}/Podcasts/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    delete: (id: number) => fetch(`${BASE_URL}/Podcasts/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
  },
  episodes: {
    create: (data: EpisodeCreateData) => fetch(`${BASE_URL}/Episodes`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    update: (id: number, data: Partial<EpisodeUpdateData>) => fetch(`${BASE_URL}/Episodes/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    delete: (id: number) => fetch(`${BASE_URL}/Episodes/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    getByPodcast: (podcastId: number) => fetch(`${BASE_URL}/Episodes/podcast/${podcastId}`, { headers: getHeaders() }).then(handleResponse),
    getById: (id: number) => fetch(`${BASE_URL}/Episodes/${id}`, { headers: getHeaders() }).then(handleResponse),
    getAudio: (id: number) => fetch(`${BASE_URL}/Episodes/${id}/audio`, { headers: getHeaders() }).then(handleResponse),
    recordPlay: (id: number) => fetch(`${BASE_URL}/Episodes/${id}/play`, { method: "POST", headers: getHeaders() }).then(handleResponse),
  },
  categories: {
    getAll: () => fetch(`${BASE_URL}/Category`, { headers: getHeaders() }).then(handleResponse),
    getById: (id: number) => fetch(`${BASE_URL}/Category/${id}`, { headers: getHeaders() }).then(handleResponse),
  },
  interactions: {
    like: (podcastId: number) => fetch(`${BASE_URL}/UserInteraction/like`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId: getUserId(), podcastId }) }).then(handleResponse),
    dislike: (podcastId: number) => fetch(`${BASE_URL}/UserInteraction/dislike`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId: getUserId(), podcastId }) }).then(handleResponse),
    favorite: (podcastId: number) => fetch(`${BASE_URL}/UserInteraction/favorite`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId: getUserId(), podcastId }) }).then(handleResponse),
    follow: (podcastId: number) => fetch(`${BASE_URL}/UserInteraction/follow`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId: getUserId(), podcastId }) }).then(handleResponse),
    comment: (podcastId: number, content: string) => fetch(`${BASE_URL}/UserInteraction/comment`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ userId: getUserId(), podcastId, content }) }).then(handleResponse),
    getComments: (podcastId: number) => fetch(`${BASE_URL}/UserInteraction/bypodcast/${podcastId}`, { headers: getHeaders() }).then(handleResponse),
    getByUser: () => fetch(`${BASE_URL}/UserInteraction/byuser`, { headers: getHeaders() }).then(handleResponse),
    deleteInteraction: (id: number) => fetch(`${BASE_URL}/UserInteraction/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    deleteComment: (id: number) => fetch(`${BASE_URL}/UserInteraction/comment/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    updateComment: (id: number, data: EditCommentData) => fetch(`${BASE_URL}/UserInteraction/comment/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
  },
  search: {
    query: (q: string) => fetch(`${BASE_URL}/Search?q=${encodeURIComponent(q)}`, { headers: getHeaders() }).then(handleResponse),
  },
  discovery: {
    filterByCategory: (id: number) => fetch(`${BASE_URL}/Podcasts/category/${id}`, { headers: getHeaders() }).then(handleResponse),
    sort: (type: 'time' | 'duration' | 'views', order: 'asc' | 'desc') => fetch(`${BASE_URL}/SortAndFilter/sortby${type}-${order}`, { headers: getHeaders() }).then(handleResponse),
  },
  history: {
    add: (data: PlayHistoryCreateData) => fetch(`${BASE_URL}/PlayHistory`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse),
    getMine: () => fetch(`${BASE_URL}/PlayHistory/mine`, { headers: getHeaders() }).then(handleResponse),
  },
  admin: {
    // Stats
    getStats: () => fetch(`${BASE_URL}/admin/analytics/stats`, { headers: getHeaders() }).then(handleResponse),
    // Users
    getUsers: (query?: string) => fetch(`${BASE_URL}/admin/users${query ? `?name=${query}` : ''}`, { headers: getHeaders() }).then(handleResponse),
    banUser: (id: number, banned: boolean) => fetch(`${BASE_URL}/admin/users/${id}/status`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(banned) }).then(handleResponse),
    changeRole: (id: number, role: string) => fetch(`${BASE_URL}/admin/users/${id}/role`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(role) }).then(handleResponse),
    deleteUser: (id: number) => fetch(`${BASE_URL}/admin/users/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    // Podcasts
    getPodcasts: () => fetch(`${BASE_URL}/admin/podcasts`, { headers: getHeaders() }).then(handleResponse),
    deletePodcast: (id: number) => fetch(`${BASE_URL}/admin/podcasts/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    approvePodcast: (id: number, approved: boolean) => fetch(`${BASE_URL}/admin/podcasts/${id}/approve`, { method: "POST", headers: getHeaders(), body: JSON.stringify(approved) }).then(handleResponse),
    // Episodes
    getEpisodes: () => fetch(`${BASE_URL}/admin/episodes`, { headers: getHeaders() }).then(handleResponse),
    deleteEpisode: (id: number) => fetch(`${BASE_URL}/admin/episodes/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
    // Comments  
    getComments: (podcastId?: number) => fetch(`${BASE_URL}/admin/comments${podcastId ? `?podcastId=${podcastId}` : ''}`, { headers: getHeaders() }).then(handleResponse),
    deleteComment: (id: number) => fetch(`${BASE_URL}/admin/comments/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
  },
  library: {
    getFollowing: () => fetch(`${BASE_URL}/Library/following`, { headers: getHeaders() }).then(handleResponse),
    getFavorites: () => fetch(`${BASE_URL}/Library/favorites`, { headers: getHeaders() }).then(handleResponse),
  },
  notifications: {
    getAll: () => fetch(`${BASE_URL}/Notification`, { headers: getHeaders() }).then(handleResponse),
    getUnreadCount: () => fetch(`${BASE_URL}/Notification/unread-count`, { headers: getHeaders() }).then(handleResponse),
    markAsRead: (id: number) => fetch(`${BASE_URL}/Notification/${id}/read`, { method: "PUT", headers: getHeaders() }).then(handleResponse),
    markAllAsRead: () => fetch(`${BASE_URL}/Notification/read-all`, { method: "PUT", headers: getHeaders() }).then(handleResponse),
    deleteNotification: (id: number) => fetch(`${BASE_URL}/Notification/${id}`, { method: "DELETE", headers: getHeaders() }).then(handleResponse),
  },
  publicStats: {
    get: () => fetch(`${BASE_URL}/PublicStats`).then(handleResponse),
  }
};