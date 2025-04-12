
from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Experiment

@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'experiment_class', 'html_file')
    list_filter = ('subject', 'experiment_class')
    search_fields = ('title',)