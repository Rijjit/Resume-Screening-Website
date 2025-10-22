from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from .utils import extract_text_from_pdf, extract_skills
from .scoring import rank_resumes
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@api_view(['POST'])
def upload_resume(request):
    file = request.FILES['resume']
    text = extract_text_from_pdf(file)
    skills = extract_skills(text)
    
    resume = Resume.objects.create(
        name=request.data['name'],
        email=request.data['email'],
        resume_file=file,
        skills=', '.join(skills)
    )
    
    serializer = ResumeSerializer(resume)
    return Response(serializer.data)

@api_view(['POST'])
def rank_candidates(request):
    job_description = request.data['job_description']
    resumes = Resume.objects.all()
    resume_texts = [extract_text_from_pdf(r.resume_file.path) for r in resumes]
    scores = rank_resumes(job_description, resume_texts)

    # Update scores in DB
    for i, r in enumerate(resumes):
        r.score = scores[i]
        r.save()
    
    serializer = ResumeSerializer(resumes, many=True)
    return Response(serializer.data)
