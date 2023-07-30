from keras.models import load_model
import argparse
import cv2
import requests
import numpy as np
from moviepy.editor import *
from nsfw_detector import predict
from moviepy.editor import VideoFileClip
import tensorflow as tf
import sys

chunk_size = 256

parser = argparse.ArgumentParser()
parser.add_argument("arg1", type=str, help="First argument")
args = parser.parse_args()
url = args.arg1
r = requests.get(url, stream=True)
with open("video.mp4", "wb") as f:
    for chunk in r.iter_content(chunk_size=chunk_size):
        f.write(chunk)

final_path = "video.mp4"
IMAGE_HEIGHT, IMAGE_WIDTH = 229, 229
data = cv2.VideoCapture(final_path)

# count the number of frames
frames = data.get(cv2.CAP_PROP_FRAME_COUNT)
fps = data.get(cv2.CAP_PROP_FPS)

# calculate duration of the video
seconds = round(frames / fps)


if seconds > 3600:
    SEQUENCE_LENGTH = 20
else:
    SEQUENCE_LENGTH = 10


def predict1_on_video(video_file_path, SEQUENCE_LENGTH):
    video_reader = cv2.VideoCapture(video_file_path)
    video_frames_count = int(video_reader.get(cv2.CAP_PROP_FRAME_COUNT))
    skip_frames_window = max(int(video_frames_count / SEQUENCE_LENGTH), 1)

    for frame_counter in range(SEQUENCE_LENGTH):
        l = frame_counter * skip_frames_window
        video_reader.set(cv2.CAP_PROP_POS_FRAMES, l)
        success, frame = video_reader.read()
        if not success:
            break
        resized_frame = cv2.resize(frame, (IMAGE_HEIGHT, IMAGE_WIDTH))
        normalized_frame = resized_frame / 255

        cv2.imwrite(
            f"/home/vedant/Workspace/server/videoModel/output_frames/frame_{frame_counter}.jpg",
            resized_frame,
        )
    video_reader.release()


# Call the function with your desired arguments
# predict1_on_video(video_file_path, SEQUENCE_LENGTH)


def predict_on_video(video_file_path, SEQUENCE_LENGTH):
    video_reader = cv2.VideoCapture(video_file_path)

    frames_list = []

    predicted_class_name = ""
    video_frames_count = int(video_reader.get(cv2.CAP_PROP_FRAME_COUNT))
    skip_frames_window = max(int(video_frames_count / SEQUENCE_LENGTH), 1)

    for frame_counter in range(SEQUENCE_LENGTH):
        l = frame_counter * skip_frames_window
        video_reader.set(cv2.CAP_PROP_POS_FRAMES, l)
        success, frame = video_reader.read()
        if not success:
            break
        resized_frame = cv2.resize(frame, (IMAGE_HEIGHT1, IMAGE_WIDTH1))

        normalized_frame = resized_frame / 255

        frames_list.append(normalized_frame)
    predicted_labels_probabilities = model1.predict(
        np.expand_dims(frames_list, axis=0), verbose=0
    )[0]

    predicted_label = np.argmax(predicted_labels_probabilities)

    predicted_class_name = CLASSES_LIST1[predicted_label]
    video_reader.release()
    return predicted_label

m = predict1_on_video(final_path, SEQUENCE_LENGTH)
model = predict.load_model("/home/vedant/Workspace/server/imageModel/nudity_final.h5")
l = predict.classify(model, "/home/vedant/Workspace/server/videoModel/output_frames")

a = False
i = 0
count = 0
for i in range(len(l)):
    if l[i] > 0.5:
        a = True

if a == False and seconds < 900:
    IMAGE_HEIGHT1, IMAGE_WIDTH1 = 64, 64
    SEQUENCE_LENGTH1 = 10
    CLASSES_LIST1 = ["Violence", "NonViolence"]
    model1 = load_model("/home/vedant/Workspace/server/videoModel/modelVideo.h5")
    m = predict_on_video(final_path, SEQUENCE_LENGTH1)

print(a)


def remove_files_in_folder(folder_path):
    try:
        # Get a list of all files in the folder
        file_list = os.listdir(folder_path)

        # Loop through the files and remove each one
        for file_name in file_list:
            file_path = os.path.join(folder_path, file_name)
            os.remove(file_path)

    except Exception as e:
        print("")


# Function to remove a file
def remove_file(file_path):
    try:
        os.remove(file_path)

    except FileNotFoundError:
        print("")
    except Exception as e:
        print("")


# File paths to remove
video_file_path = "video.mp4"

# Call the function to remove the files
remove_file(video_file_path)
remove_files_in_folder("/home/vedant/Workspace/server/videoModel/output_frames")
