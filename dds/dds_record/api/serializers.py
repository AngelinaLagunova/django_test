from rest_framework import serializers

from dds_record.models import Record, Type, Status, Category, Subcategory


class RecordSerializer(serializers.ModelSerializer):
    date_display = serializers.DateField(format='%d.%m.%Y', source='date', read_only=True)
    date = serializers.DateField()
    status_name = serializers.CharField(source="status.name", read_only=True)
    type = serializers.CharField(source="subcategory.category.type.id", read_only=True)
    type_name = serializers.CharField(source="subcategory.category.type.name", read_only=True)
    category = serializers.CharField(source="subcategory.category.id", read_only=True)
    category_name = serializers.CharField(source="subcategory.category.name", read_only=True)
    subcategory_name = serializers.CharField(source="subcategory.name", read_only=True)

    class Meta:
        model = Record
        fields = (
            "id",
            "date",
            "date_display",
            "status",
            "status_name",
            "type",
            "type_name",
            "category",
            "category_name",
            "subcategory",
            "subcategory_name",
            "amount",
            "comment",
        )


class StatusSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        model = Status
        fields = (
            "id",
            "name",
        )


class TypeSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        model = Type
        fields = (
            "id",
            "name",
        )


class CategorySerializer(serializers.ModelSerializer):
    type_id = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), source='type')
    name = serializers.CharField()

    class Meta:
        model = Category
        fields = (
            'id',
            'name',
            'type_id',)


class SubcategorySerializer(serializers.ModelSerializer):
    type_id = serializers.PrimaryKeyRelatedField(queryset=Type.objects.all(), source='category.type')
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category')
    name = serializers.CharField()

    class Meta:
        model = Subcategory
        fields = (
            'id',
            'name',
            'category_id',
            'type_id',)

