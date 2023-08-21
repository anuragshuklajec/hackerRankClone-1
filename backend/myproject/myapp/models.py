from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.db.models.functions import Coalesce
from django.db.models import Max,Value
from django.db.models import Sum

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
    inputs = models.TextField(null=False)
    starter_code = models.TextField(blank = False)
    created_at = models.DateTimeField(auto_now_add=True)
    tscore = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)



    
class Test(models.Model):
    title = models.CharField(max_length=255)
    role = models.TextField(blank=False, default=None)
    attempted = models.IntegerField(default=0)
    completed = models.IntegerField(default=0)
    public= models.BooleanField(default=False)
    questions = models.ManyToManyField(Question, related_name='tests', through="TestsQuestionsRelation")
    duration = models.IntegerField(default=40)

class TestsQuestionsRelation(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('test', 'question')


class TestCase(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    name= models.TextField(default = "")
    input_data = models.TextField()
    expected_output = models.TextField()
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        print("self score", self.score)
        print("question score", self.question.tscore)

        self.question.tscore = int(self.question.tscore) + int(self.score)
        self.question.save()

class Clients(models.Model):
    isAdmin = models.BooleanField(db_column="IsAdmin",null=False,default=False)
    password = models.CharField(db_column='Password', max_length=250,null=False)  
    firstname = models.CharField(db_column='FirstName', max_length=100,null=False,default='')
    lastname = models.CharField(db_column='LastName', max_length=100,null=False,default='')  
    email = models.CharField(db_column='Email', max_length=100,unique=True,null=False) 
    isdisabled = models.BooleanField(db_column='isDisabled',default=False) 
    createddate = models.DateTimeField(db_column='CreatedDate',auto_now_add=True) 
    updatedate = models.TimeField(db_column='UpdateDate',auto_now=True)




class QuestionAttempt(models.Model):
    user = models.ForeignKey(Clients, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class TestAttempt(models.Model):
    user = models.ForeignKey(Clients, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    time_taken = models.IntegerField()  
    score = models.IntegerField()
    question_attempts = models.ManyToManyField(QuestionAttempt, through="TestQuestionAttemtRelation")
    created_at = models.DateTimeField(auto_now_add=True)


class TestQuestionAttemtRelation(models.Model):
    tAttempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE)
    qAttempt = models.ForeignKey(QuestionAttempt, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('tAttempt', 'qAttempt')

