from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_resume),
    path('rank/', views.rank_candidates),
]
