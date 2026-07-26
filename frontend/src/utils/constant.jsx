// Dynamic Base URL Toggle Matrix (Switch between Localhost and Cloud Deployments easily)
// Currently binding to your active Node/Express server listening at port 8000
const BASE_URL = "http://localhost:8000";

// Future pipeline fallback proxy route for the Data Science NLP Cosine Similarity script (Flask/FastAPI microservice running at standard port 5000)
const ML_BASE_URL = "http://localhost:5000";

// ==================== CORE APPLICATION ENDPOINTS ====================
export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;

// MACHINE LEARNING SPECIALIZATION SLOT
// This constant provides a direct handshake gate between React UI hooks and the NLP Vectorizer Microservice
export const ML_API_END_POINT = `${ML_BASE_URL}/api/v1/recommend`;