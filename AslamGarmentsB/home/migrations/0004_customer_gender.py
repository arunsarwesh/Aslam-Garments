# Generated by Django 5.0.6 on 2024-12-07 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_remove_product_images_alter_productimages_product'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='gender',
            field=models.CharField(blank=True, choices=[('Male', 'male'), ('Female', 'female')], max_length=50, null=True),
        ),
    ]
