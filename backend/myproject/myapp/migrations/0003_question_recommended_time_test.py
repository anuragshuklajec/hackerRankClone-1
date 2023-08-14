# Generated by Django 4.2.4 on 2023-08-12 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_question_testcase'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='recommended_time',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('questions', models.ManyToManyField(related_name='tests', to='myapp.question')),
            ],
        ),
    ]
