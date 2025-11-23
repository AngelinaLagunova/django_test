from django.shortcuts import render


def index(request):
    return render(request, 'index.html', {})


def status(request):
    return render(request, 'status.html', {})


def type(request):
    return render(request, 'type.html', {})


def category(request):
    return render(request, 'category.html', {})


def subcategory(request):
    return render(request, 'subcategory.html', {})