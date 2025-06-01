from django.db import models

class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    question = models.ForeignKey('programming.Question', on_delete=models.CASCADE,related_name='answers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text
    
    
