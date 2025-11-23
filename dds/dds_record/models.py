from django.db import models
from django.utils import timezone


class Status(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Type(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    type = models.ForeignKey(
        Type,
        on_delete=models.CASCADE,
        related_name='category',
    )
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('type', 'name')

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='subcategories'
    )
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('category', 'name')

    def __str__(self):
        return self.name


class Record(models.Model):
    date = models.DateField(auto_now_add=True)
    status = models.ForeignKey(
        Status,
        on_delete=models.DO_NOTHING,
    )
    subcategory = models.ForeignKey(
        Subcategory,
        on_delete=models.DO_NOTHING,
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    comment = models.TextField(blank=True)
