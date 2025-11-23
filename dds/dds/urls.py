from django.urls import include, path
from django.contrib import admin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('dds_record.urls', namespace='dds_record')),
]
