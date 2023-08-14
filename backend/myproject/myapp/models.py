from django.db import models

# Create your models here.
class StrategyName(models.Model):
    strategyname = models.CharField(max_length=100,primary_key=True,unique=True)


class Question(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    recommended_time = models.IntegerField(blank= False)
    inputs = models.TextField(blank= False)
    starter_code = models.TextField(blank = False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class Test(models.Model):
    title = models.CharField(max_length=255)
    questions = models.ManyToManyField(Question, related_name='tests')

class TestCase(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    name= models.TextField()
    input_data = models.TextField()
    expected_output = models.TextField()
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)