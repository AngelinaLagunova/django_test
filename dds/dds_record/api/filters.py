from django_filters import NumberFilter
from django_filters.rest_framework import FilterSet, DateFromToRangeFilter

from dds_record.models import Record


class RecordFilter(FilterSet):
    date = DateFromToRangeFilter()
    category = NumberFilter(field_name="subcategory__category_id")
    type = NumberFilter(field_name="subcategory__category__type_id")

    class Meta:
        model = Record
        fields = (
            'date',
            'type',
            'category',
            'subcategory',
            'status',
        )
