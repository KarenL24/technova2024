import os
from app import app
import urllib.request
from flask import Flask, flash, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename

from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
from torchvision.transforms import ToTensor
from torch.nn.functional import cosine_similarity
import json


ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])



globalfilename = ""
globalslidervalue = 0
        	#print('display_image filename: ' + filename)
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
	
@app.route('/')
def upload_form():
	return render_template('popup.html')

@app.route('/find')
def find():
    return render_template('upload.html')


@app.route('/update-slider', methods=['POST'])
def update_slider():
    global slider_value
    sliderdata = request.get_json()  # Get the JSON data from the request
    
    # Update the global slider value
    slider_value = int(sliderdata['value'])  # Extract the slider value

    print(f"Slider value received: {slider_value}")  # Log the updated value

    # Return a response if needed
    return jsonify(success=True, value=slider_value)

def load_image(image_path):
    image = Image.open(image_path)
    return processor(images=image, return_tensors="pt")['pixel_values']

# Function to extract image features using CLIP
def extract_features(image_tensor):
    with torch.no_grad():
        image_features = model.get_image_features(image_tensor)
    return image_features

# Function to compare two images and calculate similarity (cosine similarity)
def compare_images(image1_tensor, image2_tensor):
    image1_features = extract_features(image1_tensor)
    image2_features = extract_features(image2_tensor)
    
    # Compute cosine similarity between the feature vectors
    similarity = cosine_similarity(image1_features, image2_features).item()
    return similarity

@app.route('/find', methods=['POST'])
def upload_image():

    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No image selected')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        globalfilename = filename
        flash("Image successfully uploaded and displayed below")


        with open('database.json', 'r') as json_file:
            data = json.load(json_file)
            



        folder_path = r"C:\Users\karec\Technova2024\test\static\database"
        uploaded_image_path = r'static/uploads/' + filename
        uploaded_image_tensor = load_image(uploaded_image_path)

        similarity_scores = []

        for filename in os.listdir(folder_path):
            if filename.endswith((".jpg", ".jpeg", ".png")):  # Check for image files
                image_path = os.path.join(folder_path, filename)

                print(slider_value)
                if data[filename]['distance'] > slider_value:
                    similarity = 0
                else:
                    # Load the image from the folder
                    folder_image_tensor = load_image(image_path)
                    
                    # Compare images
                    similarity = compare_images(uploaded_image_tensor, folder_image_tensor)

                # Append (filename, similarity) to list
                similarity_scores.append((filename, similarity))

        # Sort by similarity in descending order and take the top 3
        top_3_similar_images = sorted(similarity_scores, key=lambda x: x[1], reverse=True)[:3]

        img1 = ""
        sim1 = 0
        img2 = ""
        sim2 = 0
        img3 = ""
        sim3 = 0

        count = 0
        for image, similarity in top_3_similar_images:
            print(f"Image: {image}, Similarity Score: {similarity:.2f}")
            if count == 0:
                img1 = image
                sim1 = similarity
            elif count == 1:
                img2 = image
                sim2 = similarity
            else:
                img3 = image
                sim3 = similarity
            count += 1
            print(img1, sim1)
            print(img2, sim2)
            print(img3, sim3)

        
        return render_template('upload.html', filename=globalfilename, img1=img1, sim1=sim1, img2=img2, sim2=sim2, img3=img3, sim3=sim3, data=data)

    else:
        flash("Allowed image types are png, jpg, jpeg, gif")
        return redirect(request.url)

@app.route('/display/<filename>')
def display_image(filename):

    return redirect(url_for('static', filename='uploads/' + filename), code=301)









if __name__ == "__main__":
    app.run()