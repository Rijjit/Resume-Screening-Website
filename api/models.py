from django.db import models

# Create your models here.
from django.db import models

class Resume(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    resume_file = models.FileField(upload_to='resumes/')
    skills = models.TextField(blank=True)
    score = models.FloatField(default=0.0)

    def __str__(self):
        return self.name
