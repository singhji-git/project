# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-22 17:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_auto_20160618_2217'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='compatibilitymatrix',
            new_name='CompatibilityMatrices',
        ),
    ]