from flask import Flask, request, send_file, render_template, jsonify
from google.cloud import texttospeech
import os
import google.generativeai as genai
from flask_cors import CORS
from PIL import Image
import io

SECRET_KEY = os.environ.get('KEY')
os.environ['GOOGLE_API_KEY'] = SECRET_KEY
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

model = genai.GenerativeModel('gemini-pro')
model1 = genai.GenerativeModel('gemini-pro-vision')

# Define the dictionaries with age-specific topics
geography = {
    '3-6': {
        1: 'animals',
        2: 'plants',
        3: 'weather',
        4: 'colors',
        5: 'shapes',
        6: 'family',
        7: 'body parts',
        8: 'food',
        9: 'transportation',
        10: 'clothing',
    },
    '7-12': {
        1: 'countries',
        2: 'landforms',
        3: 'climate',
        4: 'population',
        5: 'languages',
        6: 'cultures',
        7: 'government',
        8: 'economics',
        9: 'natural resources',
        10: 'tourist attractions',
    },
    '13-18': {
        1: 'geopolitics',
        2: 'global issues',
        3: 'environmental concerns',
        4: 'migration patterns',
        5: 'technological advancements',
        6: 'historical events',
        7: 'economic systems',
        8: 'social structures',
        9: 'international relations',
        10: 'geographical research methods',
    }
}

maths = {
    '3-6': {
        1: 'counting',
        2: 'basic shapes',
        3: 'simple addition',
        4: 'sorting',
        5: 'patterns',
        6: 'measurement',
        7: 'matching',
        8: 'time concepts',
        9: 'basic subtraction',
        10: 'number recognition',
    },
    '7-12': {
        1: 'algebraic expressions',
        2: 'geometry',
        3: 'fractions',
        4: 'decimals',
        5: 'percentages',
        6: 'ratios and proportions',
        7: 'basic equations',
        8: 'statistics',
        9: 'probability',
        10: 'word problems',
    },
    '13-18': {
        1: 'calculus',
        2: 'linear algebra',
        3: 'geometry proofs',
        4: 'trigonometry',
        5: 'probability and statistics',
        6: 'differential equations',
        7: 'number theory',
        8: 'mathematical modeling',
        9: 'abstract algebra',
        10: 'combinatorics',
    }
}

english = {
    '3-6': {
        1: 'alphabet',
        2: 'basic vocabulary',
        3: 'rhyming words',
        4: 'nursery rhymes',
        5: 'simple sentences',
        6: 'storytelling',
        7: 'colors and shapes names',
        8: 'opposites',
        9: 'prepositions',
        10: 'early reading concepts',
    },
    '7-12': {
        1: 'grammar rules',
        2: 'sentence structure',
        3: 'reading comprehension',
        4: 'writing essays',
        5: 'literary devices',
        6: 'poetry analysis',
        7: 'vocabulary building',
        8: 'creative writing',
        9: 'literature analysis',
        10: 'speech and debate',
    },
    '13-18': {
        1: 'advanced grammar',
        2: 'critical analysis',
        3: 'academic writing',
        4: 'literary criticism',
        5: 'creative writing techniques',
        6: 'public speaking',
        7: 'debate skills',
        8: 'linguistics',
        9: 'media literacy',
        10: 'communication studies',
    }
}

# Instantiates a client for the Google Text-to-Speech API
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'google_secret_key.json.json'
tts_client = texttospeech.TextToSpeechClient()

app = Flask(__name__)
CORS(app)

@app.route('/api/listen/', methods=['POST'])
def listen_text():
    text = request.json['text']
    language = request.json['language']
    audio_file_path = generate_audio_from_text(text, language)
    return {'answer': text, 'audio_file_path': audio_file_path}


def generate_audio_from_text(text,language):
    audio_file_path = 'temp_audio.mp3'
    if os.path.exists(audio_file_path):
        os.remove(audio_file_path)
        print(f"Deleted existing audio file at: {audio_file_path}")
    if(language == 'english'):
        language = 'en-US'
    elif(language == 'spanish'):
        language = 'es-ES'
    elif(language == 'french'):
        language = 'fr-FR'
    elif(language == 'hindi'):
        language = 'hi-IN'
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code=f"{language}", ssml_gender=texttospeech.SsmlVoiceGender.FEMALE)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
    tts_response = tts_client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    # Save the generated audio file temporarily
    with open(audio_file_path, "wb") as out:
        out.write(tts_response.audio_content)
        print(f"Audio file saved at: {audio_file_path}")

    return os.path.abspath(audio_file_path)

def get_topic(subject, age, number):
    # Fetch the topic from the dictionary using the provided age group and number
    print(f"Subject: {subject}, Age: {age}, Number: {number}")

    if subject.lower() == 'geography':
        age_group_dict = geography.get(age, {})
    elif subject.lower() == 'maths':
        age_group_dict = maths.get(age, {})
    elif subject.lower() == 'english':
        age_group_dict = english.get(age, {})
    else:
        return 'unknown topic'

    return age_group_dict

@app.route('/api/answer/', methods=['POST'])
def gemini_response():
    try:
        age = request.json['age']
        language = request.json['language']
        subject = request.json['subject']
        number = request.json['number']

        topic = get_topic(subject, age, number)
        print(f"Topic: {topic.get(int(number))}")
        response = model.generate_content(
            f"Give information about {topic.get(int(number))} in {subject} in {language} for {age} years old kids",
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=800,
                top_p=0.6,
                top_k=5,
                temperature=0.8
            )
        )

        # Remove asterisks from the response text
        if(subject.lower() != 'maths'):
            cleaned_response_text = response.text.replace('*', '')

        # Perform the text-to-speech on the cleaned text
        audio_file_path = generate_audio_from_text(cleaned_response_text, language)

        # Return the path to the generated audio file along with the cleaned text
        return {'answer': cleaned_response_text, 'audio_file_path': audio_file_path}
    except KeyError as e:
        print(f"KeyError: {str(e)}")
        print(f"Request JSON Data: {request.json}")
        return {'error': 'Invalid request data'}, 400

@app.route('/api/get-audio/')
def get_audio():
    # Serve the temporary audio file directly
    audio_file_path = 'temp_audio.mp3'
    return send_file(audio_file_path, mimetype='audio/mp3')

@app.route('/api/ask-gemini', methods=['POST'])
def ask_gemini():
    data = request.get_json()
    query = data.get('query', '')

    if query:
        response = model.generate_content(query)
        return jsonify({'answer': response.text})

    return jsonify({'error': 'Invalid query'}), 400

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        image_file = request.files.get('image')
        print(image_file)
        # Check if the image file is received
        print(request.form['text'])

        pil_image = Image.open(io.BytesIO(image_file.read()))
        response = model1.generate_content(["Analyse this image", pil_image])
        # Save the generated audio file temporarily
        audio_file_path = generate_audio_from_text(response.text, 'en-US')

        return jsonify({'answer': response.text, 'audio_file_path': audio_file_path})
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': 'Error processing image'}), 400

if __name__ == '__main__':
    app.run(debug=True)
