from django.urls import path
from . import views

app_name = 'labs'

urlpatterns = [
    path('dashboard/', views.experiment_dashboard, name='experiment_dashboard'),
    path('experiment/<int:experiment_id>/', views.run_experiment, name='run_experiment'),
    path('experiments/<str:subject>/', views.subject_experiments, name='subject_experiments'),
    path('experiment/<int:experiment_id>/theory/', views.run_experiment_theory, name='run_experiment_theory'),
    path('experiment/<int:experiment_id>/simulation/', views.run_experiment_simulation, name='run_experiment_simulation'),
]
