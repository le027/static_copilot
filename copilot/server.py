from flask import Flask, request, jsonify, send_from_directory, render_template
import os
import json
import random

app = Flask(__name__)

# path to the response.json file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, 'response.json')

# endpoint to serve questionnaire.html
@app.route('/questionnaire', methods=['GET'])
def questionnaire():
    return render_template('questionnaire.html')

# endpoint to serve copilot_textarea.html
@app.route('/copilot-textarea', methods=['GET'])
def copilot_textarea():
    return render_template('copilot_textarea.html')

# function to read the response.json file
def read_responses():
    if not os.path.exists(FILE_PATH):
        return []  
    with open(FILE_PATH, 'r', encoding='utf-8') as file:
        data = file.read()
    return json.loads(data or '[]')


# function to write the response.json file
def write_responses(data):
    with open(FILE_PATH, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

# endpoint to generate a new userId
@app.route('/generate-user-id', methods=['GET'])
def generate_user_id():
    responses = read_responses()
    existing_ids = {entry['userId'] for entry in responses if 'userId' in entry}

    user_id = None
    # Ripeti il ciclo finché non viene generato un userId nuovo
    while user_id is None or user_id in existing_ids:
        user_id = str(random.randint(0, 999999))

    return jsonify({"userId": user_id})

# endpoint to save a new questionnaire
@app.route('/save-questionnaire', methods=['POST'])
def save_questionnaire():
    # extract data from the request body
    data = request.json
    user_id = data.get('userId')
    years_from_last_degree = data.get('years_from_last_degree')
    highest_degree = data.get('highest_degree')
    educational_path = data.get('educational_path')

    # check if all fields requested are present
    if not all([user_id, years_from_last_degree, highest_degree, educational_path]):
        return jsonify({"message": "All fields are required."}), 400

    responses = read_responses()

    # check if the userId is already present
    existing_user = next((entry for entry in responses if entry['userId'] == user_id), None)
    if existing_user:
        return jsonify({"message": "The user has already sent a questionnaire."}), 400

    # add a new object with the questionnaire data
    responses.append({
        "userId": user_id,
        "years_from_last_degree": years_from_last_degree,
        "highest_degree": highest_degree,
        "educational_path": educational_path,
        "response": None
    })

    write_responses(responses)

    return jsonify({"message": "Questionnaire saved!"})

# endpoint to save a new response
@app.route('/save-response', methods=['POST'])
def save_response():
    # extract data from the request body
    data = request.json
    user_id = data.get('userId')
    response = data.get('response')

    # check if all fields requested are present
    if not user_id or not response:
        return jsonify({"message": "User Id or response not found."}), 400

    responses = read_responses()

    # search for the user entry specified by the userId
    user_entry = next((entry for entry in responses if entry['userId'] == user_id), None)
    if not user_entry:
        return jsonify({"message": "User ID not found. Complete first the questionnaire."}), 404

    # add the response to the user entry
    user_entry['response'] = response

    write_responses(responses)

    return jsonify({"message": "Response saved!"})


if __name__ == '__main__':
    app.run(port=3000)
