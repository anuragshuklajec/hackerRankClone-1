# Generated by Django 4.2.4 on 2023-08-22 05:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Clients',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isAdmin', models.BooleanField(db_column='IsAdmin', default=False)),
                ('password', models.CharField(db_column='Password', max_length=250)),
                ('firstname', models.CharField(db_column='FirstName', default='', max_length=100)),
                ('lastname', models.CharField(db_column='LastName', default='', max_length=100)),
                ('email', models.CharField(db_column='Email', max_length=100, unique=True)),
                ('isdisabled', models.BooleanField(db_column='isDisabled', default=False)),
                ('createddate', models.DateTimeField(auto_now_add=True, db_column='CreatedDate')),
                ('updatedate', models.TimeField(auto_now=True, db_column='UpdateDate')),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('difficulty', models.CharField(choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')], max_length=10)),
                ('recommended_time', models.IntegerField()),
                ('inputs', models.TextField()),
                ('starter_code', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('tscore', models.IntegerField(default=0)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='QuestionAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.question')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.clients')),
            ],
        ),
        migrations.CreateModel(
            name='StrategyName',
            fields=[
                ('strategyname', models.CharField(max_length=100, primary_key=True, serialize=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('role', models.TextField(default=None)),
                ('attempted', models.IntegerField(default=0)),
                ('completed', models.IntegerField(default=0)),
                ('public', models.BooleanField(default=False)),
                ('duration', models.IntegerField(default=40)),
            ],
        ),
        migrations.CreateModel(
            name='TestAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_taken', models.IntegerField()),
                ('score', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='TestsQuestionsRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.question')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.test')),
            ],
            options={
                'unique_together': {('test', 'question')},
            },
        ),
        migrations.CreateModel(
            name='TestQuestionAttemtRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qAttempt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.questionattempt')),
                ('tAttempt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.testattempt')),
            ],
            options={
                'unique_together': {('tAttempt', 'qAttempt')},
            },
        ),
        migrations.CreateModel(
            name='TestCase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='')),
                ('input_data', models.TextField()),
                ('expected_output', models.TextField()),
                ('score', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.question')),
            ],
        ),
        migrations.AddField(
            model_name='testattempt',
            name='question_attempts',
            field=models.ManyToManyField(through='myapp.TestQuestionAttemtRelation', to='myapp.questionattempt'),
        ),
        migrations.AddField(
            model_name='testattempt',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.test'),
        ),
        migrations.AddField(
            model_name='testattempt',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.clients'),
        ),
        migrations.AddField(
            model_name='test',
            name='questions',
            field=models.ManyToManyField(related_name='tests', through='myapp.TestsQuestionsRelation', to='myapp.question'),
        ),
    ]
