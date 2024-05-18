from flask import Flask, request, jsonify, after_this_request
from flask_cors import CORS
from flask_cors import cross_origin
import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# CountVectorizer
cv = pickle.load(open('vectorizer.pkl', 'rb'))

# cosine similarity matrix
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Load your data
new_df = pd.read_csv('processed_data.csv')

@app.route('/recommend', methods=['POST'])
@cross_origin()
def recommend():
    data = request.get_json()
    song = data['song']
    
    # recommendation
    music_index = new_df[new_df['title'] == song].index[0]
    distances = similarity[music_index]
    music_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x:x[1])[1:6]
    
    recommendations = []
    for i in music_list:
        recommendations.append(new_df.iloc[i[0]].title)

    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port= 8080,debug=True)
