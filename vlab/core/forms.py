from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    name = forms.CharField(max_length=100)

    CLASS_CHOICES = [(str(i), f"Class {i}") for i in range(8, 11)]
    student_class = forms.ChoiceField(choices=CLASS_CHOICES)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'name', 'student_class', 'password1', 'password2']



class LoginForm(AuthenticationForm):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)