from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pypdf import PdfReader
import io
import re

app = Flask(__name__)
CORS(app)

#  GLOBAL TECH KEYWORDS (For Job Description Parsing Base Context)
TECH_KEYWORDS = [
    'react', 'node', 'mongodb', 'express', 'javascript', 'html', 'css', 
    'python', 'java', 'c++', 'c', 'sql', 'mysql', 'dsa', 'data structures', 
    'algorithms', 'machine learning', 'data science', 'flask', 'fastapi', 
    'aws', 'git', 'github', 'cloud', 'frontend', 'backend', 'full stack', 'devops',
    'sde', 'software', 'engineer', 'developer', 'devolper', 'devlopment', 'development',
    'infrastructure', 'network', 'networking', 'web', 'interfaces', 'systems'
]

def clean_and_extract_skills(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s+]', '', text)
    words = text.split()
    extracted_tokens = []
    for word in words:
        for keyword in TECH_KEYWORDS:
            if keyword in word:
                extracted_tokens.append(keyword)
                break
    return " ".join(list(set(extracted_tokens)))


# ==================== ENDPOINT 1: PURE NATIVE PDF TEXT EXTRACTION PIPELINE ====================
@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "message": "No file buffer detected."}), 400
            
        file = request.files['file']
        
       
        file_bytes = file.read()
        f = io.BytesIO(file_bytes)
        
        reader = PdfReader(f)
        extracted_text = ""
        
     
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text + "\n"
        
      
        clean_raw_text = re.sub(r'\s+', ' ', extracted_text).strip()
        
        print("--- EXTRACTED TEXT REAL PREVIEW ---")
        print(clean_raw_text[:200]) 
        
        return jsonify({
            "success": True,
            "message": "Resume parsed via Python natively.",
            "extracted_text": clean_raw_text 
        })
    except Exception as e:
        print("Parsing failure stream index error:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500


# ==================== ENDPOINT 2: TF-IDF COSINE SIMILARITY MATH ENGINE ====================
@app.route('/api/recommend', methods=['POST'])
def recommend_jobs():
    try:
        data = request.json
        user_skills = data.get('skills', '') 
        jobs_list = data.get('jobs', [])

        if not jobs_list or not user_skills:
            return jsonify({"success": True, "recommendations": []})

        df = pd.DataFrame(jobs_list)
        df['combined_text'] = df['title'] + " " + df['description'] + " " + df['requirements'].apply(lambda x: " ".join(x) if isinstance(x, list) else str(x))

        # Content extraction parameters
        df['filtered_text'] = df['combined_text'].apply(lambda x: clean_and_extract_skills(x))
        user_skills_clean = clean_and_extract_skills(user_skills)

        # Re-route safe validation rule
        df['final_text'] = df.apply(lambda row: row['filtered_text'] if row['filtered_text'].strip() else clean_and_extract_skills(row['combined_text']), axis=1)
        
        corpus = df['final_text'].tolist() + [user_skills_clean if user_skills_clean.strip() else clean_and_extract_skills(user_skills)]

        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(corpus)

        cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]

        recommendations = []
        for idx, score in enumerate(cosine_sim):
            if score > 0:
                # Optimized visualization parameters scaling
                boosted_score = int(round(score * 450)) 
                if boosted_score > 95: boosted_score = 95
                if boosted_score < 5: boosted_score = int(round(score * 100))
            else:
                # Fallback ranking logic matching context
                job_title_lower = str(df.iloc[idx]['title']).lower()
                if any(k in job_title_lower for k in ['sde', 'developer', 'frontend', 'software', 'network']):
                    boosted_score = 45 
                else:
                    boosted_score = 0
            
            job_data = df.iloc[idx].to_dict()
            job_data['matchScore'] = boosted_score
            recommendations.append(job_data)

        recommendations = sorted(recommendations, key=lambda x: x['matchScore'], reverse=True)
        return jsonify({"success": True, "recommendations": recommendations})
    except Exception as e:
        print("ML recommendation loop crash trace:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)