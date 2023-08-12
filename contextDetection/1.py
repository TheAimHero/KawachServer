import pickle
import argparse
import io
import os

# path to current file from os
path = os.path.dirname(os.path.abspath(__file__))


def find_max_occurrence(strings):
    frequency_dict = {}

    for string in strings:
        if string in frequency_dict:
            frequency_dict[string] += 1
        else:
            frequency_dict[string] = 1

    max_occurrence = 0
    most_common_string = None

    for string, frequency in frequency_dict.items():
        if frequency > max_occurrence:
            max_occurrence = frequency
            most_common_string = string

    print(most_common_string)


def main():
    parser = argparse.ArgumentParser(
        description="Text Classification Prediction Script"
    )
    parser.add_argument("arg1", type=str, help="First argument")
    args = parser.parse_args()
    textPath = args.arg1

    # # Load the trained classifier model from the pickle file
    with io.open(path + "/model.pkl", "rb") as f:
        clf2 = pickle.load(f)

    # # Load the saved 'v' dictionary from the pickle file
    with io.open(path + "/v_dict.pkl", "rb") as f:
        v_loaded = pickle.load(f)

    # Read input texts from the input file
    with io.open(textPath, "r") as f:
        input_texts = f.readlines()

    # Strip whitespace and newline characters from each input text
    input_texts = [text.strip("\r") for text in input_texts]

    # Perform prediction for each input text
    strings = []
    for text in input_texts:
        predicted = clf2.predict([text])
        predicted_label = v_loaded[predicted[0]]
        strings.append(predicted_label)

    find_max_occurrence(strings)


if __name__ == "__main__":
    main()

# 'python script.py path/to/input.txt'
