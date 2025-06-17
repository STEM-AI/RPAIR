from django.db import models
class Question(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    difficulty = models.CharField(max_length=20,choices=[('easy','easy'),('medium','medium'),('hard','hard')],default='easy')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    type = models.CharField(max_length=20,choices=[('python','python'),('cpp','cpp'),('tinkery','tinkery'),('flutter','flutter'),('arduino','arduino'),('tinkercad','tinkercad')],default='python')
    category = models.CharField(max_length=20,choices=[('session','session'),('compiler','compiler'),('problem_solving','problem_solving')],default='session')

    def __str__(self):
        return self.text
    @property
    def get_answers(self):
        return self.answers.all()
    @property
    def get_correct_answer(self):
        return self.answers.filter(is_correct=True).first()
    @property
    def get_random_question(self):
        return self.objects.order_by('?').first()
    
    
    