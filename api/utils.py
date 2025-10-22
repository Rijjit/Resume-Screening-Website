import PyPDF2
import re

def extract_text_from_pdf(file_path):
    pdf = PyPDF2.PdfReader(file_path)
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
    return text

def extract_skills(text):
    # Predefined skill list (can expand)
    skills_list = ['python', 'django', 'javascript', 'html', 'css', 'tensorflow', 'pandas', 'numpy']
    found_skills = [skill for skill in skills_list if skill.lower() in text.lower()]
    return found_skills
