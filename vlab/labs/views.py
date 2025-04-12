from django.shortcuts import render, get_object_or_404
from .models import Experiment
from django.contrib.auth.decorators import login_required

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Experiment

from django.db.models import F

@login_required
def experiment_dashboard(request):
    selected_class = request.GET.get('class')
    user_class = selected_class or request.user.student_class

    # Fetch experiments for the selected or user's class
    experiments_by_subject = {
        'Physics': Experiment.objects.filter(subject='Physics', experiment_class=user_class),
        'Chemistry': Experiment.objects.filter(subject='Chemistry', experiment_class=user_class),
        'Biology': Experiment.objects.filter(subject='Biology', experiment_class=user_class),
    }

    # ✅ Get all unique experiment_class values from the DB
    classes = Experiment.objects.values_list('experiment_class', flat=True).distinct().order_by('experiment_class')

    return render(request, 'labs/experiment_dashboard.html', {
        'experiments_by_subject': experiments_by_subject,
        'current_class': user_class,
        'available_classes': classes,
    })



from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from .models import Experiment

@login_required
def run_experiment(request, experiment_id):
    experiment = get_object_or_404(Experiment, id=experiment_id)

    # Assuming your Experiment model has these fields
    student_class = experiment.experiment_class  # e.g., 8
    subject = experiment.subject.lower()      # e.g., "Physics" → "physics"
    experiment_name = experiment.title  # e.g., "ohms_law"
    
    context = {
        'student_class': student_class,
        'subject': subject,
        'experiment_name': experiment_name,
    }

    return render(request, experiment.html_file, context)



# Create your views here.
@login_required
def subject_experiments(request, subject):
    user_class = request.GET.get('class') or request.user.student_class

    experiments = Experiment.objects.filter(subject__iexact=subject, experiment_class=user_class)

    return render(request, 'labs/subject_experiments.html', {
        'subject': subject.capitalize(),
        'experiments': experiments,
        'current_class': user_class
    })
def run_experiment_theory(request, experiment_id):
    experiment = get_object_or_404(Experiment, id=experiment_id)
    return render(request, 'labs/experiments_theory.html', {'experiment': experiment})


@login_required
def profile_view(request):
    return render(request, 'labs/profile.html', {
        'user': request.user,
        'profile': request.user,  # profile is just an alias for user
    })


# Create your views here.
