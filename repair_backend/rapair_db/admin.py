from django.contrib import admin
from .models import User , JudgeUser , Organization , OrganizationContact , Team , TeamSponsor , TeamSocialMedia , TeamPreviousCompetition , CompetitionGroup , TeamGroup

# Register your models here.
admin.site.register(User)
admin.site.register(JudgeUser)
admin.site.register(Organization)
admin.site.register(OrganizationContact)
admin.site.register(Team)
admin.site.register(TeamSponsor)
admin.site.register(TeamSocialMedia)
admin.site.register(TeamPreviousCompetition)
admin.site.register(CompetitionGroup)
admin.site.register(TeamGroup)

