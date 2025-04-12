from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import StudentRegistrationForm, StudentLoginForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required

def register_student(request):
    if request.method == 'POST':
        form = StudentRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Registration successful. You can now log in.')
            return redirect('login')
    else:
        form = StudentRegistrationForm()
    return render(request, 'register.html', {'form': form})


def login_student(request):
    if request.method == 'POST':
        form = StudentLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('labs:experiment_dashboard')
            else:
                messages.error(request, 'Invalid credentials')
    else:
        form = StudentLoginForm()
    return render(request, 'login.html', {'form': form})


@login_required
def student_dashboard(request):
    return render(request, 'dashboard.html', {'student': request.user})


def logout_student(request):
    logout(request)
    return redirect('student_login')
