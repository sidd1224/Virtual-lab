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


@login_required
def run_experiment(request, experiment_id):
    experiment = get_object_or_404(Experiment, id=experiment_id)

    # This mapping handles inconsistencies in the JS filenames
    title_to_filename_map = {
        "Verification of Archimedes Principle": "Verification_of_archimedes_principle",
        "Saponification": "Soapification",
        "Photosynthesis": "Photosynthesis",
        "Transpiration in Plants": "Transpiration_in_plants",
        "Chemical Effects of Electric Current": "chemical_properties_of_electric_current",
        "Surface Tension": "surface_tension",
        "Amoeba": "ameoba",
        "Determination of Water Boiling Point": "Determination_of_water_boiling_point",
        "Force and Newton": "Force_and_newton",
    }

    student_class = experiment.experiment_class
    subject = experiment.subject.lower()
    # Use the mapping to get the correct JS filename
    experiment_name = title_to_filename_map.get(experiment.title, "")
    
    context = {
        'student_class': student_class,
        'subject': subject,
        'experiment_name': experiment_name,
        'experiment': experiment, # Pass the whole object
    }

    # All simulations can use the generic template now
    return render(request, "labs/experiments/class_8/physics/ohms_law.html", context)



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
