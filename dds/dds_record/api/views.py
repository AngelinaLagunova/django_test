from rest_framework import viewsets, views, response, status

from dds_record.api.filters import RecordFilter
from dds_record.api.serializers import RecordSerializer, TypeSerializer, CategorySerializer, SubcategorySerializer, StatusSerializer
from dds_record.models import Record, Type, Category, Subcategory, Status


class RecordViewSet(viewsets.ModelViewSet):
    """
        Основной вьюсет записей
    """

    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    filterset_class = RecordFilter


class TypeViewSet(viewsets.ModelViewSet):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer


class GetFilterOptionsView(views.APIView):

    def get(self, request, *args, **kwargs):
        """
            Возвращает набор опций для категории если передан тип
            и набор подкатегорий если задана категория
        """
        record_type = request.query_params.get("type", None)
        category = request.query_params.get("category", None)

        res = {
            'types': Type.objects.all().values("id", "name"),
            'statuses': Status.objects.all().values("id", "name"),
            'categories': None,
            'subcategories': None,
        }

        if record_type:
            res['categories'] = Category.objects.filter(type_id=int(record_type)).values("id", "name")

        if category:
            res['subcategories'] = Subcategory.objects.filter(category_id=int(category)).values("id", "name")

        return response.Response(res, status=status.HTTP_200_OK)
