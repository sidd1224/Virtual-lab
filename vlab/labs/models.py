from django.db import models

class Experiment(models.Model):
    SUBJECT_CHOICES = [
        ('Physics', 'Physics'),
        ('Chemistry', 'Chemistry'),
        ('Biology', 'Biology')
    ]

    title = models.CharField(max_length=100)
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    experiment_class = models.CharField(max_length=10)  # '6', '7', etc.
    theory_text = models.TextField()
    html_file = models.CharField(max_length=100)  # e.g., 'labs/experiments/class_6/physics/ohms_law.html'

    def __str__(self):
        return f"{self.title} (Class {self.experiment_class} - {self.subject})"
