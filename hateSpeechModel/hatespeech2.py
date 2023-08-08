import pandas as pd
import os
import argparse
import numpy as np
import nltk
import re

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier


stemmer = nltk.SnowballStemmer("english")

from nltk.corpus import stopwords
import string

stopword = set(stopwords.words("english"))

current_dir = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(current_dir + "/twitter_data.csv")

df["labels"] = df["class"].map(
    {
        0: "Hate Speech Detected",
        1: "Offensive language detected",
        2: "No hate and offensive speech",
    }
)
df = df[["tweet", "labels"]]


def clean(text):
    text = str(text).lower()
    text = re.sub("\[.*?\]", "", text)
    text = re.sub("https?://S+|www\.\S+", "", text)
    text = re.sub("<.*?>+", "", text)
    text = re.sub("[%s]" % re.escape(string.punctuation), "", text)
    text = re.sub("\n", "", text)
    text = re.sub("\w*\d\w*", "", text)
    text = [word for word in text.split(" ") if word not in stopword]
    text = " ".join(text)
    text = [stemmer.stem(word) for word in text.split(" ")]
    text = " ".join(text)
    return text


df["tweet"] = df["tweet"].apply(clean)
x = np.array(df["tweet"])
y = np.array(df["labels"])

cv = CountVectorizer()
x = cv.fit_transform(x)

X_train, X_test, y_train, y_test = train_test_split(
    x, y, test_size=0.33, random_state=42
)
clf = DecisionTreeClassifier()
clf.fit(X_train, y_train)


def preprocess_text_file(file_path):
    with open(file_path, "r") as file:
        hate_speech_lines = []  # List to store lines with hate speech
        for line in file:
            text = clean(line)
            x_new = cv.transform([text]).toarray()
            predicted_label = clf.predict(x_new)

            if predicted_label[0] == "Hate Speech Detected":
                hate_speech_lines.append(line)

                # If you want to return True for the first line with hate speech, uncomment the next line

        return hate_speech_lines  # Return the list of lines with hate speech


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("arg1", type=str, help="File Path")
    args = parser.parse_args()
    url = args.arg1

    lines_with_hate_speech = preprocess_text_file(url)

    print(lines_with_hate_speech)

    # has_hate_speech = len(lines_with_hate_speech) > 0
    # if has_hate_speech:
    #     print("true")
    # else:
    #     print("false")
