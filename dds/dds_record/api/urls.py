from django.urls import path, include
from rest_framework.routers import DefaultRouter

from dds_record.api.views import RecordViewSet, GetFilterOptionsView, TypeViewSet, CategoryViewSet, SubcategoryViewSet, StatusViewSet

router = DefaultRouter()
router.register(r"record", RecordViewSet, basename="record")
router.register(r"type", TypeViewSet, basename="type")
router.register(r"category", CategoryViewSet, basename="category")
router.register(r"subcategory", SubcategoryViewSet, basename="subcategory")
router.register(r"status", StatusViewSet, basename="status")


urlpatterns = [
    path("", include(router.urls)),
    path("get-filter-choices/", GetFilterOptionsView.as_view())
]
