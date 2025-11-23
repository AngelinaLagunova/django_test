from . import views
from django.urls import path, include

app_name = 'dds_record'


urlpatterns = [
    path('', views.index, name='index'),
    path('api/', include('dds_record.api.urls'), name='api'),
]
