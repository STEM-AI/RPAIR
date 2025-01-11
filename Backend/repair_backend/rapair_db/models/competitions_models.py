from django.db import models

class Competition(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    rules = models.TextField()
    prize_distribution = models.TextField()
    image = models.CharField(max_length=255 , default=None , blank=True , null=True)

    #Additional Notes
    # Static Files in Production: In production, ensure your static files are collected using:

    # bash
    # ￼Copy code
    # python manage.py collectstatic
    # And configure a web server (e.g., Nginx or Apache) to serve the static files.

    def get_image_url(self):
        return f"/static/competition_image/{self.image}"

    def __str__(self):
        return self.name