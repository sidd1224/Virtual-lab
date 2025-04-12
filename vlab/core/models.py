# core/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    name = models.CharField(max_length=100)
    student_class = models.CharField(max_length=20)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'username'  # 👈 Add this if you're logging in with username
    REQUIRED_FIELDS = ['email', 'name', 'student_class']

    def _str_(self):
        return f"{self.name} ({self.username})"


