from . import views
from django.urls import path, include

app_name = 'dds_record'


urlpatterns = [
    path('', views.index, name='index'),
    path('status/', views.status, name='status'),
    path('type/', views.type, name='type'),
    path('category/', views.category, name='category'),
    path('subcategory/', views.subcategory, name='subcategory'),
    path('api/', include('dds_record.api.urls'), name='api'),
]
