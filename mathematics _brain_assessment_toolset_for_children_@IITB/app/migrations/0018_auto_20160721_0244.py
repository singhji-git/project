# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-20 21:14
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_profile_last_report_sent'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='last_report_sent',
            field=models.DateTimeField(default=datetime.datetime(2016, 7, 20, 21, 14, 4, 830940)),
        ),
    ]
