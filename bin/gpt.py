import os
import sys
import openai
import pytesseract
import re
import tiktoken
from PIL import Image
from transformers import pipeline

file_path = sys.argv[1]
dir_path = os.path.dirname(file_path)
max_tokens = 8192  # GPT-4
question_count = 12
answer_count = 4
openai.organization = os.getenv("OPENAI_ORGANIZATION")
openai.api_key = os.getenv("OPENAI_API_KEY")

image_to_text = pipeline("image-to-text", model="Salesforce/blip-image-captioning-large")
tokenizer = tiktoken.get_encoding("cl100k_base")


def caption_image(image):
    try:
        data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DATAFRAME, lang='deu+eng')
        data = data[data['text'].str.strip().astype(bool)]
        data = data.dropna()
        data = data.loc[:, ['text']]
        # data = data.loc[:, ['text', 'left', 'top', 'width', 'height']]
        return data.to_csv(index=False)
    except:
        return image_to_text(image)[0]['generated_text']


def replace_images(markdown):
    def replace_image_tags(match):
        if match.group(2):
            image_path = match.group(2)
        elif match.group(4):
            image_path = match.group(4)
        else:
            return ''

        image_path = os.path.join(dir_path, image_path)
        image = Image.open(image_path)
        text = caption_image(image)

        # print(image_path, text)

        return f'(image: {{\n{text}\n}})'

    image_pattern = re.compile(r'(!\[[^\]]*\]\((.*?)\))|(<img\s+[^>]*src="([^"]+)"[^>]*>)')
    return image_pattern.sub(replace_image_tags, markdown)


with open(file_path) as file:
    text = file.read()
    text = replace_images(text)
    text = f"""
        ----------------------------------------
        {text}
        ----------------------------------------
        You are a teacher. You are in the process of writing {question_count} exam questions for your students.
        These questions should each be generated in the following JSON schema in the same language as the topic:
        {{ "title": "Title suiting the topic", "questions": [{{ "q": "Question?", "a": ["Correct answer", "Wrong answer", "Wrong answer", "Wrong answer"] }}] }}
        You may use incorrect, incomplete, or misleading information in your WRONG ANSWERS ONLY but they should sound similar to the correct answer to not make it too obvious.
        Please only answer with the JSON file format specified above without any other text.
    """

    print(f'TOKENS: {len(tokenizer.encode(text))}')

    completion = openai.ChatCompletion.create(
        model="gpt-4-0314",
        messages=[{"role": "user", "content": text}]
    )

    with open(file_path + ".gpt.json", "w") as o:
        o.write(completion.choices[0].message.content)

    print(f'OUTPUT:')
    print(completion)
