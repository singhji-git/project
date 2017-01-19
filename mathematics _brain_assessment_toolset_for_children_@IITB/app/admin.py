from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# Register your models here.
from django.contrib.auth.models import User
from .models import *

"""
	CLass
		conatins information about all the users
"""

class AdminInfo(admin.ModelAdmin):
	list_display = ["__str__"]
	class Meta:
		model=UserInfo


"""
	Class
"""

class UserInline(admin.StackedInline):
	model=UserInfo
	can_delete=False
	verbose_name_plural='userinfo'


"""
	Class
"""

class UserAdmin(BaseUserAdmin):
	inlines= (UserInline,)




"""
	Class
		Model Admin for admin site for Compatability Matrix of Maths
"""


class CMmaths(admin.ModelAdmin):
	list_display = ['themename', 'subjectname']
	
	class Meta:
		model=CompatibilityMatricesMaths



"""
	Class
		Model Admin for admin site for Compatability Matrix of Brain
"""
class CMbrain(admin.ModelAdmin):
	list_display = ['themename', 'subjectname']
	
	class Meta:
		model=CompatibilityMatricesBrain



admin.site.unregister(User)
admin.site.register(User,UserAdmin)
admin.site.register(addtheme)
admin.site.register(addsubject)
admin.site.register(CompatibilityMatricesMaths,CMmaths)
admin.site.register(CompatibilityMatricesBrain,CMbrain)



