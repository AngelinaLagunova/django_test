from django.contrib import admin

from .models import Record, Status, Category, Subcategory, Type

# ...и регистрируем её в админке:
admin.site.register(Record)
admin.site.register(Status)
admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(Type)
